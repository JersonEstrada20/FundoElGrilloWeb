CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, kind TEXT NOT NULL DEFAULT 'cabana', resource_name TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL, guests INTEGER, full_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, notes TEXT, status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')), created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS idx_bookings_resource_dates ON bookings(resource_name,start_date,end_date);
CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5), comment TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')), created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status,created_at);
INSERT OR IGNORE INTO reviews (id,full_name,rating,comment,status) VALUES
('legacy-review-1','Paola Andrea Abuyeres Jadue',5,'Son hermosassssssss, lo pasamos genial años atrás con mis mejores amigos y espero pronto volver.', 'approved'),
('legacy-review-2','María Loreto B.',5,'El mejor lugar para relajarse: cercano a Quillota, ideal para desconectarse, con un entorno hermoso y cabañas impecables.', 'approved'),
('legacy-review-3','María V.',5,'Realmente un matrimonio soñado: el lugar perfecto, cabañas para invitados y una atención increíble.', 'approved');
