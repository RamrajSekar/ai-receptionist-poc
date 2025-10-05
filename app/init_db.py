from app.database import Base, engine
from app.models import Appointment

print("📦 Creating database...")
Base.metadata.create_all(bind=engine)
print("✅ Database initialized: appointments.db")
