import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/JWTUtils";

/**
 * Middleware pour vérifier si l'utilisateur est administrateur.
 * - Récupère le token JWT depuis les cookies.
 * - Vérifie la validité du token et la propriété admin.
 * - Retourne une erreur 401/403 si non autorisé, sinon passe au middleware suivant.
 */
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

    // Vérification et décodage du token
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === 'string') {
        res.status(403).json({ message: 'Token invalide' });
        return;
    }

    // Vérifie que l'utilisateur est bien admin (booléen strict)
    if (decoded.admin !== true) {
        res.status(403).json({ message: 'Accès interdit, vous devez être admin pour accéder à cette ressource' });
        return;
    }

    // Autorisé, passe au middleware suivant
    next();
}
