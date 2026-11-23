import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import {
  countTotalPhotos,
  formatDateRangeVietnamese,
} from "@/utils/travelMemoryUtils";

export interface LocationPanelMemoriesProps {
  location: ILocationWithDetails;
  isVisited: boolean;
}

export const LocationPanelMemories: React.FC<LocationPanelMemoriesProps> = ({
  location,
  isVisited,
}) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: "#0F172A" }}
        >
          Kỷ niệm tại đây ({location.memories.length})
        </Typography>

        <Button
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 14 }} />}
          onClick={() => navigate("/admin/travel-memories/create")}
          sx={{
            fontSize: "0.75rem",
            textTransform: "none",
            fontWeight: 600,
            color: "#1976D2",
          }}
        >
          Thêm kỷ niệm
        </Button>
      </Box>

      {location.memories.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            p: 2.5,
            textAlign: "center",
            borderRadius: "10px",
            border: "1px dashed #CBD5E1",
            bgcolor: "#F8FAFC",
          }}
        >
          <FlightTakeoffRoundedIcon
            sx={{ fontSize: 32, color: "#94A3B8", mb: 1 }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#64748B", fontWeight: 600, mb: 1 }}
          >
            Chưa có chuyến đi nào được lưu
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#94A3B8", display: "block", mb: 1.5 }}
          >
            {isVisited
              ? "Bạn đã ghé thăm nơi này nhưng chưa nhập kỷ niệm hoặc album ảnh."
              : "Địa điểm này đang nằm trong danh sách muốn đến trong tương lai."}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => navigate("/admin/travel-memories/create")}
            sx={{
              borderRadius: "6px",
              fontSize: "0.8rem",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Tạo kỷ niệm chuyến đi
          </Button>
        </Card>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            ...(location.memories.length > 2 && {
              maxHeight: 280,
              overflowY: "auto",
              pr: 0.5,
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#CBD5E1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#94A3B8",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5E1 transparent",
            }),
          }}
        >
          {location.memories.map((mem) => {
            const photosCount =
              typeof mem.photoCount === "number"
                ? mem.photoCount
                : countTotalPhotos(mem.days);
            const dateText = formatDateRangeVietnamese(
              mem.startDate,
              mem.endDate,
            );

            return (
              <Card
                key={mem.id}
                elevation={0}
                onClick={() => navigate(`/admin/travel-memories/${mem.id}`)}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  bgcolor: "#FFFFFF",
                  display: "flex",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.15s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    borderColor: "#1976D2",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={mem.coverImage || DEFAULT_NO_IMAGE}
                  alt={mem.title}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = DEFAULT_NO_IMAGE;
                    e.currentTarget.style.objectFit = "contain";
                    e.currentTarget.style.padding = "8px";
                    e.currentTarget.style.backgroundColor = "#F8FAFC";
                  }}
                  sx={{
                    width: 90,
                    minHeight: 85,
                    objectFit:
                      !mem.coverImage || mem.coverImage === DEFAULT_NO_IMAGE
                        ? "contain"
                        : "cover",
                    p:
                      !mem.coverImage || mem.coverImage === DEFAULT_NO_IMAGE
                        ? 1
                        : 0,
                    bgcolor: "#F8FAFC",
                    boxSizing: "border-box",
                    flexShrink: 0,
                  }}
                />

                <CardContent
                  sx={{
                    p: 1.5,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    "&:last-child": { pb: 1.5 },
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: "#0F172A",
                        fontSize: "0.9rem",
                        lineHeight: 1.3,
                        mb: 0.5,
                      }}
                    >
                      {mem.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "#64748B",
                        fontSize: "0.75rem",
                      }}
                    >
                      <CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} />
                      {dateText}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#1976D2",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      mt: 1,
                    }}
                  >
                    <PhotoCameraBackOutlinedIcon sx={{ fontSize: 14 }} />
                    {photosCount} ảnh
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
