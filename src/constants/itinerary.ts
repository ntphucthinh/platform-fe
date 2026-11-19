export enum ItineraryActivityCategory {
  Dining = "dining",
  Sightseeing = "sightseeing",
  Nature = "nature",
  Cafe = "cafe",
  Shopping = "shopping",
  Rest = "rest",
  Other = "other",
}

export const ITINERARY_ACTIVITY_CATEGORIES = [
  { value: ItineraryActivityCategory.Dining, label: "Ăn uống" },
  { value: ItineraryActivityCategory.Sightseeing, label: "Tham quan" },
  { value: ItineraryActivityCategory.Nature, label: "Thiên nhiên" },
  { value: ItineraryActivityCategory.Cafe, label: "Cà phê" },
  { value: ItineraryActivityCategory.Shopping, label: "Mua sắm" },
  { value: ItineraryActivityCategory.Rest, label: "Nghỉ ngơi" },
  { value: ItineraryActivityCategory.Other, label: "Khác" },
];

export const ITINERARY_CATEGORY_COLORS: Record<
  ItineraryActivityCategory,
  { bg: string; text: string; border: string }
> = {
  [ItineraryActivityCategory.Dining]: {
    bg: "#FEF3C7",
    text: "#B45309",
    border: "#FDE68A",
  },
  [ItineraryActivityCategory.Sightseeing]: {
    bg: "#DBEAFE",
    text: "#1D4ED8",
    border: "#93C5FD",
  },
  [ItineraryActivityCategory.Nature]: {
    bg: "#DCFCE7",
    text: "#15803D",
    border: "#BBF7D0",
  },
  [ItineraryActivityCategory.Cafe]: {
    bg: "#F3E8FF",
    text: "#7E22CE",
    border: "#E9D5FF",
  },
  [ItineraryActivityCategory.Shopping]: {
    bg: "#FFE4E6",
    text: "#BE123C",
    border: "#FECDD3",
  },
  [ItineraryActivityCategory.Rest]: {
    bg: "#CCFBF1",
    text: "#0F766E",
    border: "#99F6E4",
  },
  [ItineraryActivityCategory.Other]: {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#E2E8F0",
  },
};

