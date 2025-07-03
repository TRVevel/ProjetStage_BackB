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
    // Vérifie d'abord dans Authorization header
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        console.log('TOKEN:', token);
        token = authHeader.split(' ')[1];
    }
    // Sinon, tente depuis les cookies
    else if (req.headers.cookie) {
        console.log('Cookies:', req.headers.cookie);
        console.log('req.headers.cookie:', req.headers.cookie);
        // Recherche le cookie nommé jwt
        const cookies = req.headers.cookie.split(';').map(c => c.trim());
        const jwtCookie = cookies.find(c => c.startsWith('jwt='));
        if (jwtCookie) {
            token = jwtCookie.split('=')[1];
            console.log('TOKEN:', token);
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Token manquant' });
        return;
    }
    try {
        const decoded = (0, JWTUtils_1.verifyToken)(token);
        if (!decoded || typeof decoded === 'string') {
            res.status(403).json({ message: 'Token invalide ou expiré' });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Erreur de vérification du token', error });
        return;
    }
}
