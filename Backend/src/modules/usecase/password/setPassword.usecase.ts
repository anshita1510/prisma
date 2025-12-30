import { UserRepository } from "../../repository/auth/user.repository";
import { verifyToken } from "../../../shared/utils/jwt";
import { hashPassword } from "../../../shared/utils/password";

export class SetPasswordUsecase {
    private repo: UserRepository;

    constructor(repo: UserRepository) {
        this.repo = repo;
    }

    async execute(token: string, password: string) {
        const decoded = verifyToken(token);
        if (!decoded || decoded.type !== 'verification' || !decoded.email) {
            throw new Error('Invalid token type');
        }

        const user = await this.repo.findByEmail(decoded.email);
        if(!user || (user as any).verificationToken !== token || ((user as any).tokenExpiry && (user as any).tokenExpiry < new Date())){
            throw new Error('Invalid or expired token');
        }

        const hashedPassword = await hashPassword(password);
        return this.repo.update(user.id, {
            password: hashedPassword,
            status: 'active',
            verificationToken: null,
            tokenExpiry: null,
        })

    }
}