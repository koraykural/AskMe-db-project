"""
This file contains Question class.

Question class has database operation methods.
"""
from datetime import datetime
from . import con
from .user_db import change_askpoints

anonymous_cost = 3
regular_cost = 1
AnswerTypes = ["multi-choice-4", "multi-choice-2", "text"]
QuestionTypes = ["text"]


class Question:

    def __init__(self, f=None, id=None, owner_id=None, anonymous=None,
                 question_text=None, upvote_count=0,
                 downvote_count=0, answer_type=None, created_at=datetime.now(),
                 answer1=None, answer2=None, answer3=None, answer4=None,
                 correct_answer=None, ownername=None, user_vote=None,
                 user_answer=None):
        """
        Parameters:
        f (obj): Form body for question creation.
        owner_id (str): Owner id.
        """
        self.created_at = created_at
        self.answer1 = answer1
        self.answer2 = answer2
        self.answer3 = answer3
        self.answer4 = answer4
        self.correct_answer = correct_answer
        self.upvote_count = upvote_count
        self.downvote_count = downvote_count
        self.ownername = ownername
        self.user_vote = user_vote
        self.user_answer = user_answer
        if f is not None:
            self.owner_id = owner_id
            self.anonymous = f.get('anonymous')
            self.question_text = f.get('questionText')
            self.answer_type = f.get('answerType')
            if self.answer_type != "text":
                self.answer1 = f.get('answer1')
                self.answer2 = f.get('answer2')
                self.correct_answer = f.get('correctAnswer')
            if self.answer_type == "multi-choice-4":
                self.answer3 = f.get('answer3')
                self.answer4 = f.get('answer4')
        else:
            self.id = id
            self.owner_id = owner_id
            self.anonymous = anonymous
            self.question_text = question_text
            self.answer_type = answer_type

    def __str__(self):
        return 'Question(id="%s",question="%s",answer_type="%s")' \
            % (self.id, self.question_text, self.answer_type)

    def save(self):
        with con.cursor() as cur:
            statement = """INSERT INTO questions (owner_id, anonymous,
            question_text, answer_type, answer1,
            answer2, answer3, answer4, correct_answer, created_at) VALUES
            (%s, %s, %s,%s,%s, %s, %s, %s, %s, %s)"""
            cur.execute(statement,
                        (self.owner_id, self.anonymous,
                            self.question_text, self.answer_type,
                            self.answer1, self.answer2, self.answer3,
                            self.answer4, self.correct_answer,
                            datetime.utcnow()))
            if self.anonymous:
                change_askpoints(self.owner_id, anonymous_cost * -1)
            else:
                change_askpoints(self.owner_id, regular_cost * -1)

            cur.close()
            con.commit()
        return None

    def serialize(self):
        dic = {
            'id': self.id,
            'anonymous': self.anonymous,
            'questionText': self.question_text,
            'answerType': self.answer_type,
            'upvoteCount': self.upvote_count,
            'downvoteCount': self.downvote_count,
            'createdAt': self.created_at,
            'ownername': self.ownername,
            'userVote': self.user_vote,
            'userAnswer': self.user_answer
        }

        if not self.anonymous:
            dic['owner'] = self.owner_id

        if self.answer_type != "text":
            dic['answer1'] = self.answer1
            dic['answer2'] = self.answer2
            dic['correctAnswer'] = self.correct_answer

        if self.answer_type == "multi-choice-4":
            dic['answer3'] = self.answer3
            dic['answer4'] = self.answer4

        return dic


def serializer(id, owner_id, anonymous, question_text,
               answer_type, answer1, answer2, answer3, answer4,
               correct_answer, created_at, ownername, user_vote,
               user_answer, upvote_count, downvote_count):
    return Question(id=id, owner_id=owner_id, anonymous=anonymous,
                    question_text=question_text,
                    answer_type=answer_type, answer1=answer1, answer2=answer2,
                    answer3=answer3, answer4=answer4, created_at=created_at,
                    correct_answer=correct_answer, upvote_count=upvote_count,
                    downvote_count=downvote_count, ownername=ownername,
                    user_vote=user_vote, user_answer=user_answer)


def get_question(id):
    with con.cursor() as cur:
        statement = "SELECT * FROM questions WHERE id = %s"
        cur.execute(statement, (id,))
        row = cur.fetchone()
        if row is None:
            cur.close()
            return None
        return Question(id=row[0], owner_id=row[1], anonymous=row[2],
                        question_text=row[4],
                        answer_type=row[5], answer1=row[6], answer2=row[7],
                        answer3=row[8], answer4=row[9], created_at=row[12],
                        correct_answer=row[10], upvote_count=row[11],
                        downvote_count=row[12])


def get_all_question():
    with con.cursor() as cur:
        statement = "SELECT q.*, u.username as ownername FROM " + \
            "questions as q LEFT JOIN users as u ON q.owner_id " + \
            "= u.id and q.anonymous = 'f' ORDER BY q.created_at DESC"
        cur.execute(statement)
        rows = cur.fetchall()
        questions = []
        for row in rows:
            questions.append(serializer(*row))
        cur.close()
        return [e.serialize() for e in questions]


def get_question_pack(older_than, user_id):
    with con.cursor() as cur:
        statement = """
            SELECT q.*, u.username as ownername, v.vote as user_vote,
            a.answer as user_answer, (SELECT COUNT(*) FROM votes as v WHERE
            v.question_id = q.id AND v.vote = true) as upvote_count,
            (SELECT COUNT(*) FROM votes as v WHERE v.question_id = q.id
            AND v.vote = false) as downvote_count FROM questions as q
            LEFT JOIN users as u ON q.owner_id = u.id AND q.anonymous = 'f'
            LEFT JOIN votes as v ON v.user_id = %s AND v.question_id = q.id
            LEFT JOIN answers as a ON a.user_id = %s AND a.question_id = q.id
            """

        if older_than is not None:
            statement += "WHERE q.created_at < to_timestamp(%s) "

        statement += "ORDER BY q.created_at DESC LIMIT 5"

        cur.execute(statement, (user_id, user_id, older_than))
        rows = cur.fetchall()
        questions = []
        for row in rows:
            questions.append(serializer(*row))
        cur.close()
        return [e.serialize() for e in questions]


def change_owner_askpoints(question_id, amount):
    with con.cursor() as cur:
        statement = """
            UPDATE users SET askpoints = askpoints + %s
            FROM questions WHERE questions.id = %s
            AND users.id = questions.owner_id
            """
        cur.execute(statement, (amount, question_id))
        cur.close()
        con.commit()
