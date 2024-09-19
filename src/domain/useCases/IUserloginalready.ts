import { DecodedToken } from "../../infrastructure/repositories/mongodb/Mongo-AuthRepository";

export interface IuserLoginalready {
  execute(userId:string): Promise<boolean>;
}
