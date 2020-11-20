"""
This file contains User class.

User class has database operation methods.
"""
import os
from uuid import uuid4 as uuid
import psycopg2 as dbapi2

dsn = os.getenv('DATABASE_URL')


class User:
    def __init__(self, email=None, username=None, pw_hash=None,
                 id=str(uuid()), askpoints=10, registered_at=None):
        self.id = id
        self.email = email
        self.username = username
        self.password = pw_hash
        self.askpoints = askpoints
        self.registered_at = registered_at

    def __str__(self):
        return 'User(id="%s",email="%s",username="%s")' \
            % (self.id, self.email, self.username)

    def save(self):
        with dbapi2.connect(dsn) as con:
            with con.cursor() as cur:
                statement = """INSERT INTO users (id, email, username,
            password, askpoints) VALUES (%s, %s,%s,%s,%s)"""
                cur.execute(statement,
                            (self.id, self.email, self.username,
                             self.password, self.askpoints,))
                con.commit()
        return None

    def serialize(self):
        dic = {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'askpoints': self.askpoints,
            'registered_at': self.registered_at
        }
        return dic


def is_email_unique(email):
    with dbapi2.connect(dsn) as con:
        with con.cursor() as cur:
            statement = "SELECT 1 FROM users WHERE email = %s LIMIT 1"
            cur.execute(statement, (email,))
            row = cur.fetchone()
    if row is None:
        return True
    else:
        return False


def is_username_unique(username):
    with dbapi2.connect(dsn) as con:
        with con.cursor() as cur:
            statement = "SELECT 1 FROM users WHERE username = %s LIMIT 1"
            cur.execute(statement, (username,))
            row = cur.fetchone()
            if row is None:
                return True
            else:
                return False


def find_by_email(email):
    with dbapi2.connect(dsn) as con:
        with con.cursor() as cur:
            statement = "SELECT * FROM users WHERE email = %s LIMIT 1"
            cur.execute(statement, (email,))
            row = cur.fetchone()
            if row is None:
                return None
            else:
                return User(email=row[1], username=row[2], pw_hash=row[3],
                            id=row[0], askpoints=row[4], registered_at=row[5])


def find_by_id(id):
    with dbapi2.connect(dsn) as con:
        with con.cursor() as cur:
            statement = "SELECT * FROM users WHERE id = %s LIMIT 1"
            cur.execute(statement, (id,))
            row = cur.fetchone()
            if row is None:
                return None
            else:
                return User(email=row[1], username=row[2], pw_hash=row[3],
                            id=row[0], askpoints=row[4], registered_at=row[5])
