import { UserRepository } from "../../repository/auth/user.repository";
import { comparePassword } from '../../../shared/utils/password';
import { generateAuthToken } from '../../../shared/utils/jwt';

export class LoginUsecase {
  private userRepo: UserRepository;


  constructor(repo: UserRepository) {
    this.userRepo= repo;
  }

  async execute(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
            throw new Error('Invalid credentials or account not active');

    }
    const token = await generateAuthToken((user as any));
    console.log('user, token --', user, token );
    
    return { user, token };
  }
}