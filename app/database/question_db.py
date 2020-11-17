"""
This file contains Question class.

Question class has database operation methods.
"""
from datetime import datetime
import psycopg2 as dbapi2

dsn = "postgres://postgres:123456@localhost:5433/askme"
AnswerTypes = ["multi-choice-4", "multi-choice-2", "text"]
QuestionTypes = ["text"]


class Question:

    def __init__(self, f=None, id=None, owner_id=None, anonymous=None,
                 question_type="text", question_text=None, upvote_count=0,
                 downvote_count=0, answer_type=None, created_at=datetime.now(),
                 answer1=None, answer2=None, answer3=None, answer4=None,
                 correct_answer=None):
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
        if f is not None:
            self.owner_id = owner_id
            self.anonymous = f.get('anonymous')
            self.question_type = f.get('questionType')
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
            self.question_type = question_type
            self.question_text = question_text
            self.answer_type = answer_type

    def __str__(self):
        return 'Question(id="%s",question="%s",answer_type="%s")' \
            % (self.id, self.question_text, self.answer_type)

    def save(self):
        with dbapi2.connect(dsn) as con:
            with con.cursor() as cur:
                statement = """INSERT INTO questions (owner_id, anonymous,
                question_type, question_text, answer_type, answer1,
                answer2, answer3, answer4, correct_answer) VALUES (%s, %s,
                %s,%s,%s, %s, %s, %s, %s, %s)"""
                cur.execute(statement,
                            (self.owner_id, self.anonymous, self.question_type,
                             self.question_text, self.answer_type,
                             self.answer1, self.answer2, self.answer3,
                             self.answer4, self.correct_answer,))
                con.commit()
        return None

    def serialize(self):
        dic = {
            'id': self.id,
            'anonymous': self.anonymous,
            'questionType': self.question_type,
            'questionText': self.question_text,
            'answerType': self.answer_type,
            'upvoteCount': self.upvote_count,
            'downvoteCount': self.downvote_count,
            'createdAt': self.created_at
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


def serializer(id, owner_id, anonymous, question_type, question_text,
               answer_type, answer1, answer2, answer3, answer4,
               correct_answer, upvote_count, downvote_count,
               created_at):
    return Question(id=id, owner_id=owner_id, anonymous=anonymous,
                    question_type=question_type, question_text=question_text,
                    answer_type=answer_type, answer1=answer1, answer2=answer2,
                    answer3=answer3, answer4=answer4, created_at=created_at,
                    correct_answer=correct_answer, upvote_count=upvote_count,
                    downvote_count=downvote_count)


def get_all_question():
    with dbapi2.connect(dsn) as con:
        with con.cursor() as cur:
            statement = "SELECT * FROM questions"
            cur.execute(statement)
            rows = cur.fetchall()
            questions = []
            for row in rows:
                questions.append(serializer(*row))
            return [e.serialize() for e in questions]
