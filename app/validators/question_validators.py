"""
This file contains "create" form validator functions.
"""
from flask import g
from . import ValidationError

min_askpoints = 1
min_askpoints_anonymous = 3

AnswerTypes = ["multi-choice-4", "multi-choice-2", "text"]
QuestionTypes = ["text"]


def create(request):
    body = request.get_json()

    anonymous = body.get('anonymous', None)
    question_type = body.get('questionType', None)
    question_text = body.get('questionText', None)
    answer_type = body.get('answerType', None)
    answer1 = body.get('answer1', None)
    answer2 = body.get('answer2', None)
    answer3 = body.get('answer3', None)
    answer4 = body.get('answer4', None)
    correct_answer = body.get('correctAnswer', None)

    try:
        validate_answer(answer_type, answer1, answer2,
                        answer3, answer4, correct_answer)
        validate_question(question_type, question_text)
    except ValidationError:
        raise

    if anonymous is None:
        raise ValidationError("'anonymous' is required.")

    user = g.get('user')
    if not is_askpoints_enough(user.askpoints, anonymous):
        raise ValidationError("Insufficient askpoints.")

    return None


def validate_answer(answer_type, answer1, answer2,
                    answer3, answer4, correct_answer):

    if answer_type not in AnswerTypes:
        raise ValidationError("Invalid answer type.")

    if answer_type != "text" and correct_answer is None:
        raise ValidationError("Correct answer should be specified.")

    if answer_type == "multi-choice-2":
        if answer1 is None or answer2 is None:
            raise ValidationError("'answer1' and 'answer2' is required.")

    if answer_type == "multi-choice-4":
        if (answer1 is None or answer2 is None or
                answer3 is None or answer4 is None):
            raise ValidationError(
                "'answer1', 'answer2', 'answer3' and 'answer4' is required.")
    return None


def validate_question(question_type, question_text):
    if question_type not in QuestionTypes:
        raise ValidationError("Invalid question type.")

    if question_type is None:
        raise ValidationError("'questionType' is required.")
    if question_text is None:
        raise ValidationError("'questionText' is required.")


def is_askpoints_enough(askpoints, anonymous):
    if anonymous and askpoints < min_askpoints_anonymous:
        return False
    elif not anonymous and askpoints < min_askpoints:
        return False

    return True
