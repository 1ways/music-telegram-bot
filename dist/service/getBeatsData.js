"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBeatsData = void 0;
const node_fs_1 = require("node:fs");
const getBeatsData = () => {
    try {
        const data = (0, node_fs_1.readFileSync)('../data/beats.json', 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        return new Error(error instanceof Error ? error.message : String(error));
    }
};
exports.getBeatsData = getBeatsData;
