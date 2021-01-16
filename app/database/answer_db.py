"""
This file contains function for answering operations.
"""
from . import con
from psycopg2.errors import UniqueViolation


def row2dict(row):
    return {
        'questionId': row[0],
        'userId': row[1],
        'answer': row[2],
        'createdAt': row[3],
        'likes': row[4],
        'dislikes': row[5],
        'edited': row[6],
        'username': row[7]
    }


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
            SELECT a.*, u.username FROM answers as a
            LEFT JOIN users as u ON u.id = a.user_id
            WHERE a.question_id = %s
            """
        cur.execute(statement, (question_id,))
        rows = cur.fetchall()
        answers = []
        for row in rows:
            answers.append(row2dict(row))
        return answers


def edit_answer(question_id, user_id, answer):
    with con.cursor() as cur:
        statement = """
            UPDATE answers SET answer = %s, edited = true
            WHERE question_id = %s AND user_id = %s
            """
        cur.execute(statement, (answer, question_id, user_id))
        cur.close()
        con.commit()
        return True


def delete_answer(question_id, user_id):
    with con.cursor() as cur:
        statement = """
            DELETE FROM answers WHERE question_id = %s AND user_id = %s
            """
        cur.execute(statement, (question_id, user_id))
        cur.close()
        con.commit()
        return True


def like(question_id, user_id):
    with con.cursor() as cur:
        statement = """
            UPDATE answers SET likes = likes + 1
            WHERE question_id = %s AND user_id = %s
            """
        cur.execute(statement, (question_id, user_id))
        cur.close()
        con.commit()
        return True


def dislike(question_id, user_id):
    with con.cursor() as cur:
        statement = """
            UPDATE answers SET dislikes = dislikes + 1
            WHERE question_id = %s AND user_id = %s
            """
        cur.execute(statement, (question_id, user_id))
        cur.close()
        con.commit()
        return True
