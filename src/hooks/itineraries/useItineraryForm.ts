import {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  ITravelItinerary,
  IItineraryDay,
  IItineraryActivity,
  ItineraryActivityType,
  ICreateItineraryInput,
  IItineraryFormData,
} from "@/types/pages/itineraries/itinerary";
import { itinerarySchema } from "@/schemas/itineraries/itinerarySchema";
import { ITINERARY_ACTIVITY_CATEGORIES } from "@/constants/itinerary";
import {
  formatMinutesToDuration,
  parseDurationToMinutes,
} from "@/utils/itineraryUtils";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import type { ITravelLocationSelectionItem } from "@/hooks/selections/useTravelLocationSelection";
import type { ITravelThemeSelectionItem } from "@/hooks/selections/useTravelThemeSelection";

export interface ActivityModalState {
  open: boolean;
  dayIndex: number;
  activityIndex: number | null;
  time: string;
  title: string;
  type: ItineraryActivityType;
  duration: string;
  location: string;
  mapUrl: string;
  description: string;
  notes: string;
  image: string;
  imageFile?: File | null;
  imagePath?: string | null;
}

export interface UseItineraryFormOptions {
  initialData?: ITravelItinerary | null;
  onSubmit: (formData: ICreateItineraryInput) => void | Promise<void>;
  travelLocationsSelections?: { label: string; value: string | number }[];
  locationData?: ITravelLocationSelectionItem[];
  travelThemesSelections?: { label: string; value: string | number }[];
  themeData?: ITravelThemeSelectionItem[];
}

