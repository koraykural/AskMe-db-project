"""
This module is the flask app.
This file contains app factory functions.
"""
from flask import Flask, send_from_directory


def create_app():
    app = Flask(__name__, static_folder='public', static_url_path="")

    register_extensions(app)
    register_error_handlers(app)
    register_blueprints(app)
    register_healthz(app)
    register_static_content(app)
    minify_json_response(app)

    return app


def register_extensions(app):
    from .exts import bcrypt, init_db

    bcrypt.init_app(app)
    init_db(app)
    return None


def register_error_handlers(app):
    from app.validators import ValidationError
    from app.middlewares import AuthorizationError, api_error

    app.register_error_handler(
        AuthorizationError, lambda e: api_error(e.message))
    app.register_error_handler(
        ValidationError, lambda e: api_error(e.message))

    @app.teardown_request
    def rollback_on_error(exception):
        if exception:
            from app.database import con
            con.rollback()

    return None


def register_blueprints(app):
    from app.routes.auth_route import auth_blueprint
    from app.routes.question_route import question_blueprint
    from app.routes.user_route import user_blueprint
    from app.routes.vote_route import vote_blueprint
    from app.routes.answer_route import answer_blueprint

    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
    app.register_blueprint(question_blueprint, url_prefix='/api/question')
    app.register_blueprint(user_blueprint, url_prefix='/api/user')
    app.register_blueprint(vote_blueprint, url_prefix='/api/vote')
    app.register_blueprint(answer_blueprint, url_prefix='/api/answer')

    return None


def register_healthz(app):
    """
    deploy-release checks this after a deploy: 200 with the deployed commit
    (from REVISION at the release root) once the database answers.
    """
    import os

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    try:
        with open(os.path.join(root, 'REVISION')) as f:
            revision = f.read().strip()
    except OSError:
        revision = 'dev'

    headers = {'Content-Type': 'text/plain', 'Cache-Control': 'no-store'}

    @app.route('/healthz')
    def healthz():
        from app.database import con
        try:
            with con.cursor() as cur:
                cur.execute('SELECT 1')
            con.rollback()
        except Exception:
            app.logger.exception('healthz: database check failed')
            return 'database unavailable\n', 503, headers
        return revision + '\n', 200, headers

    return None


def register_static_content(app):
    from whitenoise import WhiteNoise
    import os

    # Allows compression and caching
    app.wsgi_app = WhiteNoise(app.wsgi_app, root=os.path.join(
        os.path.dirname(__file__), 'public'))

    @app.route('/', defaults={'path': ''})
    @app.route('/<string:path>')
    @app.route('/<path:path>')
    def static_proxy(path):
        """
        This handler will catch all routes that are not handled by previous.

        If requested thing exists in public folder, it will be served directly.
        Otherwise, index.html will be served. Angular will handle the rest.
        """
        if os.path.isfile('app/public/' + path):
            return send_from_directory('public', path)

        return app.send_static_file("index.html")

    return None


def minify_json_response(app):
    from .exts import MiniJSONEncoder
    app.json_encoder = MiniJSONEncoder
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
