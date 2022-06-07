"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const planetsSchema = new mongoose_1.default.Schema({
    keplerName: {
        type: String,
        required: true
    }
});
const planets = mongoose_1.default.model('Planet', planetsSchema);
exports.default = planets;
