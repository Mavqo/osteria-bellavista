import os
import sqlite3
from contextlib import contextmanager


def _get_path() -> str:
    """Return the database file path from env or default."""
    return os.environ.get("DATABASE_PATH", "osteria.db")


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
        conn.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT,
                date DATE NOT NULL,
                time_slot TEXT NOT NULL,
                party_size INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'confirmed',
                created_at DATETIME DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS slots_config (
                time_slot TEXT PRIMARY KEY,
                max_bookings INTEGER NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT 1
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
