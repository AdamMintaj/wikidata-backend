TODO: Add link to frontend once deployed - on github and in root response
TODO: Update env variables once frontend deployed

# Wikidata Project Backend

This app is the backend for a Wikidata project in my portfolio. It's built with Node.js and Express.

## Overview

The backend consists of two main modules/functionalities:

- Database updater,
- API.

It also works with a PostgreSQL database.

## Database

The database has two tables:

- **data**, where all data for the frontend is held,
- **wikidata_fetch_logs**, which cointains logs of all fetch operations from Wikidata, including error info for debugging.

## Database updater

The updater is reponsible for periodically fetching data from Wikidata through [Wikidata Query Service](https://www.wikidata.org/wiki/Wikidata:Data_access#Wikidata_Query_Service) and updating the database with new entries to ensure it grows and has relevant data.

Ideally, it would run on a scheduled basis (e.g., via cron), but I'm not a millionare so I'm using a free service to host the app, which means that it will be put to sleep when idle. This makes running scheduled operations problematic.
To work around this, the updater runs on app startup and checks the latest log entry to see if an update is due.

After every update the updater adds a new log to the database's logs table.

## API

The api serves the data from the database's data table and is available under `/api/v1/entries`. It has three endpoints:

- `GET /api/v1/entries/` - Fetch all entries from the database,
- `GET /api/v1/entries/:id` - Fetch an entry by id (a vaild Wikidata id, e.g., `Q1001`),
- `GET /api/v1/entries/random/:number` - Fetch a number of random entries. The number may be omitted to only fetch one random entry.

The access to the API is protected with:

- CORS,
- API key,
- custom origin-checking middleware.

The api also has an unprotected endpoint at `/api/v1/ping`. It serves as a lightweight and simple wake-up signal from the frontend to reduce latency due to backend cold starts (again, because of free-tier hosting).

### Project setup

The project uses Typescript, ESLint and Prettier. It was setup based on this [guide](https://medium.com/@gabrieldrouin/node-js-2025-guide-how-to-setup-express-js-with-typescript-eslint-and-prettier-b342cd21c30d).
