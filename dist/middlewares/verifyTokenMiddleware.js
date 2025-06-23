"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = verifyTokenMiddleware;
const dotenv_1 = __importDefault(require("dotenv"));
const JWTUtils_1 = require("../utils/JWTUtils");
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_KEY;
function verifyTokenMiddleware(req, res, next) {
    if (!SECRET_KEY) {
        throw new Error('SECRET KEY is not defined');
    }
    const cookie = req.headers.cookie;
    if (!cookie) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
        return;
    }
    const token = cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ message: 'Token manquant' });
        return;
    }
    try {
        const decoded = (0, JWTUtils_1.verifyToken)(token);
        if (!decoded) {
            res.status(403).json({ message: 'Token invalide ou expiré' });
            return;
        }
        req.user = decoded; // ✅ Bonne pratique : attacher à req.user
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
}
