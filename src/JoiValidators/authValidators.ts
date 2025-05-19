import Joi from 'joi';

// Validation des attributs d'un utilisateur Customer
export const userValidationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().pattern(/^[a-zA-Z\s]+$/).messages({
        'string.pattern.base': '"name" doit contenir uniquement des lettres et des espaces.',
        'string.min': '"name" doit comporter au moins 2 caractères.',
        'string.max': '"name" doit comporter au maximum 100 caractères.',
    }),
    email: Joi.string().email().required().messages({
        'string.email': '"email" doit être une adresse email valide.',
    }),
    phone: Joi.string().min(10).max(15).messages({
        'string.min': '"phone" doit comporter au moins 10 caractères.',
        'string.max': '"phone" doit comporter au maximum 15 caractères.',
    }),
    address: Joi.string().min(10).max(255).required().messages({
        'string.min': '"adress" doit comporter au moins 10 caractères.',
        'string.max': '"adress" doit comporter au maximum 255 caractères.',
    }),
    city: Joi.string().min(2).max(100).required().pattern(/^[a-zA-Z\s]+$/).messages({
        'string.pattern.base': '"city" doit contenir uniquement des lettres et des espaces.',
        'string.min': '"city" doit comporter au moins 2 caractères.',
        'string.max': '"city" doit comporter au maximum 100 caractères.',
    }),
    postalCode: Joi.string().min(5).max(5).required().pattern(/^[0-9]+$/).messages({
        'string.pattern.base': '"postalCode" doit contenir uniquement des chiffres.',
        'string.min': '"postalCode" doit comporter exactement 5 caractères.',
        'string.max': '"postalCode" doit comporter exactement 5 caractères.',
    }),
    password: Joi.string().min(8).required().pattern(/^(?=.*[!@#$%^&*])(?=.*\d)/).messages({
        'string.pattern.base': '"hashedpassword" doit comporter au moins un chiffre et un caractère spécial.',
        'string.min': '"hashedpassword" doit comporter au moins 8 caractères.',
    }),
});

export const userLoginValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': '"email" doit être une adresse email valide.',
    }),
    password: Joi.string().min(2).required().messages({
        'string.min': '"password" doit comporter au moins 8 caractères.',
    })
});

