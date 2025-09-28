from ocr import extract_text_from_image
from summarizer import summarize_text_gemini
from notion_wrapper import NotionClientWrapper
from app.utils import load_env_vars
import requests


def main():
    cfg = load_env_vars()

    # 1. OCR
    ocr_text = extract_text_from_image("data/sample_screenshots/sample.png")
    print("=== OCR RESULT ===")
    # print(ocr_text) 

    # 2. Summarize
    gemini_summary = summarize_text_gemini(ocr_text)
    print("\n=== GEMINI SUMMARY ===")
    print(gemini_summary)

    # 3. Save to Notion
    notion = NotionClientWrapper(cfg["NOTION_API_KEY"], cfg["NOTION_DB_ID"])
    # Optional once: notion.print_schema()
    notion.add_page("OCR Result", gemini_summary)
    db_id = "YOUR_DATABASE_ID"
    url = f"https://api.notion.com/v1/databases/{db_id}"

    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": "2022-06-28"  # or "2025-09-03"
    }

    resp = requests.get(url, headers=headers)
    print("Status:", resp.status_code)
    print("Headers:", resp.headers)


if __name__ == "__main__":
    main()
