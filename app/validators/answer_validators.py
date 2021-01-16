"""
This file contains answering validator.
"""
from . import ValidationError


def answer(request):
    body = request.get_json()
    question_id = body.get('question_id')
    answer = body.get('answer')
    if question_id is None or answer is None:
        raise ValidationError("'answer' and 'question_id' is required.")
    return


def edit(request):
    body = request.get_json()
    answer = body.get('answer')
    if answer is None:
        raise ValidationError("'answer' is required.")
    return


def like(request):
    body = request.get_json()
    question_id = body.get('question_id')
    user_id = body.get('user_id')
    if question_id is None or user_id is None:
        raise ValidationError("'user_id' and 'question_id' is required.")
    return
