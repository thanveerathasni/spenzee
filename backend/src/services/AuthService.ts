import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IAuthService } from "../types/services/IAuthService";
import { IUserRepository } from "../types/repositories/IUserRepository";
   import { UnauthorizedError } from "../utils/errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  async login(email: string, password: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    // Temporary error (will be replaced in Step 4)

if (!user) {
  throw new UnauthorizedError(
    ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS
  );
}

  }
}
