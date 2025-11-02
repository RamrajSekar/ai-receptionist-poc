from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
from fastapi.openapi.models import APIKey, APIKeyIn
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from app.routes import calls, booking, twilio_routes, auth_routes
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.responses import FileResponse
import fastapi_users
from app.dependencies.auth_dep import get_current_user
import uvicorn
from requests import Request
from pathlib import Path

security_scheme = HTTPBearer()

UI_PATH = Path(__file__).resolve().parent.parent / "app" / "ui"
INDEX_FILE = UI_PATH / "index.html"

app = FastAPI(title='AI Receptionist POC')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        # "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "https://ai-receptionist-poc.onrender.com"
        ], 
     # Frontend dev port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/assets", StaticFiles(directory=UI_PATH / "assets"), name="assets")

#Register Routes
app.include_router(auth_routes.router)
app.include_router(calls.router, prefix="/calls",tags=["Calls"])
app.include_router(booking.router, prefix="/bookings",tags=["Booking"])
app.include_router(twilio_routes.router, tags=["twilio"])


@app.get("/", include_in_schema=False)
async def serve_landing_page():
    """Serve the landing page (no auth required)."""
    return FileResponse(INDEX_FILE)


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_react_app(full_path: str):
    # Skip serving frontend for API routes
    if full_path.startswith(("auth", "bookings", "calls", "twilio")):
        raise HTTPException(status_code=404, detail=f"API path {full_path} not found")
    
    # Public routes (React)
    public_routes = ["", "login", "signup"]
    if any(full_path.startswith(r) for r in public_routes):
        return FileResponse(INDEX_FILE)
    
    # Serve static files or fall back to index.html.
    requested_path = UI_PATH / full_path
    if requested_path.exists() and requested_path.is_file():
        return FileResponse(requested_path)
    return FileResponse(INDEX_FILE)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="AI Receptionist POC",
        version="1.0.0",
        description="Backend API with JWT Authentication",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

if __name__=="__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000,reload=True)
    app.openapi = custom_openapi