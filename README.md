# 🌙 Mnemosyne – The Goddess of Memory  

Mnemosyne, goddess of memory and mother of the Muses, preserves ideas for eternity.  
This app is inspired by her: **turn messy screenshots into clean, searchable notes in Notion.**  

Built for **GirlHack 2025**.  

Turn screenshots into structured notes automatically (OCR → Summarize → Notion).

📌 Overview

Mnemosyne is a productivity app that transforms unstructured screenshots into organized, searchable notes.
It works in three steps:

1.OCR (Azure Document Intelligence or Tesseract fallback)
Extracts raw text from images.

2.Summarization (Google Gemini)
Condenses the text into a concise summary with a title and tags.

3.Notion Integration
Saves the structured note directly into a Notion database for long-term organization.

⚙️ Tech Stack

Python 3.12
FastAPI + Uvicorn
Azure Document Intelligence API (OCR)
Google Gemini (summarization)
Notion API

📂 Project Structure
mnemosyne/
│
├── app/
│   ├── ocr.py              # Extract text from images
│   ├── summarizer.py       # Summarize text with Gemini
│   ├── notion_wrapper.py   # Save notes into Notion
│   ├── utils.py            # Environment variable loader
│   ├── mcp_server.py       # FastAPI server (routes OCR → Summarize → Notion)
│   ├── test_pipeline.py    # End-to-end test script
│   └── data/sample_screenshots/sample.png
│
├── requirements.txt
└── README.md

🚀 Setup & Run
1. Clone repo & install dependencies
git clone https://github.com/yourusername/mnemosyne.git
cd mnemosyne
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

2. Set environment variables

Create a .env file in the root with:

# Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Notion
NOTION_API_KEY=secret_from_notion
NOTION_DB_ID=your_database_id   # or data_source_id if using Notion API >= 2025-09-03

# Azure OCR (optional, fallback is Tesseract)
AZURE_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_VISION_KEY=your_azure_key

3. Run server
python3 -m uvicorn app.mcp_server:app --reload


Server runs at: http://127.0.0.1:8000