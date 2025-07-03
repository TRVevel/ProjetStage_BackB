import { Request, Response } from 'express';
import BookSchema from "../DBSchemas/BookSchema";
import UserSchema from '../DBSchemas/UserSchema';
import LoanSchema from '../DBSchemas/LoanSchema';
import { Types } from 'mongoose';

/**
 * Récupère tous les livres
 */
export async function getAllBooks(req: Request, res: Response) {
    try {
        const books = await BookSchema.find();
        res.status(200).json(books);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Récupère tous les livres actifs dont le propriétaire est actif
 */
export async function getAllBooksByActiveAndOwnerActive(req: Request, res: Response) {
    try {
        const books = await BookSchema.find({ isActive: true, ownerActive: true });
        res.status(200).json(books);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Récupère un livre par son ID
 */
export async function getBookById(req: Request, res: Response) {
    try {
        const { bookId } = req.params;
        if (!bookId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }
        const book = await BookSchema.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        res.status(200).json(book);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Récupère les livres par code postal (département)
 */
export async function getBooksBypostalCode(req: Request, res: Response) {
    try {
        const { postalCode } = req.params;
        if (!postalCode) {
            res.status(400).json({ message: 'Département requis' });
            return;
        }

        // Trouver les utilisateurs dans ce département
        const users = await UserSchema.find({ postalCode: new RegExp(`^${postalCode}$`, 'i') }).select('_id');
        if (!users.length) {
            res.status(404).json({ message: 'Aucun utilisateur trouvé dans ce département' });
            return;
        }
        const userIds = users.map(user => user._id);

        // Récupérer les livres de ces utilisateurs
        const books = await BookSchema.find({ owner: { $in: userIds } });
        if (!books.length) {
            res.status(404).json({ message: 'Aucun livre trouvé pour ce département' });
            return;
        }

        res.status(200).json({ message: `Livres dans le département ${postalCode}`, data: books });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Ajoute un nouveau livre pour l'utilisateur connecté
 */
export async function addBook(req: Request, res: Response) {
    try {
        const { title, description, author, genre, publishedYear, language, state, imageCouverture, imageBack, imageInBook } = req.body;

        // Vérification des champs obligatoires
        if (!title || !description || !author || !genre || !publishedYear || !language || !state || !imageCouverture || !imageBack || !imageInBook) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }

        // Récupération de l'utilisateur connecté
        const user = req.user;
        if (!user || !user._id) {
            res.status(401).json({ message: 'Utilisateur non authentifié' });
            return;
        }
        const owner = user._id;

        // Création et sauvegarde du livre
        const newBook = new BookSchema({ title, description, author, genre, publishedYear, language, owner, state, imageCouverture, imageBack, imageInBook });
        const savedBook = await newBook.save();

        // Ajout du livre à la liste des livres possédés par l'utilisateur
        const userRecord = await UserSchema.findById(owner);
        if (!userRecord) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        userRecord.booksOwned.push(newBook._id as string);
        await userRecord.save();

        res.status(201).json({ message: 'Livre créé avec succès', savedBook });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Change le statut actif d'un livre
 */
export async function changeActiveStatus(req: Request, res: Response) {
    try {
        const { bookId } = req.params;
        const { isActive } = req.body;
        if (!bookId || isActive === undefined) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }
        const updatedBook = await BookSchema.findByIdAndUpdate(bookId, { isActive }, { new: true });
        if (!updatedBook) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        res.status(200).json(updatedBook);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Met à jour un livre existant
 */
export async function updateBook(req: Request, res: Response) {
    try {
        const { bookId } = req.params;
        const { title, description, author, genre, publishedYear, language, owner, imageCouverture, imageInBook, imageBack } = req.body;
        if (!bookId || !title || !description || !author || !genre || !publishedYear || !language || !owner || !imageCouverture || !imageInBook || !imageBack) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }
        const updatedBook = await BookSchema.findByIdAndUpdate(
            bookId,
            { title, description, author, genre, publishedYear, language, owner, imageCouverture, imageInBook, imageBack },
            { new: true }
        );
        if (!updatedBook) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        res.status(200).json(updatedBook);
        return;
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Supprime un livre si aucune contrainte d'usage n'est présente
 * - Si le livre est dans booksRead ou booksReserved d'un utilisateur, il est désactivé
 * - Si le livre est dans un emprunt, il ne peut pas être supprimé
 */
export async function deleteBook(req: Request, res: Response) {
    try {
        const { bookId } = req.params;

        if (!bookId) {
            res.status(400).json({ message: 'ID du livre requis' });
            return;
        }

        const objectId = new Types.ObjectId(bookId);

        // Vérifier si le livre est dans booksRead ou booksReserved
        const usersWithBookRead = await UserSchema.find({ booksRead: objectId });
        const usersWithBookReserved = await UserSchema.find({ booksReserved: { $in: [objectId, bookId] } });
        if (usersWithBookRead.length > 0 || usersWithBookReserved.length > 0) {
            const updatedBook = await BookSchema.findByIdAndUpdate(
                bookId,
                { $set: { isActive: false } },
                { new: true }
            );
            res.status(200).json({ message: 'Livre marqué comme inactif', data: updatedBook });
            return;
        }

        // Vérifier si le livre est dans un emprunt
        const loansWithBook = await LoanSchema.find({ bookId });
        if (loansWithBook.length > 0) {
            res.status(400).json({ message: 'Le livre est encore associé à des emprunts' });
            return;
        }

        // Suppression du livre
        const deletedBook = await BookSchema.findByIdAndDelete(bookId);
        if (!deletedBook) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }

        res.status(200).json({ message: "Livre effacé avec succès", deletedBook });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Réactive un livre si aucune contrainte d'emprunt n'est présente
 */
export async function reactivateBook(req: Request, res: Response) {
    try {
        const { bookId } = req.params;

        if (!bookId) {
            res.status(400).json({ message: 'ID du livre requis' });
            return;
        }

        // Vérifie s’il est actuellement dans un emprunt actif
        const loansWithBook = await LoanSchema.find({ bookId });
        if (loansWithBook.length > 0) {
            res.status(400).json({ message: 'Impossible de réactiver : le livre est emprunté' });
            return;
        }

        const updatedBook = await BookSchema.findByIdAndUpdate(
            bookId,
            { $set: { isActive: true } },
            { new: true }
        );

        if (!updatedBook) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }

        res.status(200).json(updatedBook);
        return;
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}
