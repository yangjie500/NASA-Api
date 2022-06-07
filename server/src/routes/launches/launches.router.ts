import express from 'express';

import { 
  httpGetAllLaunches, 
  httpPostLaunch,
  httpAbortLaunch } from './launches.controller';

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpPostLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

export default launchesRouter;