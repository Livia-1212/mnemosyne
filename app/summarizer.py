import google.generativeai as genai
import json
from app.utils import load_env_vars


def summarize_text_gemini(text: str) -> dict:
    """
    Summarize OCR text into structured JSON {title, summary, tags}.
    """
    if not text or not text.strip():
        return {"title": "Empty Note", "summary": "No text to summarize.", "tags": []}

    cfg = load_env_vars()
    genai.configure(api_key=cfg["GEMINI_API_KEY"])

    prompt = f"""
    Summarize the following OCR text into a JSON object with fields:
    - title (<=10 words)
    - summary (concise, clear paragraph)
    - tags (list of 3-5 keywords)

    Respond with ONLY valid JSON.

    Text:
    {text[:8000]}
    """

    for candidate in ["models/gemini-2.5-flash", "models/gemini-2.5-pro"]:
        try:
            model = genai.GenerativeModel(candidate)
            response = model.generate_content(prompt)

            # Try parsing as JSON
            raw = response.text.strip()
            try:
                return json.loads(raw)
            except json.JSONDecodeError:
                # Attempt to clean accidental fences
                raw = raw.replace("```json", "").replace("```", "").strip()
                return json.loads(raw)

        except Exception as e:
            print(f"⚠️ Model {candidate} failed: {e}")
            continue

    return {"title": "Error", "summary": "❌ Gemini failed", "tags": []}