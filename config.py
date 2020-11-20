"""
Config variables
"""
import os


class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY')


class Dev(BaseConfig):
    DEBUG = True


class Prod(BaseConfig):
    DEBUG = False


# Define the application directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Enable protection agains *Cross-site Request Forgery (CSRF)*
# CSRF_ENABLED = True

# Use a secure, unique and absolutely secret key for
# signing the data.
# CSRF_SESSION_KEY = "secret"
