import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { setAdminAuthenticated } from "@/utils/auth";
import { loginWithEmail } from "@/services/authService";
import { loginSchema } from "@/schemas/auth/loginSchema";
import type { ILoginFormData } from "@/types/pages/auth/login";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "admin@platform.com",
      password: "password123",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: ILoginFormData) => {
    setErrorMsg(null);
    try {
      const result = await loginWithEmail(data.email, data.password);

      if (!result.success) {
        setErrorMsg(result.message);
        return;
      }

      // Store minimal user profile + JWT token — password never stored.
      setAdminAuthenticated(true, result.user, result.accessToken);
      navigate("/admin/homestay");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setErrorMsg(message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
        py: { xs: 4, sm: 6 },
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: { xs: "calc(100% - 32px)", sm: 420 },
          maxWidth: 420,
          p: { xs: 3.5, sm: 4.5 },
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          bgcolor: "#FFFFFF",
          boxShadow:
            "0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 10px -6px rgba(15, 23, 42, 0.02)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
          }}
        >
          <LockOutlined sx={{ fontSize: 24 }} />
        </Box>

        <Typography
          component="h1"
          sx={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#172033",
            textAlign: "center",
            lineHeight: 1.3,
            mb: 1,
          }}
        >
          Sign In
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: "13.5px",
            color: "#64748B",
            mb: 3.5,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Enter your credentials to access the admin dashboard
        </Typography>

        {errorMsg && (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              mb: 2.5,
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            {errorMsg}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: "14px",
                  height: "48px",
                  "& fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#9CA3AF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: "1.5px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  color: "#64748B",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: "#94A3B8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box>
            <TextField
              required
              fullWidth
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: "14px",
                  height: "48px",
                  "& fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#9CA3AF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: "1.5px",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  color: "#64748B",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#94A3B8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        size="small"
                        sx={{ color: "#94A3B8" }}
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 20 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                {...register("rememberMe")}
                color="primary"
                size="small"
                sx={{
                  color: "#94A3B8",
                  p: 0.5,
                  mr: 0.5,
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  color: "#475569",
                  fontWeight: 500,
                  userSelect: "none",
                }}
              >
                Remember me
              </Typography>
            }
            sx={{ ml: 0, mr: 0, my: -0.5 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              height: "46px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.15)",
              mt: 0.5,
              "&:hover": {
                boxShadow: "0 4px 8px rgba(37, 99, 235, 0.25)",
              },
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
