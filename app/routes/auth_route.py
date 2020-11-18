"""
This file contains handlers for authentication routes.

POST api/auth/login,
POST api/auth/register,
GET api/auth/check,
GET api/auth/renew
"""
from flask import Blueprint, request, jsonify, g
import jwt
from datetime import datetime, timedelta
from app.validators import validate_request, auth_validators
from app.middlewares import AuthorizationError, api_error
from app.middlewares.auth_middleware import auth_required
from app.exts import bcrypt
from app.database.user_db import User, \
    find_by_email, is_email_unique, is_username_unique

auth_blueprint = Blueprint('auth_blueprint', __name__)


@auth_blueprint.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Headers'] = '*'
    header['Access-Control-Allow-Origin'] = '*'
    return response


@auth_blueprint.route("/login", methods=['POST'])
@validate_request(auth_validators.login)
def login():
    """
    POST api/auth/login

    Parameters:
    email (str): Email of the user.
    password (str): Password of the user.

    Returns:
    str:access_token that user can utilize to authenticate
    """
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    user = find_by_email(email)

    if user is None:
        return api_error("User not found.")

    if not bcrypt.check_password_hash(user.password, password):
        return api_error("Wrong password.")

    jwt_token = create_token(user.id)
    return jsonify({'access_token': jwt_token})


@auth_blueprint.route("/register", methods=['POST'])
@validate_request(auth_validators.register)
def register():
    """
    POST api/auth/register

    Parameters:
    email (str): Email of the user.
    username (str): Username of the user.
    password (str): Password of the user.

    Returns:
    str:access_token that user can utilize to authenticate
    """
    body = request.get_json()
    email = body.get('email')
    username = body.get('username')
    password = body.get('password')

    if not is_email_unique(email):
        return api_error("Email is in use.")

    if not is_username_unique(username):
        return api_error("Username is in use.")

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    user = User(email=email, username=username, pw_hash=pw_hash)
    user.save()

    jwt_token = create_token(user.id)
    return jsonify({'access_token': jwt_token})


@auth_blueprint.route("/check", methods=['GET'])
@auth_required()
def check():
    """
    GET api/auth/check

    Header:
    Authorization (str): Bearer Token

    Returns:
    bool:Whether client is authenticated or not
    """
    return jsonify({"authenticated": True})


@auth_blueprint.route("/renew", methods=['GET'])
@auth_required()
def renew():
    """
    GET api/auth/renew

    Header:
    Authorization (str): Bearer Token

    Returns:
    str:access_token that user can utilize to authenticate
    """
    user = g.get('user', None)
    if user is None:
        raise AuthorizationError(token_missing=True)

    jwt_token = create_token(user.id)
    return jsonify({'access_token': jwt_token})


def create_token(user_id):
    secret = "as'^&sdffsd24552DFS234fs"
    expiration_time = datetime.utcnow() + timedelta(hours=3)
    jwt_token = jwt.encode({'exp': expiration_time, 'id': user_id},
                           secret, algorithm='HS256').decode('utf-8')
    return jwt_token
