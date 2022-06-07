"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlanets = exports.loadPlanetsData = void 0;
const csv_parse_1 = require("csv-parse");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const planets_mongo_1 = __importDefault(require("./planets.mongo"));
// const writable = fs.createWriteStream('writeDestination.txt') // Able to use pipe to to write to a textfile
// const habitalPlanets: keplerObject[] = [];
// Filter the data based on certain criteria. Return: Boolean
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}
// Create a function that returns a promise before starting the server to ensure all data is already parse and ready
// before using the models later in planet.controller.js
function loadPlanetsData() {
    // createReadStream returns readStream which is instances of EventEmitter
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(path_1.default.join(__dirname, '..', '..', 'data', "kepler_data.csv"))
            // piping from readable stream to a writable stream destination where the buffer is parse into array of data
            // Must pipe to a parser first before the rest of .on()
            .pipe((0, csv_parse_1.parse)({
            comment: "#",
            columns: true, // Each row of CSV files as a JS object with key/value pair instead of aforementioned array.
        }))
            .on('data', (data) => __awaiter(this, void 0, void 0, function* () {
            if (isHabitablePlanet(data)) {
                // habitalPlanets.push(data)
                savePlanet(data);
            }
        }))
            .on('error', (err) => {
            reject(err);
        })
            .on('end', () => __awaiter(this, void 0, void 0, function* () {
            // console.log(`All done, number of habital planet found = ${habitalPlanets.length}`)
            const countPlanetsFound = (yield getAllPlanets()).length;
            console.log(`All done, number of habital planet found = ${countPlanetsFound}`);
            resolve('okay');
        }));
    });
}
exports.loadPlanetsData = loadPlanetsData;
function getAllPlanets() {
    return __awaiter(this, void 0, void 0, function* () {
        // return habitalPlanets
        return yield planets_mongo_1.default.find({}, {
            '__v': 0,
            '_id': 0
        });
    });
}
exports.getAllPlanets = getAllPlanets;
function savePlanet(planet) {
    return __awaiter(this, void 0, void 0, function* () {
        // insert + update = upsert
        try {
            yield planets_mongo_1.default.updateOne({
                keplerName: planet.kepler_name
            }, {
                keplerName: planet.kepler_name
            }, {
                upsert: true
            });
        }
        catch (err) {
            console.error(`Could not save planet ${err}`);
        }
    });
}
