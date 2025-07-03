import { Request, Response } from 'express';
import UserSchema from '../DBSchemas/UserSchema';
import LoanSchema from '../DBSchemas/LoanSchema';
import BookSchema from '../DBSchemas/BookSchema';

/**
 * Récupère tous les utilisateurs
 */
export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await UserSchema.find();
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUserById(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }
        const user = await UserSchema.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        user.hashedPassword = '';
        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Recherche des utilisateurs par nom, prénom, email ou code postal
 */
export async function getUserByNameOrEmailOrPostalCode(req: Request, res: Response) {
    try {
        const { query } = req.params;
        if (!query) {
            res.status(400).json({ message: 'Le paramètre "query" est requis.' });
            return;
        }
        const users = await UserSchema.find({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } },
                { firstName: { $regex: new RegExp(query, 'i') } },
                { lastName: { $regex: new RegExp(query, 'i') } },
                { email: { $regex: new RegExp(query, 'i') } },
                { postalCode: { $regex: new RegExp(query, 'i') } }
            ]
        });
        if (users.length === 0) {
            res.status(404).json({ message: 'Aucun utilisateur trouvé avec ce critère.' });
            return;
        }
        users.forEach(user => { user.hashedPassword = ''; });
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur interne', error: error.message });
    }
}

/**
 * Met à jour les informations d'un utilisateur
 */
export async function updateUser(req: Request, res: Response) {
    try {
        const userId = req.params.userId || req.params.id;
        const { address, city, postalCode, phone } = req.body;

        if (!userId) {
            res.status(400).json({ message: 'ID de l\'utilisateur requis' });
            return;
        }

        // Construction dynamique de l'objet de mise à jour
        const updateFields: any = {};
        if (address !== undefined) updateFields.address = address;
        if (city !== undefined) updateFields.city = city;
        if (postalCode !== undefined) updateFields.postalCode = postalCode;
        if (phone !== undefined) updateFields.phone = phone;

        const updatedUser = await UserSchema.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès', data: updatedUser });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Active ou désactive un utilisateur (toggle)
 */
export async function isActive(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const user = await UserSchema.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        user.isActive = !user.isActive;
        await user.save({ validateBeforeSave: false });

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Supprime un utilisateur si aucune contrainte d'emprunt ou de possession de livre
 */
export async function deleteUser(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ message: 'ID de l\'utilisateur requis' });
            return;
        }

        // Vérifier si l'utilisateur est associé à un emprunt
        const loansWithUser = await LoanSchema.find({ userId });
        if (loansWithUser.length > 0) {
            res.status(400).json({ message: 'L\'utilisateur est encore associé à des emprunts' });
            return;
        }

        // Vérifier si l'utilisateur est propriétaire d'un livre
        const booksOwnedByUser = await BookSchema.find({ owner: userId });
        if (booksOwnedByUser.length > 0) {
            res.status(400).json({ message: 'L\'utilisateur est encore propriétaire de livres' });
            return;
        }

        // Supprimer l'utilisateur
        const deletedUser = await UserSchema.findByIdAndDelete(userId);
        if (!deletedUser) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès', data: deletedUser });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Ajoute un livre à la liste des livres réservés de l'utilisateur
 */
export async function addReservedBook(req: Request, res: Response) {
    try {
        const { userId, bookId } = req.params;

        if (!userId || !bookId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }

        const user = await UserSchema.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // Vérifier que l'utilisateur ne peut réserver qu'une fois le livre
        if (user.bookReserved.includes(bookId)) {
            res.status(400).json({ message: 'Le livre est déjà réservé par cet utilisateur' });
            return;
        }

        const book = await BookSchema.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }

        user.bookReserved.push(bookId);
        await user.save();

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Ajoute un événement à la liste des événements réservés de l'utilisateur
 */
export async function addreservedEvent(req: Request, res: Response) {
    try {
        const { userId, eventId } = req.params;

        if (!userId || !eventId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }

        const user = await UserSchema.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // Vérifier que l'utilisateur ne peut réserver qu'une fois l'évènement
        if (user.eventReserved.includes(eventId)) {
            res.status(400).json({ message: 'L\'événement est déjà réservé par cet utilisateur' });
            return;
        }

        user.eventReserved.push(eventId);
        await user.save();

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Ajoute un livre à la liste des livres lus de l'utilisateur
 */
export async function addReadBook(req: Request, res: Response) {
    try {
        const { userId, bookId } = req.params;

        if (!userId || !bookId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }

        const user = await UserSchema.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // Vérifier que le livre n'est pas déjà dans la liste des livres lus
        if (user.booksRead.includes(bookId)) {
            res.status(400).json({ message: 'Le livre lu ne peut pas s\'afficher deux fois' });
            return;
        }

        user.booksRead.push(bookId);
        await user.save();

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}