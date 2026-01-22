import bcrypt from "bcryptjs";
import { userRepository } from "../modules/user/userRepository";
import { createAccessToken, createRefreshToken } from "./tokenService";
import { IUser } from "../modules/user/userModel";

export const authService = {
  signup: async (
    name: string,
    email: string,
    password: string,
    role: "user" | "provider" | "admin"
  ): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }> => {
    const exist = await userRepository.findByEmail(email);
    if (exist) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const accessToken = createAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      id: user._id,
    });

    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  },
};
