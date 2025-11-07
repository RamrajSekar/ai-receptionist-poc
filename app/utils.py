from cryptography.fernet import Fernet
import os

# print(Fernet.generate_key().decode())
# Generate once and keep in your .env as ENCRYPTION_KEY
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
fernet = Fernet(ENCRYPTION_KEY.encode())

def encrypt_value(value: str) -> str:
    if not value:
        return value
    return fernet.encrypt(value.encode()).decode()

def decrypt_value(value: str) -> str:
    if not value:
        return value
    return fernet.decrypt(value.encode()).decode()
