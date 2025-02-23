from flask import Flask
from flask_jwt_extended import JWTManager
from auth import auth  # ✅ Ensure this import is correct

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "your-secret-key"
jwt = JWTManager(app)

# ✅ Register the auth blueprint
app.register_blueprint(auth, url_prefix="/auth")

if __name__ == "__main__":
    app.run(debug=True)
