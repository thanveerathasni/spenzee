import { IUser } from "../../models/User.model";
import { UserDTO } from "../../shared/dto/user/user.dto";
import { UserMapper } from "../mapper/user/UserMapper";

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export class AuthMapper {
  static toAuthResponse(user: IUser, accessToken: string, refreshToken: string): AuthResponseDTO {
    return {
      accessToken,
      refreshToken,
      user: UserMapper.toDTO(user),
    };
  }
}
