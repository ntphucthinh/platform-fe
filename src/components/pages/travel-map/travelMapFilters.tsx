import React from "react";
import { TravelMapHeader, type TravelMapHeaderProps } from "./travelMapHeader";
import type { ILocationFilterState } from "@/types/pages/travel-map/travelMap";

export interface TravelMapFiltersProps {
  filters: ILocationFilterState;
  totalLocations: number;
  visitedLocations?: number;
  wishlistLocations?: number;
  selectedCountryCode?: string | null;
  onFilterChange: (
    updater: (prev: ILocationFilterState) => ILocationFilterState,
  ) => void;
  onSelectCountry?: (code: string | null) => void;
  onResetFilters: () => void;
  viewMode?: "map" | "list";
  onViewModeChange?: (mode: "map" | "list") => void;
  onOpenCreate?: () => void;
}

/**
 * Backward compatibility wrapper delegating to distilled TravelMapHeader.
 */
export const TravelMapFilters: React.FC<TravelMapFiltersProps> = ({
  filters,
  totalLocations,
  visitedLocations = 0,
  wishlistLocations = 0,
  selectedCountryCode,
  onFilterChange,
  onSelectCountry,
  onResetFilters,
  viewMode = "map",
  onViewModeChange = () => {},
  onOpenCreate = () => {},
}) => {
  return (
    <TravelMapHeader
      totalLocations={totalLocations}
      visitedLocations={visitedLocations}
      wishlistLocations={wishlistLocations}
      selectedStatus={filters.status}
      selectedCountryCode={selectedCountryCode}
      onStatusChange={(status) =>
        onFilterChange((prev) => ({ ...prev, status }))
      }
      onSelectCountry={(code) => onSelectCountry?.(code)}
      onResetFilters={onResetFilters}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      onOpenCreate={onOpenCreate}
    />
  );
};

export type { TravelMapHeaderProps };
