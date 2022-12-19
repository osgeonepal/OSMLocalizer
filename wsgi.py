from flask.cli import FlaskGroup
from flask_migrate import Migrate

from backend import create_app, db

app=create_app()
migrate = Migrate(app, db)

cli = FlaskGroup(create_app=create_app)

if __name__=="__main__":
   cli()
