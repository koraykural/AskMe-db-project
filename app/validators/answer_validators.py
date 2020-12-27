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
