import { UserRole, UserStatus } from "@/constants/userConstant";

export interface IUserFormData {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface IUserItem {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
