import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  InputAdornment,
  Autocomplete,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { getLocations } from "@/services/travelMapService";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type {
  ILocation,
  ILocationFormData,
  LocationStatus,
} from "@/types/pages/travel-map/travelMap";
import {
  VIETNAM_DEFAULT_CENTER,
  VIETNAM_DEFAULT_ZOOM,
} from "@/constants/travelMapConstant";
import {
  type IGlobalCountry,
  type IGlobalState,
  getAllCountries,
  findCountryByCode,
  getStatesByCountryCode,
  findStateByCode,
  findDestinationForLegacyLocation,
} from "@/services/globalGeoService";

/**
 * Icon ghim tĩnh trên bản đồ xem trước (không cho phép kéo/thả)
 */
const createStaticPinIcon = () =>
  L.divIcon({
    className: "location-preview-static-pin",
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -38],
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: default;
      ">
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
          border: 2.5px solid #FFFFFF;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(13, 71, 161, 0.4);
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: #FFFFFF;
            border-radius: 50%;
          "></div>
        </div>
        <div style="
          width: 14px;
          height: 4px;
          background: rgba(0,0,0,0.25);
          border-radius: 50%;
          margin-top: 2px;
          filter: blur(1px);
        "></div>
      </div>
    `,
  });

interface DestinationMapPreviewProps {
  country: IGlobalCountry | null;
  state: IGlobalState | null;
}

/**
 * Component bản đồ xem trước vị trí:
 * - TUYỆT ĐỐI KHÔNG cho phép click để chọn tọa độ
 * - TUYỆT ĐỐI KHÔNG cho phép kéo marker
 * - Khi chưa chọn hoặc điểm đến thiếu tọa độ: không ghim tọa độ giả
 * - Khi đã chọn và có tọa độ: tự động bay đến vị trí đại diện của tỉnh/bang
 */
const DestinationMapPreview: React.FC<DestinationMapPreviewProps> = ({
  country,
  state,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const hasCoords =
    state !== null && state.latitude !== null && state.longitude !== null;

  // Khởi tạo Leaflet map một lần duy nhất
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = hasCoords
      ? [state.latitude as number, state.longitude as number]
      : VIETNAM_DEFAULT_CENTER;
    const initialZoom = hasCoords ? 9 : VIETNAM_DEFAULT_ZOOM;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 18,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
    }).addTo(map);

    if (hasCoords) {
      const marker = L.marker(
        [state.latitude as number, state.longitude as number],
        {
          draggable: false,
          icon: createStaticPinIcon(),
        },
      ).addTo(map);
      markerRef.current = marker;
    }

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(mapContainerRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cập nhật vị trí hiển thị khi điểm đến thay đổi
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (hasCoords) {
      const targetPos: [number, number] = [
        state.latitude as number,
        state.longitude as number,
      ];
      map.flyTo(targetPos, 9, {
        duration: 1.1,
      });

      if (markerRef.current) {
        markerRef.current.setLatLng(targetPos);
      } else {
        const marker = L.marker(targetPos, {
          draggable: false,
          icon: createStaticPinIcon(),
        }).addTo(map);
        markerRef.current = marker;
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (!state) {
        map.flyTo(VIETNAM_DEFAULT_CENTER, VIETNAM_DEFAULT_ZOOM, {
          duration: 1,
        });
      }
    }
  }, [state, hasCoords]);

  return (
    <Box
      sx={{
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "#F8FAFC",
      }}
    >
      {/* Header bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.25,
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ExploreOutlinedIcon sx={{ fontSize: 20, color: "#1976D2" }} />
          <Typography
            sx={{ fontWeight: 600, fontSize: "13.5px", color: "#0F172A" }}
          >
            Vị trí trên bản đồ
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "12px",
            color: "#64748B",
            bgcolor: "#F1F5F9",
            px: 1.25,
            py: 0.35,
            borderRadius: "6px",
          }}
        >
          Xem trước tự động • Không chỉnh sửa thủ công
        </Typography>
      </Box>

      {/* Container bản đồ */}
      <Box
        ref={mapContainerRef}
        sx={{
          width: "100%",
          height: 280,
          bgcolor: "#E2E8F0",
        }}
      />

      {/* Footer bar */}
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {state && country ? (
          hasCoords ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1E40AF",
                  bgcolor: "#EFF6FF",
                  px: 1.25,
                  py: 0.35,
                  borderRadius: "6px",
                  border: "1px solid #DBEAFE",
                }}
              >
                📍 {state.name}, {country.vietnameseName} ({state.latitude},{" "}
                {state.longitude})
              </Typography>
              <Typography sx={{ fontSize: "11.5px", color: "#64748B" }}>
                Tọa độ đại diện từ dữ liệu địa lý quốc tế
              </Typography>
            </Box>
          ) : (
            <Typography
              sx={{
                fontSize: "12px",
                color: "#B45309",
                bgcolor: "#FEF3C7",
                px: 1,
                py: 0.3,
                borderRadius: "4px",
              }}
            >
              ⚠️ Điểm đến này chưa có tọa độ trong cơ sở dữ liệu (không tạo tọa
              độ giả)
            </Typography>
          )
        ) : (
          <Typography
            sx={{ fontSize: "12px", color: "#94A3B8", fontStyle: "italic" }}
          >
            💡 Vui lòng chọn quốc gia và tỉnh/bang/vùng ở trên để hiển thị vị trí
            trên bản đồ
          </Typography>
        )}
      </Box>
    </Box>
  );
};

interface LocationFormDialogProps {
  open: boolean;
  initialData?: ILocation | null;
  onClose: () => void;
  onSubmit: (formData: ILocationFormData) => void;
}

function getInitialFormData(
  initialData?: ILocation | null,
  initialCountry?: IGlobalCountry | null,
  initialState?: IGlobalState | null,
): ILocationFormData {
  if (initialData) {
    return {
      countryCode: initialData.countryCode || initialCountry?.iso2,
      countryName: initialData.countryName || initialCountry?.name,
      stateCode: initialData.stateCode || initialState?.stateCode,
      provinceCode: initialData.provinceCode || initialState?.stateCode,
      name: initialState ? initialState.name : initialData.name,
      address:
        initialState && initialCountry
          ? `${initialState.name}, ${initialCountry.vietnameseName}`
          : initialData.address,
      latitude:
        initialState !== undefined && initialState !== null
          ? initialState.latitude
          : initialData.latitude,
      longitude:
        initialState !== undefined && initialState !== null
          ? initialState.longitude
          : initialData.longitude,
      coverImage: initialData.coverImage || "",
      status: initialData.status || "Visited",
      description: initialData.description || "",
      notes: initialData.notes || "",
      googleMapsUrl: initialData.googleMapsUrl || "",
    };
  }

  return {
    countryCode: undefined,
    countryName: undefined,
    stateCode: undefined,
    provinceCode: undefined,
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    coverImage: "",
    status: "Visited",
    description: "",
    notes: "",
    googleMapsUrl: "",
  };
}

interface FormInnerProps {
  initialData?: ILocation | null;
  onClose: () => void;
  onSubmit: (formData: ILocationFormData) => void;
}

const LocationFormInner: React.FC<FormInnerProps> = ({
  initialData,
  onClose,
  onSubmit,
}) => {
  const isEdit = Boolean(initialData);

  // Xác định cặp Quốc gia & Tỉnh/Bang ban đầu khi mở form (tương thích dữ liệu mới lẫn lịch sử)
  const initialResolved = useMemo<{
    country: IGlobalCountry | null;
    state: IGlobalState | null;
  }>(() => {
    if (!initialData) return { country: null, state: null };

    if (initialData.countryCode) {
      const c = findCountryByCode(initialData.countryCode) || null;
      const s = c
        ? findStateByCode(
            c.iso2,
            initialData.stateCode || initialData.name,
          ) || null
        : null;
      if (c) return { country: c, state: s };
    }

    const legacy = findDestinationForLegacyLocation(
      initialData.name || initialData.address,
    );
    if (legacy) {
      return { country: legacy.country, state: legacy.state };
    }

    return { country: null, state: null };
  }, [initialData]);

  const [selectedCountry, setSelectedCountry] =
    useState<IGlobalCountry | null>(initialResolved.country);

  const [selectedState, setSelectedState] =
    useState<IGlobalState | null>(initialResolved.state);

  // Danh sách địa điểm hiện có trên bản đồ để kiểm tra trùng lặp
  const existingLocations = useMemo(() => getLocations(), []);

  // Kiểm tra một tỉnh/bang đã được thêm vào bản đồ hay chưa (ngoại trừ địa điểm đang sửa)
  const isStateAlreadyAdded = useCallback(
    (state: IGlobalState | null): boolean => {
      if (!state || !selectedCountry) return false;
      const currentEditingId = initialData?.id;
      return existingLocations.some((loc) => {
        if (currentEditingId && loc.id === currentEditingId) return false;
        const sameCountry =
          loc.countryCode?.toUpperCase() === selectedCountry.iso2.toUpperCase();
        const sameState =
          (loc.stateCode &&
            loc.stateCode.toUpperCase() === state.stateCode.toUpperCase()) ||
          loc.name.trim().toLowerCase() === state.name.trim().toLowerCase();
        return Boolean(sameCountry && sameState);
      });
    },
    [selectedCountry, existingLocations, initialData?.id],
  );

  // Danh sách các bang/tỉnh tương ứng của quốc gia đã chọn
  const availableStates = useMemo<IGlobalState[]>(() => {
    if (!selectedCountry) return [];
    return getStatesByCountryCode(selectedCountry.iso2);
  }, [selectedCountry]);

  const allCountries = useMemo(() => getAllCountries(), []);

  const [formData, setFormData] = useState<ILocationFormData>(() =>
    getInitialFormData(
      initialData,
      initialResolved.country,
      initialResolved.state,
    ),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Xử lý khi thay đổi Quốc gia
  const handleCountryChange = (newCountry: IGlobalCountry | null) => {
    setSelectedCountry(newCountry);
    // Khi đổi quốc gia: xóa lựa chọn tỉnh/bang cũ và xóa tọa độ preview
    setSelectedState(null);

    setFormData((prev) => ({
      ...prev,
      countryCode: newCountry?.iso2,
      countryName: newCountry?.name,
      stateCode: undefined,
      provinceCode: undefined,
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      // Xóa Google Maps URL tự sinh từ tọa độ cũ nếu có
      googleMapsUrl: prev.googleMapsUrl?.startsWith("https://www.google.com/maps?q=")
        ? ""
        : prev.googleMapsUrl,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next.country;
      delete next.state;
      delete next.latitude;
      delete next.longitude;
      return next;
    });
  };

  // Xử lý khi thay đổi Tỉnh / Bang / Vùng
  const handleStateChange = (newState: IGlobalState | null) => {
    setSelectedState(newState);

    if (newState && selectedCountry) {
      const isDuplicate = isStateAlreadyAdded(newState);
      const autoMapUrl =
        newState.latitude !== null && newState.longitude !== null
          ? `https://www.google.com/maps?q=${newState.latitude},${newState.longitude}`
          : "";

      setFormData((prev) => ({
        ...prev,
        stateCode: newState.stateCode,
        provinceCode: newState.stateCode,
        name: newState.name,
        address: `${newState.name}, ${selectedCountry.vietnameseName}`,
        latitude: newState.latitude,
        longitude: newState.longitude,
        googleMapsUrl: prev.googleMapsUrl || autoMapUrl,
      }));

      setErrors((prev) => {
        const next = { ...prev };
        if (isDuplicate) {
          next.state = "Địa điểm này đã có trong bản đồ hành trình của bạn";
        } else {
          delete next.state;
        }
        delete next.latitude;
        delete next.longitude;
        return next;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        stateCode: undefined,
        provinceCode: undefined,
        name: "",
        address: "",
        latitude: "",
        longitude: "",
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCountry) {
      newErrors.country = "Vui lòng chọn quốc gia";
    }

    if (selectedCountry && availableStates.length > 0) {
      if (!selectedState) {
        newErrors.state = "Vui lòng chọn tỉnh/bang/vùng";
      } else if (isStateAlreadyAdded(selectedState)) {
        newErrors.state = "Địa điểm này đã có trong bản đồ hành trình của bạn";
      }
    }

    if (formData.googleMapsUrl && formData.googleMapsUrl.trim()) {
      try {
        new URL(formData.googleMapsUrl.trim());
      } catch {
        newErrors.googleMapsUrl = "Đường dẫn Google Maps không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 2.5,
          pb: 1.5,
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: "#EFF6FF",
              color: "#1976D2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocationOnOutlinedIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#0F172A", fontSize: "1.15rem" }}
            >
              {isEdit ? "Chỉnh sửa điểm đến" : "Thêm điểm đến mới"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontSize: "0.825rem" }}
            >
              {isEdit
                ? "Cập nhật thông tin điểm đến theo Quốc gia và Tỉnh/Bang trên bản đồ"
                : "Quản lý điểm đến theo 2 cấp: Quốc gia và Tỉnh/Bang/Vùng"}
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={onClose} sx={{ color: "#64748B" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: "14px !important", pb: 2.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* BỘ CHỌN 2 SELECTBOX CÙNG HÀNG: QUỐC GIA & TỈNH/BANG/VÙNG */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {/* SELECTBOX 1: QUỐC GIA */}
            <Autocomplete<IGlobalCountry, false, false, false>
              sx={{ width: "100%" }}
              options={allCountries}
              getOptionLabel={(option) =>
                option.vietnameseName !== option.name
                  ? `${option.vietnameseName} (${option.name})`
                  : option.name
              }
              value={selectedCountry}
              isOptionEqualToValue={(option, value) => option.iso2 === value.iso2}
              onChange={(_, newValue) => handleCountryChange(newValue)}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                  <Box
                    component="li"
                    key={key}
                    {...rest}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      py: 0.75,
                    }}
                  >
                    <Box
                      component="img"
                      loading="lazy"
                      width="22"
                      height="15"
                      src={option.flagUrl}
                      alt={option.iso2}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                      sx={{
                        borderRadius: "2px",
                        objectFit: "cover",
                        border: "1px solid #CBD5E1",
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "13.5px",
                          color: "#0F172A",
                        }}
                      >
                        {option.vietnameseName}
                      </Typography>
                      {option.vietnameseName !== option.name && (
                        <Typography
                          sx={{ fontSize: "11.5px", color: "#64748B" }}
                        >
                          {option.name}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#64748B",
                        fontFamily: "monospace",
                        bgcolor: "#F1F5F9",
                        px: 0.75,
                        py: 0.25,
                        borderRadius: "4px",
                      }}
                    >
                      {option.iso2}
                    </Typography>
                  </Box>
                );
              }}
              noOptionsText="Không tìm thấy quốc gia"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Quốc gia *"
                  placeholder="Chọn quốc gia..."
                  size="small"
                  error={Boolean(errors.country)}
                  helperText={errors.country}
                  slotProps={{
                    ...params.slotProps,
                    input: {
                      ...params.slotProps?.input,
                      startAdornment: selectedCountry ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: 0.5,
                            pr: 0.5,
                          }}
                        >
                          <Box
                            component="img"
                            width="22"
                            height="15"
                            src={selectedCountry.flagUrl}
                            alt={selectedCountry.iso2}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                            sx={{
                              borderRadius: "2px",
                              objectFit: "cover",
                              border: "1px solid #CBD5E1",
                              flexShrink: 0,
                            }}
                          />
                          {params.slotProps?.input?.startAdornment}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: 0.5,
                            pr: 0.5,
                            color: "#94A3B8",
                          }}
                        >
                          <PublicOutlinedIcon sx={{ fontSize: 18, mr: 0.5 }} />
                          {params.slotProps?.input?.startAdornment}
                        </Box>
                      ),
                    },
                  }}
                />
              )}
            />

            {/* SELECTBOX 2: TỈNH / BANG / VÙNG */}
            <Autocomplete<IGlobalState, false, false, false>
              sx={{ width: "100%" }}
              disabled={!selectedCountry}
              options={availableStates}
              getOptionLabel={(option) => option.name}
              value={selectedState}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id || option.stateCode === value.stateCode
              }
              getOptionDisabled={(option) => isStateAlreadyAdded(option)}
              onChange={(_, newValue) => handleStateChange(newValue)}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                const isAdded = isStateAlreadyAdded(option);
                return (
                  <Box
                    component="li"
                    key={key}
                    {...rest}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      py: 0.75,
                      opacity: isAdded ? 0.55 : 1,
                      cursor: isAdded ? "not-allowed !important" : "pointer",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "13.5px",
                          color: isAdded ? "#94A3B8" : "#0F172A",
                        }}
                      >
                        {option.name}
                      </Typography>
                      {isAdded && (
                        <Chip
                          label="Đã thêm"
                          size="small"
                          sx={{
                            height: 19,
                            fontSize: "10.5px",
                            fontWeight: 600,
                            bgcolor: "#F1F5F9",
                            color: "#64748B",
                            border: "1px solid #E2E8F0",
                          }}
                        />
                      )}
                    </Box>
                    {option.stateCode && (
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#64748B",
                          fontFamily: "monospace",
                          bgcolor: "#F1F5F9",
                          px: 0.75,
                          py: 0.2,
                          borderRadius: "4px",
                        }}
                      >
                        {option.stateCode}
                      </Typography>
                    )}
                  </Box>
                );
              }}
              noOptionsText={
                selectedCountry
                  ? availableStates.length === 0
                    ? "Quốc gia này không có dữ liệu cấp tỉnh/bang trong dataset"
                    : "Không tìm thấy tỉnh/bang phù hợp"
                  : "Vui lòng chọn quốc gia trước"
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tỉnh / Bang / Vùng *"
                  placeholder={
                    selectedCountry
                      ? availableStates.length === 0
                        ? "Không có dữ liệu tỉnh/bang"
                        : "Chọn tỉnh/bang/vùng..."
                      : "Chọn quốc gia trước"
                  }
                  size="small"
                  error={Boolean(errors.state)}
                  helperText={
                    errors.state ||
                    (selectedCountry
                      ? availableStates.length > 0
                        ? `${availableStates.length} đơn vị hành chính khả dụng`
                        : "Không có dữ liệu cấp tỉnh/bang"
                      : "Cần chọn Quốc gia trước")
                  }
                />
              )}
            />
          </Box>

          {/* BẢN ĐỒ PREVIEW (1 hàng riêng, chỉ hiển thị vị trí, không cho click/kéo chọn tọa độ) */}
          <DestinationMapPreview
            country={selectedCountry}
            state={selectedState}
          />

          {/* VĨ ĐỘ & KINH ĐỘ (Cùng 1 hàng 2 cột, READ-ONLY, tự động theo đơn vị hành chính đã chọn) */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Vĩ độ (Latitude)"
              value={
                formData.latitude !== "" && formData.latitude !== null
                  ? formData.latitude
                  : "—"
              }
              fullWidth
              size="small"
              helperText={
                selectedState && selectedState.latitude === null
                  ? "Đơn vị này chưa có tọa độ trong cơ sở dữ liệu."
                  : "Tự động xác định theo đơn vị hành chính đã chọn"
              }
              slotProps={{
                input: {
                  readOnly: true,
                  sx: {
                    bgcolor: "#F8FAFC",
                    cursor: "default",
                    "& input": { cursor: "default" },
                  },
                },
              }}
            />
            <TextField
              label="Kinh độ (Longitude)"
              value={
                formData.longitude !== "" && formData.longitude !== null
                  ? formData.longitude
                  : "—"
              }
              fullWidth
              size="small"
              helperText={
                selectedState && selectedState.longitude === null
                  ? "Đơn vị này chưa có tọa độ trong cơ sở dữ liệu."
                  : "Tự động xác định theo đơn vị hành chính đã chọn"
              }
              slotProps={{
                input: {
                  readOnly: true,
                  sx: {
                    bgcolor: "#F8FAFC",
                    cursor: "default",
                    "& input": { cursor: "default" },
                  },
                },
              }}
            />
          </Box>

          {/* Trạng thái (1 hàng riêng) */}
          <FormControl fullWidth size="small">
            <InputLabel id="form-location-status-label">Trạng thái *</InputLabel>
            <Select
              labelId="form-location-status-label"
              label="Trạng thái *"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as LocationStatus,
                }))
              }
            >
              <MenuItem value="Visited">Đã ghé thăm (Visited)</MenuItem>
              <MenuItem value="Wishlist">Muốn đến (Wishlist)</MenuItem>
            </Select>
          </FormControl>

          {/* Đường dẫn Google Maps (1 hàng riêng, tùy chọn) */}
          <TextField
            label="Đường dẫn Google Maps (Tùy chọn)"
            placeholder="https://www.google.com/maps?q=..."
            value={formData.googleMapsUrl}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                googleMapsUrl: e.target.value,
              }));
              if (errors.googleMapsUrl)
                setErrors((prev) => ({ ...prev, googleMapsUrl: "" }));
            }}
            error={Boolean(errors.googleMapsUrl)}
            helperText={
              errors.googleMapsUrl ||
              "Tùy chọn liên kết xem trên Google Maps (tự động tạo theo tọa độ đại diện nếu có)."
            }
            fullWidth
            size="small"
            slotProps={{
              input: {
                endAdornment: formData.googleMapsUrl ? (
                  <InputAdornment position="end">
                    <Tooltip title="Mở xem trên Google Maps (tab mới)">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => {
                          try {
                            window.open(
                              formData.googleMapsUrl,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          } catch {
                            // silent
                          }
                        }}
                        sx={{ color: "#1976D2" }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : undefined,
              },
            }}
          />

          {/* Ảnh đại diện (URL) (1 hàng riêng) */}
          <TextField
            label="Ảnh đại diện (URL)"
            placeholder="https://images.unsplash.com/..."
            value={formData.coverImage}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
            }
            fullWidth
            size="small"
          />

          {/* Ảnh preview nếu có */}
          {formData.coverImage && (
            <Box
              component="img"
              src={formData.coverImage}
              alt="Preview"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
              sx={{
                width: "100%",
                height: 140,
                borderRadius: "10px",
                objectFit: "cover",
                border: "1px solid #E2E8F0",
              }}
            />
          )}

          {/* Giới thiệu điểm đến (1 hàng riêng) */}
          <TextField
            label="Giới thiệu điểm đến"
            placeholder="Đặc điểm nổi bật, cảnh quan, khí hậu vùng miền..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            multiline
            rows={2}
            fullWidth
            size="small"
          />

          {/* Ghi chú cá nhân / Kinh nghiệm (1 hàng riêng) */}
          <TextField
            label="Ghi chú cá nhân / Kinh nghiệm"
            placeholder="Lưu ý thời gian đi, mùa đẹp nhất, đặc sản nên thử..."
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            multiline
            rows={2}
            fullWidth
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #F1F5F9" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            color: "#64748B",
            borderColor: "#CBD5E1",
            px: 2.5,
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={Boolean(selectedState && isStateAlreadyAdded(selectedState))}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3.5,
            boxShadow: "none",
          }}
        >
          {isEdit ? "Cập nhật" : "Lưu điểm đến"}
        </Button>
      </DialogActions>
    </>
  );
};

export const LocationFormDialog: React.FC<LocationFormDialogProps> = ({
  open,
  initialData,
  onClose,
  onSubmit,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            maxHeight: "92vh",
            width: "100%",
          },
        },
      }}
    >
      {open && (
        <LocationFormInner
          key={initialData?.id || "new"}
          initialData={initialData}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
};
