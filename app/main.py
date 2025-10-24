from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import calls, booking, twilio_routes
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.responses import FileResponse
# from app.models import Base
# from app.database import engine
import uvicorn

UI_PATH = Path(__file__).parent  / "ui"
INDEX_FILE = UI_PATH / "index.html"

app = FastAPI(title='AI Receptionist POC')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-receptionist-poc.onrender.com/"
        ], 
     # Frontend dev port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/assets", StaticFiles(directory=UI_PATH / "assets"), name="assets")

#Register Routes
app.include_router(calls.router, prefix="/calls",tags=["Calls"])
app.include_router(booking.router, prefix="/bookings",tags=["Booking"])
app.include_router(twilio_routes.router, tags=["twilio"])

@app.get("/")
async def serve_root():
    return FileResponse(INDEX_FILE)

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):

    # Serve static files if exist
    requested_path = UI_PATH / full_path
    if requested_path.exists() and requested_path.is_file():
        return FileResponse(requested_path)

    # Fallback to index.html for React Router
    return FileResponse(INDEX_FILE)

if __name__=="__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000,reload=True)