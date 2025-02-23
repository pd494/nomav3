from flask import Blueprint, request, jsonify
from supabase import create_client
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt

# ✅ Ensure Blueprint is defined only once!
auth = Blueprint("auth", __name__)

# Supabase credentials
SUPABASE_URL = "https://ghhhqvakaajevwwsvnrc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaGhxdmFrYWFqZXZ3d3N2bnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDI2MzU4OSwiZXhwIjoyMDU1ODM5NTg5fQ.enipHVUtabwB3b9_LPTEP_gzXzFmnukMXbkh5a034k8"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ✅ Store revoked tokens in a set
blacklist = set()

# ✅ Function to check if a token is blacklisted
def is_token_blacklisted(jwt_payload):
    return jwt_payload["jti"] in blacklist  # Block access if token is blacklisted

@auth.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    auth_response = supabase.auth.sign_up({"email": email, "password": password})

    if not auth_response.user:
        return jsonify({"error": "Signup failed"}), 400

    user_id = auth_response.user.id

    response = supabase.table("NomAI_Table").insert({
        "id": user_id,
        "email": email,
        "name": name
    }).execute()

    return jsonify({"message": "User created successfully", "user": {"id": user_id, "email": email, "name": name}}), 201

@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    auth_response = supabase.auth.sign_in_with_password({"email": email, "password": password})

    if not auth_response.user:
        return jsonify({"error": "Invalid credentials"}), 401

    user_id = auth_response.user.id
    access_token = create_access_token(identity=user_id)

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": user_id,
            "email": email
        }
    })

@auth.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    
    # ✅ Check if the token is blacklisted
    if is_token_blacklisted(get_jwt()):
        return jsonify({"error": "Token has been revoked"}), 401

    return jsonify({"message": "This is a protected route!", "user_id": user_id})

@auth.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Get the token identifier (JTI)
    blacklist.add(jti)  # ✅ Add token to the blacklist
    return jsonify({"message": "User logged out"}), 200
