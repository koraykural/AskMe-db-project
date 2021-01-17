"""
This file contains handlers for answering routes.

POST api/answer,
GET api/answer/:question_id,
"""
import os
from flask import Blueprint, request, jsonify, g
from app.middlewares.auth_middleware import auth_required
from app.validators import validate_request, answer_validators
from app.database.answer_db import answer_question, get_answers, edit_answer, \
    like, dislike, delete_answer, get_multi_answers

answer_blueprint = Blueprint('answer_blueprint', __name__)
env = os.getenv('environment')


@answer_blueprint.after_request
def after_request(response):
    header = response.headers
    if env == 'development':
        header['Access-Control-Allow-Headers'] = '*'
        header['Access-Control-Allow-Origin'] = '*'
        header['Access-Control-Allow-Methods'] = '*'
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
    question_id = request.args.get('question_id', None)
    if question_id is None:
        return jsonify({'answers': None})
    return jsonify(get_answers(question_id))


@answer_blueprint.route("/multi/", methods=['GET'])
@auth_required()
def get_answer_multi():
    """
    GET api/answer/multi

    Parameters:
    question_id (int): Question ID

    Returns:
    obj: Array of choices and counts.
    """
    question_id = request.args.get('question_id', None)
    if question_id is None:
        return jsonify({'answers': None})
    return jsonify(get_multi_answers(question_id))


@answer_blueprint.route("/<question_id>", methods=['PUT'])
@auth_required()
@validate_request(answer_validators.edit)
def put_answer(question_id):
    """
    PUT api/answer/:question_id

    Parameters:
    question_id (int): Question ID
    answer (str): New answer of the user.

    Returns:
    obj: General api response.
    """
    body = request.get_json()
    user_id = g.user.id
    answer = body.get('answer')
    edit_answer(question_id, user_id, answer)
    return jsonify({'status': 'Success'})


@answer_blueprint.route("/<question_id>", methods=['DELETE'])
@auth_required()
def delete_answers(question_id):
    """
    DELETE api/answer/:question_id

    Parameters:
    question_id (int): Question ID

    Returns:
    obj: General api response.
    """
    user_id = g.user.id
    delete_answer(question_id, user_id)
    return jsonify({'status': 'Success'})


@answer_blueprint.route("/like", methods=['POST'])
@auth_required()
@validate_request(answer_validators.like)
def post_like():
    """
    POST api/answer/like

    Parameters:
    question_id (int): Question ID
    user_id (str): User ID

    Returns:
    obj: General api response.
    """
    body = request.get_json()
    question_id = body.get('question_id')
    user_id = body.get('user_id')
    like(question_id, user_id)
    return jsonify({'status': 'Success'})


@answer_blueprint.route("/dislike", methods=['POST'])
@auth_required()
@validate_request(answer_validators.like)
def post_dislike():
    """
    POST api/answer/dislike

    Parameters:
    question_id (int): Question ID
    user_id (str): User ID

    Returns:
    obj: General api response.
    """
    body = request.get_json()
    question_id = body.get('question_id')
    user_id = body.get('user_id')
    dislike(question_id, user_id)
    return jsonify({'status': 'Success'})
