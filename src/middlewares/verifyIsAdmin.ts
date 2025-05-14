import { NextFunction } from "express";
import {Request, Response} from "express";
import {verifyToken} from "../utils/JWTUtils"
import UserSchema from "../DBSchemas/UserSchema";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const cookie = req.headers.cookie;

    if (!cookie) {
        res.status(401).json({ message: 'Cookie manquant' });
        return
    }

    const token = cookie.split('=')[1];
    if (!token) {
        res.status(401).json({ message: 'Token manquant' });
        return
    }

    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === 'string') {
        res.status(403).json({ message: 'Token invalide' });
        return
    }
    if (decoded.admin !==  true) {
        res.status(403).json({ message: 'Accès refusé, vous n\'êtes pas admin2', data: decoded });
        return
    }
    next();
}