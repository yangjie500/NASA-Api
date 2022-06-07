import { parse } from "csv-parse";
import fs from "fs";
import path from 'path';

import planets from './planets.mongo';

interface essentialDetails {
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
  kepler_name: string;
}

interface keplerObject extends essentialDetails {
  [key: string]: unknown
}

// const writable = fs.createWriteStream('writeDestination.txt') // Able to use pipe to to write to a textfile
// const habitalPlanets: keplerObject[] = [];

// Filter the data based on certain criteria. Return: Boolean
function isHabitablePlanet<T extends essentialDetails>(planet: T) {
  return planet['koi_disposition'] === 'CONFIRMED' 
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 
    && planet['koi_prad'] < 1.6;
}

// Create a function that returns a promise before starting the server to ensure all data is already parse and ready
// before using the models later in planet.controller.js
function loadPlanetsData() {
  // createReadStream returns readStream which is instances of EventEmitter
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', "kepler_data.csv"))
      // piping from readable stream to a writable stream destination where the buffer is parse into array of data
      // Must pipe to a parser first before the rest of .on()
      .pipe(parse({ 
        comment: "#", // Telling parser to treat line starting with '#' as a comment,
        columns: true, // Each row of CSV files as a JS object with key/value pair instead of aforementioned array.
      }))
      .on('data', async (data: keplerObject) => {
        if (isHabitablePlanet(data)) {
          // habitalPlanets.push(data)
          savePlanet(data)
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', async () => {
        // console.log(`All done, number of habital planet found = ${habitalPlanets.length}`)
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`All done, number of habital planet found = ${countPlanetsFound}`)
        resolve('okay');
      })
  }) 
}

async function getAllPlanets() {
  // return habitalPlanets
  return await planets.find({}, {
    '__v': 0,
    '_id': 0
  })
}

async function savePlanet(planet: keplerObject) {
  // insert + update = upsert
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name
    }, {
      keplerName: planet.kepler_name
    }, {
      upsert: true
    })
  } catch(err) {
    console.error(`Could not save planet ${err}`)
  }
}


export {
  loadPlanetsData,
  getAllPlanets
}