import { User, IUser } from "./userModel";

export const userRepository = {
  create: (data: Partial<IUser>) => {
    return User.create(data);
  },

  findByEmail: (email: string) => {
    return User.findOne({ email });
  },

  findById: (id: string) => {
    return User.findById(id);
  },

  updateRefreshToken: (id: string, token: string) => {
    return User.findByIdAndUpdate(id, { refreshToken: token });
  },
  updateByEmail: (email: string, data: Partial<IUser>) => {
  return User.findOneAndUpdate(
    { email },
    { $set: data },
    { new: true }
  );
},

};
