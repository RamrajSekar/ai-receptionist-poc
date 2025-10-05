from app.database import Base, engine, SQLALCHEMY_DATABASE_URL
from app.models import Appointment

print("📦 Creating database...", SQLALCHEMY_DATABASE_URL)
Base.metadata.create_all(bind=engine)
print("✅ Database initialized: appointments.db")
