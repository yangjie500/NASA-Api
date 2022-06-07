import { Request, Response } from 'express';

import { 
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById
 } from "../../models/launches.model";

 import { getPagination } from '../../services/query';

type TypedRequest<
  ReqBody = Record<string, unknown>,
  QueryString = {limit: string | undefined, page: string | undefined}
> = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Partial<ReqBody>,
  QueryString
>;

async function httpGetAllLaunches(req: TypedRequest, res: Response) {
  const { skip, limit } = getPagination(req.query);

  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpPostLaunch(req: Request, res: Response) {
  // In app.ts, middleware express.json() will parse JSON request and populate in req.body
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({
      error: 'Missing requiried launch property'
    })
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date'
    })
  } 

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req: Request, res: Response) {
  const launchId = Number(req.params.id);
  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: 'Launch Id not found'
    })
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted or Launch has already aborted'
    })
  }
  return res.status(200).json({
    ok: true
  });
}

export {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch
}