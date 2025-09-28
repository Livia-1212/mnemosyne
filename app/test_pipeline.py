from app.ocr import extract_text_from_image
from app.summarizer import summarize_text_gemini
from app.notion_wrapper import NotionClientWrapper
from app.utils import load_env_vars

def main():
    cfg = load_env_vars()

    # Step 1: OCR
    ocr_text = extract_text_from_image("data/sample_screenshots/sample.png")
    print("\n=== OCR RESULT ===\n", ocr_text[:300], "...")

    # Step 2: Summarize
    summary_json = summarize_text_gemini(ocr_text)
    print("\n=== GEMINI SUMMARY ===\n", summary_json)

    # Step 3: Push to Notion
    notion = NotionClientWrapper(cfg["NOTION_API_KEY"], cfg["NOTION_DB_ID"])
    notion.add_page(summary_json["title"], summary_json["summary"], summary_json["tags"])
    print("\n✅ Successfully added page to Notion.")

if __name__ == "__main__":
    main()
