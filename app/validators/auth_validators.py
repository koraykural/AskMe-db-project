"""
This file containst login form validator class.
"""
from . import ValidationError


def login(request):
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')
    if email is None or password is None:
        raise ValidationError("'email' and 'password' is required.")
    return


def register(request):
    body = request.get_json()
    email = body.get('email')
    username = body.get('username')
    password = body.get('password')
    if email is None or username is None or password is None:
        raise ValidationError(
            "'email', 'username' and 'password' is required.")

    if len(password) > 30 or len(password) < 8:
        raise ValidationError(
            "Password should be at length of min 8 and max 30.")

    if len(username) > 20 or len(username) < 3:
        raise ValidationError(
            "Username should be at length of min 3 and max 20.")
    return
