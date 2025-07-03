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
exports.getAllBooks = getAllBooks;
exports.getAllBooksByActiveAndOwnerActive = getAllBooksByActiveAndOwnerActive;
exports.getBookById = getBookById;
exports.getBooksBypostalCode = getBooksBypostalCode;
exports.addBook = addBook;
exports.changeActiveStatus = changeActiveStatus;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
exports.reactivateBook = reactivateBook;
const BookSchema_1 = __importDefault(require("../DBSchemas/BookSchema"));
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
const LoanSchema_1 = __importDefault(require("../DBSchemas/LoanSchema"));
const mongoose_1 = require("mongoose");
/**
 * Récupère tous les livres
 */
function getAllBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const books = yield BookSchema_1.default.find();
            res.status(200).json(books);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Récupère tous les livres actifs dont le propriétaire est actif
 */
function getAllBooksByActiveAndOwnerActive(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const books = yield BookSchema_1.default.find({ isActive: true, ownerActive: true });
            res.status(200).json(books);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Récupère un livre par son ID
 */
function getBookById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            if (!bookId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const book = yield BookSchema_1.default.findById(bookId);
            if (!book) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            res.status(200).json(book);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Récupère les livres par code postal (département)
 */
function getBooksBypostalCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { postalCode } = req.params;
            if (!postalCode) {
                res.status(400).json({ message: 'Département requis' });
                return;
            }
            // Trouver les utilisateurs dans ce département
            const users = yield UserSchema_1.default.find({ postalCode: new RegExp(`^${postalCode}$`, 'i') }).select('_id');
            if (!users.length) {
                res.status(404).json({ message: 'Aucun utilisateur trouvé dans ce département' });
                return;
            }
            const userIds = users.map(user => user._id);
            // Récupérer les livres de ces utilisateurs
            const books = yield BookSchema_1.default.find({ owner: { $in: userIds } });
            if (!books.length) {
                res.status(404).json({ message: 'Aucun livre trouvé pour ce département' });
                return;
            }
            res.status(200).json({ message: `Livres dans le département ${postalCode}`, data: books });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Ajoute un nouveau livre pour l'utilisateur connecté
 */
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const newBook = new BookSchema_1.default({ title, description, author, genre, publishedYear, language, owner, state, imageCouverture, imageBack, imageInBook });
            const savedBook = yield newBook.save();
            // Ajout du livre à la liste des livres possédés par l'utilisateur
            const userRecord = yield UserSchema_1.default.findById(owner);
            if (!userRecord) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            userRecord.booksOwned.push(newBook._id);
            yield userRecord.save();
            res.status(201).json({ message: 'Livre créé avec succès', savedBook });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Change le statut actif d'un livre
 */
function changeActiveStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            const { isActive } = req.body;
            if (!bookId || isActive === undefined) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const updatedBook = yield BookSchema_1.default.findByIdAndUpdate(bookId, { isActive }, { new: true });
            if (!updatedBook) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            res.status(200).json(updatedBook);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Met à jour un livre existant
 */
function updateBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            const { title, description, author, genre, publishedYear, language, owner, imageCouverture, imageInBook, imageBack } = req.body;
            if (!bookId || !title || !description || !author || !genre || !publishedYear || !language || !owner || !imageCouverture || !imageInBook || !imageBack) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const updatedBook = yield BookSchema_1.default.findByIdAndUpdate(bookId, { title, description, author, genre, publishedYear, language, owner, imageCouverture, imageInBook, imageBack }, { new: true });
            if (!updatedBook) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            res.status(200).json(updatedBook);
            return;
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Supprime un livre si aucune contrainte d'usage n'est présente
 * - Si le livre est dans booksRead ou booksReserved d'un utilisateur, il est désactivé
 * - Si le livre est dans un emprunt, il ne peut pas être supprimé
 */
function deleteBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            if (!bookId) {
                res.status(400).json({ message: 'ID du livre requis' });
                return;
            }
            const objectId = new mongoose_1.Types.ObjectId(bookId);
            // Vérifier si le livre est dans booksRead ou booksReserved
            const usersWithBookRead = yield UserSchema_1.default.find({ booksRead: objectId });
            const usersWithBookReserved = yield UserSchema_1.default.find({ booksReserved: { $in: [objectId, bookId] } });
            if (usersWithBookRead.length > 0 || usersWithBookReserved.length > 0) {
                const updatedBook = yield BookSchema_1.default.findByIdAndUpdate(bookId, { $set: { isActive: false } }, { new: true });
                res.status(200).json({ message: 'Livre marqué comme inactif', data: updatedBook });
                return;
            }
            // Vérifier si le livre est dans un emprunt
            const loansWithBook = yield LoanSchema_1.default.find({ bookId });
            if (loansWithBook.length > 0) {
                res.status(400).json({ message: 'Le livre est encore associé à des emprunts' });
                return;
            }
            // Suppression du livre
            const deletedBook = yield BookSchema_1.default.findByIdAndDelete(bookId);
            if (!deletedBook) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            res.status(200).json({ message: "Livre effacé avec succès", deletedBook });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Réactive un livre si aucune contrainte d'emprunt n'est présente
 */
function reactivateBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            if (!bookId) {
                res.status(400).json({ message: 'ID du livre requis' });
                return;
            }
            // Vérifie s’il est actuellement dans un emprunt actif
            const loansWithBook = yield LoanSchema_1.default.find({ bookId });
            if (loansWithBook.length > 0) {
                res.status(400).json({ message: 'Impossible de réactiver : le livre est emprunté' });
                return;
            }
            const updatedBook = yield BookSchema_1.default.findByIdAndUpdate(bookId, { $set: { isActive: true } }, { new: true });
            if (!updatedBook) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            res.status(200).json(updatedBook);
            return;
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
            return;
        }
    });
}
