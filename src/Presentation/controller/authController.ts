import { NextFunction, Request, Response } from "express";
import { ILoginUseCase } from "../../domain/useCases/ILoginUseCase";
import { ISignupUseCase } from "../../domain/useCases/ISignupUseCase";
import { AppError } from "../../_lib/errors/customError";
import { HttpCode } from "../../_lib/errors/constants-htt-status";
import { Gender, Role } from "../../domain/entities/User";
import { TokenHandler } from "../../_lib/utils/Tokens";
import userModel from "../../infrastructure/repositories/mongodb/models/userModel";
import { MongoAuthRepository } from "../../infrastructure/repositories/mongodb/Mongo-AuthRepository";
import { IFindUserByEmail } from "../../domain/useCases/IFindUserByEmailUsecase";
import { ValidationType } from "../../_lib/errors/validationError";

export class AuthController {
  private tokenHandler = new TokenHandler();
  private mongoauthRepo = new MongoAuthRepository();
  constructor(
    private readonly loginUseCase: ILoginUseCase,
    private readonly signupUseCase: ISignupUseCase,
    private readonly findByEmailCase: IFindUserByEmail
  ) {}
  public login = async (
    req: Request<
      unknown,
      unknown,
      { email: string; password: string; role: Role; gender: Gender }
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationErrors: ValidationType[] = [];

    try {
      const { email, password, role, gender } = req.body;
      if (!email || !password) {
        throw AppError.badRequest("Email and password are required");
      }

      const result = await this.loginUseCase.execute(
        email,
        password,
        gender,
        role
      );
      const user = await this.findByEmailCase.execute(email);

      if (!user) {
        throw AppError.badRequest("User not found");
      }
      const payload = {
        userId: user._id.toString(),
        email: user.email,
      };
      const newAccessToken = this.tokenHandler.generateAccessToken(payload);
      const newRefreshToken = this.tokenHandler.generateRefreshToken(payload);

      // Update the refresh token in the database 
      await this.mongoauthRepo.storeRefreshToken(user._id, newRefreshToken);
      res.status(HttpCode.OK);
      res.json({ result, success: true, message: "Login success" });
    } catch (error) {
      next(error);
    }
  };
  public signup = async (
    req: Request<
      unknown,
      unknown,
      {
        email: string;
        password: string;
        role?: Role;
        gender: Gender;
        username: string;
      }
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password, role, gender, username } = req.body;
      if (!email || !password) {
        throw AppError.badRequest("Email and password are required");
      }
      const roleEnum = role ? Role[role as keyof typeof Role] : Role.user;
      if (!roleEnum) {
        throw AppError.badRequest("Invalid role provided");
      }

      const user = await this.signupUseCase.execute(
        email,
        password,
        roleEnum,
        gender,
        username
      );
      const payload = {
        userId: user._id.toString(),
        email: user.email,
      };
      const newAccessToken = this.tokenHandler.generateAccessToken(payload);
      const newRefreshToken = this.tokenHandler.generateRefreshToken(payload);

      // Update the refresh token in the database or in-memory store
      await this.mongoauthRepo.storeRefreshToken(user._id, newRefreshToken);
      res
        .status(HttpCode.OK)
        .json({ success: true, message: "Signup successful", user: user });
    } catch (error) {
      next(error);
    }
  };
}
