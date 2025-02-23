from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth  # Import your Blueprint

app = Flask(__name__)
CORS(app)  # ✅ Apply CORS globally

app.config["JWT_SECRET_KEY"] = "your-secret-key"
jwt = JWTManager(app)

# Register Blueprint
app.register_blueprint(auth, url_prefix="/auth")

if __name__ == "__main__":
    app.run(port=8081, debug=True)
