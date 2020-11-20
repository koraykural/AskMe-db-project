"""
This file contains authentication middleware decorator and error handler.
"""
import jwt
import os
from flask import request, g
from functools import wraps
from . import AuthorizationError
from app.database import user_db

SECRET_KEY = os.getenv('SECRET_KEY')


def auth_required():
    "Decorator for authorization protactor"
    def decorator(func):
        @wraps(func)
        def wrap(*args, **kwargs):
            try:
                auth_header = request.headers.get('Authorization')
                if auth_header is None:
                    raise AuthorizationError(token_missing=True)

                auth_header_list = auth_header.split()
                if(len(auth_header_list) != 2):
                    raise AuthorizationError(token_missing=True)

                token = auth_header_list[1]
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('id')
                user = user_db.find_by_id(user_id)
                if user is None:
                    raise AuthorizationError(token_invalid=True)
                g.user = user
            except jwt.ExpiredSignatureError:
                raise AuthorizationError(token_expired=True)
            except AuthorizationError:
                raise
            except Exception:
                raise AuthorizationError(token_invalid=True)

            return func(*args, **kwargs)
        return wrap
    return decorator
