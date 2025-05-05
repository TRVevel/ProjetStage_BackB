"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loanConttrolers_1 = require("../controllers/loanConttrolers");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/loans:
 *   get:
 *     tags:
 *       - Loans
 *     summary: Récupérer tous les emprunts
 *     responses:
 *       200:
 *         description: Liste des emprunts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Liste des emprunts
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookId:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *       500:
 *         description: Erreur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur interne
 *                 error:
 *                   type: string
 *                   example: [description de l'erreur]
 */
router.get('/loans', loanConttrolers_1.getAllLoans);
/**
 * @swagger
 * /api/loans/{bookId}:
 *   post:
 *     tags:
 *       - Loans
 *     summary: Ajouter un emprunt
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du livre à emprunter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-15"
 *     responses:
 *       201:
 *         description: Emprunt ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt ajouté avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookId:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Champs manquants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Champs manquants
 *       500:
 *         description: Erreur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur interne
 *                 error:
 *                   type: string
 *                   example: [description de l'erreur]
 */
router.post('/loans/:bookId', verifyTokenMiddleware_1.verifyTokenMiddleware, loanConttrolers_1.addLoan);
/**
 * @swagger
 * /api/loans/{loanId}:
 *   put:
 *     tags:
 *       - Loans
 *     summary: Mettre à jour un emprunt
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'emprunt à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - userId
 *               - startDate
 *               - endDate
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "60b6a3e8f7a90b3b9c98df23"
 *               userId:
 *                 type: string
 *                 example: "60b6a3e8f7a90b3b9c98df24"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-15"
 *     responses:
 *       200:
 *         description: Emprunt mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt mis à jour avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookId:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Champs manquants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Champs manquants
 *       404:
 *         description: Emprunt non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt non trouvé
 *       500:
 *         description: Erreur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur interne
 */
router.put('/loans/:loanId', verifyTokenMiddleware_1.verifyTokenMiddleware, loanConttrolers_1.updateLoan);
/**
 * @swagger
 * /api/loans/confirmed/{loanId}:
 *   put:
 *     tags:
 *       - Loans
 *     summary: Confirmer un emprunt
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'emprunt à confirmer
 *     responses:
 *       200:
 *         description: Emprunt confirmé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt confirmé avec succès
 *       404:
 *         description: Emprunt non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt non trouvé
 *       500:
 *         description: Erreur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur interne
 */
router.put('/loans/confirmed/:loanId', verifyTokenMiddleware_1.verifyTokenMiddleware, loanConttrolers_1.confirmLoan);
/**
 * @swagger
 * /api/loans/canceled/{loanId}:
 *   delete:
 *     tags:
 *       - Loans
 *     summary: Annuler un emprunt
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'emprunt à annuler
 *     responses:
 *       200:
 *         description: Emprunt annulé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt annulé avec succès
 *       404:
 *         description: Emprunt non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt non trouvé
 *       500:
 *         description: Erreur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur interne
 */
router.delete('/loans/canceled/:loanId', verifyTokenMiddleware_1.verifyTokenMiddleware, loanConttrolers_1.cancelLoan);
/**
 * @swagger
 * /api/loans/returned/{loanId}:
 *   put:
 *     tags:
 *       - Loans
 *     summary: Marquer un emprunt comme retourné
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'emprunt à marquer comme retourné
 *     responses:
 *       200:
 *         description: Emprunt marqué comme retourné avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt marqué comme retourné avec succès
 *       404:
 *         description: Emprunt ou utilisateur/livre non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Emprunt ou utilisateur/livre non trouvé
 *       500:
 *         description: Erreur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur interne
 */
router.put('/loans/returned/:loanId', verifyTokenMiddleware_1.verifyTokenMiddleware, loanConttrolers_1.bookReturned);
exports.default = router;
