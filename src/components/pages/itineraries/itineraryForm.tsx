import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Alert,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import type {
  ITravelItinerary,
  IItineraryDay,
  IItineraryActivity,
  ItineraryActivityType,
  ICreateItineraryInput,
} from "@/types/pages/itineraries/itinerary";
import {
  ITINERARY_CATEGORY_COLORS,
  MOCK_DALAT_ITINERARY,
} from "@/constants/itineraryConstant";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";
import { ItineraryHero } from "@/components/pages/itineraries/itineraryHero";
import { ItineraryInfoPanel } from "@/components/pages/itineraries/itineraryInfoPanel";
import {
  ItineraryDayTabs,
  type ItineraryTabKey,
} from "@/components/pages/itineraries/itineraryDayTabs";
import { ItineraryOverview } from "@/components/pages/itineraries/itineraryOverview";
import { ItineraryTimeline } from "@/components/pages/itineraries/itineraryTimeline";
import { ItineraryImageGallery } from "@/components/pages/itineraries/itineraryImageGallery";
import { ItineraryTravelTips } from "@/components/pages/itineraries/itineraryTravelTips";

const AVAILABLE_THEMES = [
  "Thiên nhiên",
  "Ẩm thực",
  "Cà phê",
  "Văn hóa địa phương",
  "Biển đảo",
  "Nghỉ dưỡng",
  "Khám phá",
  "Check-in",
  "Lịch sử",
];

const ACTIVITY_CATEGORIES: ItineraryActivityType[] = [
  "Ăn uống",
  "Tham quan",
  "Thiên nhiên",
  "Cà phê",
  "Mua sắm",
  "Nghỉ ngơi",
];

export interface ItineraryFormProps {
  initialData?: ITravelItinerary | null;
  isEdit?: boolean;
  onSubmit: (formData: ICreateItineraryInput) => void;
  onCancel: () => void;
}

