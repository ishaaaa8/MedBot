from flask import Flask, request, jsonify
from utils import analyze_text, take_action_based_on_distress
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "🚀 Sentiment Analysis API is running!"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    print("Received data:", data)  # Debugging line

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400
    
    

    text = data["text"]
    # userEmail = data["email"]
    predicted_index, confidence = analyze_text(text)
    label, conf, action = take_action_based_on_distress(predicted_index, confidence, text)

    return jsonify({
        "input_text": text,
        "predicted_label": label,
        "confidence": round(conf, 3),
        "action_taken": action,
        # "userEmail": userEmail
        
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000)

