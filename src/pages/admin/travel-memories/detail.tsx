import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { useCustomOpenNotification } from "@/hooks/common/useCustomOpenNotification";
import { useTravelMemoryDetail } from "@/hooks/travel-memories/useTravelMemoryDetail";
import { useDeleteTravelMemory } from "@/hooks/travel-memories/useDeleteTravelMemory";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import {
  calculateCalendarDuration,
  countTotalPhotos,
  formatDateRangeVietnamese,
} from "@/utils/travelMemoryUtils";
import type { ITravelMemoryPhoto } from "@/types/pages/travel-memories/travelMemory";
import { TravelMemoryPhotoLightbox } from "@/components/pages/travel-memories/travelMemoryPhotoLightbox";
import { TravelMemoryDetailHeader } from "@/components/pages/travel-memories/detail/travelMemoryDetailHeader";
import { TravelMemoryHero } from "@/components/pages/travel-memories/detail/travelMemoryHero";
import { TravelMemoryDayAlbums } from "@/components/pages/travel-memories/detail/travelMemoryDayAlbums";
import { TravelMemoryNotFound } from "@/components/pages/travel-memories/detail/travelMemoryNotFound";

export const TravelMemoryDetailPage: React.FC = () => {
  const { id } = useParams();
  const numericId = id ? Number(id) : null;
  const navigate = useNavigate();

  const {
    data: memory,
    isLoading,
    error,
    refetch,
  } = useTravelMemoryDetail(numericId && !isNaN(numericId) ? numericId : null);

  // Lightbox state
  const [lightboxState, setLightboxState] = useState<{
    open: boolean;
    photos: ITravelMemoryPhoto[];
    currentIndex: number;
    dateLabel?: string;
  }>({
    open: false,
    photos: [],
    currentIndex: 0,
  });

  // Collapse state per day: key = ISO date, value = boolean (true: collapsed, false: expanded)
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>(
    {},
  );

  const { showSuccess, handleShowError } = useCustomOpenNotification();
  const { deleteTravelMemory, isLoading: isDeleting } = useDeleteTravelMemory();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleConfirmDelete = async () => {
    if (!numericId || !memory) return;
    const { success, error: delError, rawError } = await deleteTravelMemory(numericId);
    if (success) {
      showSuccess("Đã xóa chuyến đi thành công.");
      navigate("/admin/travel-memories");
    } else {
      handleShowError(rawError || delError, "Xóa chuyến đi thất bại.");
      setOpenDeleteDialog(false);
    }
  };

  const toggleDayCollapse = (date: string) => {
    setCollapsedDays((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          py: 10,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <HeaderTitle>Chi tiết chuyến đi</HeaderTitle>
        <CircularProgress size={40} color="primary" />
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          Đang tải thông tin chuyến đi...
        </Typography>
      </Box>
    );
  }

  if (error || !memory) {
    return (
      <TravelMemoryNotFound
        error={error}
        onBack={() => navigate("/admin/travel-memories")}
        onRetry={() => refetch()}
      />
    );
  }

  const duration = calculateCalendarDuration(memory.startDate, memory.endDate);
  const totalPhotos = countTotalPhotos(memory.days);
  const dateRangeLabel = formatDateRangeVietnamese(
    memory.startDate,
    memory.endDate,
  );

  const allCollapsed =
    memory.days.length > 0 &&
    memory.days.every((day) => collapsedDays[day.date] === true);

  const toggleAllDays = () => {
    const nextState: Record<string, boolean> = {};
    (memory.days || []).forEach((day) => {
      nextState[day.date] = !allCollapsed;
    });
    setCollapsedDays(nextState);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.5, sm: 2 },
        pb: { xs: 3, sm: 4 },
      }}
    >
      <HeaderTitle>{memory.title}</HeaderTitle>

      {/* Top Navigation & Actions */}
      <TravelMemoryDetailHeader
        onBack={() => navigate("/admin/travel-memories")}
        onEdit={() => navigate(`/admin/travel-memories/${memory.id}/edit`)}
        onDelete={() => setOpenDeleteDialog(true)}
      />

      {/* Hero Banner & Trip Overview */}
      <TravelMemoryHero
        title={memory.title}
        coverImage={memory.coverImage}
        destination={memory.destination}
        durationLabel={duration.label}
        dateRangeLabel={dateRangeLabel}
        totalPhotos={totalPhotos}
        description={memory.description}
      />

      {/* Daily Photo Albums */}
      <TravelMemoryDayAlbums
        days={memory.days}
        collapsedDays={collapsedDays}
        onToggleDayCollapse={toggleDayCollapse}
        onToggleAllDays={toggleAllDays}
        allCollapsed={allCollapsed}
        onPhotoClick={(dayNumber, formattedDate, photos, photoIdx) => {
          setLightboxState({
            open: true,
            photos,
            currentIndex: photoIdx,
            dateLabel: `Ngày ${dayNumber} · ${formattedDate}`,
          });
        }}
      />

      {/* Lightbox Modal */}
      <TravelMemoryPhotoLightbox
        open={lightboxState.open}
        photos={lightboxState.photos}
        currentIndex={lightboxState.currentIndex}
        dateLabel={lightboxState.dateLabel}
        onClose={() => setLightboxState((prev) => ({ ...prev, open: false }))}
        onNavigate={(newIdx) =>
          setLightboxState((prev) => ({ ...prev, currentIndex: newIdx }))
        }
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={openDeleteDialog}
        title="Xóa Kỷ Niệm Chuyến Đi"
        loading={isDeleting}
        message="Bạn có chắc chắn muốn xóa chuyến đi này? Toàn bộ hình ảnh và dữ liệu liên quan của chuyến đi sẽ bị xóa khỏi hệ thống."
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default TravelMemoryDetailPage;
