"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = isAdmin;
const JWTUtils_1 = require("../utils/JWTUtils");
function isAdmin(req, res, next) {
    const cookie = req.headers.cookie;
    if (!cookie) {
        res.status(401).json({ message: 'Cookie manquant' });
        return;
    }
    const token = cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ message: 'Token manquant' });
        return;
    }
    const decoded = (0, JWTUtils_1.verifyToken)(token);
    if (!decoded || typeof decoded === 'string') {
        res.status(403).json({ message: 'Token invalide' });
        return;
    }
    if (decoded.admin !== true) {
        res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas admin2', data: decoded });
        return;
    }
    next();
}
