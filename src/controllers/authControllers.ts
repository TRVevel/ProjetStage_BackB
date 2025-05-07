import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import UserSchema, { IUser } from '../DBSchemas/UserSchema';
import { generateToken} from '../utils/JWTUtils';

export async function register(req: Request, res: Response) {
    try {
        const { name, phone, address, city, postalCode, email, password } = req.body;

        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!phone) missingFields.push('phone');
        if (!address) missingFields.push('address');
        if (!city) missingFields.push('city');
        if (!postalCode) missingFields.push('postalCode');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            res.status(400).json({ message: `Champs manquants: ${missingFields.join(', ')}` });
            return;
        }

        // Hashage du mot de passe
        const hashedPassword = await hashPassword(password);

        // Créer un nouvel utilisateur
        const newUser: IUser = new UserSchema({ name, phone, address, city, postalCode, email, hashedPassword });

        // Sauvegarde de l'utilisateur
        const savedUser = await newUser.save();

        // Supprimer le mot de passe haché avant de renvoyer l'utilisateur
        savedUser.hashedPassword = '';

        res.status(201).json({ message: 'Utilisateur créé avec succès', data: savedUser });
    } catch (err: any) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Cet Email est déjà utilisé' });
            return;
        }
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}


export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            res.status(400).json({ message: `Champs manquants: ${missingFields.join(', ')}` });
            return;
        }

        const user = await UserSchema.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        const isPasswordValid = await verifyPassword(password, user.hashedPassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Mot de passe incorrect' });
            return;
        }

        // Générer un token avec les informations de l'utilisateur
        const token = generateToken({ _id: user._id, email: user.email });

        // Stocker le token dans un cookie
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });

        res.status(200).json({
            message: 'Connexion réussie',
            data: {
                userId: user._id,
                email: user.email
            }
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


/**
 * Fonction pour décoder le JWT
 * @param token
 */
function decodeToken(token: string) {
    // Utilise une bibliothèque comme jwt-simple ou jsonwebtoken pour décoder le token
    const jwt = require('jsonwebtoken');
    return jwt.decode(token); // Décoder le token sans vérifier la signature
}

export async function logout(req: Request, res: Response) {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function passwordChange(req: Request, res: Response) {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
            return;
        }

        // Parse the logged-in user's _id from the decoded token
        const user = req.headers.user ? JSON.parse(req.headers.user as string) : null;
        if (!user || !user._id) {
            res.status(401).json({ message: 'Utilisateur non authentifié' });
            return;
        }

        const userId = user._id;

        const existingUser = await UserSchema.findById(userId);
        if (!existingUser) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        const isMatch = await verifyPassword(oldPassword, existingUser.hashedPassword);
        if (!isMatch) {
            res.status(400).json({ message: 'Ancien mot de passe incorrect' });
            return;
        }

        const hashedPassword = await hashPassword(newPassword);

        existingUser.hashedPassword = hashedPassword;
        await existingUser.save();

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}
