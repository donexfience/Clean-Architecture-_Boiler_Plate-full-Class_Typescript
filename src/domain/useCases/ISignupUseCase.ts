import { Gender, Role, User } from "../entities/User";

export interface ISignupUseCase {
  execute(
    email: string,
    password: string,
    role: Role,
    gender: Gender,
    usename: string
  ): Promise<User>;
}
