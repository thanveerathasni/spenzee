export interface IAdminService {
  getDashboard(adminId: string): Promise<unknown>;
}
