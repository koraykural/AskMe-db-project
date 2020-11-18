"""
This file contains handlers for question routes.

POST api/question/create,
"""
from flask import Blueprint, request, jsonify, g
from app.middlewares.auth_middleware import auth_required
from app.validators import validate_request, question_validators
from app.database.question_db import Question, get_all_question, \
    get_question_pack

question_blueprint = Blueprint('question_blueprint', __name__)


@question_blueprint.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Headers'] = '*'
    header['Access-Control-Allow-Origin'] = '*'
    return response


@question_blueprint.route("/create", methods=['POST'])
@auth_required()
@validate_request(question_validators.create)
def create():
    """
    POST api/question/create

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


@question_blueprint.route("/all", methods=['GET'])
@auth_required()
def all_questions():
    """
    GET api/question/all

    Returns:
    obj: All questions.
    """

    return jsonify(questions=get_all_question())


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
    older_than = request.args.get('older_than', None)

    return jsonify(questions=get_question_pack(older_than))
