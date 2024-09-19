import { IuserLoginalready } from "../../domain/useCases/IUserloginalready";
import { DecodedToken } from "../../infrastructure/repositories/mongodb/Mongo-AuthRepository";
import { AuthRepository } from "../interface/repositories/IAuth";

export class IsUserLoginAlready implements IuserLoginalready{
    constructor(private authRepository: AuthRepository) {}
  public async execute(userId:string): Promise<boolean> {
    const user = await this.authRepository.isUserLoggedIn(userId);
    return user;
}
}