export const ItineraryForm: React.FC<ItineraryFormProps> = ({
  initialData,
  isEdit = false,
  onSubmit,
  onCancel,
}) => {
  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [destination, setDestination] = useState(
    initialData?.destination || "",
  );
  const [durationDays, setDurationDays] = useState(
    initialData?.durationDays || initialData?.days?.length || 3,
  );
  const [durationNights, setDurationNights] = useState(
    initialData?.durationNights !== undefined
      ? initialData.durationNights
      : Math.max(0, (initialData?.days?.length || 3) - 1),
  );
  const status = initialData?.status || "Đã hoàn thiện";
  const [suitableFor, setSuitableFor] = useState(
    initialData?.suitableFor || "Cặp đôi, nhóm bạn, gia đình",
  );
  const [themes, setThemes] = useState<string[]>(
    initialData?.themes && initialData.themes.length > 0
      ? initialData.themes
      : ["Thiên nhiên", "Ẩm thực"],
  );
  const [customThemeInput, setCustomThemeInput] = useState("");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage || MOCK_DALAT_ITINERARY.coverImage,
  );
  const [travelTipsText, setTravelTipsText] = useState(
    initialData?.travelTips?.join("\n") ||
      "Thời gian di chuyển có thể thay đổi tùy tình hình giao thông.\nNên chuẩn bị trang phục phù hợp với thời tiết điểm đến.\nLịch trình có thể tùy chỉnh linh hoạt theo nhu cầu thực tế.",
  );

  // Days state
  const [days, setDays] = useState<IItineraryDay[]>(() => {
    if (initialData?.days && initialData.days.length > 0) {
      return initialData.days;
    }
    return [
      {
        id: "day-1",
        dayNumber: 1,
        title: "Ngày 1 – Khám phá điểm đến",
        subtitle: "Làm quen với thành phố và các danh thắng nổi bật.",
        date: "",
        summary:
          "Bắt đầu ngày mới đầy hứng khởi với các hoạt động trải nghiệm đặc sắc.",
        coverImage: MOCK_DALAT_ITINERARY.coverImage,
        activities: [
          {
            id: "act-1-1",
            time: "08:00",
            title: "Ăn sáng đặc sản địa phương",
            type: "Ăn uống",
            duration: "1 giờ",
            location: "Trung tâm thành phố",
            description: "Thưởng thức món ăn sáng nổi tiếng của địa phương.",
            image:
              "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
            notes: "Nên đi sớm để tránh đông khách.",
          },
          {
            id: "act-1-2",
            time: "09:30",
            title: "Tham quan danh lam thắng cảnh",
            type: "Tham quan",
            duration: "2 giờ",
            location: "Điểm tham quan chính",
            description: "Check-in và lưu giữ những bức ảnh đẹp.",
            image:
              "https://images.unsplash.com/photo-1548625361-196144e138a4?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      {
        id: "day-2",
        dayNumber: 2,
        title: "Ngày 2 – Trải nghiệm thiên nhiên và ẩm thực",
        subtitle: "Khám phá cảnh quan thiên nhiên và ẩm thực hấp dẫn.",
        date: "",
        summary: "Tận hưởng không khí trong lành và cảnh đẹp thiên nhiên.",
        coverImage:
          "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
        activities: [
          {
            id: "act-2-1",
            time: "08:30",
            title: "Khám phá cảnh quan thiên nhiên",
            type: "Thiên nhiên",
            duration: "2 giờ",
            location: "Khu du lịch sinh thái",
            description: "Dạo bước giữa thiên nhiên hoang sơ và thư thái.",
            image:
              "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      {
        id: "day-3",
        dayNumber: 3,
        title: "Ngày 3 – Mua sắm đặc sản và kết thúc chuyến đi",
        subtitle: "Mua quà lưu niệm và chuẩn bị khởi hành về.",
        date: "",
        summary: "Thong thả chọn mua quà đặc sản và lưu giữ kỷ niệm đẹp.",
        coverImage:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
        activities: [
          {
            id: "act-3-1",
            time: "09:00",
            title: "Mua quà đặc sản chợ địa phương",
            type: "Mua sắm",
            duration: "1.5 giờ",
            location: "Chợ trung tâm",
            description: "Tìm mua đặc sản thơm ngon làm quà cho người thân.",
            image:
              "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
    ];
  });

  // Errors state
  const [errors, setErrors] = useState<{
    title?: string;
    destination?: string;
  }>({});

  // File Input Ref for Cover Image
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Real-time Preview Dialog State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewActiveTab, setPreviewActiveTab] =
    useState<ItineraryTabKey>("overview");

  // Activity Dialog State
  const [activityModal, setActivityModal] = useState<{
    open: boolean;
    dayIndex: number;
    activityIndex: number | null;
    time: string;
    title: string;
    type: ItineraryActivityType;
    duration: string;
    location: string;
    description: string;
    notes: string;
    image: string;
  }>({
    open: false,
    dayIndex: 0,
    activityIndex: null,
    time: "08:00",
    title: "",
    type: "Tham quan",
    duration: "1 giờ",
    location: "",
    description: "",
    notes: "",
    image: "",
  });
  const activityImageInputRef = useRef<HTMLInputElement>(null);

  // Day Deletion Confirmation Dialog State
  const [dayToDelete, setDayToDelete] = useState<number | null>(null);

  // Handle Cover Image Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Activity Image Upload
  const handleActivityImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setActivityModal((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Theme Toggling
  const handleToggleTheme = (theme: string) => {
    if (themes.includes(theme)) {
      setThemes(themes.filter((t) => t !== theme));
    } else {
      setThemes([...themes, theme]);
    }
  };

  const handleAddCustomTheme = () => {
    const trimmed = customThemeInput.trim();
    if (trimmed && !themes.includes(trimmed)) {
      setThemes([...themes, trimmed]);
      setCustomThemeInput("");
    }
  };

  // Duration changes
  const handleDaysCountChange = (newDays: number) => {
    const clamped = Math.max(1, Math.min(30, newDays));
    setDurationDays(clamped);
    setDurationNights(Math.max(0, clamped - 1));

    // Expand days if count increased
    if (clamped > days.length) {
      const currentLen = days.length;
      const added: IItineraryDay[] = [];
      for (let i = currentLen + 1; i <= clamped; i++) {
        added.push({
          id: `day-${i}-${Date.now()}`,
          dayNumber: i,
          title: `Ngày ${i} – Khám phá tự do`,
          subtitle: "Lịch trình linh hoạt theo kế hoạch cá nhân.",
          date: "",
          summary: "Dành thời gian trải nghiệm theo nhịp độ riêng.",
          coverImage: coverImage || DEFAULT_NO_IMAGE,
          activities: [],
        });
      }
      setDays([...days, ...added]);
    }
  };

  // Add Day manually
  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const newDay: IItineraryDay = {
      id: `day-${nextDayNum}-${Date.now()}`,
      dayNumber: nextDayNum,
      title: `Ngày ${nextDayNum} – Khám phá tự do`,
      subtitle: "Lịch trình linh hoạt theo sở thích cá nhân.",
      date: "",
      summary: "Dành thời gian trải nghiệm thêm các địa điểm mới.",
      coverImage: coverImage || DEFAULT_NO_IMAGE,
      activities: [],
    };
    setDays([...days, newDay]);
    setDurationDays(nextDayNum);
    setDurationNights(Math.max(0, nextDayNum - 1));
  };

  // Delete Day
  const handleConfirmDeleteDay = () => {
    if (dayToDelete === null) return;
    const updated = days
      .filter((_, idx) => idx !== dayToDelete)
      .map((d, idx) => ({
        ...d,
        dayNumber: idx + 1,
      }));
    setDays(updated);
    setDurationDays(updated.length);
    setDurationNights(Math.max(0, updated.length - 1));
    setDayToDelete(null);
  };

  // Update Day Title/Summary
  const handleUpdateDayField = (
    dayIndex: number,
    field: "title" | "summary" | "date",
    val: string,
  ) => {
    setDays((prev) =>
      prev.map((d, idx) => (idx === dayIndex ? { ...d, [field]: val } : d)),
    );
  };

  // Open Activity Modal (Add or Edit)
  const handleOpenAddActivity = (dayIndex: number) => {
    setActivityModal({
      open: true,
      dayIndex,
      activityIndex: null,
      time: "08:00",
      title: "",
      type: "Tham quan",
      duration: "1 giờ",
      location: "",
      description: "",
      notes: "",
      image: "",
    });
  };

  const handleOpenEditActivity = (
    dayIndex: number,
    actIndex: number,
    act: IItineraryActivity,
  ) => {
    setActivityModal({
      open: true,
      dayIndex,
      activityIndex: actIndex,
      time: act.time || "08:00",
      title: act.title || "",
      type: act.type || "Tham quan",
      duration: act.duration || "1 giờ",
      location: act.location || "",
      description: act.description || "",
      notes: act.notes || "",
      image: act.image || "",
    });
  };

  // Save Activity from Modal
  const handleSaveActivity = () => {
    if (!activityModal.title.trim()) return;

    const {
      dayIndex,
      activityIndex,
      time,
      title: actTitle,
      type,
      duration,
      location,
      description: actDesc,
      notes,
      image,
    } = activityModal;

    const newActivity: IItineraryActivity = {
      id:
        activityIndex !== null && days[dayIndex].activities[activityIndex]?.id
          ? days[dayIndex].activities[activityIndex].id
          : `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time: time.trim() || "08:00",
      title: actTitle.trim(),
      type,
      duration: duration.trim() || "1 giờ",
      location: location.trim(),
      description: actDesc.trim(),
      notes: notes.trim(),
      image: image || DEFAULT_NO_IMAGE,
    };

    setDays((prev) =>
      prev.map((d, dIdx) => {
        if (dIdx !== dayIndex) return d;
        const currentActivities = [...d.activities];
        if (activityIndex !== null) {
          currentActivities[activityIndex] = newActivity;
        } else {
          currentActivities.push(newActivity);
        }
        // Chronological sort
        currentActivities.sort((a, b) => a.time.localeCompare(b.time));
        return { ...d, activities: currentActivities };
      }),
    );

    setActivityModal((prev) => ({ ...prev, open: false }));
  };

  // Delete Activity
  const handleDeleteActivity = (dayIndex: number, actIndex: number) => {
    setDays((prev) =>
      prev.map((d, dIdx) => {
        if (dIdx !== dayIndex) return d;
        return {
          ...d,
          activities: d.activities.filter((_, aIdx) => aIdx !== actIndex),
        };
      }),
    );
  };

  // Validation & Submit
  const handleSave = () => {
    const newErrors: { title?: string; destination?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Vui lòng nhập tên lịch trình";
    }
    if (!destination.trim()) {
      newErrors.destination = "Vui lòng nhập địa điểm";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const tips = travelTipsText
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: ICreateItineraryInput = {
      title: title.trim(),
      destination: destination.trim(),
      durationDays,
      durationNights,
      duration: `${durationDays} ngày ${durationNights} đêm`,
      description:
        description.trim() || `Khám phá vẻ đẹp tuyệt vời tại ${destination}.`,
      coverImage: coverImage || DEFAULT_NO_IMAGE,
      status,
      suitableFor,
      themes,
      days,
      travelTips: tips,
      featuredImages: initialData?.featuredImages || [
        {
          id: `img-1`,
          title: title.trim(),
          url: coverImage || DEFAULT_NO_IMAGE,
          caption: destination.trim(),
        },
      ],
      highlights: initialData?.highlights || [
        {
          id: `hl-1`,
          title: destination.trim(),
          subtitle: "Điểm đến hấp dẫn",
          icon: "nature",
        },
      ],
    };

    onSubmit(payload);
  };

  // Temporary Itinerary object for real-time preview
  const livePreviewItinerary: ITravelItinerary = {
    id: initialData?.id || "preview-temp",
    title: title || "Lịch trình chưa đặt tên",
    destination: destination || "Địa điểm chưa xác định",
    duration: `${durationDays} ngày ${durationNights} đêm`,
    durationDays,
    durationNights,
    description:
      description || "Mô tả tổng quan hành trình đang được cập nhật.",
    coverImage: coverImage || DEFAULT_NO_IMAGE,
    status,
    suitableFor,
    themes: themes.length > 0 ? themes : ["Du lịch", "Khám phá"],
    highlights: initialData?.highlights || [
      {
        id: "hl-preview-1",
        title: destination || "Điểm đến nổi bật",
        subtitle: "Trải nghiệm phong phú",
        icon: "nature",
      },
    ],
    days,
    featuredImages: initialData?.featuredImages || [
      {
        id: "img-preview-1",
        title: title || "Hình ảnh",
        url: coverImage || DEFAULT_NO_IMAGE,
        caption: destination,
      },
    ],
    travelTips: travelTipsText
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  const liveTotalActivities = days.reduce(
    (acc, d) => acc + (d.activities?.length || 0),
    0,
  );

  const liveActiveDay = (() => {
    if (previewActiveTab === "overview") return null;
    const match = previewActiveTab.match(/day-(\d+)/);
    if (!match) return null;
    const dayNumber = parseInt(match[1], 10);
    return days.find((d) => d.dayNumber === dayNumber) || null;
  })();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: 1200,
        mx: "auto",
        width: "100%",
        pb: 8,
      }}
    >
      <HeaderTitle>
        {isEdit ? `Chỉnh sửa: ${title || "Lịch trình"}` : "Tạo lịch trình mới"}
      </HeaderTitle>

      {/* Top Action Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="Quay lại">
            <IconButton
              onClick={onCancel}
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#334155",
                width: 40,
                height: 40,
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#0F172A",
                fontSize: { xs: "1.25rem", sm: "1.45rem" },
              }}
            >
              {isEdit ? "Chỉnh sửa lịch trình" : "Tạo lịch trình mới"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
              Thiết lập thông tin chuyến đi và các hoạt động chi tiết theo từng
              ngày.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderColor: "#CBD5E1",
              color: "#334155",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
            }}
          >
            {isEdit ? "Hủy" : "Quay lại"}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
            }}
          >
            Xem trước
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              px: 2.5,
              boxShadow: "none",
            }}
          >
            {isEdit ? "Lưu thay đổi" : "Lưu bản nháp"}
          </Button>
        </Box>
      </Box>

      {/* Demo notice banner */}
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon />}
        sx={{
          borderRadius: "10px",
          bgcolor: "#EFF6FF",
          color: "#1E40AF",
          border: "1px solid #BFDBFE",
        }}
      >
        Dữ liệu được lưu trong phiên làm việc trình duyệt (Demo UI/Mock State).
        Không lưu vào cơ sở dữ liệu thật.
      </Alert>

      {/* FORM SECTION 1: THÔNG TIN CHUNG */}
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
          sx={{ fontWeight: 700, color: "#0F172A", mb: 2.5 }}
        >
          1. Thông tin chung
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Tên lịch trình (Full width) */}
          <TextField
            label="Tên lịch trình *"
            placeholder="Ví dụ: Khám phá Đà Lạt – 3 ngày 2 đêm thơ mộng"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title)
                setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            error={Boolean(errors.title)}
            helperText={errors.title}
            fullWidth
            required
            size="medium"
          />

          {/* Row 2: Địa điểm */}
          <TextField
            label="Địa điểm *"
            placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (errors.destination)
                setErrors((prev) => ({ ...prev, destination: undefined }));
            }}
            error={Boolean(errors.destination)}
            helperText={errors.destination}
            fullWidth
            required
          />

          {/* Row 3: Thời lượng (Số ngày, Số đêm) & Đối tượng phù hợp */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 2fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Số ngày *"
              type="number"
              value={durationDays}
              onChange={(e) => handleDaysCountChange(Number(e.target.value))}
              slotProps={{ htmlInput: { min: 1, max: 30 } }}
              helperText={`${durationDays} ngày`}
            />

            <TextField
              label="Số đêm"
              type="number"
              value={durationNights}
              onChange={(e) =>
                setDurationNights(Math.max(0, Number(e.target.value)))
              }
              slotProps={{ htmlInput: { min: 0, max: 30 } }}
              helperText={`${durationNights} đêm`}
            />

            <TextField
              label="Đối tượng phù hợp"
              placeholder="Ví dụ: Cặp đôi, nhóm bạn, gia đình"
              value={suitableFor}
              onChange={(e) => setSuitableFor(e.target.value)}
            />
          </Box>

          {/* Row 4: Chủ đề */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#334155", mb: 1 }}
            >
              Chủ đề chuyến đi
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
              {AVAILABLE_THEMES.map((theme) => {
                const isSelected = themes.includes(theme);
                return (
                  <Chip
                    key={theme}
                    label={theme}
                    clickable
                    color={isSelected ? "primary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => handleToggleTheme(theme)}
                    sx={{
                      fontWeight: 600,
                      borderRadius: "8px",
                    }}
                  />
                );
              })}
            </Box>

            {/* Custom Theme Add */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                maxWidth: 360,
              }}
            >
              <TextField
                size="small"
                placeholder="Thêm chủ đề khác..."
                value={customThemeInput}
                onChange={(e) => setCustomThemeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomTheme();
                  }
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddCustomTheme}
                sx={{ borderRadius: "8px", textTransform: "none", px: 2 }}
              >
                + Thêm
              </Button>
            </Box>
          </Box>

          {/* Row 5: Mô tả tổng quan */}
          <TextField
            label="Mô tả tổng quan chuyến đi"
            placeholder="Mô tả cảm hứng, không khí, điểm nổi bật của toàn bộ chuyến hành trình..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{
              "& textarea": {
                resize: "vertical",
              },
            }}
          />

          {/* Row 6: Ảnh bìa (Cover Image with Local Preview) */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#334155", mb: 1 }}
            >
              Ảnh bìa lịch trình
            </Typography>

            <Box
              sx={{
                border: "2px dashed #CBD5E1",
                borderRadius: "12px",
                p: 2.5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 2.5,
                bgcolor: "#F8FAFC",
              }}
            >
              {coverImage && (
                <Box
                  component="img"
                  src={coverImage}
                  alt="Ảnh bìa"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = DEFAULT_NO_IMAGE;
                  }}
                  sx={{
                    width: { xs: "100%", sm: 180 },
                    height: 120,
                    borderRadius: "8px",
                    objectFit: "cover",
                    bgcolor: "#E2E8F0",
                  }}
                />
              )}

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", fontWeight: 500 }}
                >
                  Tải lên ảnh bìa đại diện cho toàn bộ lịch trình (JPG, PNG,
                  WebP).
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
                    ref={coverInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleCoverUpload}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadOutlinedIcon />}
                    onClick={() => coverInputRef.current?.click()}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Chọn ảnh từ máy
                  </Button>

                  {coverImage && (
                    <Button
                      variant="text"
                      color="error"
                      startIcon={<DeleteOutlinedIcon />}
                      onClick={() => setCoverImage("")}
                      sx={{ textTransform: "none" }}
                    >
                      Xóa ảnh
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Row 7: Lưu ý cho chuyến đi */}
          <TextField
            label="Lưu ý / Mẹo du lịch (Mỗi dòng một lưu ý)"
            value={travelTipsText}
            onChange={(e) => setTravelTipsText(e.target.value)}
            multiline
            rows={3}
            fullWidth
            helperText="Nhập các mẹo thời tiết, chuẩn bị trang phục, vé vào cổng..."
            sx={{
              "& textarea": {
                resize: "vertical",
              },
            }}
          />
        </Box>
      </Card>

      {/* FORM SECTION 2: LỊCH TRÌNH THEO TỪNG NGÀY */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
              2. Chi tiết lịch trình theo từng ngày ({days.length} ngày)
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Thêm các hoạt động cụ thể, thời gian và địa điểm cho từng ngày.
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
            + Thêm ngày mới
          </Button>
        </Box>

        {/* Days List */}
        {days.map((day, dayIndex) => (
          <Card
            key={day.id || day.dayNumber}
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              overflow: "hidden",
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
                  {day.dayNumber}
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#0F172A",
                    fontSize: "1.05rem",
                  }}
                >
                  Ngày {day.dayNumber}: {day.title}
                </Typography>
                <Chip
                  label={`${day.activities.length} hoạt động`}
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
                  onClick={() => handleOpenAddActivity(dayIndex)}
                  sx={{
                    borderRadius: "6px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  + Thêm hoạt động
                </Button>

                {days.length > 1 && (
                  <Tooltip title="Xóa ngày này">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDayToDelete(dayIndex)}
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

            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Day Inputs: Title, Date, Summary */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <TextField
                  label="Tiêu đề ngày"
                  value={day.title}
                  onChange={(e) =>
                    handleUpdateDayField(dayIndex, "title", e.target.value)
                  }
                  size="small"
                  fullWidth
                />

                <TextField
                  label="Ngày hiển thị (Tùy chọn)"
                  placeholder="Ví dụ: 15/03/2024"
                  value={day.date || ""}
                  onChange={(e) =>
                    handleUpdateDayField(dayIndex, "date", e.target.value)
                  }
                  size="small"
                  fullWidth
                />
              </Box>

              <TextField
                label="Mô tả / Tóm tắt ngày"
                value={day.summary || ""}
                onChange={(e) =>
                  handleUpdateDayField(dayIndex, "summary", e.target.value)
                }
                multiline
                rows={3}
                size="small"
                fullWidth
                sx={{
                  mb: 3,
                  "& textarea": {
                    resize: "vertical",
                  },
                }}
              />

              {/* Day Activities List */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#334155" }}
                >
                  Danh sách hoạt động trong ngày:
                </Typography>

                {day.activities.length === 0 ? (
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
                      Chưa có hoạt động nào cho ngày {day.dayNumber}.
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenAddActivity(dayIndex)}
                      sx={{ borderRadius: "6px", textTransform: "none" }}
                    >
                      Thêm hoạt động đầu tiên
                    </Button>
                  </Box>
                ) : (
                  day.activities.map((act, actIndex) => {
                    const catStyle =
                      ITINERARY_CATEGORY_COLORS[act.type] ||
                      ITINERARY_CATEGORY_COLORS["Tham quan"];
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
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700, color: "#0F172A" }}
                              >
                                {act.title}
                              </Typography>
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
                                  variant="caption"
                                  sx={{
                                    color: "#64748B",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.25,
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
                                  • {act.duration}
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
                                handleOpenEditActivity(dayIndex, actIndex, act)
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
                                handleDeleteActivity(dayIndex, actIndex)
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
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* BOTTOM ACTION BAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          pt: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            borderColor: "#CBD5E1",
            color: "#334155",
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
          }}
        >
          {isEdit ? "Hủy" : "Quay lại"}
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
            px: 3.5,
            boxShadow: "none",
          }}
        >
          {isEdit ? "Lưu thay đổi" : "Lưu bản nháp"}
        </Button>
      </Box>

      {/* ACTIVITY EDIT/ADD DIALOG */}
      <Dialog
        open={activityModal.open}
        onClose={() => setActivityModal((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#0F172A",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          {activityModal.activityIndex !== null
            ? "Chỉnh sửa hoạt động"
            : "Thêm hoạt động mới"}
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
          {/* Time & Title */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Giờ bắt đầu *"
              placeholder="08:00"
              value={activityModal.time}
              onChange={(e) =>
                setActivityModal((prev) => ({ ...prev, time: e.target.value }))
              }
              required
              fullWidth
            />

            <TextField
              label="Tên hoạt động *"
              placeholder="Ví dụ: Ăn sáng tại chợ địa phương"
              value={activityModal.title}
              onChange={(e) =>
                setActivityModal((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              fullWidth
            />
          </Box>

          {/* Category & Duration */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="category-label">Danh mục *</InputLabel>
              <Select
                labelId="category-label"
                value={activityModal.type}
                label="Danh mục *"
                onChange={(e) =>
                  setActivityModal((prev) => ({
                    ...prev,
                    type: e.target.value as ItineraryActivityType,
                  }))
                }
              >
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Thời lượng dự kiến"
              placeholder="Ví dụ: 1 giờ, 1.5 giờ"
              value={activityModal.duration}
              onChange={(e) =>
                setActivityModal((prev) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
              fullWidth
            />
          </Box>

          {/* Location */}
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
                    setActivityModal((prev) => ({ ...prev, image: "" }))
                  }
                  sx={{ textTransform: "none" }}
                >
                  Gỡ ảnh
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() =>
              setActivityModal((prev) => ({ ...prev, open: false }))
            }
            sx={{ textTransform: "none", color: "#64748B" }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveActivity}
            disabled={!activityModal.title.trim()}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              px: 2.5,
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* DAY REMOVE CONFIRMATION DIALOG */}
      <Dialog
        open={dayToDelete !== null}
        onClose={() => setDayToDelete(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "14px" } } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#0F172A",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WarningAmberOutlinedIcon color="error" />
          Xóa ngày lịch trình?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#475569" }}>
            Bạn có chắc chắn muốn xóa Ngày {(dayToDelete ?? 0) + 1}? Tất cả các
            hoạt động bên trong ngày này sẽ bị xóa bỏ.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() => setDayToDelete(null)}
            sx={{ textTransform: "none", color: "#64748B" }}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteDay}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            Xóa ngày
          </Button>
        </DialogActions>
      </Dialog>

      {/* REAL-TIME PREVIEW DIALOG */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullScreen
      >
        <Box
          sx={{
            bgcolor: "#F8FAFC",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Preview Bar */}
          <Box
            sx={{
              bgcolor: "#FFFFFF",
              borderBottom: "1px solid #E2E8F0",
              px: { xs: 2, sm: 4 },
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#0F172A" }}
              >
                Xem trước: {livePreviewItinerary.title}
              </Typography>
              <Chip
                label="Bản xem trước thời gian thực"
                size="small"
                sx={{
                  bgcolor: "#FEF3C7",
                  color: "#92400E",
                  fontWeight: 700,
                  fontSize: "0.74rem",
                  borderRadius: "6px",
                }}
              />
            </Box>

            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={() => setPreviewOpen(false)}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#CBD5E1",
                color: "#334155",
              }}
            >
              Đóng xem trước
            </Button>
          </Box>

          {/* Preview Content Body */}
          <Box
            sx={{
              p: { xs: 2, sm: 4 },
              maxWidth: 1400,
              mx: "auto",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Top Banner & Info Section */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
                gap: 3,
                alignItems: "stretch",
              }}
            >
              <ItineraryHero
                coverImage={livePreviewItinerary.coverImage}
                destination={livePreviewItinerary.destination}
                title={livePreviewItinerary.title}
                duration={livePreviewItinerary.duration}
                description={livePreviewItinerary.description}
              />

              <ItineraryInfoPanel
                duration={livePreviewItinerary.duration}
                destination={livePreviewItinerary.destination}
                suitableFor={
                  livePreviewItinerary.suitableFor || "Mọi đối tượng"
                }
                totalActivities={liveTotalActivities}
                themes={livePreviewItinerary.themes}
              />
            </Box>

            {/* Day Navigation Tabs */}
            <Box sx={{ pt: 1 }}>
              <ItineraryDayTabs
                activeTab={previewActiveTab}
                onSelectTab={setPreviewActiveTab}
                dayCount={livePreviewItinerary.days.length}
              />
            </Box>

            {/* Main Content & Supporting Sidebar */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
                gap: 3,
                alignItems: "start",
              }}
            >
              <Box sx={{ minWidth: 0, width: "100%" }}>
                {previewActiveTab === "overview" ? (
                  <ItineraryOverview
                    itinerary={livePreviewItinerary}
                    onSelectDay={(tabKey) => setPreviewActiveTab(tabKey)}
                  />
                ) : liveActiveDay ? (
                  <ItineraryTimeline day={liveActiveDay} />
                ) : (
                  <Typography sx={{ color: "text.secondary", py: 4 }}>
                    Không có thông tin cho ngày đã chọn.
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  width: "100%",
                }}
              >
                <ItineraryImageGallery
                  images={livePreviewItinerary.featuredImages || []}
                />
                <ItineraryTravelTips
                  tips={livePreviewItinerary.travelTips || []}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
