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
exports.getAllLoans = getAllLoans;
exports.addLoan = addLoan;
exports.updateLoan = updateLoan;
exports.confirmLoan = confirmLoan;
exports.cancelLoan = cancelLoan;
exports.bookReturned = bookReturned;
const LoanSchema_1 = __importDefault(require("../DBSchemas/LoanSchema"));
const UserSchema_1 = __importDefault(require("../DBSchemas/UserSchema"));
const BookSchema_1 = __importDefault(require("../DBSchemas/BookSchema"));
function getAllLoans(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loans = yield LoanSchema_1.default.find();
            res.status(200).json({ message: 'Liste des emprunts', data: loans });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function addLoan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            const { startDate, endDate } = req.body;
            const user = req.headers.user ? JSON.parse(req.headers.user) : null;
            if (!user || !user._id) {
                res.status(401).json({ message: 'Utilisateur non authentifié' });
                return;
            }
            const userId = user._id;
            if (!bookId || !userId || !startDate || !endDate) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const newLoan = new LoanSchema_1.default({ bookId, userId, startDate, endDate });
            const savedLoan = yield newLoan.save();
            res.status(201).json({ message: 'Emprunt ajouté avec succès', data: savedLoan });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function updateLoan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { loanId } = req.params;
            const { bookId, userId, startDate, endDate } = req.body;
            if (!loanId || !bookId || !userId || !startDate || !endDate) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const updatedLoan = yield LoanSchema_1.default.findByIdAndUpdate(loanId, { bookId, userId, startDate, endDate }, { new: true });
            if (!updatedLoan) {
                res.status(404).json({ message: 'Emprunt non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Emprunt mis à jour avec succès', data: updatedLoan });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function confirmLoan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { loanId } = req.params;
            if (!loanId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const updatedLoan = yield LoanSchema_1.default.findByIdAndUpdate(loanId, { status: "confirmed" }, { new: true });
            if (!updatedLoan) {
                res.status(404).json({ message: 'Emprunt non trouvé' });
                return;
            }
            const user = yield UserSchema_1.default.findById(updatedLoan.userId).exec();
            if (!user) {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
                return;
            }
            user.booksRead.push(updatedLoan.bookId);
            yield user.save();
            const book = yield BookSchema_1.default.findById(updatedLoan.bookId).exec();
            if (!book) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            book.alreadyLoaned = true;
            book.readBy.push(updatedLoan.userId);
            yield book.save();
            res.status(200).json({ message: 'Emprunt mis à jour avec succès', data: updatedLoan });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function cancelLoan(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { loanId } = req.params;
            if (!loanId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const canceledLoan = yield LoanSchema_1.default.findByIdAndDelete(loanId);
            if (!canceledLoan) {
                res.status(404).json({ message: 'Emprunt non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Emprunt annulé avec succès', data: canceledLoan });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
function bookReturned(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { loanId } = req.params;
            if (!loanId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const updatedLoan = yield LoanSchema_1.default.findByIdAndUpdate(loanId, { status: "returned" }, { new: true });
            if (!updatedLoan) {
                res.status(404).json({ message: 'Emprunt non trouvé' });
                return;
            }
            const book = yield BookSchema_1.default.findById(updatedLoan.bookId).exec();
            if (!book) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }
            book.alreadyLoaned = false;
            yield book.save();
            res.status(200).json({ message: 'Emprunt mis à jour avec succès', data: updatedLoan });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
