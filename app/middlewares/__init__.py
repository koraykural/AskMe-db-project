from flask import jsonify


class AuthorizationError(Exception):
    def __init__(self, token_missing=False,
                 token_invalid=False, token_expired=False):
        if token_missing:
            self.message = "Authorization token is missing."
        elif token_invalid:
            self.message = "Authorization token is invalid."
        elif token_expired:
            self.message = "Authorization token is expired."


def api_error(msg):
    response = {
        'status': 'Error',
        'message': msg
    }
    return jsonify(response), 400
