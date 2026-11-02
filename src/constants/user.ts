import { IUserItem } from "@/types/pages/users/user";

export enum UserRole {
  Administrator = "Administrator",
  Manager = "Manager",
  User = "User",
}

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
  Pending = "Pending",
}

export const MOCK_USERS: IUserItem[] = [
  {
    id: 1,
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    role: UserRole.Administrator,
    status: UserStatus.Active,
    createdAt: "2026-09-01",
  },
  {
    id: 2,
    name: "Tran Thi B",
    email: "tranthib@example.com",
    role: UserRole.Manager,
    status: UserStatus.Active,
    createdAt: "2026-09-02",
  },
  {
    id: 3,
    name: "Le Van C",
    email: "levanc@example.com",
    role: UserRole.User,
    status: UserStatus.Inactive,
    createdAt: "2026-09-03",
  },
  {
    id: 4,
    name: "Pham Minh D",
    email: "phamminhd@example.com",
    role: UserRole.User,
    status: UserStatus.Active,
    createdAt: "2026-09-04",
  },
  {
    id: 5,
    name: "Hoang Anh E",
    email: "hoanganhe@example.com",
    role: UserRole.Manager,
    status: UserStatus.Pending,
    createdAt: "2026-09-05",
  },
  {
    id: 6,
    name: "Vu Thi F",
    email: "vuthif@example.com",
    role: UserRole.User,
    status: UserStatus.Active,
    createdAt: "2026-09-06",
  },
  {
    id: 7,
    name: "Dang Van G",
    email: "dangvang@example.com",
    role: UserRole.User,
    status: UserStatus.Inactive,
    createdAt: "2026-09-07",
  },
  {
    id: 8,
    name: "Bui Thi H",
    email: "buithih@example.com",
    role: UserRole.Administrator,
    status: UserStatus.Active,
    createdAt: "2026-09-08",
  },
  {
    id: 9,
    name: "Doan Van I",
    email: "doanvani@example.com",
    role: UserRole.User,
    status: UserStatus.Active,
    createdAt: "2026-09-09",
  },
  {
    id: 10,
    name: "Ngo Thi K",
    email: "ngothik@example.com",
    role: UserRole.Manager,
    status: UserStatus.Active,
    createdAt: "2026-09-10",
  },
];
