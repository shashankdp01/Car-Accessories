# Car Accessories Shop

Full-stack car accessories store built with React, Express, Axios, and MongoDB.

## Features

- User signup and login
- MongoDB-backed user profiles
- Persistent cart per user
- Order placement and order history
- Guest browsing for products

## Tech Stack

- React
- React Router
- Axios
- Express
- MongoDB
- Mongoose

## How To Run The Project

### 1. Clone the repository

```bash
git clone https://github.com/punithx01/car-accessories-shop.git
cd car-accessories-shop
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Create backend environment file

Create `server/.env` and add:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/autogearpro
CORS_ORIGIN=http://localhost:3000
```

## MongoDB Setup

You can use either local MongoDB or MongoDB Atlas.

### Option 1: Local MongoDB

- Install MongoDB on your system
- Make sure MongoDB service is running
- Keep this in `server/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/autogearpro
```

### Option 2: MongoDB Atlas

- Create a cluster in MongoDB Atlas
- Create a database user
- Allow your IP address in Network Access
- Replace `MONGODB_URI` in `server/.env` with your Atlas connection string

Example:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/autogearpro?retryWrites=true&w=majority
```

## Start The Project

### Start backend

Open one terminal:

```bash
cd server
npm start
```

Backend runs on:

```text
http://localhost:5001
```

### Start frontend

Open another terminal:

```bash
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

## Project Structure

```text
car-accessories-shop/
  src/        # React frontend
  server/     # Express + MongoDB backend
```

## Notes

- `server/.env` is not pushed to GitHub
- `server/node_modules` is ignored
- Make sure backend is running before using login, cart, or order features
