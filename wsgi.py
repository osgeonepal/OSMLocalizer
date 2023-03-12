from flask_migrate import Migrate

from backend import create_app, db

app = create_app()
migrate = Migrate(app, db)


if __name__ == "__main__":
    app.run()
