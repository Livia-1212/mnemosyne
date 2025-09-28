from notion_client import Client


class NotionClientWrapper:
    def __init__(self, api_key: str, db_id: str):
        self.client = Client(auth=api_key)
        self.db_id = db_id

    def add_page(self, title: str, summary: str, tags: list[str] = None):
        """Create a page in Notion with Title, Summary, Tags properties."""
        properties = {
            "Title": {"title": [{"text": {"content": title}}]},
            "Summary": {"rich_text": [{"text": {"content": summary[:1999]}}]},
        }
        if tags:
            properties["Tags"] = {"multi_select": [{"name": tag} for tag in tags]}

        return self.client.pages.create(parent={"database_id": self.db_id}, properties=properties)

    def check_connection(self):
        """Return property names to confirm DB schema."""
        db = self.client.databases.retrieve(self.db_id)
        return list(db.get("properties", {}).keys())
