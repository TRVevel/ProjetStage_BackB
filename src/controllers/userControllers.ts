import { Request, Response } from 'express';
import UserSchema from '../DBSchemas/UserSchema';
import LoanSchema from '../DBSchemas/LoanSchema';
import BookSchema from '../DBSchemas/BookSchema';
import CitySchema from '../DBSchemas/CitySchema';

export async function getAllUsers(req:Request, res:Response){
    try{
        const users= await UserSchema.find();
        res.status(200).json(users);
    }catch(err:any){
        res.status(500).json({message: 'Erreur interne', error: err.message});
    }
}

export async function getUserById(req:Request, res:Response){
    try{
        const {userId}= req.params;
        if(!userId){
            res.status(400).json({message: 'Champs manquant'});
            return;
        }
        const user= await UserSchema.findById(userId);
        if(!user){
            res.status(404).json({message: 'Utilisateur non trouvé'});
            return;
        }
        // Masquer le mot de passe avant de renvoyer les données de l'utilisateur
        user.hashedPassword = '';
        res.status(200).json(user);
    }catch(err:any){
        res.status(500).json({message: 'Erreur interne', error: err.message});
    }
}

export async function getUserByNameOrEmailOrPostalCode(req: Request, res: Response) {
    try {
        // Récupérer les paramètres de recherche depuis l'URL
        const { query } = req.params;

        // Vérification si le paramètre de recherche a bien été fourni
        if (!query) {
            res.status(400).json({ message: 'Le paramètre "query" est requis.' });
            return;
        }

        // Recherche d'utilisateurs correspondant au nom, email ou département, insensible à la casse
        const users = await UserSchema.find({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } }, // Recherche insensible à la casse sur le nom complet
                { firstName: { $regex: new RegExp(query, 'i') } }, // Recherche insensible à la casse sur le prénom
                { lastName: { $regex: new RegExp(query, 'i') } }, // Recherche insensible à la casse sur le nom
                { email: { $regex: new RegExp(query, 'i') } }, // Recherche insensible à la casse sur l'email
                { postalCode: { $regex: new RegExp(query, 'i') } } // Recherche insensible à la casse sur le département
            ]
        });

        // Si aucun utilisateur trouvé
        if (users.length === 0) {
            res.status(404).json({ message: 'Aucun utilisateur trouvé avec ce critère.' });
            return;
        }

        // Masquer le mot de passe avant de renvoyer les données des utilisateurs
        users.forEach(user => {
            user.hashedPassword = '';
        });

        // Retourner les utilisateurs trouvés
        res.status(200).json( users );
    } catch (error: any) {
        res.status(500).json({ message: 'Erreur interne', error: error.message });
    }
}


export async function updateUser(req: Request, res: Response) {
    try {
        const userId = req.params.userId || req.params.id;
        const {address, city, postalCode, phone } = req.body;

        if (!userId) {
            res.status(400).json({ message: 'ID de l\'utilisateur requis' });
            return;
        }

        // Construire dynamiquement l'objet de mise à jour
        const updateFields: any = {};
        if (address !== undefined) updateFields.adress = address;
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
export async function isActive(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        const { isActive } = req.body;

        const updatedUser = await UserSchema.findByIdAndUpdate(
            userId,
            { $set: { isActive } },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json({ message: 'Statut de l\'utilisateur mis à jour avec succès', data: updatedUser });
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

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
        const existingBook = await UserSchema.findOne({ _id: userId, bookReserved: bookId });
        if (existingBook) {
            res.status(400).json({ message: 'Le livre est déjà réservé par cet utilisateur' });
            return;
        }

        const book = await BookSchema.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }

        // Ajouter le livre à la liste des livres réservés de l'utilisateur
        user.bookReserved.push(bookId);
        await user.save();

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

export async function addreservedEvent(req: Request, res: Response) {
    try {
        const { userId, eventId } = req.params;

        if (!userId || !eventId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }

        //Vérifier que l'utilisateur  ne peut réserver qu'une fois l'évènement
        const existingEvent = await UserSchema.findOne({ _id: userId, eventReserved: eventId });
        if (existingEvent) {
            res.status(400).json({ message: 'L\'événement est déjà réservé par cet utilisateur' });
            return;
        }

        const user = await UserSchema.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // Ajouter l'événement à la liste des événements réservés de l'utilisateur
        user.eventReserved.push(eventId);
        await user.save();

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}


export async function addReadBook (req: Request, res: Response) {
    try {
        const { userId, bookId } = req.params;

        if (!userId || !bookId) {
            res.status(400).json({ message: 'Champs manquant' });
            return;
        }

        //Vérifier que l'utilisateur  ne peut réserver qu'une fois l'évènement
        const existingBook = await UserSchema.findOne({ _id: userId, booksRead: bookId });
        if (existingBook) {
            res.status(400).json({ message: 'Le livre lu ne peut pas s\'afficher deux fois' });
            return;
        }

        const user = await UserSchema.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        // Ajouter l'événement à la liste des événements réservés de l'utilisateur
        user.booksRead.push(bookId);
        await user.save();

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}