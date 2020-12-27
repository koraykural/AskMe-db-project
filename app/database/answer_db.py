"""
This file contains function for answering operations.
"""
from . import con
from psycopg2.errors import UniqueViolation


def row2dict(row):
    return {'username': row[1], 'answer': row[0]}


def answer_question(question_id, user_id, answer):
    with con.cursor() as cur:
        statement = """
            INSERT INTO answers (user_id, question_id, answer)
            VALUES (%s, %s, %s);
            """
        try:
            cur.execute(statement, (user_id, question_id, answer))
            cur.close()
            con.commit()
        except UniqueViolation:
            return False
    return True


def get_answers(question_id):
    with con.cursor() as cur:
        statement = """
            SELECT a.answer, u.username FROM answers as a
            LEFT JOIN users as u ON u.id = a.user_id
            WHERE a.question_id = %s
            """
        cur.execute(statement, question_id)
        rows = cur.fetchall()
        answers = []
        for row in rows:
            answers.append(row2dict(row))
        return answers
