// import { IUser } from "../../../models/User.model";
// import { UserDTO } from "../../dto/user/user.dto";
// import { UserProfileDTO } from "../../dto/user/userProfile.dto";


// export class UserMapper {
//   static toDTO(user: IUser): UserDTO {
//     return {
//       id: user._id.toString(),
//       email: user.email,
//       role: user.role,
//       isVerified: user.isVerified,
//     };
//   }
// static toProfileDTO(user: IUser): UserProfileDTO {
//   return {
//     id: user._id.toString(),
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     profilePicture: user.profilePicture || "",
//     gender: user.gender,
//     dob: user.dob?.toISOString(),
//     occupation: user.occupation,
//     bio: user.bio,

//     address: {
//       street: user.address?.street,
//       city: user.address?.city,
//       state: user.address?.state,
//       pincode: user.address?.pincode,
//     },

//     role: user.role,
//     isVerified: user.isVerified,
//     verificationStatus: user.isVerified ? "verified" : "unverified",
//   };
// }


// }












import { IUser } from "../../../models/User.model";

import { UserDTO } from "../../dto/user/user.dto";

import { UserProfileDTO } from "../../dto/user/userProfile.dto";

export class UserMapper {
  /* ====================================================== */
  /* BASIC DTO */
  /* ====================================================== */

  static toDTO(
    user: IUser,
  ): UserDTO {
    return {
      id: user._id.toString(),

      email: user.email,

      role: user.role,

      isVerified:
        user.isVerified,
    };
  }

  /* ====================================================== */
  /* PROFILE DTO */
  /* ====================================================== */

static toProfileDTO(
  user: IUser,
): UserProfileDTO {
  return {
    id: user._id.toString(),

    name:
      user.name ??
      undefined,

    email: user.email,

    phone:
      user.phone ??
      undefined,

    profilePicture:
      user.profilePicture ??
      "",

    gender:
      user.gender ??
      undefined,

    dob:
      user.dob?.toISOString(),

    occupation:
      user.occupation ??
      undefined,

    bio:
      user.bio ??
      undefined,

    role: user.role,

    isVerified:
      user.isVerified,

    verificationStatus:
      user.isVerified
        ? "verified"
        : "unverified",
  };
}
}
