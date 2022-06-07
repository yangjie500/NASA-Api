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
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAbortLaunch = exports.httpPostLaunch = exports.httpGetAllLaunches = void 0;
const launches_model_1 = require("../../models/launches.model");
const query_1 = require("../../services/query");
function httpGetAllLaunches(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { skip, limit } = (0, query_1.getPagination)(req.query);
        const launches = yield (0, launches_model_1.getAllLaunches)(skip, limit);
        return res.status(200).json(launches);
    });
}
exports.httpGetAllLaunches = httpGetAllLaunches;
function httpPostLaunch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // In app.ts, middleware express.json() will parse JSON request and populate in req.body
        const launch = req.body;
        if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
            return res.status(400).json({
                error: 'Missing requiried launch property'
            });
        }
        launch.launchDate = new Date(launch.launchDate);
        if (isNaN(launch.launchDate)) {
            return res.status(400).json({
                error: 'Invalid launch date'
            });
        }
        yield (0, launches_model_1.scheduleNewLaunch)(launch);
        return res.status(201).json(launch);
    });
}
exports.httpPostLaunch = httpPostLaunch;
function httpAbortLaunch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const launchId = Number(req.params.id);
        const existsLaunch = yield (0, launches_model_1.existsLaunchWithId)(launchId);
        if (!existsLaunch) {
            return res.status(404).json({
                error: 'Launch Id not found'
            });
        }
        const aborted = yield (0, launches_model_1.abortLaunchById)(launchId);
        if (!aborted) {
            return res.status(400).json({
                error: 'Launch not aborted or Launch has already aborted'
            });
        }
        return res.status(200).json({
            ok: true
        });
    });
}
exports.httpAbortLaunch = httpAbortLaunch;
