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
exports.getAllCommentsByBook = getAllCommentsByBook;
exports.getCommentById = getCommentById;
exports.getAllCommentByUser = getAllCommentByUser;
exports.createComment = createComment;
exports.modifyComment = modifyComment;
exports.deleteComment = deleteComment;
const CommentSchema_1 = __importDefault(require("../DBSchemas/CommentSchema"));
/**
 * Récupère tous les commentaires d'un livre par son ID
 */
function getAllCommentsByBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            const comments = yield CommentSchema_1.default.find({ book_id: bookId });
            res.status(200).json(comments);
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Récupère un commentaire par son ID
 */
function getCommentById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { commentId } = req.params;
            if (!commentId) {
                res.status(400).json({ message: 'Champs manquant' });
                return;
            }
            const comment = yield CommentSchema_1.default.findById(commentId);
            if (!comment) {
                res.status(404).json({ message: 'Commentaire non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Commentaire trouvé', data: comment });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
/**
 * Récupère tous les commentaires d'un utilisateur par son ID
 */
function getAllCommentByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user_id } = req.params;
            const comments = yield CommentSchema_1.default.find({ owner: user_id });
            if (!comments.length) {
                res.status(404).json({ message: "Aucun commentaire trouvé pour cet utilisateur" });
                return;
            }
            res.status(200).json(comments);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur interne', error: error.message });
        }
    });
}
/**
 * Crée un commentaire pour un livre donné par l'utilisateur connecté
 */
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { comment, title } = req.body;
            const bookId = req.params.bookId;
            const user = req.user;
            if (!comment || !title) {
                res.status(400).json({ message: "Le titre et le commentaire sont requis." });
                return;
            }
            if (!user || !user._id) {
                res.status(401).json({ message: "Utilisateur non authentifié." });
                return;
            }
            if (!bookId) {
                res.status(400).json({ message: "L'identifiant du livre est requis." });
                return;
            }
            const commentToSave = new CommentSchema_1.default({
                book_id: bookId,
                owner: user._id,
                title,
                comment,
            });
            const savedComment = yield commentToSave.save();
            res.status(201).json({ message: "Commentaire créé avec succès.", data: savedComment });
        }
        catch (err) {
            res.status(500).json({ message: "Erreur interne", error: err.message });
        }
    });
}
/**
 * Modifie un commentaire existant par son ID
 */
function modifyComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { commentId } = req.params;
            const { title, comment } = req.body;
            const commentUser = yield CommentSchema_1.default.findById(commentId);
            if (!commentUser) {
                res.status(404).json({ message: "Commentaire non trouvé" });
                return;
            }
            if (comment)
                commentUser.comment = comment;
            if (title)
                commentUser.title = title;
            yield commentUser.save();
            res.status(200).json({ message: "Commentaire modifié avec succès", data: commentUser });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur interne", error: error.message });
        }
    });
}
/**
 * Supprime un commentaire par son ID
 */
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { commentId } = req.params;
            const commentUser = yield CommentSchema_1.default.findByIdAndDelete(commentId);
            if (!commentUser) {
                res.status(404).json({ message: "Commentaire non trouvé" });
                return;
            }
            res.status(200).json({ message: "Commentaire supprimé avec succès" });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur interne", error: error.message });
        }
    });
}
