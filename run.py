"""
Package entry point
"""
import os
from app import create_app
from dotenv import load_dotenv


load_dotenv()
env = os.getenv('environment')

app = create_app()

if env == 'development':
    app.config.from_object('config.Dev')
elif env == 'production':
    app.config.from_object('config.Prod')

host = os.getenv('host', '0.0.0.0')
port = os.getenv('port', 5000)

app.run(host=host, port=port)