export function useItineraryForm({
  initialData,
  onSubmit,
  travelLocationsSelections = [],
  locationData = [],
  travelThemesSelections = [],
  themeData = [],
}: UseItineraryFormOptions) {
  // 1. React Hook Form + Yup Resolver
  const initialDaysCount =
    initialData?.durationDays || initialData?.days?.length || 1;
  const initialNightsCount =
    initialData?.durationNights !== undefined
      ? initialData.durationNights
      : Math.max(0, initialDaysCount - 1);

  const {
    register,
    control,
    setValue,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IItineraryFormData>({
    resolver: yupResolver(itinerarySchema),
    defaultValues: {
      title: initialData?.title || "",
      locationId: initialData?.locationId
        ? Number(initialData.locationId)
        : null,
      destination: initialData?.destination || "",
      durationDays: initialDaysCount,
      durationNights: initialNightsCount,
      suitableFor: initialData?.suitableFor || "Cặp đôi, nhóm bạn, gia đình",
      description: initialData?.description || "",
      coverImage: initialData?.coverImage || "",
    },
  });

  const title = useWatch({ control, name: "title" }) ?? "";
  const locationId = useWatch({ control, name: "locationId" }) ?? null;
  const destination = useWatch({ control, name: "destination" }) ?? "";
  const suitableFor = useWatch({ control, name: "suitableFor" }) ?? "";
  const description = useWatch({ control, name: "description" }) ?? "";
  const coverImage = useWatch({ control, name: "coverImage" }) ?? "";

  // 2. Selected location object for Autocomplete
  const selectedLocation = useMemo(() => {
    if (locationId !== null && locationId !== undefined) {
      const foundInOptions = travelLocationsSelections.find(
        (loc) => Number(loc.value) === Number(locationId),
      );
      if (foundInOptions) return foundInOptions;

      const foundInRaw = locationData.find(
        (l) => Number(l.id) === Number(locationId),
      );
      if (foundInRaw) {
        return { label: foundInRaw.name, value: foundInRaw.id };
      }

      if (destination) {
        return { label: destination, value: locationId };
      }
      return null;
    }

    if (destination) {
      const foundByName = travelLocationsSelections.find(
        (loc) => loc.label.toLowerCase() === destination.trim().toLowerCase(),
      );
      if (foundByName) return foundByName;
    }

    return null;
  }, [travelLocationsSelections, locationData, locationId, destination]);

  // 3. Themes state & display
  const [themes, setThemes] = useState<string[]>(
    initialData?.themes && initialData.themes.length > 0
      ? initialData.themes
      : [],
  );

  const INITIAL_THEMES_COUNT = 10;
  const [isThemesExpanded, setIsThemesExpanded] = useState(false);

  const availableThemeNames = useMemo(() => {
    const apiNamesFromOptions = travelThemesSelections
      .map((opt) => opt.label?.trim())
      .filter((l): l is string => Boolean(l));
    const apiNamesFromData = themeData
      .map((t) => t.name?.trim())
      .filter((n): n is string => Boolean(n));
    const combinedApiNames = Array.from(
      new Set([...apiNamesFromOptions, ...apiNamesFromData]),
    );

    const selectedSet = new Set(themes.map((t) => t.trim()));
    const seen = new Set<string>();
    const allNames: string[] = [];

    // 1. Collect all selected themes first (jump to top)
    themes.forEach((t) => {
      const trimmed = t.trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        allNames.push(trimmed);
      }
    });

    // 2. Collect remaining themes from API
    combinedApiNames.forEach((t) => {
      if (!seen.has(t)) {
        seen.add(t);
        allNames.push(t);
      }
    });

    // 3. Stable sort: selected themes strictly on top
    return allNames.sort((a, b) => {
      const aSelected = selectedSet.has(a);
      const bSelected = selectedSet.has(b);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [travelThemesSelections, themeData, themes]);

  const displayedThemes = useMemo(() => {
    if (isThemesExpanded) return availableThemeNames;
    const limit = Math.max(INITIAL_THEMES_COUNT, themes.length);
    return availableThemeNames.slice(0, limit);
  }, [availableThemeNames, isThemesExpanded, themes.length]);

  const canToggleThemes = availableThemeNames.length > INITIAL_THEMES_COUNT;

  // 4. Travel Tips Text
  const [travelTipsText, setTravelTipsText] = useState(
    initialData?.travelTips?.join("\n") ||
      "Thời gian di chuyển có thể thay đổi tùy tình hình giao thông.\nNên chuẩn bị trang phục phù hợp với thời tiết điểm đến.\nLịch trình có thể tùy chỉnh linh hoạt theo nhu cầu thực tế.",
  );

  // 5. Object URL Memory Management
  const createdObjectUrlsRef = useRef<Set<string>>(new Set());

  const registerObjectUrl = useCallback((url: string) => {
    createdObjectUrlsRef.current.add(url);
    return url;
  }, []);

  useEffect(() => {
    const urls = createdObjectUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore
        }
      });
      urls.clear();
    };
  }, []);

  // 5b. Cover image file & storage path tracking
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePath, setCoverImagePath] = useState<string | null>(
    initialData?.coverImagePath ?? null,
  );

  // 6. Days state
  const [days, setDays] = useState<IItineraryDay[]>(() => {
    if (initialData?.days && initialData.days.length > 0) {
      return initialData.days.map((d) => ({
        ...d,
        dayTipsText: d.dayTipsText ?? (d.dayTips || []).join("\n"),
      }));
    }
    return [
      {
        id: Date.now(),
        dayNumber: 1,
        title: "Ngày 1 – Bắt đầu hành trình",
        subtitle: "",
        date: "",
        summary: "",
        coverImage: "",
        imagePath: null,
        imageFile: null,
        activities: [],
        dayTips: [],
        dayTipsText: "",
      },
    ];
  });

  // 7. Active Day Index for Tabbed Wizard Authoring
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const safeActiveDayIndex = Math.min(
    Math.max(0, activeDayIndex),
    Math.max(0, days.length - 1),
  );
  const currentActiveDay = days[safeActiveDayIndex] || days[0];
  const hasDayImage = Boolean(
    currentActiveDay?.coverImage &&
      currentActiveDay.coverImage.trim() !== "" &&
      currentActiveDay.coverImage !== DEFAULT_NO_IMAGE,
  );

  const displayActiveDayTitle = useMemo(() => {
    if (!currentActiveDay) return "";
    const rawTitle = currentActiveDay.title?.trim() || "";
    // If title already starts with "Ngày <dayNumber>" (e.g. "Ngày 1: ...", "Ngày 1 - ..."), avoid duplicate prefix
    const prefixRegex = new RegExp(
      `^ngày\\s*${currentActiveDay.dayNumber}[:\\s–-]*`,
      "i",
    );
    if (prefixRegex.test(rawTitle)) {
      return rawTitle;
    }
    return rawTitle
      ? `Ngày ${currentActiveDay.dayNumber}: ${rawTitle}`
      : `Ngày ${currentActiveDay.dayNumber}`;
  }, [currentActiveDay]);

  // 8. Refs for file inputs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const dayImageInputRef = useRef<HTMLInputElement>(null);
  const activityImageInputRef = useRef<HTMLInputElement>(null);

  // 9. Real-time Preview Dialog State
  const [previewOpen, setPreviewOpen] = useState(false);

  // 10. Activity Dialog State
  const [activityModal, setActivityModal] = useState<ActivityModalState>({
    open: false,
    dayIndex: 0,
    activityIndex: null,
    time: "08:00",
    title: "",
    type: "Tham quan",
    duration: "60",
    location: "",
    mapUrl: "",
    description: "",
    notes: "",
    image: "",
    imageFile: null,
    imagePath: null,
  });

  // 11. Day Deletion Confirmation Dialog State
  const [dayToDelete, setDayToDelete] = useState<number | null>(null);

  // 12. Upload handlers
  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const previewUrl = registerObjectUrl(URL.createObjectURL(file));
      setCoverImageFile(file);
      setCoverImagePath(null);
      setValue("coverImage", previewUrl, { shouldDirty: true });
    }
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleActivityImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const previewUrl = registerObjectUrl(URL.createObjectURL(file));
      setActivityModal((prev) => ({
        ...prev,
        image: previewUrl,
        imageFile: file,
        imagePath: null,
      }));
    }
    if (activityImageInputRef.current) {
      activityImageInputRef.current.value = "";
    }
  };

  const handleDayImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const previewUrl = registerObjectUrl(URL.createObjectURL(file));
      setDays((prev) =>
        prev.map((d, idx) =>
          idx === safeActiveDayIndex
            ? {
                ...d,
                coverImage: previewUrl,
                imageFile: file,
                imagePath: null,
              }
            : d,
        ),
      );
    }
    if (dayImageInputRef.current) {
      dayImageInputRef.current.value = "";
    }
  };

  // 13. Theme toggle
  const handleToggleTheme = (theme: string) => {
    if (themes.includes(theme)) {
      setThemes(themes.filter((t) => t !== theme));
    } else {
      setThemes([...themes, theme]);
    }
  };

  // 14. Day Actions
  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const newDay: IItineraryDay = {
      id: Date.now(),
      dayNumber: nextDayNum,
      title: `Ngày ${nextDayNum} – Khám phá tự do`,
      subtitle: "Lịch trình linh hoạt theo sở thích cá nhân.",
      date: "",
      summary: "Dành thời gian trải nghiệm thêm các địa điểm mới.",
      coverImage: "",
      imagePath: null,
      imageFile: null,
      activities: [],
      dayTips: [],
      dayTipsText: "",
    };
    setDays([...days, newDay]);
    setValue("durationDays", nextDayNum, { shouldDirty: true });
    setValue("durationNights", Math.max(0, nextDayNum - 1), {
      shouldDirty: true,
    });
    setActiveDayIndex(days.length);
  };

  const handleConfirmDeleteDay = () => {
    if (dayToDelete === null) return;
    const updated = days
      .filter((_, idx) => idx !== dayToDelete)
      .map((d, idx) => ({
        ...d,
        dayNumber: idx + 1,
      }));
    setDays(updated);
    setValue("durationDays", updated.length, { shouldDirty: true });
    setValue("durationNights", Math.max(0, updated.length - 1), {
      shouldDirty: true,
    });
    if (safeActiveDayIndex >= updated.length) {
      setActiveDayIndex(Math.max(0, updated.length - 1));
    }
    setDayToDelete(null);
  };

  const handleUpdateDayField = (
    dayIndex: number,
    field: "title" | "summary" | "date" | "dayTipsText" | "coverImage",
    val: string,
  ) => {
    setDays((prev) =>
      prev.map((d, idx) => {
        if (idx !== dayIndex) return d;
        if (field === "dayTipsText") {
          const parsedTips = val
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean);
          return {
            ...d,
            dayTipsText: val,
            dayTips: parsedTips,
          };
        }
        if (field === "coverImage") {
          return {
            ...d,
            coverImage: val,
            imagePath: val ? d.imagePath : null,
            imageFile: val ? d.imageFile : null,
          };
        }
        return { ...d, [field]: val };
      }),
    );
  };

  // 15. Activity Actions
  const handleOpenAddActivity = (dayIndex: number) => {
    setActivityModal({
      open: true,
      dayIndex,
      activityIndex: null,
      time: "08:00",
      title: "",
      type: "Tham quan",
      duration: "60",
      location: "",
      mapUrl: "",
      description: "",
      notes: "",
      image: "",
      imageFile: null,
      imagePath: null,
    });
  };

  const handleOpenEditActivity = (
    dayIndex: number,
    actIndex: number,
    act: IItineraryActivity,
  ) => {
    const actTypeLower = (act.type || "").trim().toLowerCase();
    const actCatLower = (act.category || "").trim().toLowerCase();
    const matchedCategory = ITINERARY_ACTIVITY_CATEGORIES.find(
      (c) =>
        c.label.toLowerCase() === actTypeLower ||
        c.value.toLowerCase() === actCatLower,
    );

    const hasValidActImage = Boolean(
      act.image && act.image.trim() !== "" && act.image !== DEFAULT_NO_IMAGE,
    );

    setActivityModal({
      open: true,
      dayIndex,
      activityIndex: actIndex,
      time: act.time || "08:00",
      title: act.title || "",
      type: (matchedCategory?.label ||
        act.type ||
        "Tham quan") as ItineraryActivityType,
      duration: parseDurationToMinutes(act.duration) || "60",
      location: act.location || "",
      mapUrl: act.mapUrl || "",
      description: act.description || "",
      notes: act.notes || "",
      image: hasValidActImage ? act.image : "",
      imageFile: act.imageFile ?? null,
      imagePath: act.imagePath ?? null,
    });
  };

  const handleSaveActivity = () => {
    if (
      !activityModal.title.trim() ||
      !activityModal.time.trim() ||
      !activityModal.type
    ) {
      return;
    }

    const {
      dayIndex,
      activityIndex,
      time,
      title: actTitle,
      type,
      duration,
      location,
      mapUrl,
      description: actDesc,
      notes,
      image,
      imageFile,
      imagePath,
    } = activityModal;

    const formattedDuration =
      formatMinutesToDuration(duration) ||
      (duration ? `${duration} phút` : "1 giờ");
    const numMinutes = parseInt(duration, 10);

    const typeLower = (type || "").trim().toLowerCase();
    const matchedCategory = ITINERARY_ACTIVITY_CATEGORIES.find(
      (c) =>
        c.label.toLowerCase() === typeLower ||
        c.value.toLowerCase() === typeLower,
    );

    const hasActImage = Boolean(image && image !== DEFAULT_NO_IMAGE);

    const newActivity: IItineraryActivity = {
      id:
        activityIndex !== null && days[dayIndex].activities[activityIndex]?.id
          ? days[dayIndex].activities[activityIndex].id
          : Date.now(),
      time: time.trim(),
      startTime: time.trim(),
      title: actTitle.trim(),
      type: (matchedCategory?.label ||
        type ||
        "Tham quan") as ItineraryActivityType,
      category: matchedCategory?.value,
      activityCategory: matchedCategory?.value,
      duration: formattedDuration,
      durationMinutes:
        !isNaN(numMinutes) && numMinutes > 0 ? numMinutes : undefined,
      location: location.trim(),
      mapUrl: mapUrl.trim(),
      googleMapsUrl: mapUrl.trim(),
      description: actDesc.trim(),
      notes: notes.trim(),
      image: hasActImage ? image : DEFAULT_NO_IMAGE,
      imageFile: hasActImage ? (imageFile ?? null) : null,
      imagePath: hasActImage ? (imagePath ?? null) : null,
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

  // 16. Validation & Submit via React Hook Form + Yup
  const handleSave = handleFormSubmit(
    async (values) => {
      const emptyTitleDayIndex = days.findIndex((d) => !d.title.trim());
      if (emptyTitleDayIndex !== -1) {
        setActiveDayIndex(emptyTitleDayIndex);
        return;
      }

      const resolvedLocationId =
        values.locationId ??
        (selectedLocation ? Number(selectedLocation.value) : null);

      const tips = travelTipsText
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);

      // Map selected theme names to numeric themeIds
      const resolvedThemeIds: number[] = [];
      const seenThemeIds = new Set<number>();
      themes.forEach((themeName) => {
        const normalized = themeName.trim().toLowerCase();
        if (!normalized) return;

        const matchedFromData = themeData.find(
          (t) => t.name.trim().toLowerCase() === normalized,
        );
        const matchedFromSelections = travelThemesSelections.find(
          (opt) => opt.label.trim().toLowerCase() === normalized,
        );
        const matchedFromInitial = initialData?.themeObjects?.find(
          (t) => t.name.trim().toLowerCase() === normalized,
        );

        const rawId =
          matchedFromData?.id ??
          (matchedFromSelections
            ? Number(matchedFromSelections.value)
            : undefined) ??
          matchedFromInitial?.id;

        if (rawId !== undefined && !isNaN(Number(rawId)) && Number(rawId) > 0) {
          const numId = Number(rawId);
          if (!seenThemeIds.has(numId)) {
            seenThemeIds.add(numId);
            resolvedThemeIds.push(numId);
          }
        }
      });

      const hasValidCoverImage = Boolean(
        values.coverImage &&
          values.coverImage.trim() !== "" &&
          values.coverImage !== DEFAULT_NO_IMAGE,
      );

      const finalDays = days.length;
      const finalNights = Math.max(0, finalDays - 1);

      const payload: ICreateItineraryInput = {
        title: values.title.trim(),
        destination: (values.destination || "").trim(),
        locationId: resolvedLocationId,
        durationDays: finalDays,
        durationNights: finalNights,
        duration: `${finalDays} ngày ${finalNights} đêm`,
        description: (values.description || "").trim(),
        coverImage: values.coverImage || DEFAULT_NO_IMAGE,
        coverImagePath: hasValidCoverImage ? coverImagePath : null,
        coverImageFile: hasValidCoverImage ? coverImageFile : null,
        suitableFor: values.suitableFor,
        themes,
        themeIds: resolvedThemeIds,
        days,
        travelTips: tips,
        featuredImages: initialData?.featuredImages || [
          {
            id: 1,
            title: values.title.trim(),
            url: values.coverImage || DEFAULT_NO_IMAGE,
            caption: (values.destination || values.title || "").trim(),
          },
        ],
      };

      await onSubmit(payload);
    },
    () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  );

  // 17. Real-time Preview Computed Values
  const livePreviewDays = days.length;
  const livePreviewNights = Math.max(0, livePreviewDays - 1);
  const livePreviewItinerary: ITravelItinerary = {
    id: initialData?.id || 0,
    locationId:
      locationId ?? (selectedLocation ? Number(selectedLocation.value) : null),
    title: title || "Lịch trình chưa đặt tên",
    destination: destination || "Địa điểm chưa xác định",
    duration: `${livePreviewDays} ngày ${livePreviewNights} đêm`,
    durationDays: livePreviewDays,
    durationNights: livePreviewNights,
    description:
      description || "Mô tả tổng quan hành trình đang được cập nhật.",
    coverImage: coverImage || DEFAULT_NO_IMAGE,
    suitableFor,
    themes,
    days,
    featuredImages: initialData?.featuredImages || [
      {
        id: 1,
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

  return {
    // Form control & values
    register,
    control,
    setValue,
    errors,
    isSubmitting,
    title,
    locationId,
    destination,
    suitableFor,
    description,
    coverImage,
    selectedLocation,

    // Themes
    themes,
    setThemes,
    displayedThemes,
    availableThemeNames,
    canToggleThemes,
    isThemesExpanded,
    setIsThemesExpanded,
    handleToggleTheme,

    // Travel tips
    travelTipsText,
    setTravelTipsText,

    // Days
    days,
    setDays,
    activeDayIndex,
    setActiveDayIndex,
    safeActiveDayIndex,
    currentActiveDay,
    hasDayImage,
    displayActiveDayTitle,
    handleAddDay,
    handleUpdateDayField,
    dayToDelete,
    setDayToDelete,
    handleConfirmDeleteDay,

    // Refs & Uploads
    coverInputRef,
    dayImageInputRef,
    activityImageInputRef,
    handleCoverUpload,
    handleDayImageUpload,
    handleActivityImageUpload,

    // Activity modal & actions
    activityModal,
    setActivityModal,
    handleOpenAddActivity,
    handleOpenEditActivity,
    handleSaveActivity,
    handleDeleteActivity,

    // Submission
    handleSave,

    // Preview
    previewOpen,
    setPreviewOpen,
    livePreviewItinerary,
  };
}

export default useItineraryForm;
