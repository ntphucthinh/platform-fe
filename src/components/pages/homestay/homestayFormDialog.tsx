import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  IHomestayFormData,
  IHomestayItem,
  IHomestayRoomFormData,
  IRoomFormImageItem,
} from "@/types/pages/homestay/homestay";
import { homestaySchema } from "@/schemas/homestay/homestaySchema";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import {
  MAX_MEDIA_FILE_SIZE_BYTES,
  MAX_MEDIA_FILE_SIZE_MB,
} from "@/constants/homestayConstant";

export interface HomestayFormDialogProps {
  open: boolean;
  initialData?: IHomestayItem | null;
  onClose: () => void;
  onSubmit: (
    data: IHomestayFormData,
    onProgress?: (completed: number, total: number) => void
  ) => Promise<void> | void;
}

interface RoomUIState {
  localId: string;
  dbId?: number;
  name: string;
  description: string;
  priceText: string;
  sortOrder: number;
  isExpanded: boolean;
  imageItems: IRoomFormImageItem[];
}

export const HomestayFormDialog: React.FC<HomestayFormDialogProps> = ({
  open,
  initialData,
  onClose,
  onSubmit: handleExternalSubmit,
}) => {
  const isEdit = Boolean(initialData);

  // File input refs for each room
  const fileInputRefs = useRef<{ [localId: string]: HTMLInputElement | null }>({});

  // Initialize room states
  const [rooms, setRooms] = useState<RoomUIState[]>(() => {
    if (initialData?.rooms && initialData.rooms.length > 0) {
      return initialData.rooms.map((room, rIdx) => ({
        localId: `room-${room.id || rIdx}-${Date.now()}-${rIdx}`,
        dbId: room.id,
        name: room.name || `Room ${rIdx + 1}`,
        description: room.description || "",
        priceText: room.priceText || "",
        sortOrder: room.sortOrder || rIdx + 1,
        isExpanded: rIdx === 0, // expand first room by default
        imageItems: (room.imageRecords || []).map((img, imgIdx) => ({
          id: `img-${img.id || imgIdx}-${Date.now()}-${imgIdx}`,
          imageId: img.id,
          url: img.url || "",
          imagePath: img.imagePath,
          isObjectUrl: false,
          sortOrder: img.sortOrder || imgIdx + 1,
          isCover: Boolean(img.isCover || imgIdx === 0),
        })),
      }));
    }

    // Default create mode: single default room
    return [
      {
        localId: `room-1-${Date.now()}`,
        name: "Room 1",
        description: "",
        priceText: "",
        sortOrder: 1,
        isExpanded: true,
        imageItems: [],
      },
    ];
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<RoomUIState | null>(null);
  const [isSubmittingAsync, setIsSubmittingAsync] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);

  const [draggingRoomId, setDraggingRoomId] = useState<string | null>(null);

  // React Hook Form for shared homestay fields
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IHomestayFormData>({
    resolver: yupResolver(homestaySchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || initialData?.location || "",
      location: initialData?.address || initialData?.location || "",
      description: initialData?.description || "",
      googleMapsUrl: initialData?.googleMapsUrl || initialData?.googleMapLink || "",
      googleMapLink: initialData?.googleMapsUrl || initialData?.googleMapLink || "",
      rooms: [],
    },
  });

  // Sync rooms state to react-hook-form value
  useEffect(() => {
    const formattedRooms: IHomestayRoomFormData[] = rooms.map((r, rIdx) => ({
      id: r.dbId,
      name: r.name,
      description: r.description || null,
      priceText: r.priceText || null,
      sortOrder: r.sortOrder ?? (rIdx + 1),
      images: r.imageItems.map((img) => img.url),
      imageItems: r.imageItems,
    }));
    setValue("rooms", formattedRooms, { shouldValidate: false });
  }, [rooms, setValue]);

  // Revoke object URLs when dialog unmounts
  useEffect(() => {
    return () => {
      rooms.forEach((room) => {
        room.imageItems.forEach((item) => {
          if (item.isObjectUrl && item.url) {
            URL.revokeObjectURL(item.url);
          }
        });
      });
    };
  }, [rooms]);

  // Compute next default room name e.g. "Room 2", "Room 3"
  const getNextRoomName = () => {
    let maxNumber = 0;
    rooms.forEach((r) => {
      const match = r.name.match(/^Room\s+(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });
    return `Room ${Math.max(maxNumber + 1, rooms.length + 1)}`;
  };

  // Add Room
  const handleAddRoom = () => {
    setFormError(null);
    const newRoom: RoomUIState = {
      localId: `room-new-${Date.now()}-${Math.random()}`,
      name: getNextRoomName(),
      description: "",
      priceText: "",
      sortOrder: rooms.length + 1,
      isExpanded: true,
      imageItems: [],
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  // Confirm delete room dialog
  const handleRequestDeleteRoom = (room: RoomUIState) => {
    if (rooms.length <= 1) {
      setFormError("Homestay phải có ít nhất 1 loại phòng. Không thể xóa loại phòng duy nhất.");
      return;
    }
    setFormError(null);
    setRoomToDelete(room);
  };

  const handleConfirmDeleteRoom = () => {
    if (!roomToDelete) return;
    // Revoke object URLs for this room
    roomToDelete.imageItems.forEach((item) => {
      if (item.isObjectUrl && item.url) {
        URL.revokeObjectURL(item.url);
      }
    });

    setRooms((prev) => {
      const filtered = prev.filter((r) => r.localId !== roomToDelete.localId);
      // Re-assign sortOrder
      return filtered.map((r, idx) => ({ ...r, sortOrder: idx + 1 }));
    });
    setRoomToDelete(null);
  };

  // Toggle expand / collapse room panel
  const handleToggleExpand = (localId: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, isExpanded: !r.isExpanded } : r))
    );
  };

  // Move Room Up / Down
  const handleMoveRoom = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === rooms.length - 1) return;

    setRooms((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((r, idx) => ({ ...r, sortOrder: idx + 1 }));
    });
  };

  // Update room text fields
  const handleRoomFieldChange = (
    localId: string,
    field: "name" | "priceText" | "description",
    value: string
  ) => {
    setFormError(null);
    setRooms((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, [field]: value } : r))
    );
  };

  // Process files for a specific room
  const processRoomFiles = (localId: string, files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setFormError(null);

    const room = rooms.find((r) => r.localId === localId);
    if (!room) return;

    const filesArray = Array.from(files);
    if (room.imageItems.length >= 50 || room.imageItems.length + filesArray.length > 50) {
      setFormError(`Loại phòng "${room.name}" chỉ được phép có tối đa 50 hình ảnh/video.`);
      return;
    }

    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/ogg", "video/x-m4v", "video/x-matroska"];
    const validTypes = [...validImageTypes, ...validVideoTypes];

    const newItems: IRoomFormImageItem[] = [];
    let hasTypeError = false;
    let hasSizeError = false;

    filesArray.forEach((file) => {
      const fileTypeLower = file.type.toLowerCase();
      if (!validTypes.includes(fileTypeLower)) {
        hasTypeError = true;
        return;
      }

      if (file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
        hasSizeError = true;
        return;
      }

      const isDuplicate = room.imageItems.some(
        (item) => item.file && item.file.name === file.name && item.file.size === file.size
      );
      if (isDuplicate) return;

      const objectUrl = URL.createObjectURL(file);
      const isFirst = room.imageItems.length === 0 && newItems.length === 0;
      const mediaType: "image" | "video" = fileTypeLower.startsWith("video/") ? "video" : "image";

      newItems.push({
        id: `file-${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        url: objectUrl,
        file,
        isObjectUrl: true,
        sortOrder: room.imageItems.length + newItems.length + 1,
        isCover: isFirst,
        mediaType,
      });
    });

    if (hasTypeError) {
      setFormError("Chỉ chấp nhận hình ảnh (PNG, JPG, WebP) hoặc video (MP4, WebM, MOV, OGG).");
    }
    if (hasSizeError) {
      setFormError(`Mỗi file không được vượt quá ${MAX_MEDIA_FILE_SIZE_MB}MB.`);
    }

    if (newItems.length > 0) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.localId !== localId) return r;
          const updatedImages = [...r.imageItems, ...newItems].map((img, idx) => ({
            ...img,
            sortOrder: idx + 1,
          }));
          return { ...r, imageItems: updatedImages };
        })
      );
    }
  };

  // Handle file select
  const handleFileSelect = (localId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processRoomFiles(localId, files);
    }
    if (fileInputRefs.current[localId]) {
      fileInputRefs.current[localId]!.value = "";
    }
  };

  // Drag and Drop handlers for room dropzone
  const handleDragOver = (localId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmittingAsync) {
      e.dataTransfer.dropEffect = "copy";
      setDraggingRoomId(localId);
    }
  };

  const handleDragLeave = (localId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (draggingRoomId === localId) {
      setDraggingRoomId(null);
    }
  };

  const handleDrop = (localId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingRoomId(null);
    if (isSubmittingAsync) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processRoomFiles(localId, e.dataTransfer.files);
    }
  };

  // Remove individual room image
  const handleRemoveRoomImage = (roomLocalId: string, imageId: string) => {
    setFormError(null);
    setRooms((prev) =>
      prev.map((room) => {
        if (room.localId !== roomLocalId) return room;
        const itemToRemove = room.imageItems.find((img) => img.id === imageId);
        if (itemToRemove?.isObjectUrl) {
          URL.revokeObjectURL(itemToRemove.url);
        }

        const filtered = room.imageItems.filter((img) => img.id !== imageId);
        // If removed image was cover, set first remaining image as cover
        const wasCover = itemToRemove?.isCover;
        const updated = filtered.map((img, idx) => ({
          ...img,
          sortOrder: idx + 1,
          isCover: wasCover && idx === 0 ? true : img.isCover,
        }));
        return { ...room, imageItems: updated };
      })
    );
  };

  // Set image as cover
  const handleSetCover = (roomLocalId: string, imageId: string) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.localId !== roomLocalId) return room;
        const updated = room.imageItems.map((img) => ({
          ...img,
          isCover: img.id === imageId,
        }));
        return { ...room, imageItems: updated };
      })
    );
  };

  // Reorder images within room
  const handleReorderImage = (
    roomLocalId: string,
    imgIndex: number,
    direction: "left" | "right"
  ) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.localId !== roomLocalId) return room;
        if (direction === "left" && imgIndex === 0) return room;
        if (direction === "right" && imgIndex === room.imageItems.length - 1) return room;

        const copy = [...room.imageItems];
        const targetIndex = direction === "left" ? imgIndex - 1 : imgIndex + 1;
        const temp = copy[imgIndex];
        copy[imgIndex] = copy[targetIndex];
        copy[targetIndex] = temp;

        return {
          ...room,
          imageItems: copy.map((item, idx) => ({ ...item, sortOrder: idx + 1 })),
        };
      })
    );
  };

  // Submit handler
  const handleFormSubmit = async (data: IHomestayFormData) => {
    setFormError(null);

    if (rooms.length === 0) {
      setFormError("Vui lòng thêm ít nhất một loại phòng.");
      return;
    }

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (!room.name || !room.name.trim()) {
        setFormError(`Tên loại phòng thứ ${i + 1} không được để trống.`);
        return;
      }
      if (room.imageItems.length > 50) {
        setFormError(`Loại phòng "${room.name}" vượt quá giới hạn 50 hình ảnh.`);
        return;
      }
    }

    const formattedRooms: IHomestayRoomFormData[] = rooms.map((r, rIdx) => ({
      id: r.dbId,
      name: r.name.trim(),
      description: r.description.trim() || null,
      priceText: r.priceText.trim() || null,
      sortOrder: r.sortOrder ?? (rIdx + 1),
      images: r.imageItems.map((img) => img.url),
      imageItems: r.imageItems,
    }));

    const rawMapUrl =
      typeof data.googleMapsUrl === "string" ? data.googleMapsUrl : data.googleMapLink ?? "";
    const mapUrlValue = rawMapUrl.trim() ? rawMapUrl.trim() : null;

    setIsSubmittingAsync(true);
    setUploadProgress(null);

    try {
      await handleExternalSubmit(
        {
          ...data,
          name: data.name.trim(),
          address: (data.address || data.location || "").trim(),
          location: (data.address || data.location || "").trim(),
          description: data.description?.trim() || null,
          googleMapsUrl: mapUrlValue,
          googleMapLink: mapUrlValue,
          rooms: formattedRooms,
        },
        (completed, total) => {
          setUploadProgress({ completed, total });
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu thông tin.";
      setFormError(msg);
    } finally {
      setIsSubmittingAsync(false);
      setUploadProgress(null);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={isSubmittingAsync ? undefined : onClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              p: 1,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
            {isEdit ? "Chỉnh Sửa Homestay" : "Thêm Homestay Mới"}
          </Typography>
          <IconButton
            onClick={onClose}
            disabled={isSubmittingAsync}
            size="small"
            aria-label="close modal"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <DialogContent dividers sx={{ py: 2.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* SECTION A: SHARED HOMESTAY INFORMATION */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#0F172A", mb: 2 }}
                >
                  Thông Tin Chung Homestay
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* 1. Homestay Name */}
                  <TextField
                    required
                    fullWidth
                    label="Tên Homestay"
                    placeholder="Nhập tên homestay (ví dụ: Pine Forest Eco Villa)"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    size="small"
                    disabled={isSubmittingAsync}
                  />

                  {/* 2. Address / Location */}
                  <TextField
                    required
                    fullWidth
                    label="Địa Điểm / Địa Chỉ"
                    placeholder="Nhập địa chỉ hoặc vị trí (ví dụ: Đà Lạt, Lâm Đồng)"
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    size="small"
                    disabled={isSubmittingAsync}
                  />

                  {/* 3. General Description (optional) */}
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Mô Tả Chung Về Homestay (tùy chọn)"
                    placeholder="Giới thiệu tổng quan về homestay..."
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isSubmittingAsync}
                    size="small"
                    sx={{
                      "& textarea": {
                        resize: "vertical",
                      },
                    }}
                  />

                  {/* 4. Google Maps URL (optional) */}
                  <TextField
                    fullWidth
                    label="Link Google Map (tùy chọn)"
                    placeholder="https://maps.google.com/?q=..."
                    {...register("googleMapsUrl")}
                    error={!!errors.googleMapsUrl}
                    helperText={errors.googleMapsUrl?.message ?? "Để trống nếu chưa có"}
                    size="small"
                    disabled={isSubmittingAsync}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* SECTION B: ROOM TYPES (Danh sách loại phòng) */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#0F172A" }}
                    >
                      Danh Sách Loại Phòng
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      Mỗi loại phòng có tên, giá thuê, mô tả và thư viện hình ảnh riêng biệt.
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddRoom}
                    disabled={isSubmittingAsync}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      borderColor: "#BFDBFE",
                    }}
                  >
                    + Thêm loại phòng
                  </Button>
                </Box>

                {/* Rooms List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  {rooms.map((room, index) => {
                    const isOnlyRoom = rooms.length === 1;
                    const isDraggingThis = draggingRoomId === room.localId;

                    return (
                      <Card
                        key={room.localId}
                        elevation={0}
                        sx={{
                          border: "1px solid #CBD5E1",
                          borderRadius: "12px",
                          overflow: "hidden",
                          bgcolor: "#FFFFFF",
                        }}
                      >
                        {/* Room Panel Header */}
                        <CardHeader
                          sx={{
                            bgcolor: "#F8FAFC",
                            py: 1.5,
                            px: 2,
                            borderBottom: room.isExpanded ? "1px solid #E2E8F0" : "none",
                            cursor: "pointer",
                          }}
                          onClick={() => handleToggleExpand(room.localId)}
                          avatar={
                            <MeetingRoomOutlinedIcon
                              sx={{ color: "#2563EB", fontSize: 24 }}
                            />
                          }
                          title={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700, color: "#0F172A" }}
                              >
                                {room.name || `Loại phòng #${index + 1}`}
                              </Typography>
                              {room.priceText && (
                                <Chip
                                  label={room.priceText}
                                  size="small"
                                  sx={{
                                    bgcolor: "#EFF6FF",
                                    color: "#1D4ED8",
                                    fontWeight: 600,
                                    fontSize: "0.72rem",
                                    borderRadius: "6px",
                                  }}
                                />
                              )}
                              <Chip
                                label={`${room.imageItems.length} ảnh`}
                                size="small"
                                sx={{
                                  bgcolor: "#F1F5F9",
                                  color: "#475569",
                                  fontWeight: 600,
                                  fontSize: "0.72rem",
                                  borderRadius: "6px",
                                }}
                              />
                            </Box>
                          }
                          action={
                            <Box
                              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Reorder Up */}
                              <Tooltip title="Di chuyển lên">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={index === 0 || isSubmittingAsync}
                                    onClick={() => handleMoveRoom(index, "up")}
                                  >
                                    <KeyboardArrowUpIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              {/* Reorder Down */}
                              <Tooltip title="Di chuyển xuống">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={
                                      index === rooms.length - 1 || isSubmittingAsync
                                    }
                                    onClick={() => handleMoveRoom(index, "down")}
                                  >
                                    <KeyboardArrowDownIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              {/* Delete Room */}
                              <Tooltip
                                title={
                                  isOnlyRoom
                                    ? "Không thể xóa loại phòng duy nhất"
                                    : "Xóa loại phòng này"
                                }
                              >
                                <span>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    disabled={isOnlyRoom || isSubmittingAsync}
                                    onClick={() => handleRequestDeleteRoom(room)}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              {/* Expand/Collapse Chevron */}
                              <IconButton
                                size="small"
                                onClick={() => handleToggleExpand(room.localId)}
                              >
                                {room.isExpanded ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </Box>
                          }
                        />

                        {/* Room Panel Content */}
                        <Collapse in={room.isExpanded} timeout="auto" unmountOnExit>
                          <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Room Name and Price */}
                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                gap: 2,
                              }}
                            >
                              <TextField
                                required
                                fullWidth
                                label="Tên Loại Phòng"
                                placeholder="Ví dụ: Room 1, Căn Bê Tông, Phòng Giường Đôi"
                                value={room.name}
                                onChange={(e) =>
                                  handleRoomFieldChange(room.localId, "name", e.target.value)
                                }
                                size="small"
                                disabled={isSubmittingAsync}
                              />

                              <TextField
                                fullWidth
                                label="Giá Thuê (dạng chữ tự do)"
                                placeholder="Ví dụ: 430k - 450k / đêm / phòng, 1tr3 / đêm"
                                value={room.priceText}
                                onChange={(e) =>
                                  handleRoomFieldChange(room.localId, "priceText", e.target.value)
                                }
                                size="small"
                                helperText="Lưu chính xác chuỗi văn bản giá thuê"
                                disabled={isSubmittingAsync}
                              />
                            </Box>

                            {/* Room Description */}
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              label="Mô Tả Loại Phòng"
                              placeholder="Chi tiết tiện nghi, số lượng giường, ban công, view..."
                              value={room.description}
                              onChange={(e) =>
                                handleRoomFieldChange(room.localId, "description", e.target.value)
                              }
                              size="small"
                              disabled={isSubmittingAsync}
                              sx={{
                                "& textarea": {
                                  resize: "vertical",
                                },
                              }}
                            />

                            {/* Room Image Gallery */}
                            <Box sx={{ mt: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: 700, color: "#334155" }}
                                >
                                  Hình Ảnh Của Loại Phòng Này
                                </Typography>
                                <Chip
                                  label={`${room.imageItems.length}/50 ảnh`}
                                  size="small"
                                  color={
                                    room.imageItems.length >= 50
                                      ? "warning"
                                      : "default"
                                  }
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.75rem",
                                    borderRadius: "6px",
                                  }}
                                />
                              </Box>

                              {/* Drag & Drop Dropzone */}
                              <Paper
                                elevation={0}
                                onDragOver={(e) => handleDragOver(room.localId, e)}
                                onDragLeave={(e) => handleDragLeave(room.localId, e)}
                                onDrop={(e) => handleDrop(room.localId, e)}
                                onClick={() =>
                                  !isSubmittingAsync &&
                                  room.imageItems.length < 50 &&
                                  fileInputRefs.current[room.localId]?.click()
                                }
                                sx={{
                                  p: 2.5,
                                  textAlign: "center",
                                  borderRadius: "10px",
                                  border: `2px dashed ${
                                    isDraggingThis ? "#2563EB" : "#CBD5E1"
                                  }`,
                                  bgcolor: isDraggingThis
                                    ? "#EFF6FF"
                                    : "#F8FAFC",
                                  cursor:
                                    isSubmittingAsync || room.imageItems.length >= 50
                                      ? "not-allowed"
                                      : "pointer",
                                  transition: "all 0.2s ease-in-out",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 0.6,
                                  mb: 2,
                                  "&:hover": {
                                    borderColor:
                                      isSubmittingAsync || room.imageItems.length >= 50
                                        ? "#CBD5E1"
                                        : "#2563EB",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "50%",
                                    bgcolor: isDraggingThis ? "#DBEAFE" : "#E2E8F0",
                                    color: isDraggingThis ? "#2563EB" : "#64748B",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CloudUploadIcon sx={{ fontSize: 22 }} />
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                    color: isDraggingThis ? "#1D4ED8" : "#334155",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {room.imageItems.length >= 50
                                    ? "Đã đạt giới hạn tối đa 50 hình ảnh cho loại phòng này"
                                    : "Kéo & thả ảnh vào đây hoặc nhấp để chọn tệp"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#64748B" }}
                                >
                                  Hỗ trợ PNG, JPG, JPEG, WebP. Tối đa 50 ảnh/phòng.
                                </Typography>

                                <input
                                  ref={(el) => {
                                    fileInputRefs.current[room.localId] = el;
                                  }}
                                  type="file"
                                  multiple
                                  accept="image/png,image/jpeg,image/webp,image/jpg,video/mp4,video/webm,video/quicktime,video/ogg"
                                  style={{ display: "none" }}
                                  onChange={(e) => handleFileSelect(room.localId, e)}
                                  disabled={
                                    isSubmittingAsync || room.imageItems.length >= 50
                                  }
                                />
                              </Paper>

                              {/* Images Grid */}
                              {room.imageItems.length > 0 && (
                                <Box
                                  sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fill, minmax(110px, 1fr))",
                                    gap: 1.5,
                                    p: 1.5,
                                    bgcolor: "#F8FAFC",
                                    borderRadius: "10px",
                                    border: "1px solid #E2E8F0",
                                    maxHeight: 250,
                                    overflowY: "auto",
                                  }}
                                >
                                  {room.imageItems.map((img, imgIndex) => (
                                    <Paper
                                      key={img.id}
                                      elevation={0}
                                      sx={{
                                        position: "relative",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        border: img.isCover
                                          ? "2px solid #2563EB"
                                          : "1px solid #CBD5E1",
                                        pt: "80%",
                                        bgcolor: "#E2E8F0",
                                        "&:hover .action-bar": {
                                          opacity: 1,
                                        },
                                      }}
                                    >
                                      {img.mediaType === "video" ? (
                                        <Box
                                          component="video"
                                          src={img.url}
                                          muted
                                          autoPlay
                                          loop
                                          playsInline
                                          sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                          }}
                                        />
                                      ) : (
                                        <Box
                                          component="img"
                                          src={img.url}
                                          alt={`Room img ${imgIndex + 1}`}
                                          sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}

                                      {/* Cover Badge */}
                                      {img.isCover && (
                                        <Box
                                          sx={{
                                            position: "absolute",
                                            bottom: 4,
                                            left: 4,
                                            bgcolor: "#2563EB",
                                            color: "#FFF",
                                            fontSize: "0.65rem",
                                            fontWeight: 700,
                                            px: 0.6,
                                            py: 0.2,
                                            borderRadius: "4px",
                                            zIndex: 2,
                                          }}
                                        >
                                          Ảnh bìa
                                        </Box>
                                      )}

                                      {/* Action Overlay */}
                                      <Box
                                        className="action-bar"
                                        sx={{
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bgcolor: "rgba(15, 23, 42, 0.6)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          p: 0.4,
                                          opacity: 0,
                                          transition: "opacity 0.2s",
                                          zIndex: 3,
                                        }}
                                      >
                                        {/* Set as Cover */}
                                        <Tooltip
                                          title={
                                            img.isCover
                                              ? "Đang là ảnh bìa"
                                              : "Đặt làm ảnh bìa"
                                          }
                                        >
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSetCover(room.localId, img.id);
                                            }}
                                            sx={{
                                              color: img.isCover ? "#FBBF24" : "#FFFFFF",
                                              p: 0.3,
                                            }}
                                          >
                                            {img.isCover ? (
                                              <StarIcon sx={{ fontSize: 16 }} />
                                            ) : (
                                              <StarBorderIcon sx={{ fontSize: 16 }} />
                                            )}
                                          </IconButton>
                                        </Tooltip>

                                        {/* Reorder Left/Right */}
                                        <Box sx={{ display: "flex", gap: 0.2 }}>
                                          {imgIndex > 0 && (
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleReorderImage(
                                                  room.localId,
                                                  imgIndex,
                                                  "left"
                                                );
                                              }}
                                              sx={{ color: "#FFF", p: 0.2 }}
                                            >
                                              <ArrowBackIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                          )}

                                          {imgIndex < room.imageItems.length - 1 && (
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleReorderImage(
                                                  room.localId,
                                                  imgIndex,
                                                  "right"
                                                );
                                              }}
                                              sx={{ color: "#FFF", p: 0.2 }}
                                            >
                                              <ArrowForwardIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                          )}
                                        </Box>

                                        {/* Delete Image */}
                                        <Tooltip title="Xóa ảnh này">
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveRoomImage(
                                                room.localId,
                                                img.id
                                              );
                                            }}
                                            sx={{
                                              color: "#EF4444",
                                              p: 0.3,
                                              "&:hover": { color: "#DC2626" },
                                            }}
                                          >
                                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </Paper>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                        </Collapse>
                      </Card>
                    );
                  })}
                </Box>
              </Box>

              {/* Upload Progress Bar */}
              {uploadProgress && uploadProgress.total > 0 && (
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "#EFF6FF",
                    borderRadius: "8px",
                    border: "1px solid #BFDBFE",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#1E40AF", mb: 0.5 }}
                  >
                    Đang tải ảnh lên Supabase Storage... {uploadProgress.completed}/
                    {uploadProgress.total} tệp (
                    {Math.round(
                      (uploadProgress.completed / uploadProgress.total) * 100
                    )}
                    %)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (uploadProgress.completed / uploadProgress.total) * 100
                    }
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              )}

              {/* Error Alert */}
              {formError && (
                <Alert
                  severity="error"
                  sx={{ borderRadius: "8px", fontSize: "0.85rem" }}
                  onClose={() => setFormError(null)}
                >
                  {formError}
                </Alert>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              color="inherit"
              disabled={isSubmittingAsync}
            >
              Hủy Bỏ
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmittingAsync}
              startIcon={
                isSubmittingAsync ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {isSubmittingAsync
                ? uploadProgress && uploadProgress.total > 0
                  ? `Đang tải ảnh (${uploadProgress.completed}/${uploadProgress.total})...`
                  : "Đang lưu..."
                : isEdit
                ? "Cập Nhật Homestay"
                : "Tạo Homestay"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Room Confirmation Modal */}
      <DeleteConfirmDialog
        open={Boolean(roomToDelete)}
        title="Xóa Loại Phòng"
        itemName={roomToDelete?.name}
        loading={false}
        onClose={() => setRoomToDelete(null)}
        onConfirm={handleConfirmDeleteRoom}
      />
    </>
  );
};
