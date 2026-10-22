import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import jwt

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY não está definido no arquivo .env")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30



def create_access_token(data: dict):
    data_atual = datetime.now(timezone.utc)
    expire = data_atual + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    data_copy = data.copy()
    data_copy.update({"exp": expire})
    return jwt.encode(data_copy, SECRET_KEY, algorithm=ALGORITHM)


