"""Tests for menu gallery endpoints."""
import pytest
from fastapi.testclient import TestClient


# --- GET /menu tests ---

def test_get_menu_returns_items(client):
    """GET /menu should return all available menu items."""
    response = client.get("/menu")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) > 0


def test_get_menu_includes_required_fields(client):
    """Menu items should have all required fields."""
    response = client.get("/menu")
    data = response.json()
    assert len(data["items"]) > 0
    item = data["items"][0]
    assert "id" in item
    assert "name" in item
    assert "price" in item
    assert "category" in item


def test_get_menu_filter_by_category(client):
    """GET /menu?category=antipasti should filter items."""
    response = client.get("/menu?category=antipasti")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["category"] == "antipasti"


def test_get_menu_invalid_category_returns_empty(client):
    """GET /menu?category=invalid should return empty list."""
    response = client.get("/menu?category=invalidcategory")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []


def test_get_menu_categories_returns_all_categories(client):
    """GET /menu/categories should return all menu categories."""
    response = client.get("/menu/categories")
    assert response.status_code == 200
    data = response.json()
    assert "categories" in data
    categories = [c["value"] for c in data["categories"]]
    assert "antipasti" in categories
    assert "primi" in categories
    assert "secondi" in categories


def test_get_menu_item_by_id_returns_item(client):
    """GET /menu/{id} should return specific item."""
    # First get all items to find a valid ID
    response = client.get("/menu")
    items = response.json()["items"]
    if items:
        item_id = items[0]["id"]
        response = client.get(f"/menu/{item_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == item_id


def test_get_menu_item_not_found_returns_404(client):
    """GET /menu/99999 should return 404."""
    response = client.get("/menu/99999")
    assert response.status_code == 404


def test_rate_limit_menu_get(client):
    """GET /menu should be rate limited to 60/minute."""
    for _ in range(60):
        client.get("/menu")
    response = client.get("/menu")
    assert response.status_code == 429


# --- Admin POST /menu tests (require auth) ---

def test_create_menu_item_without_auth_returns_401(client):
    """POST /menu without authentication should return 401/403."""
    response = client.post("/menu", json={
        "name": "Test Item",
        "price": 10.00,
        "category": "antipasti"
    })
    assert response.status_code in [401, 403]


def test_update_menu_item_without_auth_returns_401(client):
    """PUT /menu/{id} without authentication should return 401/403."""
    response = client.put("/menu/1", json={
        "name": "Updated Item",
        "price": 15.00,
        "category": "primi"
    })
    assert response.status_code in [401, 403]


def test_delete_menu_item_without_auth_returns_401(client):
    """DELETE /menu/{id} without authentication should return 401/403."""
    response = client.delete("/menu/1")
    assert response.status_code in [401, 403]


# --- Admin menu management with auth ---

def get_admin_token(client):
    """Helper to get admin token for testing."""
    response = client.post("/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    if response.status_code == 200:
        return response.json()["access_token"]
    return None


def test_create_menu_item_with_auth(client):
    """POST /menu with valid auth should create item."""
    token = get_admin_token(client)
    if not token:
        pytest.skip("Admin user not configured")
    
    response = client.post(
        "/menu",
        json={
            "name": "Test Creation",
            "description": "A test menu item",
            "price": 12.50,
            "category": "antipasti"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Creation"
    assert data["price"] == 12.50
    assert "id" in data


def test_create_menu_item_invalid_price_returns_422(client):
    """POST /menu with negative price should return 422."""
    token = get_admin_token(client)
    if not token:
        pytest.skip("Admin user not configured")
    
    response = client.post(
        "/menu",
        json={
            "name": "Invalid Price",
            "price": -5.00,
            "category": "antipasti"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422


def test_create_menu_item_name_too_long_returns_422(client):
    """POST /menu with name > 100 chars should return 422."""
    token = get_admin_token(client)
    if not token:
        pytest.skip("Admin user not configured")
    
    response = client.post(
        "/menu",
        json={
            "name": "A" * 101,
            "price": 10.00,
            "category": "antipasti"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 422


def test_update_menu_item_with_auth(client):
    """PUT /menu/{id} with valid auth should update item."""
    token = get_admin_token(client)
    if not token:
        pytest.skip("Admin user not configured")
    
    # First create an item
    create_response = client.post(
        "/menu",
        json={
            "name": "Item to Update",
            "price": 10.00,
            "category": "antipasti"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    if create_response.status_code != 201:
        pytest.skip("Could not create test item")
    
    item_id = create_response.json()["id"]
    
    # Now update it
    response = client.put(
        f"/menu/{item_id}",
        json={
            "name": "Updated Item",
            "price": 15.00,
            "category": "primi"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Item"
    assert data["price"] == 15.00


def test_delete_menu_item_with_auth(client):
    """DELETE /menu/{id} with valid auth should delete item."""
    token = get_admin_token(client)
    if not token:
        pytest.skip("Admin user not configured")
    
    # First create an item
    create_response = client.post(
        "/menu",
        json={
            "name": "Item to Delete",
            "price": 10.00,
            "category": "antipasti"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    if create_response.status_code != 201:
        pytest.skip("Could not create test item")
    
    item_id = create_response.json()["id"]
    
    # Delete it
    response = client.delete(
        f"/menu/{item_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 204
    
    # Verify it's gone
    get_response = client.get(f"/menu/{item_id}")
    assert get_response.status_code == 404
