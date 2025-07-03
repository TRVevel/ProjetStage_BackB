import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/JWTUtils";
import UserSchema from "../DBSchemas/UserSchema";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    // Récupération du token depuis le cookie (compatible avec plusieurs cookies)
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.status(401).json({ message: 'Cookie manquant' });
        return;
    }

    // Recherche du cookie "jwt"
    const match = cookieHeader.match(/(?:^|;\s*)jwt=([^;]+)/);
    const token = match ? match[1] : null;
    if (!token) {
        res.status(401).json({ message: 'Token manquant' });
        return;
    }

    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === 'string') {
        res.status(403).json({ message: 'Token invalide' });
        return;
    }

    if (decoded.admin !== true) {
        res.status(403).json({ message: 'Accès interdit, vous devez être admin pour accéder à cette ressource' });
        return;
    }

    next();
}
