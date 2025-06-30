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
  
    // Vérifie d'abord dans Authorization header
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 
    // Sinon, tente depuis les cookies
    else if (req.headers.cookie) {
      token = req.headers.cookie.split('=')[1];
    }
  
    if (!token) {
      res.status(401).json({ message: 'Token manquant' });
      return
    }
  
    try {
      const decoded = verifyToken(token);
      if (!decoded || typeof decoded === 'string') {
        res.status(403).json({ message: 'Token invalide ou expiré' });
        return
      }
  
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Erreur de vérification du token', error });
      return
    }
  }
  