import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // Assure-toi d'avoir installé la librairie 'jsonwebtoken'
import dotenv from 'dotenv';
import { verifyToken } from '../utils/JWTUtils';
declare global {
    namespace Express {
        interface Request {
            user?: { _id: string; email: string };
        }
    }
}
dotenv.config();

const SECRET_KEY = process.env.JWT_KEY;

interface CustomRequest extends Request {
    user?: any; // ou une interface UserToken
  }

export function verifyTokenMiddleware(req: CustomRequest, res: Response, next: NextFunction): void {
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
        const decoded = verifyToken(token);
        if (!decoded) {
          res.status(403).json({ message: 'Token invalide ou expiré' });
          return
        }
    
        req.user = decoded; // ✅ Bonne pratique : attacher à req.user
        next();
      } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
      }
    }
