import { Router } from "express";
import { getCommentById, createComment, getAllCommentsByBook, modifyComment, deleteComment } from "../controllers/commentController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { isAdmin } from "../middlewares/verifyIsAdmin";

const router = Router();

router.get('/comments/:bookId', getAllCommentsByBook);
router.get('/comments/comment/:commentId', getCommentById);
router.post('/comments/:bookId', verifyTokenMiddleware, createComment);
router.put('/comments/put/:commentId', verifyTokenMiddleware, modifyComment);
router.delete('/comments/:commentId', verifyTokenMiddleware, deleteComment);

export default router;