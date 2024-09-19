import { Types } from "mongoose";
import { Gender, Role, User } from "../../domain/entities/User";
import { ISignupUseCase } from "../../domain/useCases/ISignupUseCase";
import { AuthRepository } from "../interface/repositories/IAuth";
import {
  ValidationError,
  ValidationType,
} from "../../_lib/errors/validationError";
import { AppError } from "../../_lib/errors/customError";
import { PasswordHandler } from "../../_lib/utils/bcrypt";

export class SignupUseCase implements ISignupUseCase {
  private passwordHandler = new PasswordHandler();
  constructor(private authRepository: AuthRepository) {}

  async execute(
    email: string,
    password: string,
    role: Role,
    gender: Gender,
    username: string
  ): Promise<User> {
    const validationErrors: ValidationType[] = [];
    if (!email) {
      console.log("email required");
      validationErrors.push({
        constants: "Email is required",
        fields: ["email"],
      });
    }

    if (!password) {
      validationErrors.push({
        constants: "Password is required",
        fields: ["password"],
      });
    }

    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors);
    }

    // Check if user already exists
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw AppError.badRequest("user exist alread");
    }
    const hashedPassword = await this.passwordHandler.hashPassword(password);
    // Create new user
    const newUser = new User(
      new Types.ObjectId(),
      email,
      hashedPassword,
      true,
      role,
      gender,
      username
    );
    const createdUser = await this.authRepository.create(newUser);
    if (!createdUser) {
      throw AppError.badRequest("user not created");
    }
    return createdUser;
  }
}
