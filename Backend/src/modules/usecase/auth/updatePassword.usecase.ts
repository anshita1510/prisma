import bcrypt from 'bcrypt';
import { UserRepository } from '../../repository/auth/user.repository';

export class UpdatePasswordUsecase{
    constructor(private userRepo: UserRepository){}

    async execute(userId: number, newPassword: string){
        if(!newPassword || newPassword.length<6){
            throw new Error('Password must be at least 6 characters');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.userRepo.updatePassword(userId, hashedPassword);

        console.log("New password: ", newPassword);

        return { message: 'Password updated successfully'};
    }
}