"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controllers/bookController");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const verifyIsAdmin_1 = require("../middlewares/verifyIsAdmin");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/books:
 *   get:
 *     tags:
 *       - Books
 *     summary: "Get all books"
 *     responses:
 *       200:
 *         description: "List of all books"
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
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: "Internal server error"
 */
router.get('/books', verifyIsAdmin_1.isAdmin, bookController_1.getAllBooks);
/**
 * @swagger
 * /api/books/active:
 *   get:
 *     tags:
 *       - Books
 *     summary: "Get all active books"
 *     responses:
 *       200:
 *         description: "List of all active books"
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
 *                     $ref: '#/components/schemas/Book'
 */
router.get('/books/active', bookController_1.getAllBooksByActiveAndOwnerActive);
/**
* @swagger
* /api/books/{bookId}:
*   get:
*     tags:
*       - Books
*     summary: "Get a book by ID"
*     parameters:
*       - in: path
*         name: bookId
*         required: true
*         schema:
*           type: string
*         description: "The ID of the book to retrieve"
*     responses:
*       200:
*         description: "Book retrieved successfully"
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 data:
*                   $ref: '#/components/schemas/Book'
*       404:
*         description: "Book not found"
*       500:
*         description: "Internal server error"
*/
router.get('/books/:bookId', bookController_1.getBookById);
/**
 * @swagger
 * /api/books/postalCode/{postalCode}:
 *   get:
 *     tags:
 *       - Books
 *     summary: "Get books by postalCode"
 *     parameters:
 *       - in: path
 *         name: postalCode
 *         required: true
 *         schema:
 *           type: string
 *         description: "The postalCode to filter books by"
 *     responses:
 *       200:
 *         description: "Books retrieved successfully"
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
 *                     $ref: '#/components/schemas/Book'
 *       404:
 *         description: "No books found for this postalCode"
 *       500:
 *         description: "Internal server error"
 */
router.get('/books/postalCode/:postalCode', bookController_1.getBooksBypostalCode);
/**
 * @swagger
 * /api/books:
 *   post:
 *     tags:
 *       - Books
 *     summary: "Add a new book"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - author
 *               - genre
 *               - publishedYear
 *               - language
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               description:
 *                 type: string
 *                 example: "A novel written by F. Scott Fitzgerald."
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               genre:
 *                 type: string
 *                 example: "Fiction"
 *               publishedYear:
 *                 type: integer
 *                 example: 1925
 *               language:
 *                 type: string
 *                 example: "english"
 *               images:
 *                 type: string
 *                 example: "data:image/png;base64,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"
 *     responses:
 *       201:
 *         description: "Book added successfully"
 *       400:
 *         description: "Missing fields"
 *       404:
 *         description: "Owner not found"
 *       500:
 *         description: "Internal server error"
 */
router.post('/books', verifyTokenMiddleware_1.verifyTokenMiddleware, bookController_1.addBook);
/**
 * @swagger
 * /api/books/{bookId}:
 *   put:
 *     tags:
 *       - Books
 *     summary: "Update an existing book"
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: "The ID of the book to update"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - author
 *               - genre
 *               - publishedYear
 *               - language
 *               - owner
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               description:
 *                 type: string
 *                 example: "A novel written by F. Scott Fitzgerald."
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               genre:
 *                 type: string
 *                 example: "Fiction"
 *               publishedYear:
 *                 type: integer
 *                 example: 1925
 *               language:
 *                 type: string
 *                 example: "english"
 *               owner:
 *                 type: string
 *                 example: "60b6a3e8f7a90b3b9c98df23"
 *     responses:
 *       200:
 *         description: "Book updated successfully"
 *       400:
 *         description: "Missing fields"
 *       404:
 *         description: "Book not found"
 *       500:
 *         description: "Internal server error"
 */
router.put('/books/:bookId', verifyTokenMiddleware_1.verifyTokenMiddleware, bookController_1.updateBook);
/**
 * @swagger
 * /api/books/changeActive/{bookId}:
 *   put:
 *     tags:
 *       - Books
 *     summary: "Change the active status of a book"
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: "The ID of the book to update"
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
 *         description: "Book status updated successfully"
 *       400:
 *         description: "Missing fields"
 *       404:
 *         description: "Book not found"
 *       500:
 *         description: "Internal server error"
 */
router.put('/books/changeActive/:bookId', verifyTokenMiddleware_1.verifyTokenMiddleware, bookController_1.changeActiveStatus);
/**
 * @swagger
 * /api/books/{bookId}:
 *   delete:
 *     tags:
 *       - Books
 *     summary: "Delete a book by ID"
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: "The ID of the book to delete"
 *     responses:
 *       200:
 *         description: "Book deleted successfully"
 *       404:
 *         description: "Book not found"
 *       500:
 *         description: "Internal server error"
 */
router.delete('/books/:bookId', verifyTokenMiddleware_1.verifyTokenMiddleware, bookController_1.deleteBook);
exports.default = router;
