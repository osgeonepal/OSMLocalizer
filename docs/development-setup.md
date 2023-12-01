# Setup OSMLocalizer for development

## Architecture
The codebase is divided into 2 main parts:
- `frontend`: The frontend is a React app that is served by the backend. It is located in the `frontend` folder.
- `backend`: The backend is a Python Flask app that provides the API. Most of the code is located in the `backend` folder. The `wsgi.py` file is the entrypoint of the backend.
- `database`: The database is a PostgreSQL database with the PostGIS extension. The database is used by the backend to store data.


## Setting up the development environment

### Environment variables
Copy example.env to localizer.env with the following command:
```bash
cp example.env localizer.env
```

Now you can edit the `localizer.env` file to set the environment variables. The following environment variables are required to run the app:
- `API_BASE_URL`: The base URL of the API. This is used by the frontend to make API calls. The default value is `http://127.0.0.1:5000/`
- `MAPBOX_ACCESS_TOKEN`: The access token for the Mapbox API. This is used by the frontend to display the map.
`MAX_CHALLENGE_AREA`: The maximum area of a challenge in square meters. This is used by the backend and frontend to validate challenges. The default value is `200`.
- `CHANGES_UPLOAD_LIMIT`: The maximum number of changes that can be uploaded at once. This is used by the frontend to stop users making too many changes at once to ensure changes are being uploaded consistently to OSM. The default value is `25`.
- `APP_SECRET_KEY`: The secret key of the app. This is used by the backend to sign tokens.

##### Login with OSM
Create an OAuth2 application on the [OpenStreetMap website](https://www.openstreetmap.org/oauth2/applications/new).  It is important to provide `Read user preferences` and `Modify the map (read and write)` scopes. The redirect URI should be set to `http://127.0.0.1:3000/authorized` while developing locally.
- `OAUTH2_CLIENT_ID`: The client ID of the OAuth2 application.
- `OAUTH2_CLIENT_SECRET`: The client secret of the OAuth2 application.
- `OAUTH2_REDIRECT_URI`: The redirect URI of the OAuth2 application. This should be set to `http://127.0.0.1:3000/authorized`.
- `OAUTH2_SCOPE`: The scope of the OAuth2 application. This should be set to `read_prefs` and `write_api`.

##### Database variables
The following environment variables are required to connect to the database:
- `POSTGRES_DB`: The name of the database.
- `POSTGRES_USER`: The username of the database user.
- `POSTGRES_PASSWORD`: The password of the database user.
- `POSTGRES_ENDPOINT`: The host of the database. The default value is `localhost`.
- `POSTGRES_PORT`: The port of the database. The default value is `5432`.


### Database setup
##### Method 1: Without Docker
1. Install PostgreSQL (version 13 or higher recommended)
2. Install [PostGIS](https://postgis.net/install/) (version 3.1 or higher recommended)
3. Create a database user with the following command:
```bash
sudo -u postgres createuser -P -s -e <username>
```
4. Create a database with the following command:
```bash
sudo -u postgres createdb -O <username> <database_name>
```
5. Create the PostGIS extension with the following command:
```bash
sudo -u postgres psql -d <database_name> -c "CREATE EXTENSION postgis;"
```
6. Set the environment variables in the `localizer.env` file.   

##### Method 2: With Docker (Database)
1. Install [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher recommended)
2. Install [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29 or higher recommended)



##### Method 2: With Docker (Just the database)
1. Install [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher recommended)
2. Install [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29 or higher recommended)
3. Set the environment variables in the `localizer.env` file. The `POSTGRES_PORT` environment variable should be set to `5535` as this is the port that is exposed by the `db` service in the `docker-compose.yml` file. The docker-compose will create user, database and password with the specified `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` env variables while creating the database container.
4. Comment out all other services in the `docker-compose.yml` file except for the `db` service if you want to run only the database in Docker.
4. Run the following command to start the database container:
```bash
docker-compose up -d
```
5. You need to setup the backend to create the tables. Follow the steps in the backend setup section.


Your database should now be set up. Let's move on to the backend setup.

### Backend setup
##### Method 1: Without Docker
1. Install [Python](https://www.python.org/downloads/) (version 3.9 or higher recommended)
2. Install [PDM](https://pdm.fming.dev/) (version 1.8 or higher recommended)


**Using PDM (Recommended)**

1. Install the dependencies by running `pdm install` in the project root with the following command:
```bash
pdm install
```
2. Set the environment variables in the `localizer.env` file.
3. Run the following command to create the tables / apply migrations (skip this if```flask db upgrade``` is done):
```bash
pdm run upgrade
```
4. Start the backend with the following command:
```bash
pdm run start
```
**Using Pip**
1. Export the dependencies from `pdm.lock` to `requirements.txt` with the following command:
```bash
pdm export --without-hashes > requirements.txt
```
2. Create a virtual environment with the following command:
```bash
python -m venv venv
```
3. Activate the virtual environment with the following command:
```bash
source venv/bin/activate
```
4. Install the dependencies from `requrements.txt` with the following command:
```bash
pip install -r requirements.txt
```
5. Set the environment variables in the `localizer.env` file.
6. Run the following command to create the tables:
```bash
flask db upgrade
```
7. Start the backend with the following command:
```bash
python wsgi.py
```

##### Method 2: With Docker
1. Install [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher recommended)
2. Install [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29 or higher recommended)
3. Set the environment variables in the `localizer.env` file.
4. Run the following command to start the backend container:
```bash
docker-compose up -d
```
5. All the tables should be created automatically. You can check if the tables are created by running the following command:
```bash
docker-compose logs -f backend
```

**Your backend should now be set up.**

Hit GET API ```/api/system/``` For health check of API to ensure backend is running successfully it should return healthy

**Let's move on to the frontend setup.**


### Frontend setup
1. Install [Node.js](https://nodejs.org/en/download/) (version 18 or higher recommended)
2. Install [Yarn](https://yarnpkg.com/getting-started/install) (version 1.22 or higher recommended)
3. Install the dependencies by running `yarn install` in the `frontend` folder with the following command:
```bash
cd frontend
yarn install
```
4. Start the frontend with the following command:
```bash
yarn start
```
5. The frontend should now be running on [http://localhost:3000](http://localhost:3000)
6. Now you need to navigate to [http://127.0.0.1:3000](http://127.0.0.1:3000) as login functionality doesn't work on [http://localhost:3000](http://localhost:3000). You should now be able to login with your OSM account.


### Post SETUP 

- After successful setup and login you will encounter permission issue during creation of challenge , Open Users table in your database , Alter your users role to 1 , Logout from frontend and Login again , You should be READY TO ROCK 