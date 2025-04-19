from fastapi import HTTPException,Depends
from fastapi.security import HTTPBasic,HTTPBasicCredentials
import secrets
import os
from dotenv import load_dotenv
load_dotenv()
security=HTTPBasic()
password=os.getenv("ADMIN_PASSWORD")
def verify_admin(credentials:HTTPBasicCredentials=Depends(security)):
    # print("username",credentials.username,"password",credentials.password)
    correct_username = secrets.compare_digest(credentials.username, "admin")
    correct_password = secrets.compare_digest(credentials.password, password)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username