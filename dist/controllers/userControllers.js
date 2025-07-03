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
/**
 * Récupère tous les utilisateurs
 */
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
/**
 * Récupère un utilisateur par son ID
 */
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
            user.hashedPassword = '';
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Recherche des utilisateurs par nom, prénom, email ou code postal
 */
function getUserByNameOrEmailOrPostalCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { query } = req.params;
            if (!query) {
                res.status(400).json({ message: 'Le paramètre "query" est requis.' });
                return;
            }
            const users = yield UserSchema_1.default.find({
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
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur interne', error: error.message });
        }
    });
}
/**
 * Met à jour les informations d'un utilisateur
 */
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.userId || req.params.id;
            const { address, city, postalCode, phone } = req.body;
            if (!userId) {
                res.status(400).json({ message: 'ID de l\'utilisateur requis' });
                return;
            }
            // Construction dynamique de l'objet de mise à jour
            const updateFields = {};
            if (address !== undefined)
                updateFields.address = address;
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
/**
 * Active ou désactive un utilisateur (toggle)
 */
function isActive(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const user = yield UserSchema_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            user.isActive = !user.isActive;
            yield user.save({ validateBeforeSave: false });
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Supprime un utilisateur si aucune contrainte d'emprunt ou de possession de livre
 */
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
/**
 * Ajoute un livre à la liste des livres réservés de l'utilisateur
 */
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
            if (user.bookReserved.includes(bookId)) {
                res.status(400).json({ message: 'Le livre est déjà réservé par cet utilisateur' });
                return;
            }
            const book = yield BookSchema_1.default.findById(bookId);
            if (!book) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            user.bookReserved.push(bookId);
            yield user.save();
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Ajoute un événement à la liste des événements réservés de l'utilisateur
 */
function addreservedEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, eventId } = req.params;
            if (!userId || !eventId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const user = yield UserSchema_1.default.findById(userId);
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
            yield user.save();
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Ajoute un livre à la liste des livres lus de l'utilisateur
 */
function addReadBook(req, res) {
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
            // Vérifier que le livre n'est pas déjà dans la liste des livres lus
            if (user.booksRead.includes(bookId)) {
                res.status(400).json({ message: 'Le livre lu ne peut pas s\'afficher deux fois' });
                return;
            }
            user.booksRead.push(bookId);
            yield user.save();
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
