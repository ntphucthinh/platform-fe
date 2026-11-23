import React from "react";
import {
  Card,
  Box,
  Typography,
} from "@mui/material";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";

export interface LocationDetailNotesProps {
  details: ILocationWithDetails;
}

export const LocationDetailNotes: React.FC<LocationDetailNotesProps> = ({
  details,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        p: { xs: 2.5, sm: 3.5 },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#0F172A", mb: 2 }}
      >
        Thông tin điểm đến & Ghi chú
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: "#64748B" }}
          >
            Địa chỉ chi tiết
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#0F172A", fontWeight: 500, mt: 0.25 }}
          >
            {details.address}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: "#64748B" }}
          >
            Tọa độ địa lý (GPS)
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#0F172A", fontFamily: "monospace", mt: 0.25 }}
          >
            Vĩ độ (Latitude): {details.latitude ?? "—"} | Kinh độ (Longitude):{" "}
            {details.longitude ?? "—"}
          </Typography>
        </Box>

        {details.notes && (
          <Box
            sx={{
              p: 2,
              bgcolor: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: "12px",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <NotesOutlinedIcon
              sx={{ color: "#D97706", fontSize: 20, mt: 0.25 }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#92400E", mb: 0.25 }}
              >
                Ghi chú cá nhân / Kinh nghiệm chuyến đi
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#78350F", lineHeight: 1.6 }}
              >
                {details.notes}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};
