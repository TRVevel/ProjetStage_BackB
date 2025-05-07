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
exports.getBookById = getBookById;
exports.getBooksBypostalCode = getBooksBypostalCode;
exports.addBook = addBook;
exports.changeActiveStatus = changeActiveStatus;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
const BookSchema_1 = __importDefault(require("../DBSchemas/BookSchema"));
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
const LoanSchema_1 = __importDefault(require("../DBSchemas/LoanSchema"));
function getAllBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const books = yield BookSchema_1.default.find();
            res.status(200).json({ message: 'Liste des livres', data: books });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
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
            res.status(200).json({ message: 'Livre trouvé', data: book });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
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
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, description, author, genre, publishedYear, language } = req.body;
            if (!title || !description || !author || !genre || !publishedYear || !language) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            // Parse the logged-in user's _id from the decoded token
            const user = req.headers.user ? JSON.parse(req.headers.user) : null;
            if (!user || !user._id) {
                res.status(401).json({ message: 'Utilisateur non authentifié' });
                return;
            }
            const owner = user._id;
            const newBook = new BookSchema_1.default({ title, description, author, genre, publishedYear, language, owner });
            const savedBook = yield newBook.save();
            const userRecord = yield UserSchema_1.default.findById(owner);
            if (!userRecord) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            userRecord.booksOwned.push(newBook._id);
            yield userRecord.save();
            res.status(201).json({ message: 'Livre ajouté avec succès', data: savedBook });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
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
            res.status(200).json({ message: 'Statut du livre mis à jour avec succès', data: updatedBook });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function updateBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            const { title, description, author, genre, publishedYear, language, owner } = req.body;
            if (!bookId || !title || !description || !author || !genre || !publishedYear || !language || !owner) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const updatedBook = yield BookSchema_1.default.findByIdAndUpdate(bookId, { title, description, author, genre, publishedYear, language, owner }, { new: true });
            if (!updatedBook) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Livre mis à jour avec succès', data: updatedBook });
            return;
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function deleteBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            if (!bookId) {
                res.status(400).json({ message: 'ID du livre requis' });
                return;
            }
            // Vérifier si le livre est présent dans le tableau booksRead de n'importe quel utilisateur
            const usersWithBookRead = yield UserSchema_1.default.find({ booksRead: bookId });
            if (usersWithBookRead.length > 0) {
                res.status(400).json({ message: 'Le livre est encore marqué comme lu par des utilisateurs' });
                return;
            }
            // Vérifier si le livre est présent dans un emprunt
            const loansWithBook = yield LoanSchema_1.default.find({ bookId });
            if (loansWithBook.length > 0) {
                res.status(400).json({ message: 'Le livre est encore associé à des emprunts' });
                return;
            }
            // Supprimer le livre
            const deletedBook = yield BookSchema_1.default.findByIdAndDelete(bookId);
            if (!deletedBook) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Livre supprimé avec succès', data: deletedBook });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
