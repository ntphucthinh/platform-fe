import React, { useEffect, useState } from "react";
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
  Link,
  CircularProgress,
} from "@mui/material";
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  LockOutlined,
  EmailOutlined,
  LoginRounded,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation, type Location } from "react-router-dom";
import { useLogin } from "@refinedev/core";
import { isAuthenticated } from "@/utils/auth";
import { loginSchema } from "@/schemas/auth/loginSchema";
import { APP_NAME } from "@/constants/common";
import { LoginIllustration } from "@/components/pages/auth/loginIllustration";
import type { ILoginFormData } from "@/types/pages/auth/login";

interface PlatformBrandLogoProps {
  size?: "medium" | "large";
}

const PlatformBrandLogo: React.FC<PlatformBrandLogoProps> = ({
  size = "medium",
}) => {
  const iconSize = size === "large" ? { xs: 36, sm: 40 } : { xs: 34, sm: 36 };
  const fontSize =
    size === "large"
      ? { xs: "1.45rem", sm: "1.65rem" }
      : { xs: "1.35rem", sm: "1.5rem" };

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        userSelect: "none",
      }}
    >
      <Box
        component="img"
        src="/logo.svg"
        alt={APP_NAME}
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: "8px",
          flexShrink: 0,
          objectFit: "contain",
          boxShadow: "0 4px 10px rgba(25, 118, 210, 0.22)",
        }}
      />
      <Typography
        component="span"
        sx={{
          fontWeight: 800,
          fontSize,
          letterSpacing: "-0.02em",
          color: "text.primary",
          lineHeight: 1.2,
        }}
      >
        {APP_NAME}
      </Typography>
    </Box>
  );
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: login } = useLogin<
    ILoginFormData & { redirectTo?: string }
  >();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // Extract return path if redirected from AdminAuthGuard
  const stateFrom = (
    location.state as { from?: Location | string } | null
  )?.from;
  const redirectPath = stateFrom
    ? typeof stateFrom === "string"
      ? stateFrom
      : `${stateFrom.pathname}${stateFrom.search || ""}${stateFrom.hash || ""}`
    : "/admin/homestay";

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: ILoginFormData) => {
    setErrorMsg(null);
    setForgotPasswordNotice(false);
    try {
      const response = await login({ ...data, redirectTo: redirectPath });
      if (response && !response.success && response.error) {
        setErrorMsg(response.error.message);
        return;
      }
      navigate(redirectPath, { replace: true });
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

  const handleForgotPasswordClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setForgotPasswordNotice(true);
  };

  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #E5F0FD 0%, #F7F9FC 48%, #FFFFFF 100%)",
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
      }}
    >
      {/* Decorative Background Soft Wave SVG */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <path
            d="M 0 0 L 760 0 C 690 220 560 330 580 540 C 598 720 490 830 410 900 L 0 900 Z"
            fill="#E5F0FD"
            fillOpacity="0.65"
          />
          <path
            d="M 0 740 C 320 690 540 820 880 780 C 1150 748 1310 670 1440 700 L 1440 900 L 0 900 Z"
            fill="#E5F0FD"
            fillOpacity="0.55"
          />
        </Box>
      </Box>

      {/* Main Responsive Content Container (1 col on Mobile/Tablet, 2 cols on Desktop md+) */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1160,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.08fr) minmax(380px, 460px)",
          },
          alignItems: "center",
          gap: { xs: 2, sm: 3, md: 5, lg: 7 },
        }}
      >
        {/* Left / Top Zone: Platform Brand + System Administration Illustration */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "space-between",
            gap: { xs: 1.5, sm: 2, md: 3 },
            width: "100%",
          }}
        >
          <Box
            sx={{
              alignSelf: { xs: "center", md: "flex-start" },
              pl: { xs: 0, md: 1 },
            }}
          >
            <PlatformBrandLogo size="large" />
          </Box>

          <LoginIllustration
            sx={{
              my: { xs: 0, md: 1 },
            }}
          />
        </Box>

        {/* Right / Bottom Zone: Login Form Card */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: { xs: 440, md: 460 },
              p: { xs: 2.75, sm: 4, md: 4.5 },
              borderRadius: "14px",
              border: "1px solid #E7ECF2",
              bgcolor: "background.paper",
              boxShadow:
                "0 20px 40px -15px rgba(25, 118, 210, 0.1), 0 4px 14px -4px rgba(23, 32, 51, 0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Card-top Brand Logo (Displayed on Desktop md+, hidden on Mobile where top logo is already centered) */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                mb: 2,
              }}
            >
              <PlatformBrandLogo size="medium" />
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.375rem", sm: "1.5rem", md: "1.6rem" },
                fontWeight: 700,
                color: "text.primary",
                textAlign: "center",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                mb: { xs: 2.5, sm: 3 },
              }}
            >
              Đăng nhập hệ thống
            </Typography>

            {errorMsg && (
              <Alert
                severity="error"
                onClose={() => setErrorMsg(null)}
                sx={{
                  width: "100%",
                  mb: 2.5,
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                {errorMsg}
              </Alert>
            )}

            {forgotPasswordNotice && (
              <Alert
                severity="info"
                onClose={() => setForgotPasswordNotice(false)}
                sx={{
                  width: "100%",
                  mb: 2.5,
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                Vui lòng liên hệ quản trị viên hệ thống để được hỗ trợ đặt lại
                mật khẩu.
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
                gap: 2,
              }}
            >
              <TextField
                required
                fullWidth
                id="email"
                placeholder="Email"
                autoComplete="email"
                autoFocus
                disabled={isSubmitting}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F7F9FC",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    transition:
                      "background-color 0.2s ease, box-shadow 0.2s ease",
                    "& fieldset": {
                      borderColor: "#E7ECF2",
                    },
                    "&:hover fieldset": {
                      borderColor: "#58AAF8",
                    },
                    "&.Mui-focused": {
                      bgcolor: "#FFFFFF",
                      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "text.secondary",
                    opacity: 0.85,
                  },
                }}
                slotProps={{
                  htmlInput: {
                    "aria-label": "Email",
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined
                          sx={{ color: "text.secondary", fontSize: 20 }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                required
                fullWidth
                id="password"
                placeholder="Mật khẩu"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isSubmitting}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F7F9FC",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    transition:
                      "background-color 0.2s ease, box-shadow 0.2s ease",
                    "& fieldset": {
                      borderColor: "#E7ECF2",
                    },
                    "&:hover fieldset": {
                      borderColor: "#58AAF8",
                    },
                    "&.Mui-focused": {
                      bgcolor: "#FFFFFF",
                      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.12)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "text.secondary",
                    opacity: 0.85,
                  },
                }}
                slotProps={{
                  htmlInput: {
                    "aria-label": "Mật khẩu",
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined
                          sx={{ color: "text.secondary", fontSize: 20 }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                          }
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          size="small"
                          disabled={isSubmitting}
                          sx={{
                            color: "text.secondary",
                            "&:hover": {
                              color: "text.primary",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlined sx={{ fontSize: 20 }} />
                          ) : (
                            <VisibilityOutlined sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Remember Me & Forgot Password Row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: -0.25,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("rememberMe")}
                      color="primary"
                      size="small"
                      disabled={isSubmitting}
                      sx={{
                        color: "text.disabled",
                        p: 0.75,
                        mr: 0.25,
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: "text.primary",
                        fontWeight: 500,
                        userSelect: "none",
                      }}
                    >
                      Ghi nhớ đăng nhập
                    </Typography>
                  }
                  sx={{ ml: -0.5, mr: 0 }}
                />

                <Link
                  component="button"
                  type="button"
                  onClick={handleForgotPasswordClick}
                  underline="always"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "primary.main",
                    cursor: "pointer",
                    textUnderlineOffset: "3px",
                    transition: "color 0.15s ease",
                    "&:hover": {
                      color: "primary.dark",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #1976D2",
                      outlineOffset: 2,
                      borderRadius: "4px",
                    },
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </Box>

              {/* Login Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <LoginRounded sx={{ fontSize: 20 }} />
                  )
                }
                sx={{
                  height: "50px",
                  borderRadius: "8px",
                  fontSize: "0.975rem",
                  fontWeight: 600,
                  textTransform: "none",
                  mt: 0.5,
                  bgcolor: "primary.main",
                  boxShadow: "0 6px 16px -4px rgba(25, 118, 210, 0.35)",
                  transition:
                    "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: "0 8px 20px -4px rgba(21, 101, 192, 0.45)",
                  },
                  "&:active": {
                    transform: "translateY(1px)",
                  },
                  "&:focus-visible": {
                    outline: "2px solid #1976D2",
                    outlineOffset: 2,
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#94A3B8",
                    color: "#FFFFFF",
                  },
                }}
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
