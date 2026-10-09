import React from "react";
import { Box, Card, TextField, MenuItem, Button, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "@/schemas/users/userSchema";
import { UserRole, UserStatus } from "@/constants/userConstant";
import type { IUserFormData } from "@/types/pages/users/user";

export interface UserFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<IUserFormData>;
  onSubmit?: (data: IUserFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const ROLE_OPTIONS: IUserFormData["role"][] = [
  UserRole.Administrator,
  UserRole.Manager,
  UserRole.User,
];

const STATUS_OPTIONS: IUserFormData["status"][] = [
  UserStatus.Active,
  UserStatus.Inactive,
  UserStatus.Pending,
];

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      role: defaultValues?.role || UserRole.User,
      status: defaultValues?.status || UserStatus.Active,
    },
  });

  const handleFormSubmit = (data: IUserFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log(`${mode.toUpperCase()} user form submitted:`, data);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        bgcolor: "#FFFFFF",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        maxWidth: 720,
        width: "100%",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              id="name"
              label="Full Name"
              placeholder="e.g. Nguyen Van A"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              slotProps={{
                input: {
                  sx: { borderRadius: "8px", fontSize: "14px" },
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              placeholder="e.g. user@example.com"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{
                input: {
                  sx: { borderRadius: "8px", fontSize: "14px" },
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              required
              fullWidth
              id="role"
              label="Role"
              defaultValue={defaultValues?.role || UserRole.User}
              {...register("role")}
              error={!!errors.role}
              helperText={errors.role?.message}
              slotProps={{
                input: {
                  sx: { borderRadius: "8px", fontSize: "14px" },
                },
              }}
            >
              {ROLE_OPTIONS.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              required
              fullWidth
              id="status"
              label="Status"
              defaultValue={defaultValues?.status || UserStatus.Active}
              {...register("status")}
              error={!!errors.status}
              helperText={errors.status?.message}
              slotProps={{
                input: {
                  sx: { borderRadius: "8px", fontSize: "14px" },
                },
              }}
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            pt: 1,
            borderTop: "1px solid #F1F5F9",
          }}
        >
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isSubmitting}
              sx={{
                borderRadius: "8px",
                px: 2.5,
                color: "#475569",
                borderColor: "#CBD5E1",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#94A3B8",
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              borderRadius: "8px",
              px: 3,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.15)",
            }}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create User"
              : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};
