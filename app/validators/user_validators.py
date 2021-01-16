"""
This file contains change_username, change_email, change_password
form validator functions.
"""
from . import ValidationError
# from flask import g
# from app.exts import bcrypt
# from app.middlewares import api_error


def email(request):
    body = request.get_json()
    email = body.get('email')
    if email is None:
        raise ValidationError(
            "'email', 'username' and 'password' is required.")
    return


def username(request):
    body = request.get_json()
    username = body.get('username')
    if username is None or len(username) > 20 or len(username) < 3:
        raise ValidationError(
            "Username should be at length of min 3 and max 20.")
    return


def password(request):
    body = request.get_json()
    # user = g.user
    # old_password = body.get('old_password')
    new_password = body.get('new_password')

    # if old_password is None or \
    #         not bcrypt.check_password_hash(user.password, old_password):
    #     return api_error("Wrong password.")

    if new_password is None or len(new_password) > 30 or len(new_password) < 8:
        raise ValidationError(
            "Password should be at length of min 8 and max 30.")
    return
