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
function getAllCommentsByBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookId } = req.params;
            const comments = yield CommentSchema_1.default.find({ book_id: bookId });
            res.status(200).json({ message: 'Liste des commentaires', data: comments });
        }
        catch (err) {
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
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
function getAllCommentByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user_id } = req.params;
            const utilisateursSession = yield CommentSchema_1.default.findById({ where: { user_id } });
            if (!utilisateursSession) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
            }
            res.send(utilisateursSession);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validation des champs
            const { comment, title } = req.body;
            const user = req.headers.user ? JSON.parse(req.headers.user) : null;
            const book = req.params.bookId;
            if (!comment) {
                res.status(400).send('Le commentaire est incomplet.');
                return;
            }
            if (!user) {
                res.status(403).json({ message: "Utilisateur non valide." });
                return;
            }
            if (!book) {
                res.status(400).json({ message: "Le livre avec cet ID n'existe pas." });
                return;
            }
            const commentUser = new CommentSchema_1.default({ book_id: book, owner: user, title, comment });
            const savedComment = yield commentUser.save();
            res.status(200).json({ message: 'Livre trouvé', data: savedComment });
        }
        catch (err) {
            // Gestion des erreurs
            res.status(500).json({ message: 'Erreur interne', error: err.message });
        }
    });
}
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
            res.status(200).json({ message: "Commentaire modifié avec succès", commentUser });
        }
        catch (error) {
            console.error("Erreur lors de la modification :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    });
}
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { commentId } = req.params;
            const commentUser = yield CommentSchema_1.default.findByIdAndDelete(commentId);
            if (!commentUser) {
                res.status(404).json({ message: "Commentaire non trouvé" });
                return;
            }
            res.json({ message: "Commentaire supprimé avec succès" });
        }
        catch (error) {
            console.error("Erreur lors de la suppression :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    });
}
