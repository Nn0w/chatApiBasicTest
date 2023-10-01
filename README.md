# Test Api

## Installation

Install the dependencies and devDependencies and start the server.

1. Install SQL server of your choice
2. Change directory to the root of the project

```sh
cd chatApiBasicTest
```

3. Create .env file with two values:

- [How to create connection string uri for your db type](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql) -

1. DATABASE_URL
   .env values are` one liners`

```sh
echo "DATABASE_URL=\"<YOUR SQL TYPE>://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE NAME>?<OPTIONAL SETTINGS>
\"" >> .env
```

2. PORT

```sh
echo "PORT=\"<SERVER PORT NUMBER TO RUN ON>\"" >> .env
```

4. Install dependencies with node package manager

```sh
npm i
```

5. Create db and migrate your schemas with `prisma`

```sh
npx prisma migrate dev --name init
```

Now all tables should appear in the DB 6. Start dev server to check the set up

```sh
npm run dev
```

## Start Server

Start dev server with

```sh
npm run dev
```

### Run Javascript :

Build to javascript with

```sh
npm run build
```

Copy .env to the `build/` directory

```sh
cp .env build
```

Run `index.js` with node

```sh
cd build
```

```sh
node index.js
```

## Usage
