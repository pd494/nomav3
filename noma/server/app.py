from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth  # Import your Blueprint

app = Flask(__name__)
CORS(app)  # Apply CORS globally

app.config["JWT_SECRET_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaGhxdmFrYWFqZXZ3d3N2bnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDI2MzU4OSwiZXhwIjoyMDU1ODM5NTg5fQ.enipHVUtabwB3b9_LPTEP_gzXzFmnukMXbkh5a034k8"  # Replace with a secure secret
jwt = JWTManager(app)

# Register Blueprint
app.register_blueprint(auth, url_prefix="/auth")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081, debug=True)
