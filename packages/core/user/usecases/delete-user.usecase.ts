import type { UserService } from "../user.service.ts";

export class DeleteUserUseCase {
  constructor(private userService: UserService) {}
  execute(userId: string): Promise<void> {
    return this.userService.delete(userId);
  }
}
