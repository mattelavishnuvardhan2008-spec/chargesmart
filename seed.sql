INSERT INTO stations (name, city, address, charger_type, power_kw, price_per_kwh, total_ports) VALUES
  ('Green Mobility Hub',    'Hyderabad', 'HITEC City',   'DC Fast',  60, 18, 6),
  ('City Charge Point',     'Hyderabad', 'Gachibowli',   'AC',       22, 12, 4),
  ('Bengaluru Fast Charge', 'Bengaluru', 'Whitefield',   'DC Fast', 120, 22, 8),
  ('Chennai Eco Charge',    'Chennai',   'OMR Road',     'AC',       11, 10, 3),
  ('Mumbai Power Station',  'Mumbai',    'Andheri East', 'DC Fast',  60, 19, 5);
INSERT INTO ports (station_id,label,status) VALUES
  (1,'A1','available'),(1,'A2','available'),(1,'A3','available'),(1,'B1','occupied'),(1,'B2','occupied'),(1,'B3','occupied'),
  (2,'A1','occupied'),(2,'A2','occupied'),(2,'A3','occupied'),(2,'A4','occupied'),
  (3,'A1','available'),(3,'A2','available'),(3,'A3','available'),(3,'A4','available'),(3,'A5','available'),(3,'B1','occupied'),(3,'B2','occupied'),(3,'B3','occupied'),
  (4,'A1','available'),(4,'A2','occupied'),(4,'A3','occupied'),
  (5,'A1','occupied'),(5,'A2','occupied'),(5,'A3','occupied'),(5,'A4','occupied'),(5,'A5','occupied');
