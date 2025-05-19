"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cityDbControllers_1 = require("../controllers/cityDbControllers");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/cities:
 *   get:
 *     tags:
 *       - Cities
 *     summary: Récupérer toutes les villes
 *     responses:
 *       200:
 *         description: Liste des villes récupérée avec succès
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
 *                     $ref: '#/components/schemas/City'
 */
router.get("/cities", cityDbControllers_1.getAllCities);
router.get("/cities/:cityName", cityDbControllers_1.getCityByName);
exports.default = router;
