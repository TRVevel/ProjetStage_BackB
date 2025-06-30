"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUserByNameOrEmailOrPostalCode = getUserByNameOrEmailOrPostalCode;
exports.updateUser = updateUser;
exports.isActive = isActive;
exports.deleteUser = deleteUser;
exports.addReservedBook = addReservedBook;
exports.addreservedEvent = addreservedEvent;
exports.addReadBook = addReadBook;
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
const LoanSchema_1 = __importDefault(require("../DBSchemas/LoanSchema"));
const BookSchema_1 = __importDefault(require("../DBSchemas/BookSchema"));
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield UserSchema_1.default.find();
            res.status(200).json(users);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const user = yield UserSchema_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            // Masquer le mot de passe avant de renvoyer les données de l'utilisateur
            user.hashedPassword = '';
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function getUserByNameOrEmailOrPostalCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Récupérer les paramètres de recherche depuis l'URL
            const { query } = req.params;
            // Vérification si le paramètre de recherche a bien été fourni
            if (!query) {
                res.status(400).json({ message: 'Le paramètre "query" est requis.' });
                return;
            }
            // Recherche d'utilisateurs correspondant au nom, email ou département, insensible à la casse
            const users = yield UserSchema_1.default.find({
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
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur interne', error: error.message });
        }
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.userId || req.params.id;
            const { address, city, postalCode, phone } = req.body;
            if (!userId) {
                res.status(400).json({ message: 'ID de l\'utilisateur requis' });
                return;
            }
            // Construire dynamiquement l'objet de mise à jour
            const updateFields = {};
            if (address !== undefined)
                updateFields.adress = address;
            if (city !== undefined)
                updateFields.city = city;
            if (postalCode !== undefined)
                updateFields.postalCode = postalCode;
            if (phone !== undefined)
                updateFields.phone = phone;
            const updatedUser = yield UserSchema_1.default.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });
            if (!updatedUser) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Utilisateur mis à jour avec succès', data: updatedUser });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function isActive(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const { isActive } = req.body;
            const updatedUser = yield UserSchema_1.default.findByIdAndUpdate(userId, { $set: { isActive } }, { new: true });
            if (!updatedUser) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Statut de l\'utilisateur mis à jour avec succès', data: updatedUser });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ message: 'ID de l\'utilisateur requis' });
                return;
            }
            // Vérifier si l'utilisateur est associé à un emprunt
            const loansWithUser = yield LoanSchema_1.default.find({ userId });
            if (loansWithUser.length > 0) {
                res.status(400).json({ message: 'L\'utilisateur est encore associé à des emprunts' });
                return;
            }
            // Vérifier si l'utilisateur est propriétaire d'un livre
            const booksOwnedByUser = yield BookSchema_1.default.find({ owner: userId });
            if (booksOwnedByUser.length > 0) {
                res.status(400).json({ message: 'L\'utilisateur est encore propriétaire de livres' });
                return;
            }
            // Supprimer l'utilisateur
            const deletedUser = yield UserSchema_1.default.findByIdAndDelete(userId);
            if (!deletedUser) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Utilisateur supprimé avec succès', data: deletedUser });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function addReservedBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, bookId } = req.params;
            if (!userId || !bookId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const user = yield UserSchema_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            // Vérifier que l'utilisateur ne peut réserver qu'une fois le livre
            const existingBook = yield UserSchema_1.default.findOne({ _id: userId, bookReserved: bookId });
            if (existingBook) {
                res.status(400).json({ message: 'Le livre est déjà réservé par cet utilisateur' });
                return;
            }
            const book = yield BookSchema_1.default.findById(bookId);
            if (!book) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            // Ajouter le livre à la liste des livres réservés de l'utilisateur
            user.bookReserved.push(bookId);
            yield user.save();
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function addreservedEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, eventId } = req.params;
            if (!userId || !eventId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            //Vérifier que l'utilisateur  ne peut réserver qu'une fois l'évènement
            const existingEvent = yield UserSchema_1.default.findOne({ _id: userId, eventReserved: eventId });
            if (existingEvent) {
                res.status(400).json({ message: 'L\'événement est déjà réservé par cet utilisateur' });
                return;
            }
            const user = yield UserSchema_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            // Ajouter l'événement à la liste des événements réservés de l'utilisateur
            user.eventReserved.push(eventId);
            yield user.save();
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function addReadBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, bookId } = req.params;
            if (!userId || !bookId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            //Vérifier que l'utilisateur  ne peut réserver qu'une fois l'évènement
            const existingBook = yield UserSchema_1.default.findOne({ _id: userId, booksRead: bookId });
            if (existingBook) {
                res.status(400).json({ message: 'Le livre lu ne peut pas s\'afficher deux fois' });
                return;
            }
            const user = yield UserSchema_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            // Ajouter l'événement à la liste des événements réservés de l'utilisateur
            user.booksRead.push(bookId);
            yield user.save();
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
