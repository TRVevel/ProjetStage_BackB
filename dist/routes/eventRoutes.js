"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const verifyIsAdmin_1 = require("../middlewares/verifyIsAdmin");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Récupérer tous les événements
 *     responses:
 *       200:
 *         description: Liste des événements récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Erreur interne
 */
router.get('/events', eventController_1.getAllEvents);
/**
 * @swagger
 * /api/events/{eventId}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Récupérer un événement par son ID
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement à récupérer
 *     responses:
 *       200:
 *         description: Événement trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Événement non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Événement non trouvé
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
router.get('/events/:eventId', eventController_1.getEventById);
/**
 * @swagger
 * /api/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Créer un nouvel événement
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - language
 *               - eventStartDate
 *               - eventEndDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Atelier de lecture"
 *               description:
 *                 type: string
 *                 example: "Un atelier pour découvrir la littérature ukrainienne."
 *               images:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               language:
 *                 type: string
 *                 example: "fr"
 *               eventStartDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T14:00:00Z"
 *               eventEndDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T16:00:00Z"
 *     responses:
 *       201:
 *         description: Événement créé
 *       400:
 *         description: Champs manquant
 *       500:
 *         description: Erreur interne
 */
router.post('/events', verifyTokenMiddleware_1.verifyTokenMiddleware, verifyIsAdmin_1.isAdmin, eventController_1.createEvent);
/**
 * @swagger
 * /api/events/{eventId}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Mettre à jour un événement
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - creator
 *               - language
 *               - usersInEvent
 *               - eventStartDate
 *               - eventEndDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Atelier de lecture"
 *               description:
 *                 type: string
 *                 example: "Un atelier pour découvrir la littérature ukrainienne."
 *               images:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               creator:
 *                 type: string
 *                 example: "665c1e2f1a2b3c4d5e6f7a8b"
 *               language:
 *                 type: string
 *                 example: "fr"
 *               usersInEvent:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *               eventStartDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T14:00:00Z"
 *               eventEndDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-01T16:00:00Z"
 *     responses:
 *       200:
 *         description: Événement mis à jour
 *       400:
 *         description: Champs manquant
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur interne
 */
router.put('/events/:eventId', verifyIsAdmin_1.isAdmin, eventController_1.updateEvent);
/**
 * @swagger
 * /api/events/{eventId}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Supprimer un événement
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement à supprimer
 *     responses:
 *       200:
 *         description: Événement supprimé
 *       400:
 *         description: ID inconnu
 *       404:
 *         description: Événement non trouvé
 *       500:
 *         description: Erreur interne
 */
router.delete('/events/:eventId', verifyIsAdmin_1.isAdmin, eventController_1.deleteEvent);
exports.default = router;
