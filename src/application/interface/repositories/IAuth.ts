import { Response } from "express";
import { User } from "../../../domain/entities/User";
import { Types } from "mongoose";
import { DecodedToken } from "../../../infrastructure/repositories/mongodb/Mongo-AuthRepository";

export abstract class AuthRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(userEntity: User): Promise<User | null>;
  abstract storeRefreshToken(
    userId: Types.ObjectId,
    refreshtoken: string | null
  ): Promise<void>;
  abstract isUserLoggedIn(email:string): Promise<boolean>;
}
