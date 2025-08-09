from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import List

app = FastAPI()

# Enable CORS for your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://crisis-manager.onrender.com"],  # your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
def init_db():
    conn = sqlite3.connect("news.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Pydantic models
class NewsCreate(BaseModel):
    title: str
    content: str

class NewsRead(NewsCreate):
    id: int

@app.post("/add-news")
def add_news(item: NewsCreate):
    conn = sqlite3.connect("news.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO news (title, content) VALUES (?, ?)", (item.title, item.content))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/news", response_model=List[NewsRead])
def get_news():
    conn = sqlite3.connect("news.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, content FROM news ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [{"id": row[0], "title": row[1], "content": row[2]} for row in rows]

@app.delete("/news/{news_id}")
def delete_news(news_id: int):
    conn = sqlite3.connect("news.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM news WHERE id = ?", (news_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted", "id": news_id}
