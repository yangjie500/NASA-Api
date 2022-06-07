import * as http from 'http';

import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { loadLaunchesData } from './models/launches.model';
import { loadPlanetsData } from './models/planets.model';
import { mongoConnect } from './services/mongo';

// PORT must be different from the front end
const PORT = process.env.PORT || 8000;

// Express is a request listener function.
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  // Use promises to load the data first
  await loadPlanetsData();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}...`)
  });
}

startServer()



