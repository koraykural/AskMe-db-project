"""
This file contains handlers for voting routes.

POST api/vote/up,
POST api/vote/down,
POST api/vote/delete,
"""
import os
from flask import Blueprint, request, jsonify
from app.middlewares.auth_middleware import auth_required
from app.validators import validate_request, general_validators
from app.database.vote_db import upvote_question, \
    downvote_question, delete_vote

vote_blueprint = Blueprint('vote_blueprint', __name__)
env = os.getenv('environment')


@vote_blueprint.after_request
def after_request(response):
    header = response.headers
    if env == 'development':
        header['Access-Control-Allow-Headers'] = '*'
        header['Access-Control-Allow-Origin'] = '*'
    return response


@vote_blueprint.route("/up", methods=['POST'])
@auth_required()
@validate_request(general_validators.primary_key)
def upvote():
    """
    POST api/vote/up

    Parameters:
    question_id (int): Question ID
    user_id (int): User ID

    Returns:
    obj: General api response.
    """
    body = request.get_json()
    user_id = body.get('user_id')
    question_id = body.get('question_id')

    upvote_question(question_id, user_id)

    return jsonify({'status': 'Success'})


@vote_blueprint.route("/down", methods=['POST'])
@auth_required()
@validate_request(general_validators.primary_key)
def downvote():
    """
    POST api/vote/down

    Parameters:
    question_id (int): Question ID
    user_id (int): User ID

    Returns:
    obj: General api response.
    """
    body = request.get_json()
    user_id = body.get('user_id')
    question_id = body.get('question_id')

    downvote_question(question_id, user_id)

    return jsonify({'status': 'Success'})


@vote_blueprint.route("/delete", methods=['POST'])
@auth_required()
@validate_request(general_validators.primary_key)
def deletevote():
    """
    POST api/vote/delete

    Parameters:
    question_id (int): Question ID
    user_id (int): User ID

    Returns:
    obj: General api response.
    """
    body = request.get_json()
    user_id = body.get('user_id')
    question_id = body.get('question_id')

    delete_vote(question_id, user_id)

    return jsonify({'status': 'Success'})
