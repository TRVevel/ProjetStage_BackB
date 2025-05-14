import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import UserSchema, { IUser } from '../DBSchemas/UserSchema';
import { generateToken} from '../utils/JWTUtils';
import { userLoginValidationSchema, userValidationSchema } from '../JoiValidators/authValidators';
import BookSchema from '../DBSchemas/BookSchema';

export async function register(req: Request, res: Response) {
    try {

        // Validation des données d'entrée avec Joi
        const { error } = userValidationSchema.validate(req.body);
        
        if (error) {
            // Si la validation échoue, on retourne les erreurs
           res.status(400).json({ message: 'Erreur de validation', details: error.details });
           return ;
        }

        
        const { name, phone, address, city, postalCode, email, password } = req.body;
        
        // Vérifier si un client avec le même email existjà (gestion de duplication)
        const existingCustomer = await UserSchema.findOne({ where: { email } });
        if (existingCustomer) {
            res.status(400).json({ message: 'Ce customer existe déjà !' });
            return ;
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

        // Validation des données
        const { error } = userLoginValidationSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: "Erreur de validation", details: error.details });
            return;
        }

        const { email, password } = req.body;

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
        user.isActive = true;
        user.lastLogin = new Date();
        const userBooks = await BookSchema.find({ owner: user._id });

        for (const book of userBooks) {
            book.ownerActive = true;
            await book.save();
        }
        // Générer un token avec les informations de l'utilisateur
        const token = generateToken({ _id: user._id, email: user.email });

        // Stocker le token dans un cookie
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });

        await user.save();
        res.status(200).json({
            message: 'Connexion réussie',
            data: {
                userId: user._id,
                email: user.email,
                userActivity: user.isActive
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
