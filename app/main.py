from fastapi import FastAPI
from app.routes import calls, booking
from app.models import Base
from app.database import engine
import uvicorn

app = FastAPI(title='AI Receptionist POC')

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Assistant API"}

@app.get("/init-db")
async def init_db():
    Base.metadata.create_all(bind=engine)
    return {"message": "Database initialized"}

#Register Routes
app.include_router(calls.router, prefix="/calls",tags=["Calls"])
app.include_router(booking.router, prefix="/bookings",tags=["Booking"])

if __name__=="__main__":
    
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000,reload=True)