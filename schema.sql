PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer','admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS stations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operator_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL, city TEXT NOT NULL, address TEXT NOT NULL,
  charger_type TEXT NOT NULL, power_kw REAL NOT NULL, price_per_kwh REAL NOT NULL,
  total_ports INTEGER NOT NULL DEFAULT 1,
  lat REAL, lng REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS ports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id INTEGER NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','occupied','offline'))
);
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  port_id INTEGER NOT NULL REFERENCES ports(id),
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS charging_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  booking_id INTEGER REFERENCES bookings(id),
  port_id INTEGER NOT NULL REFERENCES ports(id),
  energy_kwh REAL NOT NULL DEFAULT 0,
  cost REAL NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_bookings_port ON bookings(port_id, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE TRIGGER IF NOT EXISTS no_overlap_insert BEFORE INSERT ON bookings WHEN NEW.status IN ('pending','confirmed') BEGIN
  SELECT RAISE(ABORT, 'overlapping booking') WHERE EXISTS (SELECT 1 FROM bookings b WHERE b.port_id=NEW.port_id AND b.status IN ('pending','confirmed') AND NOT (b.end_time <= NEW.start_time OR b.start_time >= NEW.end_time));
END;
CREATE TRIGGER IF NOT EXISTS no_overlap_update BEFORE UPDATE OF start_time, end_time, status ON bookings WHEN NEW.status IN ('pending','confirmed') BEGIN
  SELECT RAISE(ABORT, 'overlapping booking') WHERE EXISTS (SELECT 1 FROM bookings b WHERE b.id != NEW.id AND b.port_id=NEW.port_id AND b.status IN ('pending','confirmed') AND NOT (b.end_time <= NEW.start_time OR b.start_time >= NEW.end_time));
END;
