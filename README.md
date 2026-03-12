### Overview

Here’s a **short, generic guide** for running this project locally from GitHub.

### 1. Prerequisites

- **Git** installed
- **Node.js + npm** installed (LTS version recommended, e.g. 20.x)

### 2. Clone the repository

```bash
git clone https://github.com/weproztech-stack/clozety.git
cd clozety
```

### 3. Backend setup

```bash
cd backend
npm install
```

- If needed, create an `.env` file (copy from `.env.example` if it exists) and fill in required variables.
- Start the backend server:

```bash
npm start
# or
npm run dev
```

### 4. Frontend setup

Open a second terminal:

```bash
cd clozety/frontend
npm install
npm start
```

This will usually start the app at `http://localhost:3000`.

### 5. Access the app

- **Frontend**: `http://localhost:3000`
- **Backend API**: typically `http://localhost:5000` or whatever port `backend/server.js` is configured to use.