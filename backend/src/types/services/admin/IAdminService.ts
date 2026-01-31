export interface IAdminService {
  getDashboard(): Promise<{
    status: string;
    message: string;
  }>;
}
