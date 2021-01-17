"""
This file contains User class.

User class has database operation methods.
"""
from uuid import uuid4 as uuid
from . import con


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
        with con.cursor() as cur:
            statement = """
                INSERT INTO users (id, email, username,
                password, askpoints) VALUES (%s, %s,%s,%s,%s)
                """
            cur.execute(statement,
                        (self.id, self.email, self.username,
                         self.password, self.askpoints,))
            cur.close()
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
    with con.cursor() as cur:
        statement = "SELECT 1 FROM users WHERE email = %s LIMIT 1"
        cur.execute(statement, (email,))
        row = cur.fetchone()
        cur.close()
    if row is None:
        return True
    else:
        return False


def is_username_unique(username):
    with con.cursor() as cur:
        statement = "SELECT 1 FROM users WHERE username = %s LIMIT 1"
        cur.execute(statement, (username,))
        row = cur.fetchone()
        if row is None:
            return True
        else:
            return False
        cur.close()


def find_by_email(email):
    with con.cursor() as cur:
        statement = "SELECT * FROM users WHERE email = %s LIMIT 1"
        cur.execute(statement, (email,))
        row = cur.fetchone()
        if row is None:
            return None
        else:
            return User(email=row[1], username=row[2], pw_hash=row[3],
                        id=row[0], askpoints=row[4], registered_at=row[5])
        cur.close()


def find_by_id(id):
    with con.cursor() as cur:
        statement = "SELECT * FROM users WHERE id = %s LIMIT 1"
        cur.execute(statement, (id,))
        row = cur.fetchone()
        if row is None:
            return None
        else:
            return User(email=row[1], username=row[2], pw_hash=row[3],
                        id=row[0], askpoints=row[4], registered_at=row[5])
        cur.close()


def change_email(user_id, new_email):
    with con.cursor() as cur:
        statement = """
            UPDATE users SET email = %s
            WHERE id = %s
            """
        cur.execute(statement, (new_email, user_id))
        cur.close()
        con.commit()
    return None


def change_username(user_id, new_username):
    with con.cursor() as cur:
        statement = """
            UPDATE users SET username = %s
            WHERE id = %s
            """
        cur.execute(statement, (new_username, user_id))
        cur.close()
        con.commit()
    return None


def change_password(user_id, new_password):
    with con.cursor() as cur:
        statement = """
            UPDATE users SET password = %s
            WHERE id = %s
            """
        cur.execute(statement, (new_password, user_id))
        cur.close()
        con.commit()
    return None


def delete_account(user_id):
    with con.cursor() as cur:
        statement = """
            DELETE FROM users WHERE id = %s
            """
        cur.execute(statement, (user_id,))
        cur.close()
        con.commit()
    return None


def get_statistics(user_id):
    with con.cursor() as cur:
        statement = """
            SELECT COUNT(q.id) as question_count,
            COALESCE(SUM(vu.count), 0) :: bigint as total_upvote,
            COALESCE(MAX(vu.count), 0) as max_upvote,
            COALESCE(SUM(vd.count), 0) :: bigint as total_downvote,
            COALESCE(MAX(vd.count), 0) as max_downvote,
            COALESCE(SUM(a.count), 0) :: bigint as total_answers,
            COALESCE(MAX(a.count), 0) AS max_answers
            FROM questions as q
            LEFT JOIN (
                SELECT COUNT(user_id), v.question_id FROM votes as v
                WHERE v.vote = true GROUP BY v.question_id
                ) AS vu ON vu.question_id = q.id
            LEFT JOIN (
                SELECT COUNT(user_id), v.question_id FROM votes as v
                WHERE v.vote = false GROUP BY v.question_id
                ) AS vd ON vd.question_id = q.id
            LEFT JOIN (
                SELECT COUNT(user_id), a.question_id FROM answers as a
                GROUP BY a.question_id
                ) AS a ON a.question_id = q.id
            WHERE q.owner_id = %s
            GROUP BY q.owner_id
            """
        cur.execute(statement, (user_id,))
        row = cur.fetchone()
        if row is None:
            return {
                'questionCount': 0,
                'totalUpvote': 0,
                'maxUpvote': 0,
                'totalDownvote': 0,
                'maxDownvote': 0,
                'totalAnswers': 0,
                'maxAnswers': 0,
            }
        stats = {
            'questionCount': row[0],
            'totalUpvote': row[1],
            'maxUpvote': row[2],
            'totalDownvote': row[3],
            'maxDownvote': row[4],
            'totalAnswers': row[5],
            'maxAnswers': row[6],
        }
        cur.close()
        return stats
