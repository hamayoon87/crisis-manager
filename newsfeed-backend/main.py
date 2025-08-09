from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import List

app = FastAPI()

# Enable CORS so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://crisis-manager.onrender.com"],
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

# Pydantic model
class NewsItem(BaseModel):
    title: str
    content: str

@app.post("/add-news")
def add_news(item: NewsItem):
    conn = sqlite3.connect("news.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO news (title, content) VALUES (?, ?)", (item.title, item.content))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/news", response_model=List[NewsItem])
def get_news():
    conn = sqlite3.connect("news.db")
    cursor = conn.cursor()
    cursor.execute("SELECT title, content FROM news ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [{"title": row[0], "content": row[1]} for row in rows]
