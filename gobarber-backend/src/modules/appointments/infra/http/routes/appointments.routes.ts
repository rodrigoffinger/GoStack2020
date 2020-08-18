import { Router } from "express";

import ensureAutenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";
import AppointmentsController from "../controllers/AppointmentsController";

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAutenticated);

appointmentsRouter.post("/", appointmentsController.create);

export default appointmentsRouter;
