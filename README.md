# Northcoders News API

## Create environment variables

We'll have two databases in this project. One for real looking *dev data* and another for simpler *test data*.

The connection to the relevant database is established in a `./db/connection.js` file.

You will need to create two .env files for your project: `.env.test` and `.env.development` to determine which database to connect to. Into each, add `PGDATABASE=<database_name_here>` (see `.env-example`), with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.

> _`dotenv` is a [module that loads environment variables from a `.env` file into the `process.env` global object](https://github.com/motdotla/dotenv#readme)_
