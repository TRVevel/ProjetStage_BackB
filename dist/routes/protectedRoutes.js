"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const protectedController_1 = require("../controllers/protectedController");
const router = express_1.default.Router();
router.get('/protected', verifyTokenMiddleware_1.verifyTokenMiddleware, protectedController_1.protectedTest);
exports.default = router;
