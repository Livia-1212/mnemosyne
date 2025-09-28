# notion_export.py
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from notion_client import Client
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get Notion API key and database ID
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_DB_ID = os.getenv("NOTION_DB_ID")

if not NOTION_API_KEY or not NOTION_DB_ID:
    raise ValueError("NOTION_API_KEY and NOTION_DB_ID must be set in .env")

# Initialize Notion client
notion = Client(auth=NOTION_API_KEY)
app = FastAPI()

# Define the data model for incoming notes
class NoteData(BaseModel):
    title: str
    raw_text: str
    summary: str

# Endpoint to export note to Notion
@app.post("/export")
async def export_note(note: NoteData):
    try:
        # Fallback: use first line of raw_text if title is empty
        title = note.title.strip() or (note.raw_text.strip().split("\n")[0] if note.raw_text else "Untitled Note")

        new_page = notion.pages.create(
            parent={"database_id": NOTION_DB_ID},
            properties={
                "Title": {
                    "title": [{"text": {"content": title}}]
                },
                "Raw Text": {
                    "rich_text": [{"text": {"content": note.raw_text}}]
                },
                "Summary": {
                    "rich_text": [{"text": {"content": note.summary}}]
                }
            }
        )
        return {"status": "success", "page_id": new_page["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

