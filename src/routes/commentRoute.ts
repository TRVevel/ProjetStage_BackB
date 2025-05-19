import { Router } from "express";
import { getAllCommentByUser, getCommentById, createComment } from "../controllers/commentController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { isAdmin } from "../middlewares/verifyIsAdmin";

const router = Router();

router.get('/comments', getAllCommentByUser);
router.get('/comments/:commentId', getCommentById);
router.post('/comments', verifyTokenMiddleware, createComment);

export default router;