<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# API Server – Setup Instructions

This server is used as a backend for a React Native technical test.

## 🚀 Getting Started

Follow these steps to run the server locally:

### 1. Clone the Repository

```bash
git clone https://github.com/FerRiv3ra/softvize-technical-test-server.git
```

```bash
cd softvize-technical-test-server
```

---

### 2. Install Dependencies

You can use either `yarn` or `npm`, but this project was developed using `yarn`.

```bash
yarn
```

Or

```bash
npm install
```

---

### 3. Set Up Environment Variables

Rename the `.env.template` file to `.env`:

```bash
mv .env.template .env
```

Adjust any variables in `.env` as needed (e.g., port, database URL).

---

### 4. Start Docker

Make sure Docker is running, then start the containers:

```bash
docker compose up -d
```

This will start the MongoDB container required by the server.

---

### 5. Run the Server in Development Mode

```bash
yarn start:dev
```

Or

```bash
npm run start:dev
```

---

### 6. Open the API Documentation

Visit:

```
http://localhost:4000/docs
```

> (Replace `4000` with your actual port if modified in `.env`.)

---

### 7. Seed the Database

To clear existing data and load test users:

```
Run the endpoint /load-seed
```

This will:

- Delete all existing `users` and `connections`
- Insert a new set of predefined test users

---

## ✅ Ready to Use

The server is now fully configured and ready to be connected with the React Native app.
