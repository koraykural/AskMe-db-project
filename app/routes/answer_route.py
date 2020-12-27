"""
This file contains handlers for answering routes.

POST api/answer,
GET api/answer/:question_id,
"""
import os
from flask import Blueprint, request, jsonify, g
from app.middlewares.auth_middleware import auth_required
from app.validators import validate_request, answer_validators
from app.database.answer_db import answer_question, get_answers

answer_blueprint = Blueprint('answer_blueprint', __name__)
env = os.getenv('environment')


@answer_blueprint.after_request
def after_request(response):
    header = response.headers
    if env == 'development':
        header['Access-Control-Allow-Headers'] = '*'
        header['Access-Control-Allow-Origin'] = '*'
    return response


@answer_blueprint.route("/", methods=['POST'])
@auth_required()
@validate_request(answer_validators.answer)
def post_answer():
    """
    POST api/answer/

    Parameters:
    question_id (int): Question ID
    user_id (int): User ID
    answer (str): Answer of the user.

    Returns:
    obj: General api response.
    """
    body = request.get_json()

    user_id = g.user.id
    question_id = body.get('question_id')
    answer = body.get('answer')

    success = answer_question(question_id, user_id, answer)

    if success:
        return jsonify({'status': 'Success'})
    else:
        return jsonify({'status': 'Error', 'message': 'Already answered'})


@answer_blueprint.route("/", methods=['GET'])
@auth_required()
def get_answer():
    """
    GET api/answer/

    Parameters:
    question_id (int): Question ID

    Returns:
    obj: Array of answers and usernames.
    """
    body = request.get_json()
    question_id = request.args.get('question_id', None)

    if question_id is None:
        return jsonify({'answers': None})

    return jsonify(get_answers(question_id))
