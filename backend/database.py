import os
import sqlite3
from contextlib import contextmanager


def _get_path() -> str:
    """Return the database file path from env or default, creating the directory if needed."""
    path = os.environ.get("DATABASE_PATH", "osteria.db")
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)
    return path


@contextmanager
def get_db():
    """Yield a SQLite connection with row_factory and automatic commit/rollback."""
    conn = sqlite3.connect(_get_path())
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    """Create tables and seed initial slot configuration (idempotent)."""
    with get_db() as conn:
        # Bookings table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT,
                email TEXT,
                date DATE NOT NULL,
                time_slot TEXT NOT NULL,
                party_size INTEGER NOT NULL,
                table_preference TEXT DEFAULT 'nessuna',
                notes TEXT,
                status TEXT NOT NULL DEFAULT 'confirmed',
                created_at DATETIME DEFAULT (datetime('now'))
            )
        """)
        # Slots configuration table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS slots_config (
                time_slot TEXT PRIMARY KEY,
                max_bookings INTEGER NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT 1
            )
        """)
        # Menu items table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS menu_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                category TEXT NOT NULL,
                image_url TEXT,
                is_available BOOLEAN NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT (datetime('now'))
            )
        """)
        # Contact form submissions table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                category TEXT,
                priority TEXT DEFAULT 'medium',
                status TEXT NOT NULL DEFAULT 'new',
                created_at DATETIME DEFAULT (datetime('now'))
            )
        """)
        # Admin users table (for JWT authentication)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'admin',
                is_active BOOLEAN NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT (datetime('now'))
            )
        """)
        seed_slots = [
            ("12:00", 4, 1),
            ("13:00", 4, 1),
            ("20:00", 4, 1),
            ("21:00", 4, 1),
            ("21:30", 4, 1),
        ]
        conn.executemany(
            "INSERT OR IGNORE INTO slots_config (time_slot, max_bookings, is_active) "
            "VALUES (?, ?, ?)",
            seed_slots,
        )
        # Seed sample menu items if none exist
        seed_menu_items(conn)


def seed_menu_items(conn: sqlite3.Connection) -> None:
    """Seed sample menu items if table is empty."""
    cursor = conn.execute("SELECT COUNT(*) FROM menu_items")
    if cursor.fetchone()[0] == 0:
        sample_items = [
            ("Bruschetta al Pomodoro", "Grilled bread topped with fresh tomatoes, garlic, and basil", 8.50, "antipasti", None, 1),
            ("Carpaccio di Manzo", "Thinly sliced beef with arugula and parmesan", 14.00, "antipasti", None, 1),
            ("Spaghetti alla Carbonara", "Classic Roman pasta with eggs, pecorino, and guanciale", 16.00, "primi", None, 1),
            ("Risotto ai Funghi", "Creamy risotto with wild mushrooms and truffle oil", 18.00, "primi", None, 1),
            ("Bistecca alla Fiorentina", "Grilled T-bone steak with rosemary and olive oil", 32.00, "secondi", None, 1),
            ("Branzino al Sale", "Sea bass baked in sea salt crust", 28.00, "secondi", None, 1),
            ("Tiramisù", "Classic Italian coffee-flavoured dessert", 9.00, "dolci", None, 1),
            ("Panna Cotta", "Silky custard with berry coulis", 8.00, "dolci", None, 1),
        ]
        conn.executemany(
            "INSERT INTO menu_items (name, description, price, category, image_url, is_available) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            sample_items,
        )
