import { Router } from 'express';
import { chatWithAi, speechToText } from '../controllers/ai.controller';

const router = Router();

router.post('/chat', chatWithAi);
router.post('/stt', speechToText);

export default router;
