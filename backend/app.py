from flask import Flask, render_template, request, jsonify
import os
from tensorflow.keras.models import load_model
import numpy as np
import requests
from datetime import datetime
from collections import defaultdict
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model
model_path = os.path.join(os.getcwd(), "backend", "best_cnn_model.keras")
best_cnn_model = load_model(model_path)

api_key = '701cf10ad3df9b6f5f58f40bfba7e837'

# Function to get city coordinates
def get_city_coordinates(city_name):
    url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={api_key}"
    response = requests.get(url)
    if response.status_code == 200 and response.json():
        data = response.json()[0]
        return data['lat'], data['lon']
    return None, None

# Function to fetch PM2.5 forecast data
def fetch_forecast_pm25(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        pm2_5_daily = defaultdict(list)
        for entry in data['list']:
            date_str = datetime.utcfromtimestamp(entry['dt']).strftime('%Y-%m-%d')
            pm2_5_daily[date_str].append(entry['components']['pm2_5'])
        return {date: sum(values) / len(values) for date, values in pm2_5_daily.items()}
    return {}

# Function to calculate AQI, category, and warning
# Function to calculate AQI, category, and warning
def calculate_aqi_and_warning(pm25):
    breakpoints = [
        (0, 30, 0, 50, "Good", "Satisfactory air quality.", "green"),
        (31, 60, 51, 100, "Moderate", "Acceptable air quality.", "yellow"),
        (61, 90, 101, 200, "Unhealthy for Sensitive Groups", "May cause discomfort.", "orange"),
        (91, 120, 201, 300, "Unhealthy", "Breathing discomfort likely.", "red"),
        (121, 250, 301, 400, "Very Unhealthy", "Serious health effects.", "purple"),
        (251, 500, 401, 500, "Hazardous", "Severe health warnings.", "maroon")
    ]
    for low_pm, high_pm, low_aqi, high_aqi, category, warning, color in breakpoints:
        if low_pm <= pm25 <= high_pm:
            aqi = (high_aqi - low_aqi) / (high_pm - low_pm) * (pm25 - low_pm) + low_aqi
            return round(aqi) if aqi is not None else 0, category, warning, color
    return 0, "Out of Range", "PM2.5 level is beyond measurable limits.", "gray"


# Function to predict PM2.5
def predict_pm25(historical_data):
    sequence = np.array(historical_data).reshape((1, 5, 1))
    predictions = []
    for _ in range(5):
        pred = best_cnn_model.predict(sequence)[0, 0]
        pm25_value = abs(pred)
        aqi, category, warning, color = calculate_aqi_and_warning(pm25_value)
        predictions.append({
            "pm25": round(pm25_value, 2),
            "aqi": aqi,
            "category": category,
            "warning": warning,
            "color": color
        })
        sequence = np.roll(sequence, shift=-1, axis=1)
        sequence[0, -1, 0] = pred
    return predictions

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result')
def result():
    return render_template('result.html')

@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict():
    city_name = request.json.get("city")  # Fetch city from request
    lat, lon = get_city_coordinates(city_name)
    
    if lat is None or lon is None:
        return jsonify({"error": "Invalid city"}), 400

    forecast_data = fetch_forecast_pm25(lat, lon)
    if not forecast_data:
        return jsonify({"error": "No forecast data available"}), 400

    historical_data = list(forecast_data.values())[:5]
    if len(historical_data) < 5:
        return jsonify({"error": "Insufficient data"}), 400

    predictions = predict_pm25(historical_data)

    return jsonify({
        "city": city_name,
        "predictions": [
            {
                "pm25": float(item["pm25"]),
                "aqi": int(item["aqi"]) if item["aqi"] is not None else 0,
                "category": item["category"],
                "warning": item["warning"],
                "color": item["color"]
            }
            for item in predictions
        ]
    })


if __name__ == '__main__':
    app.run(debug=True)
