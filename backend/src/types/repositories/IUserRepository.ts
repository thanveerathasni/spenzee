export interface IUserRepository {
  findByEmail(email: string): Promise<unknown | null>;
}
