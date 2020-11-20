"""
This file contains handlers for user routes.

GET api/user/
"""
import os
from flask import Blueprint, jsonify, g
from app.middlewares.auth_middleware import auth_required

user_blueprint = Blueprint('user_blueprint', __name__)
env = os.getenv('environment')


@user_blueprint.after_request
def after_request(response):
    header = response.headers
    if env == 'development':
        header['Access-Control-Allow-Headers'] = '*'
        header['Access-Control-Allow-Origin'] = '*'
    return response


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
