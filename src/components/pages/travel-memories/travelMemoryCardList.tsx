import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import { TravelMemoryCard } from "@/components/pages/travel-memories/travelMemoryCard";

export interface TravelMemoryCardListProps {
  memories: ITravelMemory[];
  page: number;
  slideDirection?: "next" | "prev";
  onView: (id: number | string) => void;
  onEdit: (id: number | string) => void;
  onDelete: (memory: ITravelMemory) => void;
}

export const TravelMemoryCardList: React.FC<TravelMemoryCardListProps> = ({
  memories,
  page,
  slideDirection = "next",
  onView,
  onEdit,
  onDelete,
}) => {
  const prefersReducedMotion = useMediaQuery(
    "@media (prefers-reduced-motion: reduce)",
  );

  return (
    <Box
      key={page}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          lg: "repeat(5, 1fr)",
        },
        gap: { xs: 1.25, sm: 2 },
        animation: prefersReducedMotion
          ? "none"
          : `${
              slideDirection === "next" ? "slideNext" : "slidePrev"
            } 240ms cubic-bezier(0.22, 1, 0.36, 1)`,
        "@keyframes slideNext": {
          "0%": {
            opacity: 0,
            transform: "translateX(16px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        "@keyframes slidePrev": {
          "0%": {
            opacity: 0,
            transform: "translateX(-16px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }}
    >
      {memories.map((memory) => (
        <TravelMemoryCard
          key={memory.id}
          memory={memory}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};
