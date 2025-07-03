"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const verifyIsAdmin_1 = require("../middlewares/verifyIsAdmin");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Liste des utilisateurs récupérée avec succès
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
router.get('/users', userControllers_1.getAllUsers);
/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer un utilisateur par son ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df24"
 *         description: ID de l'utilisateur à récupérer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur trouvé
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
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
router.get('/users/:userId', userControllers_1.getUserById);
/**
 * @swagger
 * /api/users/search/{query}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer un utilisateur par son Name ou Email ou postalCode
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "eva.sarf@example.com"
 *         description: Nom, email ou code postal à rechercher
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur trouvé
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aucun utilisateur trouvé avec ce critère.
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
router.get('/users/search/:query', verifyIsAdmin_1.isAdmin, userControllers_1.getUserByNameOrEmailOrPostalCode);
/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Mettre à jour un utilisateur par son ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df24"
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: "123 Rue Exemple, Paris"
 *               city:
 *                 type: string
 *                 example: "Paris"
 *               postalCode:
 *                 type: string
 *                 example: "75000"
 *               phone:
 *                 type: string
 *                 example: "+33612345678"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur mis à jour avec succès
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Champs manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Champs manquant
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
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
router.put('/users/:userId', verifyTokenMiddleware_1.verifyTokenMiddleware, userControllers_1.updateUser);
/**
 * @swagger
 * /api/users/{userId}/active:
 *   put:
 *     tags:
 *       - Users
 *     summary: Mettre à jour le statut actif d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df24"
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Statut de l'utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Statut de l'utilisateur mis à jour avec succès
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Champs manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Champs manquant
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
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
router.put('/users/:userId/active', userControllers_1.isActive);
/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprimer un utilisateur par son ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df24"
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur supprimé avec succès
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
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
router.delete('/users/:userId', verifyIsAdmin_1.isAdmin, userControllers_1.deleteUser);
/**
 * @swagger
 * /api/users/{userId}/reservedBooks/{bookId}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Ajouter un livre à la liste des livres réservés de l'utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df24"
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df23"
 *         description: ID du livre à réserver
 *     responses:
 *       200:
 *         description: Livre réservé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Livre réservé avec succès
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Champs manquant ou déjà réservé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le livre est déjà réservé par cet utilisateur
 *       404:
 *         description: Utilisateur ou livre non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
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
router.post('/users/:userId/reservedBooks/:bookId', verifyTokenMiddleware_1.verifyTokenMiddleware, userControllers_1.addReservedBook);
/**
 * @swagger
 * /api/users/{userId}/reservedEvents/{eventId}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Ajouter un événement à la liste des événements réservés de l'utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df24"
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df99"
 *         description: ID de l'événement à réserver
 *     responses:
 *       200:
 *         description: Événement réservé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Événement réservé avec succès
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Champs manquant ou déjà réservé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: L'événement est déjà réservé par cet utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
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
router.post('/users/:userId/reservedEvents/:eventId', verifyTokenMiddleware_1.verifyTokenMiddleware, userControllers_1.addreservedEvent);
/**
 * @swagger
 * /api/users/{userId}/readBooks/{bookId}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Ajouter un livre à la liste des livres lus de l'utilisateur
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df24"
 *         description: ID de l'utilisateur
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60b6a3e8f7a90b3b9c98df23"
 *         description: ID du livre lu
 *     responses:
 *       200:
 *         description: Livre ajouté à la liste des livres lus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Livre ajouté à la liste des livres lus
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Champs manquant ou déjà lu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le livre lu ne peut pas s'afficher deux fois
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non trouvé
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
router.post('/users/:userId/readBooks/:bookId', verifyTokenMiddleware_1.verifyTokenMiddleware, userControllers_1.addReadBook);
exports.default = router;
