# json-api-server-example

> An example [JSON API](http://jsonapi.org/) server using Postgres and Express

This project is my attempt at understanding what's involved in creating a compliant JSON API server from scratch. It uses Postgres as a data store.

## Installation

```
npm install
```

## Usage

You'll need [Postgres](http://www.postgresql.org/) installed and running. You can then setup the database:

```
npm run setup-database
```

Start the server:

```
npm start
```

This will start a server running at [http://127.0.0.1:3000](http://127.0.0.1:3000).

## API

The API provides the basic JSON API actions for a single collection, `/people`.

* `GET /people`
* `POST /people`
* `GET /people/:id`
* `PATCH /people/:id`
* `DELETE /people/:id`
