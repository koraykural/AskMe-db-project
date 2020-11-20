"""
Database module
This file contains connection to Database
"""
import os
import psycopg2 as dbapi2

dsn = os.getenv('DATABASE_URL')

with dbapi2.connect(dsn) as con:
    with con.cursor() as cur:
        cur.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        cur.execute(
            """CREATE TABLE IF NOT EXISTS "users" ( "id" uuid PRIMARY KEY
            DEFAULT uuid_generate_v4(),
            "email" text UNIQUE NOT NULL, "username" text UNIQUE NOT NULL,
            "password" BYTEA NOT NULL, "askpoints" int DEFAULT 0,
            "registered_at" timestamp DEFAULT (now() AT TIME ZONE 'utc'));"""
        )
        try:
            cur.execute("CREATE TYPE question_type AS ENUM('text')")
            cur.execute("CREATE TYPE answer_type AS ENUM('text', \
            'multi-choice-2', 'multi-choice-4')")
        except Exception:
            pass
        cur.execute("""CREATE TABLE IF NOT EXISTS "questions" ( "id" serial
        PRIMARY KEY,"owner_id" uuid NOT NULL, "anonymous" boolean NOT NULL,
            "question_type" question_type DEFAULT ('text'), "question_text"
            varchar, "answer_type" answer_type DEFAULT ('text'), "answer1"
            text, "answer2" text, "answer3" text, "answer4" text,
            "correct_answer" int2, "upvote_count" int DEFAULT 0,
            "downvote_count" int DEFAULT 0,
            "created_at" timestamp DEFAULT (now() AT TIME ZONE 'utc'));""")
        cur.execute("""ALTER TABLE "questions" ADD FOREIGN KEY ("owner_id")
            REFERENCES "users" ("id");
        """)
        con.commit()
