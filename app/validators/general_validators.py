"""
This file contains general validators.
"""
from . import ValidationError


def primary_key(request):
    body = request.get_json()
    question_id = body.get('question_id')
    user_id = body.get('user_id')
    if question_id is None or user_id is None:
        raise ValidationError("'user_id' and 'question_id' is required.")
    return


def question_id(request):
    body = request.get_json()
    question_id = body.get('question_id')
    if question_id is None:
        raise ValidationError("'question_id' is required.")
    return
