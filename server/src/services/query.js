"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
// MongoDB will return all of the collection if 0 is passed
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;
function getPagination(query) {
    const page = Math.abs(Number(query.page)) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(Number(query.limit)) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;
    return {
        skip,
        limit
    };
}
exports.getPagination = getPagination;
