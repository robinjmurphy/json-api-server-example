# json-api-server-example

> An example [JSON API](http://jsonapi.org/) server using Postgres and Express

Created to help me learn the JSON API [format](http://jsonapi.org/format/). It uses the [MassiveJS](https://github.com/robconery/massive-js) library to access a [Postgres](http://www.postgresql.org/) database.

## Installation

```
npm install
```

## Usage

You'll need Postgres to be installed and running. You can then setup the database:

```
npm run setup-database
```

Start the server:

```
npm start
```

This will start a server running at [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Features

The API implements the basic _CRUD_ actions for a single collection:

* `GET /people`
* `POST /people`
* `GET /people/:id`
* `PATCH /people/:id`
* `DELETE /people/:id`

### Sorting

The `GET /people` route supports sorting as described in the [sorting specification](http://jsonapi.org/format/#fetching-sorting). Multiple sort fields can be used together:

```http
GET /people?sort=surname,-name HTTP/1.1
```

### Pagination

_Page-based_ pagination is implemented as per the [pagination specification](http://jsonapi.org/format/#fetching-pagination):

```http
GET /people?page[number]=2&page[size]=1 HTTP/1.1
```
### Filtering

The `filter` parameter can be used to filter records as described in the [recommendations for filtering](http://jsonapi.org/recommendations/#filtering):

```http
GET /people?filter[name]=Ron&filter[surname]=Weasley HTTP/1.1
```
