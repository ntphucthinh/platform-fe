import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Collapse,
  Snackbar,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { ITravelMemoryPhoto } from "@/types/pages/travel-memories/travelMemory";
import { formatDateVietnamese } from "@/utils/travelMemoryUtils";
import { TravelMemoryPhotoGrid } from "@/components/pages/travel-memories/travelMemoryPhotoGrid";

export interface TravelMemoryDaysSectionProps {
  activeDates: string[];
  photosByDate: Record<string, ITravelMemoryPhoto[]>;
  descriptionsByDate: Record<string, string>;
  setDescriptionsByDate: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  collapsedDays: Record<string, boolean>;
  setCollapsedDays: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  toggleDayCollapse: (date: string) => void;
  dayInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onDayFilesChange: (
    date: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  dragOverDate: string | null;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, date: string) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, date: string) => void;
  selectedPhotoIdsByDate: Record<string, number[]>;
  onTogglePhotoSelect: (date: string, photoId: number) => void;
  onSelectAllPhotos: (date: string) => void;
  onDeleteSelectedPhotos: (date: string) => void;
  onRemovePhoto: (date: string, photoId: number) => void;
  onPhotoClick: (
    dayNumber: number,
    formattedDate: string,
    photos: ITravelMemoryPhoto[],
    photoIdx: number,
  ) => void;

  // Snackbar hoàn tác xóa ảnh (gộp theo hướng 1)
  showUndoSnackbar: boolean;
  undoBuffer: { date: string; photos: ITravelMemoryPhoto[] } | null;
  onCloseUndoSnackbar: () => void;
  onUndoDelete: () => void;
}

