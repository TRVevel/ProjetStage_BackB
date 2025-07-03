import { Router } from "express";
import {
    getCommentById,
    createComment,
    getAllCommentsByBook,
    modifyComment,
    deleteComment
} from "../controllers/commentController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

/**
 * @swagger
 * /api/comments/{bookId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Récupère tous les commentaires d'un livre par son ID
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df23"
 *         description: L'ID du livre
 *     responses:
 *       200:
 *         description: Liste des commentaires du livre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Erreur interne
 */
router.get('/comments/:bookId', getAllCommentsByBook);

/**
 * @swagger
 * /api/comments/comment/{commentId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Récupère un commentaire par son ID
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df99"
 *         description: L'ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.get('/comments/comment/:commentId', getCommentById);

/**
 * @swagger
 * /api/comments/{bookId}:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Crée un commentaire pour un livre donné par l'utilisateur connecté
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df23"
 *         description: L'ID du livre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - comment
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Super livre"
 *               comment:
 *                 type: string
 *                 example: "J'ai adoré ce roman, très bien écrit !"
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 *       400:
 *         description: Champs manquant
 *       401:
 *         description: Utilisateur non authentifié
 *       500:
 *         description: Erreur interne
 */
router.post('/comments/:bookId', verifyTokenMiddleware, createComment);

/**
 * @swagger
 * /api/comments/put/{commentId}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Modifie un commentaire existant par son ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df99"
 *         description: L'ID du commentaire à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Titre modifié"
 *               comment:
 *                 type: string
 *                 example: "Commentaire modifié"
 *     responses:
 *       200:
 *         description: Commentaire modifié avec succès
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.put('/comments/put/:commentId', verifyTokenMiddleware, modifyComment);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Supprime un commentaire par son ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df99"
 *         description: L'ID du commentaire à supprimer
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne
 */
router.delete('/comments/:commentId', verifyTokenMiddleware, deleteComment);

export default router;