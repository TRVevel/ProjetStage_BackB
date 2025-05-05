"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedTest = protectedTest;
function protectedTest(req, res) {
    const decodeUser = req.headers.user;
    res.status(200).send(decodeUser);
}
