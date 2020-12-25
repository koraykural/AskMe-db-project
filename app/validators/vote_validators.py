"""
This file contains voting validator.
"""
from . import ValidationError, general_validators


def vote(request):
    body = request.get_json()
    general_validators.primary_key(request)
    vote = body.get('vote')
    if vote is None:
        raise ValidationError("'vote' is required.")
    return
