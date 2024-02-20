# User Management API

This API handles user registration, login, and profile management with avatar and photo uploads.

**Project Stack**: NestJS, Postgres, Typescript, Docker

## Run the API in Dev Mode

To start the application in development mode:

1. Clone this repo.

2. Copy the `.env` file provided into the api root folder.

3. Certify you have [Docker](https://www.docker.com/get-started/) installed in your machine.

4. In the terminal, Navigate to the project's directory where the `Dockerfile` and `docker-compose.yml` files are located. You should *For example:*

```bash
cd Documents/umt-api
```

5. Build the Dokcer Image based on `Dockerfile`

```bash
docker build -f Dockerfile .
```

6. Start the application running Docker Compose. This defines the services, networks and volumes based on your `docker-compose.yml`

```bash
docker compose up
```

7. Use the Postman collection provided to test the API.

## Useful Links

- API Link: <http://localhost:3000/api/>
- API Documentation link: <http://localhost:3000/api/docs>
- PGAdmin link: <http://localhost:5050/>
  - Check the user and password in the `.env` file.
