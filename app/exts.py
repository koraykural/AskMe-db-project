"""
This file contains extension initilizers.
"""
from psycopg2 import pool
import os
from flask_bcrypt import Bcrypt
from flask.json import JSONEncoder


bcrypt = Bcrypt()
pgpool = None


def init_db(app):
    global pgpool
    PORT = os.getenv('DATABASE_PORT')
    USER = os.getenv('DATABASE_USER')
    HOST = os.getenv('DATABASE_HOST')
    DATABASE = os.getenv('DATABASE_DATABASE')
    PASSWORD = os.getenv('DATABASE_PASSWORD')
    pgpool = \
        pool.SimpleConnectionPool(1, 10, user=USER, password=PASSWORD,
                                  host=HOST, port=PORT, database=DATABASE)
    app.config['postgreSQL_pool'] = pgpool


class MiniJSONEncoder(JSONEncoder):
    """Minify JSON output."""
    item_separator = ','
    key_separator = ':'
