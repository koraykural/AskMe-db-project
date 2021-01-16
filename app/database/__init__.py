"""
Database module
This file contains connection to Database
"""
from app.exts import pgpool


def get_con():
    return pgpool.getconn()


con = get_con()

# Initial setup
setup_statement = """
    CREATE TYPE "answer_type" AS ENUM (
    'text',
    'multi-choice-2',
    'multi-choice-4'
    );

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE "users" (
    "id" uuid PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
    "email" text UNIQUE NOT NULL,
    "username" text UNIQUE NOT NULL,
    "password" text NOT NULL,
    "askpoints" int NOT NULL DEFAULT 0,
    "registered_at" timestamp NOT NULL DEFAULT (now())
    );

    CREATE TABLE "questions" (
    "id" serial PRIMARY KEY NOT NULL,
    "owner_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "anonymous" boolean NOT NULL,
    "question_text" varchar,
    "answer_type" answer_type NOT NULL,
    "answer1" text,
    "answer2" text,
    "answer3" text,
    "answer4" text,
    "correct_answer" int2,
    "created_at" timestamp NOT NULL DEFAULT (now())
    );

    CREATE TABLE "answers" (
    "question_id" int NOT NULL REFERENCES "questions" ("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "answer" text NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT (now()),
    "likes" int NOT NULL DEFAULT 0,
    "dislikes" int NOT NULL DEFAULT 0,
    "edited" boolean NOT NULL DEFAULT false,
    PRIMARY KEY ("question_id", "user_id")
    );

    CREATE TABLE "votes" (
    "question_id" int NOT NULL REFERENCES "questions" ("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "vote" boolean NOT NULL,
    PRIMARY KEY ("question_id", "user_id")
    );

    CREATE INDEX vote_count_idx ON votes USING btree (vote, question_id);

    CREATE FUNCTION delete_vote_ap() RETURNS trigger AS
    $$
    BEGIN
        IF OLD.vote = true THEN
            UPDATE users SET askpoints = askpoints - 1 FROM questions
            WHERE questions.id = OLD.question_id
            AND users.id = questions.owner_id;
            RETURN OLD;
        ELSE
            UPDATE users SET askpoints = askpoints + 1 FROM questions
            WHERE questions.id = OLD.question_id
            AND users.id = questions.owner_id;
            RETURN OLD;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

    CREATE FUNCTION insert_vote_ap() RETURNS trigger AS
    $$
    BEGIN
        IF NEW.vote = true THEN
            UPDATE users SET askpoints = askpoints + 1 FROM questions
            WHERE questions.id = NEW.question_id
            AND users.id = questions.owner_id;
            RETURN NEW;
        ELSE
            UPDATE users SET askpoints = askpoints - 1 FROM questions
            WHERE questions.id = NEW.question_id
            AND users.id = questions.owner_id;
            RETURN NEW;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

    CREATE FUNCTION withdraw_question_cost() RETURNS trigger AS
    $$
    BEGIN
        IF NEW.anonymous = true THEN
            UPDATE users SET askpoints = askpoints - 3
            WHERE id = NEW.owner_id;
            RETURN NEW;
        ELSE
            UPDATE users SET askpoints = askpoints - 1
            WHERE id = NEW.owner_id;
            RETURN NEW;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

    CREATE FUNCTION update_vote_ap() RETURNS trigger AS
    $$
    BEGIN
        IF NEW.vote = true THEN
            UPDATE users SET askpoints = askpoints + 2 FROM questions
            WHERE questions.id = NEW.question_id
            AND users.id = questions.owner_id;
            RETURN NEW;
        ELSE
            UPDATE users SET askpoints = askpoints - 2 FROM questions
            WHERE questions.id = NEW.question_id
            AND users.id = questions.owner_id;
            RETURN NEW;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER delete_vote AFTER DELETE ON votes FOR EACH ROW
    EXECUTE PROCEDURE delete_vote_ap();

    CREATE TRIGGER insert_vote AFTER INSERT ON votes FOR EACH ROW
    EXECUTE PROCEDURE insert_vote_ap();

    CREATE TRIGGER update_vote AFTER UPDATE OF vote ON votes FOR EACH ROW
    EXECUTE PROCEDURE update_vote_ap();

    CREATE TRIGGER create_question AFTER INSERT ON questions FOR EACH ROW
    EXECUTE PROCEDURE withdraw_question_cost();
"""

# with con:
#     cursor = con.cursor()
#     cursor.execute(setup_statement)
#     cursor.close()
