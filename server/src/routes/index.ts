import { Router } from 'express';

import { quizRoutes } from './quizRoutes';

export const apiRouter = Router();

apiRouter.use(quizRoutes);
