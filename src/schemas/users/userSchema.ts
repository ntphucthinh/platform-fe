import { type ObjectSchema, object, string } from "yup";
import type { IUserFormData } from "@/types/pages/users/user";
import { UserRole, UserStatus } from "@/constants/userConstant";

/**
 * Validation schema for the user form.
 */
export const userSchema: ObjectSchema<IUserFormData> = object().shape({
  name: string().required("Name is required"),
  email: string().required("Email is required").email("Invalid email address"),
  role: string<IUserFormData["role"]>()
    .oneOf(
      [UserRole.Administrator, UserRole.Manager, UserRole.User],
      "Invalid role",
    )
    .required("Role is required"),
  status: string<IUserFormData["status"]>()
    .oneOf(
      [UserStatus.Active, UserStatus.Inactive, UserStatus.Pending],
      "Invalid status",
    )
    .required("Status is required"),
});
