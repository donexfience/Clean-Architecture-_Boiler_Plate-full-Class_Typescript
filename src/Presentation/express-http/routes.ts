import { Request, Response, Router } from "express";
import { AuthRoutes } from "../../infrastructure/routes/authRoutes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Added test route for `/api`
    router.get("/", (req: Request, res: Response) => {
      res.status(200).send({ message: "API is working!" });
    });
    router.use("/auth", AuthRoutes.routes);

    return router;
  }
}
