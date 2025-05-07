import {Router} from "express";
import { createEvent, getEventById, getAllEvents, updateEvent, deleteEvent } from "../controllers/eventController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

router.get('/events', verifyTokenMiddleware, getAllEvents);
router.get('/events/:eventId', verifyTokenMiddleware, getEventById);
router.post('/events', verifyTokenMiddleware, createEvent);
router.put('/events/:eventId', verifyTokenMiddleware, updateEvent);
router.delete('/events/:eventId', verifyTokenMiddleware, deleteEvent);

export default router;