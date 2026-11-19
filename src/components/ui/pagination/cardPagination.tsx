import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export interface CardPaginationProps {
  page: number;
  totalItems: number;
  perPage?: number;
  itemLabel?: string;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
  mode?: "full" | "mobile-only";
  showDots?: boolean;
  showResultCount?: boolean;
}

export interface CardPaginationHeaderProps {
  page: number;
  totalItems: number;
  perPage?: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

/**
 * Thanh điều hướng trang thu nhỏ đặt ở Header danh sách (chỉ hiển thị trên Desktop md+)
 */
export const CardPaginationHeader: React.FC<CardPaginationHeaderProps> = ({
  page,
  totalItems,
  perPage = 10,
  onPageChange,
  isLoading = false,
}) => {
  const totalGroups = Math.max(1, Math.ceil(totalItems / perPage));

  if (totalGroups <= 1) return null;

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        alignItems: "center",
        gap: 1,
      }}
    >
      <IconButton
        size="small"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isLoading}
        aria-label="Trang trước"
        sx={{
          border: "1px solid",
          borderColor: page <= 1 || isLoading ? "#E2E8F0" : "#CBD5E1",
          bgcolor: "#FFFFFF",
          borderRadius: "8px",
          width: 36,
          height: 36,
          color: page <= 1 || isLoading ? "action.disabled" : "text.primary",
          transition: "all 0.15s ease-in-out",
          "&:hover": {
            bgcolor: "#F8FAFC",
            borderColor: "primary.main",
            color: "primary.main",
          },
          "&.Mui-disabled": {
            borderColor: "#E2E8F0",
            bgcolor: "#F8FAFC",
          },
        }}
      >
        <ChevronLeftRoundedIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 600,
          fontSize: "0.85rem",
          userSelect: "none",
          whiteSpace: "nowrap",
          px: 0.5,
        }}
      >
        Trang {page}/{totalGroups}
      </Typography>

      <IconButton
        size="small"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalGroups || isLoading}
        aria-label="Trang sau"
        sx={{
          border: "1px solid",
          borderColor: page >= totalGroups || isLoading ? "#E2E8F0" : "#CBD5E1",
          bgcolor: "#FFFFFF",
          borderRadius: "8px",
          width: 36,
          height: 36,
          color: page >= totalGroups || isLoading ? "action.disabled" : "text.primary",
          transition: "all 0.15s ease-in-out",
          "&:hover": {
            bgcolor: "#F8FAFC",
            borderColor: "primary.main",
            color: "primary.main",
          },
          "&.Mui-disabled": {
            borderColor: "#E2E8F0",
            bgcolor: "#F8FAFC",
          },
        }}
      >
        <ChevronRightRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

/**
 * Component phân trang dùng chung cho các màn hình dạng Card / Grid / List:
 * - mode="full" (mặc định):
 *   + Mobile: Nút Trước / Sau lớn dễ bấm, kèm dòng đếm số lượng
 *   + Desktop: Dãy chấm tròn thông minh tương tác (dots indicator) + dòng đếm kết quả
 * - mode="mobile-only":
 *   + Chỉ hiển thị cụm điều hướng trên mobile (dành cho màn hình mà desktop đã có Table Pagination như Itineraries)
 */
export const CardPagination: React.FC<CardPaginationProps> = ({
  page,
  totalItems,
  perPage = 10,
  itemLabel = "mục",
  onPageChange,
  isLoading = false,
  mode = "full",
  showDots = true,
  showResultCount = true,
}) => {
  const totalGroups = Math.max(1, Math.ceil(totalItems / perPage));
  const startItem = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <Box
      sx={{
        display: mode === "mobile-only" ? { xs: "flex", sm: "none" } : "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        pt: { xs: 2, sm: 0 },
        mt: { xs: 1, sm: 0.5 },
        borderTop: { xs: "1px solid #E2E8F0", sm: "none" },
        width: "100%",
      }}
    >
      {/* 1. Mobile Pagination Controls */}
      <Box
        sx={{
          display: { xs: "flex", sm: mode === "mobile-only" ? "flex" : "none" },
          flexDirection: "column",
          alignItems: "center",
          gap: 1.25,
          width: "100%",
        }}
      >
        {showResultCount && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.85rem",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Đang xem {startItem}–{endItem} trong {totalItems} {itemLabel}
          </Typography>
        )}

        {totalGroups > 1 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<ChevronLeftRoundedIcon />}
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
              aria-label="Trang trước"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.825rem",
                borderColor: "#CBD5E1",
                color: "text.primary",
                minHeight: 40,
                minWidth: 80,
                px: 1.5,
                "&:hover": { borderColor: "primary.main", bgcolor: "#F8FAFC" },
                "&.Mui-disabled": {
                  borderColor: "#E2E8F0",
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              Trước
            </Button>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                px: 1.25,
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              Trang {page} / {totalGroups}
            </Typography>

            <Button
              size="small"
              variant="outlined"
              endIcon={<ChevronRightRoundedIcon />}
              disabled={page >= totalGroups || isLoading}
              onClick={() => onPageChange(page + 1)}
              aria-label="Trang sau"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.825rem",
                borderColor: "#CBD5E1",
                color: "text.primary",
                minHeight: 40,
                minWidth: 80,
                px: 1.5,
                "&:hover": { borderColor: "primary.main", bgcolor: "#F8FAFC" },
                "&.Mui-disabled": {
                  borderColor: "#E2E8F0",
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              Sau
            </Button>
          </Box>
        )}
      </Box>

      {/* 2. Desktop Dots Indicator (Khi mode !== "mobile-only" và tổng số trang từ 2 đến 12) */}
      {mode !== "mobile-only" && showDots && totalGroups > 1 && totalGroups <= 12 && (
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {Array.from({ length: totalGroups }).map((_, idx) => (
            <Box
              key={idx}
              onClick={() => onPageChange(idx + 1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onPageChange(idx + 1);
                }
              }}
              aria-label={`Chuyển đến nhóm ${idx + 1}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 32,
                minWidth: idx === page - 1 ? 32 : 20,
                px: 0.5,
                cursor: "pointer",
                borderRadius: "4px",
                "&:focus-visible": {
                  outline: "2px solid #1976D2",
                  outlineOffset: 2,
                },
              }}
            >
              <Box
                sx={{
                  width: idx === page - 1 ? 24 : 8,
                  height: 8,
                  borderRadius: "4px",
                  bgcolor: idx === page - 1 ? "primary.main" : "text.disabled",
                  transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                  "&:hover": {
                    bgcolor:
                      idx === page - 1 ? "primary.main" : "text.secondary",
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* 3. Desktop Count indicator (Khi mode !== "mobile-only") */}
      {mode !== "mobile-only" && showResultCount && (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            display: { xs: "none", sm: "block" },
          }}
        >
          Đang xem {startItem}–{endItem} trong {totalItems} {itemLabel}
        </Typography>
      )}
    </Box>
  );
};
