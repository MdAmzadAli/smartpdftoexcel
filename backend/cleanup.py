import asyncio
import os
from datetime import datetime, timedelta
from fastapi import FastAPI

FILE_EXPIRATION_MINUTES = 20  # Files older than 10 mins will be deleted
CLEANUP_INTERVAL_SECONDS = 300  # Run cleanup every 5 mins

def is_file_old(file_path):
    modified_time = datetime.fromtimestamp(os.path.getmtime(file_path))
    return datetime.now() - modified_time > timedelta(minutes=FILE_EXPIRATION_MINUTES)

async def delete_old_files():
    while True:
        for file in os.listdir("."):
            if file.startswith(("output_", "temp_")) and file.endswith((".xlsx", ".pdf")):
                path = os.path.join(".", file)
                if is_file_old(path):
                    try:
                        os.remove(path)
                        print(f"Deleted old file: {path}")
                    except Exception as e:
                        print(f"Error deleting file {path}: {e}")
        await asyncio.sleep(CLEANUP_INTERVAL_SECONDS)
