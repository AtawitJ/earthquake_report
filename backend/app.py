from flask_cors import CORS
from flask import Flask, jsonify, request
import requests
import json
import os
from datetime import datetime
import threading
import time
from dotenv import load_dotenv

# โหลด .env
load_dotenv()

UID = os.getenv("TMD_UID")
UKEY = os.getenv("TMD_UKEY")

if not UID or not UKEY:
    raise ValueError("Please set TMD_UID and TMD_UKEY in .env file!")

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

FETCH_INTERVAL = 300  # 5 นาที

def fetch_and_save_data_once():
    """Fetch ข้อมูลแผ่นดินไหวครั้งเดียวและ save เป็นไฟล์รายเดือน"""
    url = 'http://data.tmd.go.th/api/DailySeismicEvent/v1/' 
    params = {
        'uid': UID,
        'ukey': UKEY,
        'format': 'json'
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            now = datetime.now()
            filename = f"earthquakes_{now.strftime('%Y-%m')}.json"
            filepath = os.path.join(DATA_DIR, filename)
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"✅ Saved earthquake data to {filename}")
        else:
            print(f"❌ Failed to fetch data, status {response.status_code}")
    except Exception as e:
        print(f"❌ Exception while fetching data: {e}")

def fetch_loop():
    """Background thread ทำ fetch ทุก 5 นาที"""
    while True:
        fetch_and_save_data_once()
        time.sleep(FETCH_INTERVAL)

@app.route("/api/earthquakes", methods=["GET"])
def get_earthquake_data():
    month = request.args.get("month")
    if not month:
        month = datetime.now().strftime("%Y-%m")
    filename = f"earthquakes_{month}.json"
    filepath = os.path.join(DATA_DIR, filename)

    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": f"Failed to read local file: {e}"}), 500
    else:
        # ถ้าไฟล์ยังไม่มี ให้ fetch ครั้งเดียว
        fetch_and_save_data_once()
        return jsonify({"message": "Data is being fetched. Please try again in a few seconds."}), 202

if __name__ == "__main__":
    # Start background thread แบบ daemon
    threading.Thread(target=fetch_loop, daemon=True).start()
    app.run(debug=True, port=5000)