export const TravelMemoryDaysSection: React.FC<TravelMemoryDaysSectionProps> = ({
  activeDates,
  photosByDate,
  descriptionsByDate,
  setDescriptionsByDate,
  collapsedDays,
  setCollapsedDays,
  toggleDayCollapse,
  dayInputRefs,
  onDayFilesChange,
  dragOverDate,
  onDragOver,
  onDragLeave,
  onDrop,
  selectedPhotoIdsByDate,
  onTogglePhotoSelect,
  onSelectAllPhotos,
  onDeleteSelectedPhotos,
  onRemovePhoto,
  onPhotoClick,
  showUndoSnackbar,
  undoBuffer,
  onCloseUndoSnackbar,
  onUndoDelete,
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: "14px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
            Hình ảnh theo từng ngày
          </Typography>
          <Chip
            label={`${activeDates.length} ngày`}
            size="small"
            sx={{
              bgcolor: "#EFF6FF",
              color: "primary.main",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Các phần theo ngày được tạo tự động từ ngày khởi hành đến ngày kết
          thúc. Bạn có thể chọn nhiều ảnh độc lập cho từng ngày.
        </Typography>
      </Box>

      {activeDates.length === 0 ? (
        <Box
          sx={{
            p: 4,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "12px",
            bgcolor: "background.default",
            textAlign: "center",
          }}
        >
          <InfoOutlinedIcon
            sx={{ fontSize: 36, color: "text.secondary", mb: 1 }}
          />
          <Typography
            variant="body1"
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            Chưa có danh sách ngày hợp lệ
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            Vui lòng chọn ngày khởi hành và ngày kết thúc ở phía trên để hệ
            thống tự động tạo các mục tải ảnh theo ngày.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {activeDates.map((date, index) => {
            const dayPhotos = photosByDate[date] || [];
            const dayNumber = index + 1;
            const formattedDate = formatDateVietnamese(date);

            const isCollapsed = collapsedDays[date] === true;
            const isDragOver = dragOverDate === date;

            return (
              <Card
                key={date}
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: isDragOver ? "primary.main" : "divider",
                  borderRadius: "12px",
                  bgcolor: isDragOver ? "#EFF6FF" : "background.paper",
                  overflow: "hidden",
                  transition: "border-color 0.15s, background-color 0.15s",
                }}
                onDragOver={(e) => onDragOver(e, date)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, date)}
              >
                {/* Day Header */}
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    bgcolor: isDragOver ? "#DBEAFE" : "action.hover",
                    borderBottom: isCollapsed ? "none" : "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                    transition: "background-color 0.15s",
                  }}
                >
                  {/* Left: number badge + title + count + collapse toggle */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                      userSelect: "none",
                      flex: 1,
                      minWidth: 0,
                      borderRadius: "4px",
                      "&:focus-visible": {
                        outline: "2px solid #1976D2",
                        outlineOffset: 2,
                      },
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={!isCollapsed}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggleDayCollapse(date);
                      }
                    }}
                    onClick={() => toggleDayCollapse(date)}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "4px",
                        bgcolor: "primary.main",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {dayNumber}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#1E293B" }}
                    >
                      Ngày {dayNumber} · {formattedDate}
                    </Typography>
                    <Chip
                      label={`${dayPhotos.length} ảnh`}
                      size="small"
                      sx={{
                        bgcolor: dayPhotos.length > 0 ? "#ECFDF5" : "#E2E8F0",
                        color: dayPhotos.length > 0 ? "#059669" : "#64748B",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        ml: "auto",
                        color: "#64748B",
                        transform: isCollapsed
                          ? "rotate(-90deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s",
                        flexShrink: 0,
                      }}
                      tabIndex={-1}
                    >
                      <KeyboardArrowDownIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Hidden Day File Input */}
                  <input
                    type="file"
                    ref={(el) => {
                      dayInputRefs.current[date] = el;
                    }}
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => onDayFilesChange(date, e)}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddPhotoAlternateOutlinedIcon />}
                    onClick={() => {
                      setCollapsedDays((prev) => ({
                        ...prev,
                        [date]: false,
                      }));
                      dayInputRefs.current[date]?.click();
                    }}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      boxShadow: "none",
                      fontSize: "0.82rem",
                    }}
                  >
                    Chọn hình ảnh
                  </Button>
                </Box>

                {/* Collapsible body */}
                <Collapse in={!isCollapsed} timeout={200}>
                  {/* Day Description Textarea */}
                  <Box sx={{ px: 2, pt: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      maxRows={4}
                      size="small"
                      label={`Ghi chú / Nhật ký Ngày ${dayNumber}`}
                      placeholder="Nhập cảm xúc, trải nghiệm hoặc tóm tắt các hoạt động nổi bật trong ngày..."
                      value={descriptionsByDate[date] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDescriptionsByDate((prev) => ({
                          ...prev,
                          [date]: val,
                        }));
                      }}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      sx={{
                        bgcolor: "#FFFFFF",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                        "& textarea": {
                          resize: "vertical",
                        },
                      }}
                    />
                  </Box>

                  {/* Day Photos Grid */}
                  <CardContent sx={{ p: 2 }}>
                    {dayPhotos.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 1.5,
                          p: 1,
                          borderRadius: "8px",
                          bgcolor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => onSelectAllPhotos(date)}
                            sx={{
                              textTransform: "none",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          >
                            {(selectedPhotoIdsByDate[date]?.length ?? 0) ===
                            dayPhotos.length
                              ? "Bỏ chọn tất cả"
                              : "Chọn tất cả"}
                          </Button>

                          {(selectedPhotoIdsByDate[date]?.length ?? 0) > 0 && (
                            <Chip
                              label={`Đã chọn ${selectedPhotoIdsByDate[date]?.length} ảnh`}
                              size="small"
                              color="primary"
                              sx={{
                                height: 22,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Box>

                        {(selectedPhotoIdsByDate[date]?.length ?? 0) > 0 && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteOutlinedIcon fontSize="small" />}
                            onClick={() => onDeleteSelectedPhotos(date)}
                            sx={{
                              textTransform: "none",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              borderRadius: "6px",
                            }}
                          >
                            Xóa ({selectedPhotoIdsByDate[date]?.length}) ảnh đã
                            chọn
                          </Button>
                        )}
                      </Box>
                    )}

                    <TravelMemoryPhotoGrid
                      photos={dayPhotos}
                      selectedPhotoIds={selectedPhotoIdsByDate[date] || []}
                      onToggleSelectPhoto={(photoId) =>
                        onTogglePhotoSelect(date, photoId)
                      }
                      isDragOver={isDragOver}
                      onPhotoClick={(photoIdx) =>
                        onPhotoClick(
                          dayNumber,
                          formattedDate,
                          dayPhotos,
                          photoIdx,
                        )
                      }
                      onRemovePhoto={(photoId) =>
                        onRemovePhoto(date, photoId)
                      }
                      emptyMessage="Chưa có hình ảnh nào. Nhấp 'Chọn hình ảnh' hoặc kéo thả ảnh vào đây."
                    />
                  </CardContent>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Soft-Delete Undo Notification (Gộp vào DaysSection) */}
      <Snackbar
        open={showUndoSnackbar}
        autoHideDuration={6000}
        onClose={onCloseUndoSnackbar}
        message={`Đã xóa ${undoBuffer?.photos.length || 1} ảnh`}
        action={
          <Button
            color="primary"
            size="small"
            onClick={onUndoDelete}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              color: "#60A5FA",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
            }}
          >
            Hoàn tác
          </Button>
        }
        sx={{
          bottom: { xs: 72, sm: 24 },
          "& .MuiSnackbarContent-root": {
            bgcolor: "#0F172A",
            color: "#F8FAFC",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
          },
        }}
      />
    </Card>
  );
};
