import { Gender, Role } from "../entities/User";

export interface ILoginUseCase {
  execute(
    email: string,
    password: string,
    gender: Gender,
    role: Role
  ): Promise<void>;
}
