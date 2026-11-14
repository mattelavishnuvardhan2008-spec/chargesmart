import os
from datetime import datetime, timedelta, timezone
import httpx
from fastapi import FastAPI, Depends, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt, JWTError

ACCOUNT = os.environ.get("D1_ACCOUNT_ID", "")
DB      = os.environ.get("D1_DATABASE_ID", "")
TOKEN   = os.environ.get("D1_API_TOKEN", "")
SECRET  = os.environ.get("JWT_SECRET", "dev-secret")
PROD    = os.environ.get("ENV", "prod") == "prod"
ORIGIN  = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
D1_URL  = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}/d1/database/{DB}/query"

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
app = FastAPI(title="ChargeSmart API")
app.add_middleware(CORSMiddleware, allow_origins=[ORIGIN], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

async def d1(sql: str, params: list | None = None):
    if not ACCOUNT or not DB or not TOKEN:
        raise HTTPException(500, "Missing D1 environment variables")
    async with httpx.AsyncClient(timeout=20) as c:
        try:
            r = await c.post(D1_URL, headers={"Authorization": f"Bearer {TOKEN}"}, json={"sql": sql, "params": params or []})
            data = r.json()
        except Exception as e:
            raise HTTPException(500, f"Cloudflare connection failed: {str(e)}")
    
    if not data.get("success"):
        raise HTTPException(500, f"Cloudflare API Error: {data.get('errors')}")
    
    try:
        return data["result"][0]["results"]
    except (IndexError, KeyError, TypeError):
        return []

@app.get("/api/health")
async def health(): return {"ok": True}

class SignupIn(BaseModel):
    email: EmailStr
    password: str
    role: str = "customer"

class LoginIn(BaseModel):
    email: EmailStr
    password: str

def issue(resp: Response, uid: int, role: str):
    tok = jwt.encode({"sub": str(uid), "role": role, "exp": datetime.now(timezone.utc) + timedelta(days=7)}, SECRET, algorithm="HS256")
    resp.set_cookie("auth", tok, httponly=True, secure=PROD, samesite="lax", max_age=604800, path="/")

@app.post("/api/auth/signup")
async def signup(b: SignupIn, resp: Response):
    if b.role not in ("customer", "admin"): raise HTTPException(400, "bad role")
    if len(b.password) < 6: raise HTTPException(400, "password too short")
    if await d1("SELECT id FROM users WHERE email=?", [b.email]): raise HTTPException(409, "email already registered")
    try:
        row = (await d1("INSERT INTO users (email,password_hash,role) VALUES (?,?,?) RETURNING id,role", [b.email, pwd.hash(b.password), b.role]))[0]
    except Exception as e:
        raise HTTPException(500, f"Insert failed: {str(e)}")
    issue(resp, row["id"], row["role"])
    return {"ok": True, "role": row["role"]}

@app.post("/api/auth/login")
async def login(b: LoginIn, resp: Response):
    rows = await d1("SELECT id,password_hash,role FROM users WHERE email=?", [b.email])
    if not rows or not pwd.verify(b.password, rows[0]["password_hash"]): raise HTTPException(401, "invalid credentials")
    issue(resp, rows[0]["id"], rows[0]["role"])
    return {"ok": True, "role": rows[0]["role"]}

@app.post("/api/auth/logout")
async def logout(resp: Response):
    resp.delete_cookie("auth", path="/")
    return {"ok": True}

async def current(req: Request):
    tok = req.cookies.get("auth")
    if not tok: raise HTTPException(401, "not logged in")
    try: 
        p = jwt.decode(tok, SECRET, algorithms=["HS256"])
    except JWTError: 
        raise HTTPException(401, "invalid token")
    
    uid = p.get("sub")
    if not uid: raise HTTPException(401, "invalid token payload")
    
    rows = await d1("SELECT id,email,role FROM users WHERE id=?", [uid])
    if not rows: raise HTTPException(401, "user not found")
    return rows[0]

@app.get("/api/auth/me")
async def me(u=Depends(current)): return u

def admin_only(u):
    if u["role"] != "admin": raise HTTPException(403, "admin only")

@app.get("/api/stations")
async def stations():
    rows = await d1("SELECT s.*, (SELECT COUNT(*) FROM ports WHERE station_id=s.id) AS total_ports, (SELECT COUNT(*) FROM ports WHERE station_id=s.id AND status='available') AS available_ports FROM stations s ORDER BY s.name")
    for s in rows: s["ports"] = await d1("SELECT id,label,status FROM ports WHERE station_id=? ORDER BY label", [s["id"]])
    return rows

@app.get("/api/recommendations")
async def recs():
    return await d1("SELECT s.*, (SELECT COUNT(*) FROM ports WHERE station_id=s.id AND status='available') AS available_ports FROM stations s WHERE (SELECT COUNT(*) FROM ports WHERE station_id=s.id AND status='available') > 0 ORDER BY s.price_per_kwh ASC LIMIT 10")

class BookingIn(BaseModel):
    port_id: int
    start_time: str
    end_time: str

@app.post("/api/bookings")
async def create_booking(b: BookingIn, u=Depends(current)):
    if b.start_time >= b.end_time: raise HTTPException(400, "end must be after start")
    if not await d1("SELECT id FROM ports WHERE id=?", [b.port_id]): raise HTTPException(404, "port not found")
    clash = await d1("SELECT id FROM bookings WHERE port_id=? AND status IN ('pending','confirmed') AND NOT (end_time <= ? OR start_time >= ?)", [b.port_id, b.start_time, b.end_time])
    if clash: raise HTTPException(409, "port already booked for that window")
    return (await d1("INSERT INTO bookings (user_id,port_id,start_time,end_time) VALUES (?,?,?,?) RETURNING id,status", [u["id"], b.port_id, b.start_time, b.end_time]))[0]

@app.get("/api/bookings/me")
async def my_bookings(u=Depends(current)):
    return await d1("SELECT b.*, s.name AS station_name, p.label AS port_label FROM bookings b JOIN ports p ON p.id=b.port_id JOIN stations s ON s.id=p.station_id WHERE b.user_id=? ORDER BY b.start_time DESC", [u["id"]])

@app.post("/api/bookings/{bid}/cancel")
async def cancel(bid: int, u=Depends(current)):
    rows = await d1("UPDATE bookings SET status='cancelled' WHERE id=? AND user_id=? AND status IN ('pending','confirmed') RETURNING id", [bid, u["id"]])
    if not rows: raise HTTPException(404, "not found")
    return {"ok": True}

@app.get("/api/history")
async def history(u=Depends(current)):
    return await d1("SELECT cs.*, s.name AS station_name FROM charging_sessions cs JOIN ports p ON p.id=cs.port_id JOIN stations s ON s.id=p.station_id WHERE cs.user_id=? ORDER BY cs.started_at DESC", [u["id"]])

@app.get("/api/operator/stations")
async def op_stations(u=Depends(current)):
    admin_only(u)
    rows = await d1("SELECT s.*, (SELECT COUNT(*) FROM ports WHERE station_id=s.id) AS total_ports, (SELECT COUNT(*) FROM ports WHERE station_id=s.id AND status='available') AS available_ports FROM stations s ORDER BY s.name")
    for s in rows: s["ports"] = await d1("SELECT id,label,status FROM ports WHERE station_id=?", [s["id"]])
    return rows

@app.get("/api/operator/bookings")
async def op_bookings(u=Depends(current)):
    admin_only(u)
    return await d1("SELECT b.*, s.name AS station_name, p.label AS port_label, us.email AS customer FROM bookings b JOIN ports p ON p.id=b.port_id JOIN stations s ON s.id=p.station_id JOIN users us ON us.id=b.user_id ORDER BY b.created_at DESC LIMIT 200")

@app.get("/api/operator/analytics")
async def op_analytics(u=Depends(current)):
    admin_only(u)
    a=(await d1("SELECT COUNT(*) AS n FROM stations"))[0]["n"]
    b=(await d1("SELECT COUNT(*) AS n FROM ports"))[0]["n"]
    c=(await d1("SELECT COUNT(*) AS n FROM ports WHERE status='available'"))[0]["n"]
    d=(await d1("SELECT COUNT(*) AS n FROM bookings"))[0]["n"]
    e=(await d1("SELECT COALESCE(SUM(energy_kwh),0) AS n FROM charging_sessions"))[0]["n"]
    f=(await d1("SELECT COALESCE(SUM(cost),0) AS n FROM charging_sessions"))[0]["n"]
    return {"station_count":a,"total_ports":b,"free_ports":c,"bookings_count":d,"energy":e,"cost":f}
