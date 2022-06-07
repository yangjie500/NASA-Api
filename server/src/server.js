"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const http = __importStar(require("http"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app_1 = __importDefault(require("./app"));
const launches_model_1 = require("./models/launches.model");
const planets_model_1 = require("./models/planets.model");
const mongo_1 = require("./services/mongo");
// PORT must be different from the front end
const PORT = process.env.PORT || 8000;
// Express is a request listener function.
const server = http.createServer(app_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, mongo_1.mongoConnect)();
        // Use promises to load the data first
        yield (0, planets_model_1.loadPlanetsData)();
        yield (0, launches_model_1.loadLaunchesData)();
        server.listen(PORT, () => {
            console.log(`Listening on PORT ${PORT}...`);
        });
    });
}
startServer();
