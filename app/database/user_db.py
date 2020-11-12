"""
This file contains User class.

User class has database operation methods.
"""
from uuid import uuid4 as uuid


class User:
    def __init__(self, email, username, pw_hash):
        self.id = str(uuid())
        self.email = email
        self.username = username
        self.password = pw_hash
        self.askpoints = 10

    def __str__(self):
        return 'User(id="%s",email="%s",username="%s")' \
            % (self.id, self.email, self.username)

    def save(self):
        users.append(self)
        emails[self.email] = self
        usernames[self.username] = self
        ids[self.id] = self
        return None


# Temporary in-memory database
users = []
emails = {u.email: u for u in users}
usernames = {u.username: u for u in users}
ids = {u.id: u for u in users}


def is_email_unique(email):
    print(emails)
    user = emails.get(email, None)
    if user is None:
        return True
    else:
        return False


def is_username_unique(username):
    user = usernames.get(username, None)
    if user is None:
        return True
    else:
        return False


def find_by_email(email):
    user = emails.get(email, None)
    return user


def find_by_id(id):
    user = ids.get(id, None)
    return user


# def get_askpoints(id):
#     user = find_by_id(id)

#     if user is None:
#         raise Exception("User not found")

#     return user.askpoints
