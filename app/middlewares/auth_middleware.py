"""
This file contains authentication middleware decorator and error handler.
"""
from flask import request, g
import jwt
from functools import wraps
from . import AuthorizationError


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
                secret = "as'^&sdffsd24552DFS234fs"
                payload = jwt.decode(token, secret, algorithms=['HS256'])
                g.id = payload.get('id')
            except jwt.ExpiredSignatureError:
                raise AuthorizationError(token_expired=True)
            except AuthorizationError:
                raise
            except Exception:
                raise AuthorizationError(token_invalid=True)

            return func(*args, **kwargs)
        return wrap
    return decorator
