from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter(tags=["Public"])

UI_PATH = Path(__file__).resolve().parent.parent / "ui"
INDEX_FILE = UI_PATH / "index.html"

@router.get("/", include_in_schema=False)
async def serve_landing_page():
    """Serve the landing page (no auth required)."""
    return FileResponse(INDEX_FILE)

@router.get("/{full_path:path}", include_in_schema=False)
async def serve_react_app(full_path: str):
    """Serve static files or fall back to index.html."""
    requested_path = UI_PATH / full_path
    if requested_path.exists() and requested_path.is_file():
        return FileResponse(requested_path)
    return FileResponse(INDEX_FILE)
