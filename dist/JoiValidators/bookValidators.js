"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.bookSchema = joi_1.default.object({
    title: joi_1.default.string()
        .pattern(/^[A-Za-z0-9&' ]{1,50}$/)
        .required()
        .messages({
        'string.pattern.base': 'Le titre doit contenir entre 1 et 50 caractères alphanumériques, espaces ou &\'',
        'any.required': 'Le titre est requis',
    }),
    description: joi_1.default.string()
        .max(200)
        .required()
        .messages({
        'string.max': 'La description ne peut pas dépasser 200 caractères',
        'any.required': 'La description est requise',
    }),
    genre: joi_1.default.string()
        .pattern(/^[A-Za-z0-9&' ]{1,50}$/)
        .required()
        .messages({
        'string.pattern.base': 'Le genre doit contenir entre 1 et 50 caractères alphanumériques, espaces ou &\'',
        'any.required': 'Le genre est requis',
    }),
    author: joi_1.default.string()
        .pattern(/^[A-Za-z0-9&' ]{1,50}$/)
        .required()
        .messages({
        'string.pattern.base': 'L\'auteur doit contenir entre 1 et 50 caractères alphanumériques, espaces ou &\'',
        'any.required': 'L\'auteur est requis',
    }),
    publishedYear: joi_1.default.number()
        .integer()
        .min(1600)
        .max(new Date().getFullYear())
        .required()
        .messages({
        'number.base': 'L\'année de publication doit être un nombre entier',
        'number.min': 'L\'année de publication doit être au moins 1600',
        'number.max': `L\'année de publication ne peut pas dépasser ${new Date().getFullYear()}`,
        'any.required': 'L\'année de publication est requise',
    }),
    language: joi_1.default.string()
        .valid('french', 'ukrainian', 'english')
        .required()
        .messages({
        'any.only': 'La langue doit être "french", "ukrainian" ou "english"',
        'any.required': 'La langue est requise',
    }),
    state: joi_1.default.string()
        .valid('new', 'good', 'used')
        .required()
        .messages({
        'any.only': 'L\'état doit être "new", "good" ou "used"',
        'any.required': 'L\'état est requis',
    }),
    images: joi_1.default.array()
        .items(joi_1.default.string().uri())
        .optional()
        .messages({
        'array.base': 'Les images doivent être un tableau d\'URI valides',
        'string.uri': 'Chaque image doit être une URI valide',
    }),
});
