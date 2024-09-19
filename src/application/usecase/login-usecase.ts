import { PasswordHandler } from "./../../_lib/utils/bcrypt";
import {
  ValidationError,
  ValidationType,
} from "../../_lib/errors/validationError";
import { ILoginUseCase } from "../../domain/useCases/ILoginUseCase";
import { AuthRepository } from "../interface/repositories/IAuth";
import { AppError } from "../../_lib/errors/customError";
import { TokenHandler } from "../../_lib/utils/Tokens";

export class LoginUseCase implements ILoginUseCase {
  private tokenHandler = new TokenHandler();
  private passwordHandler = new PasswordHandler();
  constructor(private authRepository: AuthRepository) {}
  async execute(email: string, password: string): Promise<void> {
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
    const existingUser = await this.authRepository.findByEmail(email);
    if (!existingUser) {
      throw AppError.badRequest("User does not exist");
    }
    const match = await this.passwordHandler.comparePassword(
      password,
      existingUser?.email
    );
    if (!match) {
      throw AppError.unauthorized("Invalid password");
    }
    const accessToken = this.tokenHandler.generateAccessToken({
      userId: existingUser._id.toString(),
      email: existingUser.email,
    });
    let refreshtoken: string | null = null;
    if (!existingUser.refreshToken) {
      refreshtoken = this.tokenHandler.generateRefreshToken({
        userId: existingUser._id.toString(),
        email: existingUser.email,
      });
    } else {

      this.authRepository.storeRefreshToken(existingUser._id, refreshtoken);
    }
  }
}
