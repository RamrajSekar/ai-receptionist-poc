from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routes import calls, booking, twilio_routes, auth_routes, public_routes
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.responses import FileResponse
import fastapi_users
from app.dependencies.auth_dep import get_current_user
import uvicorn
from requests import Request



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


#Register Routes
app.include_router(public_routes.router)
app.include_router(auth_routes.router)
app.include_router(calls.router, prefix="/calls",tags=["Calls"])
app.include_router(booking.router, prefix="/bookings",tags=["Booking"])
app.include_router(twilio_routes.router, tags=["twilio"])


if __name__=="__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000,reload=True)