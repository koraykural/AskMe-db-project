"""
This file contains handlers for user routes.

GET api/user/
"""
import os
from flask import Blueprint, jsonify, g, request
from app.validators import user_validators, validate_request
from app.middlewares.auth_middleware import auth_required
from app.database.user_db import change_username, \
    delete_account, change_email, change_password, get_statistics
from app.exts import bcrypt

user_blueprint = Blueprint('user_blueprint', __name__)
env = os.getenv('environment')


@user_blueprint.after_request
def after_request(response):
    header = response.headers
    if env == 'development':
        header['Access-Control-Allow-Headers'] = '*'
        header['Access-Control-Allow-Origin'] = '*'
        header['Access-Control-Allow-Methods'] = '*'
    return response


@user_blueprint.route("/", methods=['GET'])
@auth_required()
def get_profile_data():
    """
    GET api/user/

    Returns:
    obj:User data
    """

    return jsonify(g.user.serialize())


@user_blueprint.route("/email", methods=['PUT'])
@auth_required()
@validate_request(user_validators.email)
def put_email():
    """
    PUT api/user/email

    Parameters:
    email (str): New email of the user.

    Returns:
    status (str): Status of request
    """
    body = request.get_json()
    user_id = g.user.id
    email = body.get('email')
    change_email(user_id, email)
    return jsonify({'status': 'Success'})


@user_blueprint.route("/username", methods=['PUT'])
@auth_required()
@validate_request(user_validators.username)
def put_username():
    """
    PUT api/user/username

    Parameters:
    username (str): New username of the user.

    Returns:
    status (str): Status of request
    """
    body = request.get_json()
    user_id = g.user.id
    username = body.get('username')
    change_username(user_id, username)
    return jsonify({'status': 'Success'})


@user_blueprint.route("/password", methods=['PUT'])
@auth_required()
@validate_request(user_validators.password)
def put_password():
    """
    PUT api/user/password

    Parameters:
    old_password (str): Old password of the user.
    new_password (str): New password of the user.

    Returns:
    status (str): Status of request
    """
    body = request.get_json()
    user_id = g.user.id
    new_password = body.get('new_password')
    pw_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    change_password(user_id, pw_hash)
    return jsonify({'status': 'Success'})


@user_blueprint.route("/", methods=['DELETE'])
@auth_required()
def delete_user():
    """
    DELETE api/user/

    Returns:
    status (str): Status of request
    """
    user_id = g.user.id
    delete_account(user_id)

    return jsonify({'status': 'Success'})


@user_blueprint.route("/stats", methods=['GET'])
@auth_required()
def get_stats():
    """
    GET api/user/stats

    Returns:
    obj:Stats for the user
    """

    return jsonify(get_statistics(g.user.id))
