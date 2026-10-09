import { type ObjectSchema, object, string, boolean } from "yup";
import type { ILoginFormData } from "@/types/pages/auth/login";

/**
 * Validation schema for the login form.
 */
export const loginSchema: ObjectSchema<ILoginFormData> = object().shape({
  email: string()
    .required("Email is required")
    .email("Invalid email address"),
  password: string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: boolean().default(false),
});