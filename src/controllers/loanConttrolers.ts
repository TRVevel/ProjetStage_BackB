import { Request, Response } from 'express';
import LoanSchema from '../DBSchemas/LoanSchema';
import UserSchema from '../DBSchemas/UserSchema';
import BookSchema from '../DBSchemas/BookSchema';

/**
 * Récupère la liste de tous les emprunts
 */
export async function getAllLoans(req: Request, res: Response) {
    try {
        const loans = await LoanSchema.find();
        res.status(200).json({ message: 'Liste des emprunts', data: loans });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Ajoute un nouvel emprunt pour l'utilisateur connecté
 */
export async function addLoan(req: Request, res: Response) {
    try {
        const { bookId } = req.params;
        const { startDate, endDate } = req.body;
        const user = req.user;

        if (!user || !user._id) {
            res.status(401).json({ message: 'Utilisateur non authentifié' });
            return;
        }
        const userId = user._id;

        if (!bookId || !userId || !startDate || !endDate) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }

        // Vérifie qu'il n'y a pas déjà un emprunt en cours pour ce livre et cet utilisateur
        const existingLoan = await LoanSchema.findOne({ userId, bookId, status: { $in: ['pending', 'confirmed'] } });
        if (existingLoan) {
            res.status(400).json({ message: 'Un emprunt pour ce livre est déjà en cours' });
            return;
        }

        // Vérifie que le livre n'est pas déjà emprunté
        const book = await BookSchema.findById(bookId).exec();
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        if (book.alreadyLoaned) {
            res.status(400).json({ message: 'Le livre est déjà emprunté' });
            return;
        }

        const newLoan = new LoanSchema({ bookId, userId, startDate, endDate });
        const savedLoan = await newLoan.save();

        res.status(201).json({ message: 'Emprunt ajouté avec succès', data: savedLoan });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Met à jour un emprunt existant
 */
export async function updateLoan(req: Request, res: Response) {
    try {
        const { loanId } = req.params;
        const { bookId, userId, startDate, endDate } = req.body;
        if (!loanId || !bookId || !userId || !startDate || !endDate) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }
        const updatedLoan = await LoanSchema.findByIdAndUpdate(
            loanId,
            { bookId, userId, startDate, endDate },
            { new: true }
        );
        if (!updatedLoan) {
            res.status(404).json({ message: 'Emprunt non trouvé' });
            return;
        }
        res.status(200).json({ message: 'Emprunt mis à jour avec succès', data: updatedLoan });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Confirme un emprunt (status: "confirmed"), met à jour l'utilisateur et le livre associés
 */
export async function confirmLoan(req: Request, res: Response) {
    try {
        const { loanId } = req.params;
        if (!loanId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }
        const updatedLoan = await LoanSchema.findByIdAndUpdate(loanId, { status: "confirmed" }, { new: true });
        if (!updatedLoan) {
            res.status(404).json({ message: 'Emprunt non trouvé' });
            return;
        }
        // Ajoute le livre à la liste des livres lus de l'utilisateur
        const user = await UserSchema.findById(updatedLoan.userId).exec();
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        user.booksRead.push(updatedLoan.bookId);
        await user.save();

        // Met à jour le livre comme emprunté et ajoute l'utilisateur à la liste des lecteurs
        const book = await BookSchema.findById(updatedLoan.bookId).exec();
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        book.alreadyLoaned = true;
        book.readBy.push(updatedLoan.userId);
        await book.save();

        res.status(200).json({ message: 'Emprunt mis à jour avec succès', data: updatedLoan });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Annule un emprunt (suppression)
 */
export async function cancelLoan(req: Request, res: Response) {
    try {
        const { loanId } = req.params;
        if (!loanId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }
        const canceledLoan = await LoanSchema.findByIdAndDelete(loanId);
        if (!canceledLoan) {
            res.status(404).json({ message: 'Emprunt non trouvé' });
            return;
        }
        res.status(200).json({ message: 'Emprunt annulé avec succès', data: canceledLoan });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

/**
 * Marque un emprunt comme retourné (status: "returned") et libère le livre
 */
export async function bookReturned(req: Request, res: Response) {
    try {
        const { loanId } = req.params;
        if (!loanId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }
        const updatedLoan = await LoanSchema.findByIdAndUpdate(loanId, { status: "returned" }, { new: true });
        if (!updatedLoan) {
            res.status(404).json({ message: 'Emprunt non trouvé' });
            return;
        }
        // Libère le livre
        const book = await BookSchema.findById(updatedLoan.bookId).exec();
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }
        book.alreadyLoaned = false;
        await book.save();

        res.status(200).json({ message: 'Emprunt mis à jour avec succès', data: updatedLoan });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}
