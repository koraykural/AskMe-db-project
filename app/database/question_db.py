"""
This file contains Question class.

Question class has database operation methods.
"""
from datetime import datetime

AnswerTypes = ["multi-choice-4", "multi-choice-2", "text"]
QuestionTypes = ["text"]


# Temporary in-memory database
questions = []
last_id = 0
ids = {u.id: u for u in questions}
ownerids = {u.owner_id: u for u in questions}


class Question:

    def __init__(self, f, owner_id):
        """
        Parameters:
        f (obj): Form body for question creation.
        owner_id (str): Owner id.
        """
        global last_id
        self.id = last_id
        self.owner_id = owner_id
        self.anonymous = f.get('anonymous')
        self.question_type = f.get('questionType')
        self.question_text = f.get('questionText')
        self.upvote_count = 0
        self.downvote_count = 0
        self.answer_type = f.get('answerType')
        self.created_at = datetime.now()
        if self.answer_type != "text":
            self.answer1 = f.get('answer1')
            self.answer2 = f.get('answer2')
            self.correct_answer = f.get('correctAnswer')
        if self.answer_type == "multi-choice-4":
            self.answer3 = f.get('answer3')
            self.answer4 = f.get('answer4')

        last_id += 1

    def __str__(self):
        return 'Question(id="%s",question="%s",answer_type="%s")' \
            % (self.id, self.question_text, self.answer_type)

    def save(self):
        questions.append(self)
        ids[self.id] = self
        ownerids[self.owner_id] = self
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


def get_all_question():
    return questions
