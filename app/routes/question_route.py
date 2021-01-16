"""
This file contains handlers for question routes.

POST api/question/create,
GET api/question/pack,
GET api/question/all
"""
import os
from flask import Blueprint, request, jsonify, g
from app.middlewares.auth_middleware import auth_required
from app.validators import validate_request, question_validators
from app.database.question_db import Question, edit_question, \
    get_question_pack, get_users_questions, delete_question

question_blueprint = Blueprint('question_blueprint', __name__)
env = os.getenv('environment')


@question_blueprint.after_request
def after_request(response):
    header = response.headers
    if env == 'development':
        header['Access-Control-Allow-Headers'] = '*'
        header['Access-Control-Allow-Origin'] = '*'
        header['Access-Control-Allow-Methods'] = '*'
    return response


@question_blueprint.route("/", methods=['POST'])
@auth_required()
@validate_request(question_validators.create)
def post_question_create():
    """
    POST api/question/

    Parameters:
    form (obj): New question form.

    Returns:
    obj: General api response.
    """
    body = request.get_json()
    user = g.get('user')

    question = Question(f=body, owner_id=user.id)
    question.save()

    return jsonify({'status': 'Success'})


@question_blueprint.route("/pack", methods=['GET'])
@auth_required()
def question_pack():
    """
    GET api/question/pack

    Parameters:
    older_than (number): Questions will be older than this timestamp.

    Returns:
    obj: A question pack for defined pagination
    """
    user = g.get('user')
    user_id = user.id
    older_than = request.args.get('older_than', None)

    return jsonify(questions=get_question_pack(older_than, user_id))


@question_blueprint.route("/ofuser", methods=['GET'])
@auth_required()
def questions_ofuser():
    """
    GET api/question/ofuser

    Returns:
    obj: Questions of the user that send the request
    """
    user_id = g.get('user').id

    return jsonify(questions=get_users_questions(user_id))


@question_blueprint.route("/<question_id>", methods=['DELETE'])
@auth_required()
def delete_question_id(question_id):
    """
    DELETE api/question/:id

    Parameters:
    question_id (str): ID of the question to be deleted

    Returns:
    obj: General api response.
    """
    user = g.get('user')

    delete_question(str(question_id), user.id)

    return jsonify({'status': 'Success'})


@question_blueprint.route("/<question_id>", methods=['PUT'])
@auth_required()
@validate_request(question_validators.edit)
def put_question_id(question_id):
    """
    PUT api/question/:id

    Parameters:
    question_id (str): ID of the question to be deleted
    form (obj): Updated data of the question

    Returns:
    obj: General api response.
    """
    body = request.get_json()

    user = g.get('user')
    question_text = body.get('questionText', None)
    answer1 = body.get('answer1', None)
    answer2 = body.get('answer2', None)
    answer3 = body.get('answer3', None)
    answer4 = body.get('answer4', None)
    correct_answer = body.get('correctAnswer', None)

    edit_question(str(question_id), user.id, question_text, answer1,
                  answer2, answer3, answer4, correct_answer)

    return jsonify({'status': 'Success'})
