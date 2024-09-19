import { IsUserLoginAlready } from "./../../../application/usecase/is-user-logged-in";
import { User } from "../../../domain/entities/User";
import { AuthRepository } from "../../../application/interface/repositories/IAuth";
import userModel from "./models/userModel";
import { Types, ObjectId } from "mongoose";
import { TokenHandler } from "../../../_lib/utils/Tokens";
import { AppError } from "../../../_lib/errors/customError";
export interface DecodedToken {
  exp: any;
  userId: string;
}
export class MongoAuthRepository extends AuthRepository {
  private tokenHandler = new TokenHandler();
  private toEntity(user: any): User {
    return User.fromJson({
      _id: user._id,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
      role: user.role,
    });
  }
  public async storeRefreshToken(
    userId: Types.ObjectId,
    refreshtoken: string
  ): Promise<void> {
    try {
      await userModel.findByIdAndUpdate(
        userId,
        {
          $set: { refreshToken: refreshtoken },
        },
        { new: true }
      );
    } catch (error) {
      throw new Error("could not store refresh token");
    }
  }
  public async findByEmail(email: string): Promise<User | null> {
    const user = await userModel.findOne({ email });
    return user ? this.toEntity(user) : null;
  }
  public async create(userEntity: User): Promise<User | null> {
    const user = new userModel(userEntity);
    await user.save();
    return this.toEntity(user);
  }
  public async isUserLoggedIn(userId: string): Promise<boolean> {
    const user = await userModel.findOne({ _id: userId });
    if (user && user.refreshToken) {
      try {
        const decodedToken = this.tokenHandler.verifyRefreshToken(
          user.refreshToken
        );
        if (
          decodedToken &&
          typeof decodedToken === "object" &&
          "exp" in decodedToken
        ) {
          const token = decodedToken as DecodedToken;
          if (token && token.exp > Date.now() / 1000) {
            return true;
          }
        }
      } catch (error) {
        console.log(error, "already logined");
      }
    }
    return false;
  }
}
