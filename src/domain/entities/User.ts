import { Types } from "mongoose";
import {
  ValidationError,
  ValidationType,
} from "../../_lib/errors/validationError";

export enum Role {
  admin = "admin",
  user = "user",
}
export enum Gender {
  male = "male",
  female = "female",
}
export class User {
  constructor(
    public _id: Types.ObjectId,
    public email: string,
    public password: string,
    public isActive: boolean = true,
    public role: Role = Role.user,
    public gender: Gender,
    public username: string,
    public refreshToken?: string
  ) {}

  // Static method to create a User from a JSON object
  public static fromJson(obj: Record<string, unknown>): User {
    const {
      _id,
      email,
      password,
      isActive = true,
      role = "user",
      username,
      gender,
    } = obj;

    const validationErrors: ValidationType[] = [];

    if (!_id) {
      validationErrors.push({
        constants: "ID is required",
        fields: ["_id"],
      });
    }

    if (!email) {
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

    // If validation errors exist, throw the ValidationError
    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors);
    }

    return new User(
      _id as Types.ObjectId,
      email as string,
      password as string,
      isActive as boolean,
      role as Role,
      gender as Gender,
      username as string
    );
  }
}
