import { Router } from 'express';

import ensureAutenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

const providersRouter = Router();
const providersController = new ProvidersController();

providersRouter.use(ensureAutenticated);

providersRouter.get('/', providersController.index);

export default providersRouter;
