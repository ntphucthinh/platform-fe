import React from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { LocationStatus } from "@/constants/travelMap";
import type { ILocationFormData } from "@/types/pages/travel-map/travelMap";

export interface LocationFormCoordinatesProps {
  formData: ILocationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ILocationFormData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const LocationFormCoordinates: React.FC<
  LocationFormCoordinatesProps
> = ({ formData, setFormData, errors, setErrors }) => {
  return (
    <>
      {/* VĨ ĐỘ & KINH ĐỘ (READ-ONLY, tự động theo vị trí chọn từ bản đồ) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        <TextField
          label="Vĩ độ (Latitude)"
          value={
            formData.latitude !== "" && formData.latitude !== null
              ? formData.latitude
              : "—"
          }
          fullWidth
          size="small"
          error={Boolean(errors.coordinates)}
          helperText={errors.coordinates}
          slotProps={{
            input: {
              readOnly: true,
              sx: {
                bgcolor: "#F8FAFC",
                cursor: "default",
                "& input": { cursor: "default" },
              },
            },
          }}
        />
        <TextField
          label="Kinh độ (Longitude)"
          value={
            formData.longitude !== "" && formData.longitude !== null
              ? formData.longitude
              : "—"
          }
          fullWidth
          size="small"
          error={Boolean(errors.coordinates)}
          helperText={errors.coordinates}
          slotProps={{
            input: {
              readOnly: true,
              sx: {
                bgcolor: "#F8FAFC",
                cursor: "default",
                "& input": { cursor: "default" },
              },
            },
          }}
        />
      </Box>

      {/* Trạng thái (1 hàng riêng, mặc định null khi tạo mới, không chọn sẵn) */}
      <TextField
        select
        fullWidth
        size="small"
        label="Trạng thái *"
        value={formData.status || ""}
        error={Boolean(errors.status)}
        helperText={errors.status}
        onChange={(e) => {
          const val = e.target.value as LocationStatus;
          setFormData((prev) => ({
            ...prev,
            status: val || null,
          }));
          if (errors.status) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.status;
              return next;
            });
          }
        }}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          select: {
            displayEmpty: true,
            renderValue: (selected) => {
              if (!selected) {
                return (
                  <Typography
                    component="span"
                    sx={{ color: "#94A3B8", fontSize: "14px" }}
                  >
                    -- Chọn trạng thái --
                  </Typography>
                );
              }
              return selected === LocationStatus.Visited
                ? "Đã ghé thăm (Visited)"
                : "Muốn đến (Wishlist)";
            },
          },
        }}
      >
        <MenuItem value="" disabled sx={{ color: "#94A3B8" }}>
          <em>-- Chọn trạng thái --</em>
        </MenuItem>
        <MenuItem value={LocationStatus.Visited}>
          Đã ghé thăm (Visited)
        </MenuItem>
        <MenuItem value={LocationStatus.Wishlist}>
          Muốn đến (Wishlist)
        </MenuItem>
      </TextField>

      {/* Đường dẫn Google Maps (1 hàng riêng, tùy chọn) */}
      <TextField
        label="Đường dẫn Google Maps (Tùy chọn)"
        placeholder="https://www.google.com/maps?q=..."
        value={formData.googleMapsUrl || ""}
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            googleMapsUrl: e.target.value,
          }));
          if (errors.googleMapsUrl)
            setErrors((prev) => ({ ...prev, googleMapsUrl: "" }));
        }}
        error={Boolean(errors.googleMapsUrl)}
        helperText={errors.googleMapsUrl}
        fullWidth
        size="small"
        slotProps={{
          input: {
            endAdornment: formData.googleMapsUrl ? (
              <InputAdornment position="end">
                <Tooltip title="Mở xem trên Google Maps (tab mới)">
                  <IconButton
                    size="small"
                    edge="end"
                    onClick={() => {
                      try {
                        window.open(
                          formData.googleMapsUrl,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      } catch {
                        // silent
                      }
                    }}
                    sx={{ color: "#1976D2" }}
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
    </>
  );
};
