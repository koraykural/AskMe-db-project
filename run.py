"""
Package entry point
"""
from app import create_app


app = create_app()
app.config.from_object('config.Dev')
app.run(host="0.0.0.0")
