from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import certifi

# Use certifi for SSL/TLS verification to avoid handshake errors
client = AsyncIOMotorClient(settings.MONGODB_URI, tlsCAFile=certifi.where())
db = client.get_database()

async def get_database():
    return db
