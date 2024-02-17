# User Management API

This API handles user registration, login, and profile management with avatar and photo uploads.

**Project Stack**: NestJS, Postgres, Typescript, Docker

## Run the API in Dev Mode

To start the application in development mode:

1. Clone this repo.

2. Copy the `.env` file provided into the api root folder.

3. Certify you have [Docker](https://www.docker.com/get-started/) installed in your machine.

4. In the terminal, navigate to the project directory (api root folder). *For example:*

```bash
cd Documents/umt-api
```

1. Use Docker Compose to start the services.

```bash
docker compose up
```

1. Use the Postman collection provided to test the API.

## Useful Links

- API Link: <http://localhost:3000/api/>
- API Documentation link: <http://localhost:3000/api/docs>
- PGAdmin link: <http://localhost:5050/>
  - Check the user and password in the `.env` file.
