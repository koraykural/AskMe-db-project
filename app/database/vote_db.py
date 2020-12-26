"""
This file contains function for voting operations.
"""
from . import con


def vote_question(question_id, user_id, vote):
    with con.cursor() as cur:
        statement = """
            INSERT INTO votes (user_id, question_id, vote) VALUES (%s, %s, %s)
            ON CONFLICT (user_id, question_id) DO UPDATE SET vote = %s
            """
        cur.execute(statement, (user_id, question_id, vote, vote))
        cur.close()
        con.commit()
    return


def upvote_question(question_id, user_id):
    vote_question(question_id, user_id, True)


def downvote_question(question_id, user_id):
    vote_question(question_id, user_id, False)


def delete_vote(question_id, user_id):
    with con.cursor() as cur:
        statement = """
            DELETE FROM votes WHERE question_id = %s AND user_id = %s
            """
        cur.execute(statement, (question_id, user_id,))
        cur.close()
        con.commit()
