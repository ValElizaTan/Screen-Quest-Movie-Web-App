# Screen Quest – Movie Web App (Node.js / Express / MongoDB)

A movie website where you can search for films, browse a movie catalogue, look up ticket types and save movies to playlists to watch later. It has a REST API built with Express and MongoDB, a simple HTML/jQuery front end, and live movie search powered by [The Movie Database (TMDB)](https://developer.themoviedb.org/docs). Built as a Web Application Development (WAD) project at Nanyang Polytechnic.

## Features

- **Accounts:** register (password must be at least 8 characters, checked with `validator`), log in, log out, view, edit and delete your profile.
- **Token authentication:** logging in returns a token, which protected routes require as `?token=...`. Accounts have `admin` or `user` roles.
- **Movies:** add, list, update and delete movies (by ID or title), and search TMDB live by title and optional year.
- **Tickets:** add ticket types and prices, and search them.
- **Playlists:** create a playlist with movies, view playlists and delete them.

## Tech stack

- Node.js, Express 4
- MongoDB with Mongoose 7
- [`moviedb`](https://www.npmjs.com/package/moviedb) (TMDB API client), [`validator`](https://www.npmjs.com/package/validator)
- Front end: HTML, CSS, jQuery (`views/`)
- API tests: Postman collection (`L1-wad-project-Valerie.postman_collection.json`)

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts` | Register |
| POST | `/api/accounts/login` | Log in (returns token) |
| GET | `/api/accounts/logout` | Log out 🔒 |
| GET / PUT / DELETE | `/api/accounts/:id` | View / edit / delete profile 🔒 |
| GET | `/api/movies` | List movies |
| GET | `/api/movies/:id` | Get a movie |
| GET | `/api/movies/search?query=&year=` | Search TMDB |
| POST | `/api/movies` | Add a movie 🔒 |
| PUT / DELETE | `/api/movies/:id` | Update / delete a movie 🔒 |
| PUT / DELETE | `/api/movies/title/:value` | Update / delete by title 🔒 |
| GET / POST | `/api/tickets` | List / add tickets (add 🔒) |
| POST | `/api/tickets/search` | Search tickets |
| GET / POST | `/api/playlists` | List / create playlists |
| GET / DELETE | `/api/playlists/:id` | View / delete a playlist |

🔒 = requires `?token=<token>`

## Project structure

```
server.js            # Express app (port 3000), serves views/ statically
routes.js            # All API routes + auth middleware
services/db.js       # Mongoose connection and data-access functions
models/              # account, movie, ticket, playlist schemas
views/               # HTML pages, css/, js/
json/                # Sample data exports (accounts, movies, tickets)
```

## Getting started

1. Install [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community), and start MongoDB on `mongodb://127.0.0.1:27017`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Import the sample data from `json/` into a database named `movieDB_Valerie` with MongoDB Compass or `mongoimport`.
4. Add your own TMDB API key (see the note below).
5. Start the server:
   ```bash
   npm start
   ```
6. Open `http://localhost:3000/`, or import the Postman collection to try the API.

## Notes

- The TMDB API key should be loaded from an environment variable (e.g. `process.env.TMDB_API_KEY`) rather than written into `routes.js`.
- Passwords are stored in plain text in this version. `bcrypt` is already listed in the dependencies and could be used to hash them.

## Author

Valerie Tan Wan Xin – Nanyang Polytechnic, Module Group L1