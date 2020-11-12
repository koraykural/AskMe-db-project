"""
This file contains validation decorator and error handlers
"""
from flask import request
from functools import wraps


class ValidationError(Exception):
    def __init__(self, message='Invalid input'):
        self.message = message


def validate_request(validator):
    "Decorator for input validation"
    def decorator(func):
        @wraps(func)
        def wrap(*args, **kwargs):
            try:
                validator(request)
            except ValidationError:
                raise
            return func(*args, **kwargs)
        return wrap
    return decorator
