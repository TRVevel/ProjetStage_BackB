"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const validateSchema = (data, schema) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(`Validation failed: ${error.details.map(d => d.message).join(', ')}`);
    }
    return value; // Retourne les données validées
};
exports.validateSchema = validateSchema;
