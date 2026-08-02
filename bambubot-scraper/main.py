import os
import time
import json
import requests
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials, firestore
from groq import Groq

load_dotenv()

# ==========================================
# CONFIGURATION
# ==========================================
FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH", "serviceAccountKey.json")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

# ==========================================
# INITIALIZATION
# ==========================================
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(FIREBASE_KEY_PATH)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Warning: Could not initialize Firebase Admin. Please ensure {FIREBASE_KEY_PATH} exists.")
        print(e)

db = firestore.client() if firebase_admin._apps else None
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# ==========================================
# 1. SCRAPING / CRAWLING (MOCK/EXAMPLE)
# ==========================================
def scrape_bamboo_news():
    """
    Simulates scraping news/social media. 
    In production, this would use Apify API (for Twitter/FB/IG) or direct API endpoints.
    """
    print("Scraping bamboo news and social media trends...")
    # Mocking some recent scraped data
    scraped_data = [
        {
            "title": "Global Bamboo Market Price Surges 15% in Q3",
            "content": "Due to high demand in eco-friendly construction, bamboo prices in Southeast Asia have reached a 5-year high. Experts predict this trend will continue as carbon credit policies tighten.",
            "source": "Global Eco Trade News",
            "author": "System Scraper",
            "year": "2026",
            "url": "https://example.com/bamboo-market",
            "type": "Market Data",
            "category": "Economy"
        },
        {
            "title": "New Blockchain Certification for Bamboo Farmers",
            "content": "A recent post from a local WhatsApp farming group discussed the new blockchain certificates from Yayasan Sabumi Nusantara Jaya. Farmers report higher transparency in carbon credit payments.",
            "source": "WhatsApp Group: Petani Bambu Nusantara",
            "author": "Admin Group",
            "year": "2026",
            "url": "whatsapp://group/...",
            "type": "Sosial Media",
            "category": "Community"
        },
        {
            "title": "Bitcoin reaches $200k, unrelated to Bamboo",
            "content": "Bitcoin has reached an all time high today.",
            "source": "Crypto Twitter",
            "author": "@crypto_whale",
            "year": "2026",
            "url": "https://x.com/crypto_whale/status/123",
            "type": "Sosial Media",
            "category": "Finance"
        }
    ]
    return scraped_data

# ==========================================
# 2. AI VALIDATOR (GROQ LLM)
# ==========================================
def validate_content_with_ai(content):
    """
    Uses Groq LLM to validate if the scraped content is relevant to Bamboo, 
    accurate, and free from spam/hoaxes.
    """
    if not groq_client:
        print("Groq client not initialized, skipping AI validation.")
        return {"valid": False, "reason": "No API Key"}

    prompt = f"""
    You are an AI Validator for a Bamboo Knowledge Base (Bambupedia).
    Analyze the following scraped text and determine if it is:
    1. Relevant to bamboo (agriculture, trade, market, ecology, etc).
    2. Seems like legitimate information (not spam or obvious hoax).
    
    Text to analyze:
    "{content}"
    
    Respond STRICTLY in JSON format:
    {{
        "valid": true/false,
        "reason": "short explanation"
    }}
    """
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            response_format={"type": "json_object"}
        )
        result = json.loads(completion.choices[0].message.content)
        return result
    except Exception as e:
        print(f"Error during AI Validation: {e}")
        return {"valid": False, "reason": "API Error"}

# ==========================================
# 3. VECTOR EMBEDDING (HUGGINGFACE)
# ==========================================
def generate_embedding(text):
    """Generates embedding vector for semantic search (RAG)."""
    if not HUGGINGFACE_API_KEY:
        print("HuggingFace API Key missing, skipping embedding.")
        return None
        
    api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    
    try:
        response = requests.post(api_url, headers=headers, json={"inputs": [text]})
        if response.status_code == 200:
            data = response.json()
            return data[0] if isinstance(data[0], list) else data
    except Exception as e:
        print(f"Error generating embedding: {e}")
    return None

# ==========================================
# 4. FIREBASE INGESTION
# ==========================================
def upload_to_firestore(item):
    if not db:
        print("Firestore DB not initialized.")
        return
        
    try:
        doc_ref = db.collection('knowledge_items').document()
        doc_ref.set(item)
        print(f"Successfully uploaded to Firestore: {item['title']}")
    except Exception as e:
        print(f"Error uploading to Firestore: {e}")

# ==========================================
# MAIN PIPELINE
# ==========================================
def run_pipeline():
    print("--- Starting BambuBot Automated Data Pipeline ---")
    data = scrape_bamboo_news()
    
    for item in data:
        print(f"\nProcessing: {item['title']}")
        
        # 1. AI Validation
        validation = validate_content_with_ai(item['content'])
        print(f"AI Validation: {validation}")
        
        if not validation.get('valid', False):
            print(f"Skipping item due to AI validation failure: {validation.get('reason')}")
            continue
            
        # 2. Vector Embedding
        text_to_embed = f"{item['title']} {item['content']} {item['source']} {item['author']}"
        vector = generate_embedding(text_to_embed)
        
        # 3. Prepare Payload
        firestore_payload = {
            "title": item['title'],
            "author": item['author'],
            "summary": item['content'],
            "publisher": item['source'],
            "year": item['year'],
            "type": item['type'],
            "category": item['category'],
            "tags": "auto-scraped, market-data",
            "url": item.get('url', ''),
            "extractedText": item['content'],
            "adminNotes": f"Auto-Validated by AI. Reason: {validation.get('reason')}",
            "embedding": vector,
            "status": "approved", # Direct to approved since AI validated it
            "auto_verified": True,
            "createdAt": firestore.SERVER_TIMESTAMP
        }
        
        # 4. Upload
        upload_to_firestore(firestore_payload)
        
    print("\n--- Pipeline Completed ---")

if __name__ == "__main__":
    run_pipeline()
