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
    if (SECRET_KEY === undefined) {
        throw new Error('SECRET KEY is not defined');
    }
    const cookie = req.headers.cookie;
    if (!cookie) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
        return;
    }
    const token = cookie.split('=')[1];
    console.log(token);
    if (!token) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
        return;
    }
    try {
        const decoded = (0, JWTUtils_1.verifyToken)(token);
        req.headers.user = JSON.stringify(decoded);
        next();
        if (!decoded) {
            res.status(403).send({ message: 'Token Invalide ou Expiré' });
        }
    }
    catch (error) {
        res.status(401).send({ message: 'Vous n\'êtes pas autorisé à accéder à cette ressource' });
        return;
    }
}
