import express from 'express';

import planetsRouter from './planets/planets.router';
import launchesRouter from './launches/launches.router';

const api = express.Router();

api.use('/planets', planetsRouter);
// Match request under the /launches request so in launches.router do not need to get repetitively
api.use('/launches', launchesRouter);

export {
  api
};
