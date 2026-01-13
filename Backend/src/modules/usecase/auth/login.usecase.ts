
import { UserRepository } from "../../repository/auth/user.repository";
import { comparePassword } from "../../../shared/utils/password";
import { generateAuthToken } from "../../../shared/utils/jwt";
import { Status } from "@prisma/client";

export class LoginUsecase {
  constructor(private userRepo: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user || !user.password) {
      throw new Error("Invalid email or password hello");
    }

    if (user.status === Status.PENDING) {
      throw new Error("Please set your password");
    }

    if(!user.isActive){
      throw new Error("Accoount disabled");
    }

    if (user.status === Status.INACTIVE) {
      throw new Error("Account is inactive");
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password wow" );
    }

    const token = generateAuthToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    // Format user data for frontend
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    // Create name, avoiding duplicates and handling empty values
    let name = firstName;
    if (lastName && lastName !== firstName) {
      name = `${firstName} ${lastName}`;
    }
    name = name.trim() || 'User'; // Fallback to 'User' if both are empty

    const formattedUser = {
      id: user.id,
      name,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      designation: user.designation,
      status: user.status,
      isActive: user.isActive
    };

    return { 
      success: true,
      user: formattedUser, 
      token 
    };
  }
}
