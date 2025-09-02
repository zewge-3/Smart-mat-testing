from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    # Just mock a result for now
    data = request.get_json()
    return jsonify({
        "summary": "Sample AI analysis result",
        "details": {"max_stress": 123, "fatigue_life": 456}
    })

if __name__ == "__main__":
    app.run(port=5001)