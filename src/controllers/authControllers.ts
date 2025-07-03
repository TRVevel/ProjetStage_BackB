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
            res.status(400).json({
                message: 'Erreur de validation des champs.',
                errors: error.details.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }

        const { name, phone, address, city, postalCode, email, password } = req.body;

        // Vérifier si un utilisateur avec le même email existe déjà
        const existingUser = await UserSchema.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (existingUser) {
            res.status(409).json({
                message: 'Un utilisateur avec cet email existe déjà.'
            });
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

        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: {
                _id: savedUser._id,
                name: savedUser.name,
                phone: savedUser.phone,
                address: savedUser.address,
                city: savedUser.city,
                postalCode: savedUser.postalCode,
                email: savedUser.email
            }
        });
        return;
    } catch (err: any) {
        // Gestion des erreurs MongoDB (duplication, etc.)
        if (err.code === 11000) {
            res.status(409).json({
                message: 'Cet email est déjà utilisé.'
            });
            return;
        }
        // Erreur inattendue
        res.status(500).json({
            message: 'Erreur interne du serveur.',
            error: err.message
        });
        return;
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

        // Recherche insensible à la casse pour l'email
        const user = await UserSchema.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
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
        const token = generateToken({ _id: user._id, email: user.email, admin: user.admin });

        // Stocker le token dans un cookie
        res.cookie("jwt", token, {httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production"
        });

        await user.save();
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user
        });
        return;

    } catch (error: any) {
        res.status(500).json({ message: error.message });
        return;
    }
}

export async function logout(req: Request, res: Response) {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'Déconnexion réussie' });
        return;
    } catch (error: any) {
        res.status(500).json({ message: error.message });
        return;
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
        return;
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}
