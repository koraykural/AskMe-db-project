"""
Package entry point
"""
import os
from app import create_app
from dotenv import load_dotenv
import waitress


load_dotenv()
env = os.getenv('environment')

app = create_app()

if env == 'development':
    app.config.from_object('config.Dev')
elif env == 'production':
    app.config.from_object('config.Prod')

# host = os.getenv('host')
port = int(os.getenv('port', 33507))

if __name__ == "__main__":
    waitress.serve(app, port=port)
