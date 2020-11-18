"""
This file contains handlers for authentication routes.

POST api/auth/login,
POST api/auth/register,
GET api/auth/check,
GET api/auth/renew
"""
from flask import Blueprint, jsonify, g
# from app.validators import validate_request
from app.middlewares.auth_middleware import auth_required

user_blueprint = Blueprint('user_blueprint', __name__)


@user_blueprint.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Headers'] = '*'
    header['Access-Control-Allow-Origin'] = '*'
    return response


# @user_blueprint.route("/login", methods=['POST'])
# @validate_request(auth_validators.login)
# def login():
#     """
#     POST api/auth/login

#     Parameters:
#     email (str): Email of the user.
#     password (str): Password of the user.

#     Returns:
#     str:access_token that user can utilize to authenticate
#     """
#     body = request.get_json()
#     email = body.get('email')
#     password = body.get('password')
#     return jsonify({'access_token': jwt_token})


@user_blueprint.route("/", methods=['GET'])
@auth_required()
def get_profile_data():
    """
    GET api/user/

    Header:
    Authorization (str): Bearer Token

    Returns:
    obj:User data
    """

    return jsonify(g.user.serialize())
