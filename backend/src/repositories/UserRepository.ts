import { injectable } from "inversify";
import { IUserRepository } from "../types/repositories/IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<unknown | null> {
    // Temporary stub – real DB logic later
    return null;
  }
}
