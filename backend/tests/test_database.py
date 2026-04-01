from __future__ import annotations
import os
import sqlite3
import pytest


def test_init_db_creates_bookings_table(test_db):
    conn = sqlite3.connect(test_db)
    cursor = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='bookings'"
    )
    assert cursor.fetchone() is not None
    conn.close()


def test_init_db_creates_slots_config_table(test_db):
    conn = sqlite3.connect(test_db)
    cursor = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='slots_config'"
    )
    assert cursor.fetchone() is not None
    conn.close()


def test_init_db_seeds_five_slots(test_db):
    conn = sqlite3.connect(test_db)
    cursor = conn.execute("SELECT COUNT(*) FROM slots_config")
    count = cursor.fetchone()[0]
    assert count == 5
    conn.close()


def test_init_db_seed_slots_are_active(test_db):
    conn = sqlite3.connect(test_db)
    cursor = conn.execute(
        "SELECT COUNT(*) FROM slots_config WHERE is_active = 1"
    )
    count = cursor.fetchone()[0]
    assert count == 5
    conn.close()


def test_init_db_seed_slots_max_bookings(test_db):
    conn = sqlite3.connect(test_db)
    cursor = conn.execute(
        "SELECT COUNT(*) FROM slots_config WHERE max_bookings = 4"
    )
    count = cursor.fetchone()[0]
    assert count == 5
    conn.close()


def test_init_db_seed_slot_times(test_db):
    conn = sqlite3.connect(test_db)
    cursor = conn.execute(
        "SELECT time_slot FROM slots_config ORDER BY time_slot"
    )
    slots = [row[0] for row in cursor.fetchall()]
    assert slots == ["12:00", "13:00", "20:00", "21:00", "21:30"]
    conn.close()


def test_get_db_returns_row_factory_connection(test_db):
    from database import get_db
    with get_db() as conn:
        conn.execute(
            "INSERT INTO slots_config (time_slot, max_bookings, is_active) "
            "VALUES ('99:00', 1, 1)"
        )
        conn.commit()
        cursor = conn.execute(
            "SELECT time_slot FROM slots_config WHERE time_slot = '99:00'"
        )
        row = cursor.fetchone()
        # Row factory means we can access by column name
        assert row["time_slot"] == "99:00"
