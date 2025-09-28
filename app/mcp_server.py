from fastapi import FastAPI, UploadFile, File
from app.ocr import extract_text_from_image
from app.summarizer import summarize_text_gemini
from app.notion_wrapper import NotionClientWrapper
from app.utils import load_env_vars

app = FastAPI()

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    image_bytes = await file.read()
    text = extract_text_from_image(image_bytes)
    return {"ocr_text": text}

@app.post("/summarize")
async def summarize_endpoint(payload: dict):
    text = payload.get("text", "")
    summary = summarize_text_gemini(text)
    return {"summary": summary}

@app.post("/notion")
async def notion_endpoint(payload: dict):
    cfg = load_env_vars()
    notion = NotionClientWrapper(cfg["NOTION_API_KEY"], cfg["NOTION_DB_ID"])
    title = payload.get("title", "Untitled")
    summary = payload.get("summary", "")
    tags = payload.get("tags", [])
    page = notion.add_page(title, summary, tags)
    return {"notion_page": page}

# 🚀 NEW END-TO-END PIPELINE
@app.post("/process")
async def process_endpoint(file: UploadFile = File(...)):
    """
    Full pipeline: OCR -> Summarize -> Save to Notion
    """
    cfg = load_env_vars()
    image_bytes = await file.read()

    # Step 1: OCR
    ocr_text = extract_text_from_image(image_bytes)

    # Step 2: Summarize (structured JSON)
    summary_data = summarize_text_gemini(ocr_text)
    # summary_data should be JSON with {title, summary, tags}

    # Step 3: Save to Notion
    notion = NotionClientWrapper(cfg["NOTION_API_KEY"], cfg["NOTION_DB_ID"])
    page = notion.add_page(
        summary_data.get("title", "OCR Note"),
        summary_data.get("summary", ""),
        summary_data.get("tags", []),
    )

    return {
        "ocr_text": ocr_text,
        "summary": summary_data,
        "notion_page": page,
    }
