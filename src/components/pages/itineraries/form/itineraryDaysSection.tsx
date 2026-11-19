import React from "react";
import {
  Card,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import type {
  IItineraryDay,
  IItineraryActivity,
} from "@/types/pages/itineraries/itinerary";
import {
  getActivityCategoryStyle,
  formatMinutesToDuration,
} from "@/utils/itineraryUtils";
import { getItineraryDayTitleError } from "@/schemas/itineraries/itinerarySchema";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface ItineraryDaysSectionProps {
  days: IItineraryDay[];
  safeActiveDayIndex: number;
  setActiveDayIndex: React.Dispatch<React.SetStateAction<number>>;
  currentActiveDay?: IItineraryDay;
  hasDayImage: boolean;
  displayActiveDayTitle: string;
  handleAddDay: () => void;
  handleUpdateDayField: (
    dayIndex: number,
    field: "title" | "summary" | "date" | "dayTipsText" | "coverImage",
    value: string,
  ) => void;
  setDayToDelete: React.Dispatch<React.SetStateAction<number | null>>;
  dayImageInputRef: React.RefObject<HTMLInputElement | null>;
  handleDayImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenAddActivity: (dayIndex: number) => void;
  handleOpenEditActivity: (
    dayIndex: number,
    actIndex: number,
    act: IItineraryActivity,
  ) => void;
  handleDeleteActivity: (dayIndex: number, actIndex: number) => void;
}

export const ItineraryDaysSection: React.FC<ItineraryDaysSectionProps> = ({
  days,
  safeActiveDayIndex,
  setActiveDayIndex,
  currentActiveDay,
  hasDayImage,
  displayActiveDayTitle,
  handleAddDay,
  handleUpdateDayField,
  setDayToDelete,
  dayImageInputRef,
  handleDayImageUpload,
  handleOpenAddActivity,
  handleOpenEditActivity,
  handleDeleteActivity,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        p: { xs: 2.5, sm: 3.5 },
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
            2. Chi tiết lịch trình theo từng ngày
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#64748B",
              mt: 0.25,
              fontWeight: 500,
              fontSize: "0.8rem",
              display: "block",
            }}
          >
            {days.length} ngày {Math.max(0, days.length - 1)} đêm
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddDay}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          Thêm ngày mới
        </Button>
      </Box>

      {/* Day Tabs Strip for Tabbed Wizard Authoring */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          overflowX: "auto",
          pb: 1,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#CBD5E1",
            borderRadius: "3px",
          },
        }}
      >
        {days.map((day, dayIndex) => {
          const isActive = dayIndex === safeActiveDayIndex;
          return (
            <Box
              key={day.id || day.dayNumber}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
                borderRadius: "12px",
                border: "1px solid",
                borderColor: isActive ? "primary.main" : "#E2E8F0",
                bgcolor: isActive ? "#EFF6FF" : "#F8FAFC",
                transition: "all 0.15s ease-in-out",
                overflow: "hidden",
                height: 40,
                boxShadow: isActive
                  ? "0 2px 6px rgba(37, 99, 235, 0.12)"
                  : "none",
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => setActiveDayIndex(dayIndex)}
                sx={{
                  border: "none",
                  bgcolor: "transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  height: "100%",
                  color: isActive ? "primary.main" : "#334155",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  outline: "none",
                  "&:hover": {
                    bgcolor: isActive ? "#EFF6FF" : "#F1F5F9",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: isActive ? "primary.main" : "#CBD5E1",
                    color: "#FFFFFF",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {day.dayNumber}
                </Box>
                <span>Ngày {day.dayNumber}</span>
                <Chip
                  label={day.activities?.length || 0}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    bgcolor: isActive ? "#DBEAFE" : "#E2E8F0",
                    color: isActive ? "primary.dark" : "#64748B",
                    borderRadius: "6px",
                    px: 0.25,
                    pointerEvents: "none",
                  }}
                />
              </Box>

              {days.length > 1 && (
                <Tooltip title="Xóa ngày này">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDayToDelete(dayIndex);
                    }}
                    sx={{
                      mr: 0.75,
                      p: 0.5,
                      color: "#94A3B8",
                      borderRadius: "6px",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        color: "error.main",
                        bgcolor: "#FEE2E2",
                      },
                    }}
                  >
                    <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        })}

        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={handleAddDay}
          sx={{
            flexShrink: 0,
            borderRadius: "12px",
            borderStyle: "dashed",
            borderColor: "#CBD5E1",
            textTransform: "none",
            fontWeight: 600,
            height: 40,
            px: 1.75,
            color: "#475569",
            bgcolor: "#F8FAFC",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "#EFF6FF",
              color: "primary.main",
            },
          }}
        >
          Ngày mới
        </Button>
      </Box>

      {/* Active Day Content (Focused Single-Day Wizard Sub-Panel) */}
      {currentActiveDay ? (
        <Box
          key={currentActiveDay.id || currentActiveDay.dayNumber}
          sx={{
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
            animation: "fadeInDay 0.2s ease-out",
            "@keyframes fadeInDay": {
              from: { opacity: 0, transform: "translateY(4px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Day Header Banner */}
          <Box
            sx={{
              bgcolor: "#F8FAFC",
              p: { xs: 2, sm: 2.5 },
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  bgcolor: "#DBEAFE",
                  color: "#1D4ED8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                }}
              >
                {currentActiveDay.dayNumber}
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#0F172A",
                  fontSize: "1.05rem",
                }}
              >
                {displayActiveDayTitle}
              </Typography>
              <Chip
                label={`${currentActiveDay.activities.length} hoạt động`}
                size="small"
                sx={{
                  bgcolor: "#EFF6FF",
                  color: "#1D4ED8",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenAddActivity(safeActiveDayIndex)}
                sx={{
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Thêm hoạt động
              </Button>

              {days.length > 1 && (
                <Tooltip title="Xóa ngày này">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDayToDelete(safeActiveDayIndex)}
                    sx={{
                      border: "1px solid #FECDD3",
                      bgcolor: "#FFF1F2",
                      "&:hover": { bgcolor: "#FFE4E6" },
                    }}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Day Inputs: Title & Summary */}
            <TextField
              label="Tiêu đề ngày"
              required
              value={currentActiveDay.title}
              onChange={(e) =>
                handleUpdateDayField(
                  safeActiveDayIndex,
                  "title",
                  e.target.value,
                )
              }
              error={Boolean(getItineraryDayTitleError(currentActiveDay.title))}
              helperText={getItineraryDayTitleError(currentActiveDay.title)}
              size="small"
              fullWidth
              sx={{ mb: 2.5 }}
            />

            <TextField
              label="Mô tả / Tóm tắt ngày"
              value={currentActiveDay.summary || ""}
              onChange={(e) =>
                handleUpdateDayField(
                  safeActiveDayIndex,
                  "summary",
                  e.target.value,
                )
              }
              multiline
              rows={2}
              size="small"
              fullWidth
              sx={{
                mb: 2.5,
                "& textarea": {
                  resize: "vertical",
                },
              }}
            />

            <TextField
              label="Lưu ý trong ngày"
              placeholder="Nhập các lưu ý đặc thù riêng cho ngày này (mỗi lưu ý một dòng)..."
              value={
                currentActiveDay.dayTipsText !== undefined
                  ? currentActiveDay.dayTipsText
                  : (currentActiveDay.dayTips || []).join("\n")
              }
              onChange={(e) =>
                handleUpdateDayField(
                  safeActiveDayIndex,
                  "dayTipsText",
                  e.target.value,
                )
              }
              multiline
              rows={3}
              size="small"
              fullWidth
              helperText="Mỗi dòng là một lưu ý riêng cho ngày này (hiển thị ở thẻ Lưu ý trong ngày khi xem trước)"
              sx={{
                mb: 3,
                "& textarea": {
                  resize: "vertical",
                },
              }}
            />

            {/* Day Cover Image */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#475569", mb: 1 }}
              >
                Hình ảnh đại diện cho ngày (Tùy chọn)
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  border: "1px dashed #CBD5E1",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 2,
                  bgcolor: "#F8FAFC",
                }}
              >
                {hasDayImage && (
                  <Box
                    component="img"
                    src={currentActiveDay.coverImage}
                    alt={currentActiveDay.title || "Ảnh ngày"}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = DEFAULT_NO_IMAGE;
                    }}
                    sx={{
                      width: { xs: "100%", sm: 140 },
                      height: 95,
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid #E2E8F0",
                      bgcolor: "#E2E8F0",
                      flexShrink: 0,
                    }}
                  />
                )}

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", fontSize: "0.85rem", mb: 1.5 }}
                  >
                    {hasDayImage
                      ? "Hình ảnh này sẽ đại diện cho ngày trong phần tóm tắt và xem trước lịch trình."
                      : "Chưa có ảnh đại diện cho ngày này. Bạn có thể tải lên ảnh chụp nổi bật nhất trong ngày."}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <input
                      type="file"
                      ref={dayImageInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleDayImageUpload}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloudUploadOutlinedIcon />}
                      onClick={() => dayImageInputRef.current?.click()}
                      sx={{
                        borderRadius: "6px",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      {hasDayImage ? "Đổi ảnh khác" : "Tải ảnh lên"}
                    </Button>

                    {hasDayImage && (
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlinedIcon />}
                        onClick={() =>
                          handleUpdateDayField(
                            safeActiveDayIndex,
                            "coverImage",
                            "",
                          )
                        }
                        sx={{ textTransform: "none" }}
                      >
                        Gỡ ảnh
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Day Activities List */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#334155" }}
              >
                Danh sách hoạt động trong ngày:
              </Typography>

              {currentActiveDay.activities.length === 0 ? (
                <Box
                  sx={{
                    p: 3,
                    border: "1px dashed #CBD5E1",
                    borderRadius: "10px",
                    textAlign: "center",
                    bgcolor: "#F8FAFC",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", mb: 1 }}
                  >
                    Chưa có hoạt động nào cho ngày{" "}
                    {currentActiveDay.dayNumber}.
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenAddActivity(safeActiveDayIndex)}
                    sx={{ borderRadius: "6px", textTransform: "none" }}
                  >
                    Thêm hoạt động đầu tiên
                  </Button>
                </Box>
              ) : (
                currentActiveDay.activities.map((act, actIndex) => {
                  const catStyle = getActivityCategoryStyle(
                    act.category || act.type,
                  );
                  return (
                    <Box
                      key={act.id || actIndex}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        bgcolor: "#FFFFFF",
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor: "#94A3B8",
                          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {/* Time badge */}
                        <Box
                          sx={{
                            px: 1.25,
                            py: 0.6,
                            borderRadius: "8px",
                            bgcolor: "#F1F5F9",
                            color: "#1E293B",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
                          {act.time}
                        </Box>

                        {/* Activity Info */}
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                color: "#0F172A",
                                wordBreak: "break-word",
                              }}
                            >
                              {act.title}
                            </Typography>
                            {act.type && (
                              <Chip
                                label={act.type}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: "0.72rem",
                                    fontWeight: 600,
                                    bgcolor: catStyle.bg,
                                    color: catStyle.text,
                                    border: `1px solid ${catStyle.border}`,
                                }}
                              />
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              mt: 0.5,
                              flexWrap: "wrap",
                            }}
                          >
                            {act.location && (
                              <Typography
                                {...(act.mapUrl
                                  ? {
                                      component: "a",
                                      href: act.mapUrl,
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                    }
                                  : {})}
                                variant="caption"
                                sx={{
                                  color: act.mapUrl
                                    ? "primary.main"
                                    : "#64748B",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.25,
                                  textDecoration: act.mapUrl
                                    ? "underline"
                                    : "none",
                                  "&:hover": act.mapUrl
                                    ? { color: "primary.dark" }
                                    : {},
                                }}
                              >
                                <PlaceOutlinedIcon sx={{ fontSize: 14 }} />
                                {act.location}
                              </Typography>
                            )}
                            {act.duration && (
                              <Typography
                                variant="caption"
                                sx={{ color: "#64748B" }}
                              >
                                •{" "}
                                {formatMinutesToDuration(act.duration) ||
                                  act.duration}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {/* Actions */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Tooltip title="Chỉnh sửa hoạt động">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleOpenEditActivity(
                                safeActiveDayIndex,
                                actIndex,
                                act,
                              )
                            }
                            sx={{ color: "#475569" }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Xóa hoạt động">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteActivity(
                                safeActiveDayIndex,
                                actIndex,
                              )
                            }
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  );
                })
              )}
            </Box>

            {/* Day Wizard Stepper Navigation Footer */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 3.5,
                pt: 2.5,
                borderTop: "1px solid #F1F5F9",
                flexWrap: "wrap",
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<NavigateBeforeIcon />}
                disabled={safeActiveDayIndex === 0}
                onClick={() =>
                  setActiveDayIndex((prev) => Math.max(0, prev - 1))
                }
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Ngày trước
              </Button>

              <Typography
                variant="caption"
                sx={{ color: "#64748B", fontWeight: 600 }}
              >
                Đang xem: Ngày {safeActiveDayIndex + 1} / {days.length} ngày
              </Typography>

              {safeActiveDayIndex < days.length - 1 ? (
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<NavigateNextIcon />}
                  onClick={() =>
                    setActiveDayIndex((prev) =>
                      Math.min(days.length - 1, prev + 1),
                    )
                  }
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                  }}
                >
                  Ngày {safeActiveDayIndex + 2} tiếp theo
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddDay}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Thêm ngày mới
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
            border: "1px dashed #CBD5E1",
            bgcolor: "#F8FAFC",
          }}
        >
          <Typography variant="body1" sx={{ color: "#64748B", mb: 2 }}>
            Chưa có ngày nào trong lịch trình.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDay}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Thêm ngày đầu tiên
          </Button>
        </Box>
      )}
    </Card>
  );
};
