import axios from 'axios';

import launches from './launches.mongo';
// Not recommeded to create and import a helper function from planet.model
// Always try to talk to files that are in a layer below the current layer
// Prevent web of dependencies between each of our modules get all tangled up
import planets from './planets.mongo';

interface ILaunch {
  flightNumber: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target?: string;
  customer: string[];
  upcoming: boolean;
  success: boolean;
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//   flightNumber: 100, //flight_number
//   mission: 'Kepler Exploration X', // name
//   rocket: 'Explorer IS1', // rocket.name
//   launchDate: new Date('December 27, 2030'), // date_local
//   target: 'Kepler-442 b', // NA
//   customer: ['ZTM', 'NASA'], // payload.customers for each payload
//   upcoming: true, // upcoming
//   success: true // success
// }
// const launchesMap = new Map<number,ILaunch>([[launch.flightNumber, launch]]);

async function findLaunch(filter: Record<string, string | number>) {
  return await launches.findOne(filter)
}

async function existsLaunchWithId(launchId: number) {
  return await launches.findOne({
    flightNumber: launchId
  });
}

async function getLatestFlightNumber() {
  const lastestLaunch = await launches
    .findOne()
    .sort({
      flightNumber: -1
    });

  if (!lastestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return lastestLaunch.flightNumber;
}

// function so can abstract away this logic from the launchesMap.controller module
async function getAllLaunches(skip: number, limit: number) {
  // return Array.from(launchesMap.values())
  return await launches
    .find({}, { '_id': 0, '__v': 0 })
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit)
}

async function saveLaunches(launch: ILaunch) {
  await launches.updateOne({
    flightNumber: launch.flightNumber
  }, 
  launch,
  {
    upsert: true
  });
}

async function scheduleNewLaunch(launch: ILaunch) {
  const isPlanetExists = await planets.findOne({
    keplerName: launch.target
  })

  if (!isPlanetExists) throw new Error('No matching planet found');

  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    sucess: true,
    upcoming: true,
    customer: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber
  });

  await saveLaunches((newLaunch));
}


async function abortLaunchById(launchId: number) {
  // metadata of the updated result
  const aborted =  await launches.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount === 1;
}

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }    
        }
      ]
    }
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload:any) => {
      return payload.customers;
    });

    const launch: ILaunch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customer: customers
    };

    console.log(launch.flightNumber, launch.mission);

    await saveLaunches(launch);
  } 
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  });

  if (firstLaunch) {
    console.log('Launch data already loaded!');
    return;
  }

  await populateLaunches();
  
}

// (async function () {
//   await scheduleNewLaunch(launch);
//   console.log('lol')
// })();


export { 
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  loadLaunchesData
};