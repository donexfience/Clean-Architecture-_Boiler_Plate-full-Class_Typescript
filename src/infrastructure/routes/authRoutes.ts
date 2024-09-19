import { SignupUseCase } from "./../../application/usecase/signup-usecase";
import { Request, Response, Router } from "express";
import { MongoAuthRepository } from "../repositories/mongodb/Mongo-AuthRepository";
import { LoginUseCase } from "../../application/usecase/login-usecase";
import { AuthController } from "../../Presentation/controller/authController";
import { FindUserByEmail } from "../../application/usecase/find-user-using-email";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const respository = new MongoAuthRepository();
    const loginUseCase = new LoginUseCase(respository);
    const signupUseCase = new SignupUseCase(respository);
    const findbyemailUseCase = new FindUserByEmail(respository);
    const controller = new AuthController(
      loginUseCase,
      signupUseCase,
      findbyemailUseCase
    );
    // Test route to check if `/api/auth` is working
    router.get("/", (req: Request, res: Response) => {
      res.status(200).send({ message: "Auth route is working!" });
    });
    router.post("/login", controller.login);
    router.post("/signup", controller.signup);
    return router;
  }
}
