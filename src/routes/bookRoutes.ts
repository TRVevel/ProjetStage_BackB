import { Router } from "express";
import { addBook, changeActiveStatus, deleteBook, getAllBooks, getBookById, getBooksByDepartment, updateBook } from "../controllers/bookController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

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
router.get('/books', getAllBooks);

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
router.get('/books/:bookId', getBookById);

/**
 * @swagger
 * /api/books/department/{department}:
 *   get:
 *     tags:
 *       - Books
 *     summary: "Get books by department"
 *     parameters:
 *       - in: path
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *         description: "The department to filter books by"
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
 *         description: "No books found for this department"
 *       500:
 *         description: "Internal server error"
 */
router.get('/books/department/:department', getBooksByDepartment);


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
router.post('/books',verifyTokenMiddleware, addBook);

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
router.put('/books/:bookId', verifyTokenMiddleware, updateBook);

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
router.put('/books/changeActive/:bookId',verifyTokenMiddleware, changeActiveStatus);

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
router.delete('/books/:bookId',verifyTokenMiddleware, deleteBook);

export default router;