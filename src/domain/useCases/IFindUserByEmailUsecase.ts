import { User } from "../entities/User";

export interface IFindUserByEmail {
  execute(email: string): Promise<User | null>;
}
