"""Menu gallery routes."""
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from typing import Annotated

from database import get_db
from limiter import limiter
from models import MenuCategory, MenuItemCreate, MenuItemResponse
from auth.jwt import get_current_admin

router = APIRouter()


@router.get("/menu", response_model=dict)
@limiter.limit("60/minute")
def get_menu(
    request: Request,
    category: Annotated[str | None, Query(description="Filter by category")] = None,
) -> dict:
    """Get all available menu items, optionally filtered by category."""
    with get_db() as conn:
        query = """
            SELECT id, name, description, price, category, image_url, is_available, created_at
            FROM menu_items
            WHERE is_available = 1
        """
        params = []
        
        if category:
            # Validate category is valid
            valid_categories = [c.value for c in MenuCategory]
            if category not in valid_categories:
                return {"items": []}
            query += " AND category = ?"
            params.append(category)
        
        query += " ORDER BY category, name"
        
        rows = conn.execute(query, params).fetchall()
        
        items = []
        for row in rows:
            items.append({
                "id": row["id"],
                "name": row["name"],
                "description": row["description"],
                "price": row["price"],
                "category": row["category"],
                "image_url": row["image_url"],
                "is_available": bool(row["is_available"]),
                "created_at": row["created_at"],
            })
    
    return {"items": items}


@router.get("/menu/categories", response_model=dict)
@limiter.limit("60/minute")
def get_menu_categories(request: Request) -> dict:
    """Get all available menu categories."""
    categories = [
        {"value": c.value, "label": c.value.capitalize()}
        for c in MenuCategory
    ]
    return {"categories": categories}


@router.get("/menu/{item_id}", response_model=MenuItemResponse)
@limiter.limit("60/minute")
def get_menu_item(request: Request, item_id: int) -> MenuItemResponse:
    """Get a specific menu item by ID."""
    with get_db() as conn:
        row = conn.execute(
            """
            SELECT id, name, description, price, category, image_url, is_available, created_at
            FROM menu_items
            WHERE id = ?
            """,
            (item_id,)
        ).fetchone()
        
        if row is None:
            raise HTTPException(status_code=404, detail="Menu item not found")
        
        return MenuItemResponse(
            id=row["id"],
            name=row["name"],
            description=row["description"],
            price=row["price"],
            category=row["category"],
            image_url=row["image_url"],
            is_available=bool(row["is_available"]),
            created_at=row["created_at"],
        )


@router.post("/menu", response_model=MenuItemResponse, status_code=201)
@limiter.limit("30/minute")
def create_menu_item(
    request: Request,
    item: MenuItemCreate,
    current_user: Annotated[dict, Depends(get_current_admin)],
) -> MenuItemResponse:
    """Create a new menu item (admin only)."""
    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO menu_items (name, description, price, category, image_url, is_available)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                item.name,
                item.description,
                item.price,
                item.category.value,
                item.image_url,
                item.is_available,
            ),
        )
        item_id = cursor.lastrowid
        
        # Fetch the created item
        row = conn.execute(
            "SELECT * FROM menu_items WHERE id = ?",
            (item_id,)
        ).fetchone()
    
    return MenuItemResponse(
        id=row["id"],
        name=row["name"],
        description=row["description"],
        price=row["price"],
        category=row["category"],
        image_url=row["image_url"],
        is_available=bool(row["is_available"]),
        created_at=row["created_at"],
    )


@router.put("/menu/{item_id}", response_model=MenuItemResponse)
@limiter.limit("30/minute")
def update_menu_item(
    request: Request,
    item_id: int,
    item: MenuItemCreate,
    current_user: Annotated[dict, Depends(get_current_admin)],
) -> MenuItemResponse:
    """Update a menu item (admin only)."""
    with get_db() as conn:
        # Check if item exists
        existing = conn.execute(
            "SELECT id FROM menu_items WHERE id = ?",
            (item_id,)
        ).fetchone()
        
        if existing is None:
            raise HTTPException(status_code=404, detail="Menu item not found")
        
        conn.execute(
            """
            UPDATE menu_items
            SET name = ?, description = ?, price = ?, category = ?, image_url = ?, is_available = ?
            WHERE id = ?
            """,
            (
                item.name,
                item.description,
                item.price,
                item.category.value,
                item.image_url,
                item.is_available,
                item_id,
            ),
        )
        
        # Fetch updated item
        row = conn.execute(
            "SELECT * FROM menu_items WHERE id = ?",
            (item_id,)
        ).fetchone()
    
    return MenuItemResponse(
        id=row["id"],
        name=row["name"],
        description=row["description"],
        price=row["price"],
        category=row["category"],
        image_url=row["image_url"],
        is_available=bool(row["is_available"]),
        created_at=row["created_at"],
    )


@router.delete("/menu/{item_id}", status_code=204)
@limiter.limit("30/minute")
def delete_menu_item(
    request: Request,
    item_id: int,
    current_user: Annotated[dict, Depends(get_current_admin)],
) -> None:
    """Delete a menu item (admin only)."""
    with get_db() as conn:
        # Check if item exists
        existing = conn.execute(
            "SELECT id FROM menu_items WHERE id = ?",
            (item_id,)
        ).fetchone()
        
        if existing is None:
            raise HTTPException(status_code=404, detail="Menu item not found")
        
        conn.execute(
            "DELETE FROM menu_items WHERE id = ?",
            (item_id,)
        )
    
    return None
