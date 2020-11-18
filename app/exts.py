"""
This file contains extension initilizers.
"""
from flask_bcrypt import Bcrypt
from flask.json import JSONEncoder

bcrypt = Bcrypt()


class MiniJSONEncoder(JSONEncoder):
    """Minify JSON output."""
    item_separator = ','
    key_separator = ':'
