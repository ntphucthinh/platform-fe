import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Button,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import type { ItineraryActivityType } from "@/types/pages/itineraries/itinerary";
import { ITINERARY_ACTIVITY_CATEGORIES } from "@/constants/itinerary";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import type { ActivityModalState } from "@/hooks/itineraries/useItineraryForm";
import { validateItineraryActivity } from "@/schemas/itineraries/itinerarySchema";

export interface ItineraryActivityModalProps {
  activityModal: ActivityModalState;
  setActivityModal: React.Dispatch<React.SetStateAction<ActivityModalState>>;
  handleSaveActivity: () => void;
  activityImageInputRef: React.RefObject<HTMLInputElement | null>;
  handleActivityImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ItineraryActivityModal: React.FC<ItineraryActivityModalProps> = ({
  activityModal,
  setActivityModal,
  handleSaveActivity,
  activityImageInputRef,
  handleActivityImageUpload,
}) => {
  const activityErrors = validateItineraryActivity(activityModal);

  return (
    <Dialog
      open={activityModal.open}
      onClose={() => setActivityModal((prev) => ({ ...prev, open: false }))}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-container": {
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.5, sm: 2 },
          py: {
            xs: "calc(12px + env(safe-area-inset-top, 0px))",
            sm: 2,
          },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            width: { xs: "100%", sm: "auto" },
            maxWidth: { xs: "100%", sm: "sm" },
            m: 0,
            maxHeight: {
              xs: "calc(100dvh - 24px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
              sm: "calc(100dvh - 48px)",
              md: "calc(100vh - 64px)",
            },
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 700, color: "#0F172A" }}
        >
          {activityModal.activityIndex !== null
            ? "Chỉnh sửa hoạt động"
            : "Thêm hoạt động mới"}
        </Typography>
        <IconButton
          size="small"
          onClick={() =>
            setActivityModal((prev) => ({ ...prev, open: false }))
          }
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
      >
        {/* Row 1: Tên hoạt động (Full width) */}
        <TextField
          label="Tên hoạt động"
          placeholder="Ví dụ: Ăn sáng tại chợ địa phương"
          value={activityModal.title}
          onChange={(e) =>
            setActivityModal((prev) => ({ ...prev, title: e.target.value }))
          }
          slotProps={{ htmlInput: { maxLength: 200 } }}
          required
          fullWidth
          error={Boolean(activityErrors.title)}
          helperText={activityErrors.title}
        />

        {/* Row 2: Danh mục hoạt động (Category - không được null) */}
        <FormControl fullWidth required error={Boolean(activityErrors.type)}>
          <InputLabel id="activity-category-select-label">
            Danh mục hoạt động
          </InputLabel>
          <Select
            labelId="activity-category-select-label"
            id="activity-category-select"
            label="Danh mục hoạt động *"
            value={activityModal.type || ITINERARY_ACTIVITY_CATEGORIES[1].label}
            onChange={(e) =>
              setActivityModal((prev) => ({
                ...prev,
                type: e.target.value as ItineraryActivityType,
              }))
            }
          >
            {ITINERARY_ACTIVITY_CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.label}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
          {activityErrors.type && (
            <FormHelperText>{activityErrors.type}</FormHelperText>
          )}
        </FormControl>

        {/* Row 3: Giờ bắt đầu & Thời lượng dự kiến */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TimePicker
            label="Giờ bắt đầu"
            ampm={false}
            format="HH:mm"
            value={
              activityModal.time &&
              dayjs(activityModal.time, "HH:mm").isValid()
                ? dayjs(activityModal.time, "HH:mm")
                : null
            }
            onChange={(newValue) => {
              setActivityModal((prev) => ({
                ...prev,
                time:
                  newValue && newValue.isValid()
                    ? newValue.format("HH:mm")
                    : "",
              }));
            }}
            slotProps={{
              actionBar: {
                actions: ["clear", "accept"],
              },
              textField: {
                required: true,
                fullWidth: true,
                error: Boolean(activityErrors.time),
                helperText: activityErrors.time,
              },
            }}
          />

          <TextField
            label="Thời lượng dự kiến (phút)"
            placeholder="Ví dụ: 60, 70"
            value={activityModal.duration}
            onChange={(e) => {
              const numericOnly = e.target.value.replace(/\D/g, "");
              setActivityModal((prev) => ({
                ...prev,
                duration: numericOnly,
              }));
            }}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">phút</InputAdornment>
                ),
              },
            }}
            fullWidth
          />
        </Box>

        {/* Row 3: Địa điểm cụ thể */}
        <TextField
          label="Địa điểm cụ thể"
          placeholder="Ví dụ: Nhà thờ Con Gà, đường Trần Phú"
          value={activityModal.location}
          onChange={(e) =>
            setActivityModal((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
          fullWidth
        />

        {/* Row 4: Link Google Maps (Không bắt buộc) */}
        <TextField
          label="Link Google Maps (Không bắt buộc)"
          placeholder="Ví dụ: https://maps.app.goo.gl/... hoặc https://google.com/maps/..."
          value={activityModal.mapUrl}
          onChange={(e) =>
            setActivityModal((prev) => ({
              ...prev,
              mapUrl: e.target.value,
            }))
          }
          error={Boolean(activityErrors.mapUrl)}
          helperText={activityErrors.mapUrl}
          fullWidth
        />

        {/* Description */}
        <TextField
          label="Mô tả chi tiết"
          placeholder="Nội dung trải nghiệm hoặc hoạt động nổi bật..."
          value={activityModal.description}
          onChange={(e) =>
            setActivityModal((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          multiline
          rows={3}
          fullWidth
          sx={{
            "& textarea": {
              resize: "vertical",
            },
          }}
        />

        {/* Notes */}
        <TextField
          label="Ghi chú / Mẹo nhỏ"
          placeholder="Ví dụ: Nên mang theo mũ nón, đến sớm để chụp ảnh đẹp..."
          value={activityModal.notes}
          onChange={(e) =>
            setActivityModal((prev) => ({ ...prev, notes: e.target.value }))
          }
          multiline
          rows={3}
          fullWidth
          sx={{
            "& textarea": {
              resize: "vertical",
            },
          }}
        />

        {/* Activity Image */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "#475569",
              mb: 1,
              display: "block",
            }}
          >
            Ảnh minh họa hoạt động (Tùy chọn)
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {activityModal.image && (
              <Box
                component="img"
                src={activityModal.image}
                alt="Ảnh hoạt động"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = DEFAULT_NO_IMAGE;
                }}
                sx={{
                  width: 64,
                  height: 52,
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            )}
            <input
              type="file"
              ref={activityImageInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleActivityImageUpload}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudUploadOutlinedIcon />}
              onClick={() => activityImageInputRef.current?.click()}
              sx={{ borderRadius: "6px", textTransform: "none" }}
            >
              Tải ảnh lên
            </Button>
            {activityModal.image && (
              <Button
                size="small"
                color="error"
                onClick={() =>
                  setActivityModal((prev) => ({
                    ...prev,
                    image: "",
                    imageFile: null,
                    imagePath: null,
                  }))
                }
                sx={{ textTransform: "none" }}
              >
                Gỡ ảnh
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          onClick={() =>
            setActivityModal((prev) => ({ ...prev, open: false }))
          }
          fullWidth
          sx={{
            textTransform: "none",
            color: "#64748B",
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveActivity}
          disabled={Boolean(
            activityErrors.title ||
              activityErrors.time ||
              activityErrors.type ||
              activityErrors.mapUrl,
          )}
          fullWidth
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            px: 2.5,
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};
