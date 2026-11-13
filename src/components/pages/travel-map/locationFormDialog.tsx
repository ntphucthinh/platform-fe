import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Tooltip,
  InputAdornment,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Feature } from "geojson";
import type {
  ILocation,
  ILocationFormData,
} from "@/types/pages/travel-map/travelMap";
import { LocationStatus } from "@/constants/travelMap";
import {
  extractRelativeImagePath,
  getGoogleMapsUrl,
  loadCountryBoundaries,
  getCountryBoundary,
  getCountryCenterAndZoom,
  isPointInCountry,
  type CountryGeometry,
} from "@/utils/travelMapUtils";
import { createVietnamSovereigntyLayer } from "@/utils/vietnamSovereigntyLayer";
import {
  useCountries,
  useGlobalGeo,
  type IGlobalCountry,
} from "@/hooks/common/useGlobalGeo";

/**
 * Icon ghim trên bản đồ xem trước (hỗ trợ kéo thả ghim)
 */
const createMapPinIcon = () =>
  L.divIcon({
    className: "location-preview-custom-pin",
    iconSize: [34, 40],
    iconAnchor: [17, 40],
    popupAnchor: [0, -40],
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: grab;
      ">
        <div style="
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          border: 2.5px solid #FFFFFF;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(29, 78, 216, 0.45);
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: #FFFFFF;
            border-radius: 50%;
          "></div>
        </div>
        <div style="
          width: 16px;
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
  latitude: number | "" | null;
  longitude: number | "" | null;
  warning?: string | null;
  onLocationSelect: (lat: number, lng: number) => void;
  onLocationWarning?: (msg: string | null) => void;
  existingLocations?: ILocation[];
  currentLocationId?: number;
  initialCoordinates?: { lat: number; lng: number } | null;
}

/**
 * Component bản đồ tương tác:
 * - Highlight ranh giới quốc gia được chọn với viền và màu nền mờ
 * - Hiển thị các địa điểm đã có trong quốc gia dạng chấm tròn nhỏ mờ (kèm tooltip)
 * - Cho phép nhấp trực tiếp vào bản đồ hoặc kéo thả ghim để chọn tọa độ
 * - Cảnh báo màu vàng nếu tọa độ nằm ngoài ranh giới quốc gia (không chặn chọn tọa độ)
 * - Tự động di chuyển tới ranh giới quốc gia khi chọn từ dropdown
 */
const DestinationMapPreview: React.FC<DestinationMapPreviewProps> = ({
  country,
  latitude,
  longitude,
  warning,
  onLocationSelect,
  onLocationWarning,
  existingLocations,
  currentLocationId,
  initialCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const initialGhostMarkerRef = useRef<L.Marker | null>(null);
  const existingMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const highlightLayerRef = useRef<L.GeoJSON | null>(null);
  const countryGeometryRef = useRef<CountryGeometry | null>(null);
  const countryRef = useRef<IGlobalCountry | null>(country);
  const onLocationSelectRef = useRef(onLocationSelect);
  const onLocationWarningRef = useRef(onLocationWarning);
  const coordsRef = useRef<{
    lat: number | "" | null;
    lng: number | "" | null;
  }>({
    lat: latitude,
    lng: longitude,
  });
  const prevCountryIso2Ref = useRef<string | undefined>(country?.iso2);
  const hasInitialCoordsRef = useRef<boolean>(
    latitude !== null &&
      latitude !== "" &&
      latitude !== undefined &&
      longitude !== null &&
      longitude !== "" &&
      longitude !== undefined,
  );

  useEffect(() => {
    countryRef.current = country;
  }, [country]);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    onLocationWarningRef.current = onLocationWarning;
  }, [onLocationWarning]);

  useEffect(() => {
    coordsRef.current = { lat: latitude, lng: longitude };
  }, [latitude, longitude]);

  const hasValidCoords =
    latitude !== null &&
    latitude !== "" &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== "" &&
    longitude !== undefined;

  // Tạo draggable marker với cảnh báo vị trí kéo thả
  const createDraggableMarker = useCallback(
    (lat: number, lng: number): L.Marker => {
      const marker = L.marker([lat, lng], {
        draggable: true,
        icon: createMapPinIcon(),
      });

      marker.on("dragend", async () => {
        const currentCountry = countryRef.current;
        const pos = marker.getLatLng();
        const newLat = Number(pos.lat.toFixed(7));
        const newLng = Number(pos.lng.toFixed(7));

        if (!currentCountry) {
          onLocationWarningRef.current?.(null);
          onLocationSelectRef.current(newLat, newLng);
          return;
        }

        let geometry = countryGeometryRef.current;
        if (!geometry && currentCountry.iso2) {
          geometry = await getCountryBoundary(currentCountry.iso2);
          countryGeometryRef.current = geometry;
        }

        const isValid = isPointInCountry(
          newLat,
          newLng,
          geometry,
          currentCountry.iso2,
        );
        if (!isValid) {
          onLocationWarningRef.current?.(
            `Vị trí đã chọn không thuộc lãnh thổ ${currentCountry.name}.`,
          );
        } else {
          onLocationWarningRef.current?.(null);
        }

        // Vẫn cho phép chọn tọa độ bình thường, không chặn lại
        onLocationSelectRef.current(newLat, newLng);
      });

      return marker;
    },
    [],
  );

  // Khởi tạo Leaflet map một lần duy nhất
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const hasInitialCoords =
      hasValidCoords &&
      typeof latitude === "number" &&
      typeof longitude === "number";

    const initialCenter: [number, number] = hasInitialCoords
      ? [latitude, longitude]
      : getCountryCenterAndZoom(country?.iso2).center;

    const initialZoom = hasInitialCoords
      ? 10
      : getCountryCenterAndZoom(country?.iso2).zoom;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
    }).addTo(map);

    // Cho phép click chọn vị trí trên bản đồ với cảnh báo lãnh thổ quốc gia
    map.on("click", async (e: L.LeafletMouseEvent) => {
      const currentCountry = countryRef.current;
      const newLat = Number(e.latlng.lat.toFixed(7));
      const newLng = Number(e.latlng.lng.toFixed(7));

      if (markerRef.current) {
        markerRef.current.setLatLng([newLat, newLng]);
      } else {
        const marker = createDraggableMarker(newLat, newLng).addTo(map);
        markerRef.current = marker;
      }

      if (!currentCountry) {
        onLocationWarningRef.current?.(null);
        onLocationSelectRef.current(newLat, newLng);
        return;
      }

      let geometry = countryGeometryRef.current;
      if (!geometry && currentCountry.iso2) {
        geometry = await getCountryBoundary(currentCountry.iso2);
        countryGeometryRef.current = geometry;
      }

      const isValid = isPointInCountry(
        newLat,
        newLng,
        geometry,
        currentCountry.iso2,
      );
      if (!isValid) {
        onLocationWarningRef.current?.(
          `Vị trí đã chọn không thuộc lãnh thổ ${currentCountry.name}.`,
        );
      } else {
        onLocationWarningRef.current?.(null);
      }

      // Vẫn cho phép chọn tọa độ bình thường, không chặn lại
      onLocationSelectRef.current(newLat, newLng);
    });

    if (hasInitialCoords) {
      const marker = createDraggableMarker(latitude, longitude).addTo(map);
      markerRef.current = marker;
    }

    // Khởi tạo Layer Chủ quyền Biển đảo Việt Nam (Hoàng Sa & Trường Sa)
    const vnSovereignty = createVietnamSovereigntyLayer(map);
    vnSovereignty.layerGroup.addTo(map);

    // Khởi tạo Layer chứa các địa điểm đã có
    const existingGroup = L.layerGroup().addTo(map);
    existingMarkersLayerRef.current = existingGroup;

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
      vnSovereignty.cleanup();
      existingGroup.clearLayers();
      existingMarkersLayerRef.current = null;
      if (initialGhostMarkerRef.current) {
        initialGhostMarkerRef.current.remove();
        initialGhostMarkerRef.current = null;
      }
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hiển thị highlight quốc gia và di chuyển camera tới ranh giới quốc gia
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let isCancelled = false;

    if (!country) {
      prevCountryIso2Ref.current = undefined;
      countryGeometryRef.current = null;
      onLocationWarningRef.current?.(null);
      if (highlightLayerRef.current) {
        map.removeLayer(highlightLayerRef.current);
        highlightLayerRef.current = null;
      }
      return;
    }

    const isCountryChanged = prevCountryIso2Ref.current !== country.iso2;
    prevCountryIso2Ref.current = country.iso2;

    getCountryBoundary(country.iso2).then(
      (geometry: CountryGeometry | null) => {
        if (isCancelled) return;
        countryGeometryRef.current = geometry;

        // Xóa layer highlight cũ khi dữ liệu layer mới đã sẵn sàng
        if (highlightLayerRef.current) {
          map.removeLayer(highlightLayerRef.current);
          highlightLayerRef.current = null;
        }

        if (geometry) {
          try {
            const feature: Feature = {
              type: "Feature",
              properties: {},
              geometry,
            };
            const geoJsonLayer = L.geoJSON(feature, {
              style: {
                color: "#2563EB",
                weight: 2,
                opacity: 0.85,
                fillColor: "#60A5FA",
                fillOpacity: 0.04,
                dashArray: "6, 6",
              },
              interactive: false,
            }).addTo(map);

            highlightLayerRef.current = geoJsonLayer;

            // Di chuyển camera bay mượt mà (flyToBounds) tới ranh giới quốc gia vừa chọn
            if (isCountryChanged || !hasInitialCoordsRef.current) {
              const bounds = geoJsonLayer.getBounds();
              if (bounds.isValid()) {
                map.flyToBounds(bounds, {
                  padding: [24, 24],
                  maxZoom: country.iso2 === "SG" ? 11 : 8,
                  duration: 1.5,
                  easeLinearity: 0.25,
                });
                hasInitialCoordsRef.current = false;
                return;
              }
            }
          } catch (err) {
            console.warn("Lỗi khi hiển thị highlight quốc gia:", err);
          }
        }

        // Fallback flyTo nếu không có GeoJSON geometry hoặc bounds không hợp lệ
        if (isCountryChanged || !hasInitialCoordsRef.current) {
          const { center, zoom } = getCountryCenterAndZoom(country.iso2);
          map.flyTo(center, zoom, {
            duration: 1.5,
            easeLinearity: 0.25,
          });
          hasInitialCoordsRef.current = false;
        }

        // Cập nhật cảnh báo nếu vị trí hiện tại không thuộc quốc gia
        if (
          typeof coordsRef.current.lat === "number" &&
          typeof coordsRef.current.lng === "number"
        ) {
          const isValid = isPointInCountry(
            coordsRef.current.lat,
            coordsRef.current.lng,
            geometry,
            country.iso2,
          );
          if (!isValid) {
            onLocationWarningRef.current?.(
              `Vị trí đã chọn không thuộc lãnh thổ ${country.name}.`,
            );
          } else {
            onLocationWarningRef.current?.(null);
          }
        } else {
          onLocationWarningRef.current?.(null);
        }
      },
    );

    return () => {
      isCancelled = true;
    };
  }, [country]);

  // Đồng bộ vị trí ghim marker khi tọa độ thay đổi
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (hasValidCoords) {
      const lat = Number(latitude);
      const lng = Number(longitude);

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const marker = createDraggableMarker(lat, lng).addTo(map);
        markerRef.current = marker;
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [latitude, longitude, hasValidCoords, createDraggableMarker]);

  // Lọc và đếm các địa điểm đã có thuộc cùng quốc gia (loại trừ chính địa điểm đang chỉnh sửa)
  const countryExistingLocations = useMemo(() => {
    if (!existingLocations || existingLocations.length === 0) return [];
    const currentCountryCode = country?.iso2?.toUpperCase();
    return existingLocations.filter((loc) => {
      if (currentLocationId && loc.id === currentLocationId) return false;
      if (
        loc.latitude === null ||
        loc.latitude === undefined ||
        isNaN(Number(loc.latitude)) ||
        loc.longitude === null ||
        loc.longitude === undefined ||
        isNaN(Number(loc.longitude))
      ) {
        return false;
      }
      if (currentCountryCode && loc.countryCode) {
        return loc.countryCode.toUpperCase() === currentCountryCode;
      }
      return true;
    });
  }, [existingLocations, country, currentLocationId]);

  // Vẽ các địa điểm đã có lên bản đồ (dạng dot marker tinh tế)
  useEffect(() => {
    const markersGroup = existingMarkersLayerRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    countryExistingLocations.forEach((loc) => {
      const locLat = Number(loc.latitude);
      const locLng = Number(loc.longitude);
      const isVisited = loc.status === LocationStatus.Visited;
      const markerColor = isVisited ? "#059669" : "#D97706";
      const locName = loc.locationName || loc.name || "Địa điểm";

      const dotIcon = L.divIcon({
        className: "existing-location-dot",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8],
        html: `
          <div style="
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: ${markerColor};
            border: 2px solid #FFFFFF;
            box-shadow: 0 1px 4px rgba(0,0,0,0.35);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s ease;
          ">
            <div style="
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: #FFFFFF;
            "></div>
          </div>
        `,
      });

      const existingMarker = L.marker([locLat, locLng], {
        icon: dotIcon,
        zIndexOffset: -100, // Đảm bảo luôn nằm dưới ghim chính đang chọn
      });

      existingMarker.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; line-height: 1.35; padding: 1px 2px;">
          <div style="font-weight: 700; color: #0F172A;">${locName}</div>
          <div style="font-size: 10px; color: ${markerColor}; font-weight: 600;">
            ${isVisited ? "✓ Đã ghé thăm" : "★ Muốn đến"}
          </div>
          <div style="font-size: 9.5px; color: #64748B; margin-top: 2px; font-style: italic;">
            (Nhấp để chọn vị trí này)
          </div>
        </div>`,
        {
          direction: "top",
          offset: [0, -6],
          opacity: 0.95,
        },
      );

      // Nhấp vào địa điểm cũ sẽ lấy tọa độ của địa điểm đó
      existingMarker.on("click", async (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        const currentCountry = countryRef.current;
        const newLat = Number(locLat.toFixed(7));
        const newLng = Number(locLng.toFixed(7));

        if (markerRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
        } else if (mapInstanceRef.current) {
          const marker = createDraggableMarker(newLat, newLng).addTo(
            mapInstanceRef.current,
          );
          markerRef.current = marker;
        }

        if (!currentCountry) {
          onLocationWarningRef.current?.(null);
          onLocationSelectRef.current(newLat, newLng);
          return;
        }

        let geometry = countryGeometryRef.current;
        if (!geometry && currentCountry.iso2) {
          geometry = await getCountryBoundary(currentCountry.iso2);
          countryGeometryRef.current = geometry;
        }

        const isValid = isPointInCountry(
          newLat,
          newLng,
          geometry,
          currentCountry.iso2,
        );
        if (!isValid) {
          onLocationWarningRef.current?.(
            `Vị trí đã chọn không thuộc lãnh thổ ${currentCountry.name}.`,
          );
        } else {
          onLocationWarningRef.current?.(null);
        }

        onLocationSelectRef.current(newLat, newLng);
      });

      existingMarker.addTo(markersGroup);
    });
  }, [countryExistingLocations, createDraggableMarker]);

  // Kiểm tra tọa độ có bị thay đổi so với vị trí ban đầu khi Edit
  const isCoordsChangedFromInitial = useMemo(() => {
    if (
      !initialCoordinates ||
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      return false;
    }
    const latDiff = Math.abs(latitude - initialCoordinates.lat);
    const lngDiff = Math.abs(longitude - initialCoordinates.lng);
    return latDiff > 0.00001 || lngDiff > 0.00001;
  }, [initialCoordinates, latitude, longitude]);

  // Tính khoảng cách đã di chuyển (m hoặc km)
  const movedDistanceText = useMemo(() => {
    if (!isCoordsChangedFromInitial || !initialCoordinates) return "";
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (isNaN(lat) || isNaN(lng)) return "";

    const R = 6371; // km
    const dLat = ((lat - initialCoordinates.lat) * Math.PI) / 180;
    const dLng = ((lng - initialCoordinates.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((initialCoordinates.lat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = R * c;

    if (distKm < 1) {
      return `${Math.round(distKm * 1000)} m`;
    }
    return `${distKm.toFixed(1)} km`;
  }, [isCoordsChangedFromInitial, initialCoordinates, latitude, longitude]);

  // Hàm khôi phục lại vị trí gốc ban đầu
  const handleRevertToInitial = useCallback(async () => {
    if (!initialCoordinates) return;
    const map = mapInstanceRef.current;
    const currentCountry = countryRef.current;
    const origLat = initialCoordinates.lat;
    const origLng = initialCoordinates.lng;

    if (markerRef.current) {
      markerRef.current.setLatLng([origLat, origLng]);
    }

    if (map) {
      map.flyTo([origLat, origLng], Math.max(map.getZoom(), 12), {
        duration: 0.8,
      });
    }

    if (!currentCountry) {
      onLocationWarningRef.current?.(null);
      onLocationSelectRef.current(origLat, origLng);
      return;
    }

    let geometry = countryGeometryRef.current;
    if (!geometry && currentCountry.iso2) {
      geometry = await getCountryBoundary(currentCountry.iso2);
      countryGeometryRef.current = geometry;
    }

    const isValid = isPointInCountry(
      origLat,
      origLng,
      geometry,
      currentCountry.iso2,
    );
    if (!isValid) {
      onLocationWarningRef.current?.(
        `Vị trí đã chọn không thuộc lãnh thổ ${currentCountry.name}.`,
      );
    } else {
      onLocationWarningRef.current?.(null);
    }

    onLocationSelectRef.current(origLat, origLng);
  }, [initialCoordinates]);

  // Hiển thị Ghost Marker tại vị trí gốc ban đầu khi người dùng di chuyển ghim
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isCoordsChangedFromInitial && initialCoordinates) {
      const ghostIcon = L.divIcon({
        className: "initial-ghost-marker",
        iconSize: [26, 30],
        iconAnchor: [13, 30],
        popupAnchor: [0, -30],
        html: `
          <div style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0.75;
            cursor: pointer;
          " title="Vị trí ban đầu (Nhấp để khôi phục)">
            <div style="
              width: 22px;
              height: 22px;
              background-color: #64748B;
              border: 2px dashed #FFFFFF;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
              <div style="
                width: 6px;
                height: 6px;
                background-color: #FFFFFF;
                border-radius: 50%;
              "></div>
            </div>
            <div style="
              margin-top: 1px;
              background-color: rgba(30, 41, 59, 0.9);
              color: #FFFFFF;
              font-size: 8.5px;
              font-weight: 600;
              padding: 1px 4px;
              border-radius: 3px;
              white-space: nowrap;
            ">Vị trí gốc</div>
          </div>
        `,
      });

      if (!initialGhostMarkerRef.current) {
        const ghost = L.marker(
          [initialCoordinates.lat, initialCoordinates.lng],
          {
            icon: ghostIcon,
            zIndexOffset: -50,
          },
        ).addTo(map);

        ghost.bindTooltip("Vị trí gốc ban đầu (Nhấp để khôi phục)", {
          direction: "top",
          offset: [0, -26],
        });

        ghost.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          handleRevertToInitial();
        });

        initialGhostMarkerRef.current = ghost;
      } else {
        initialGhostMarkerRef.current.setLatLng([
          initialCoordinates.lat,
          initialCoordinates.lng,
        ]);
      }
    } else {
      if (initialGhostMarkerRef.current) {
        initialGhostMarkerRef.current.remove();
        initialGhostMarkerRef.current = null;
      }
    }
  }, [isCoordsChangedFromInitial, initialCoordinates, handleRevertToInitial]);

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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          {countryExistingLocations.length > 0 && (
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
                fontSize: "11px",
                color: "#64748B",
              }}
            >
              <Typography sx={{ fontSize: "11px", color: "#64748B", fontWeight: 500 }}>
                {countryExistingLocations.length} điểm đã có:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#059669" }} />
                <span>Đã ghé thăm</span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#D97706" }} />
                <span>Muốn đến</span>
              </Box>
            </Box>
          )}

          <Typography
            sx={{
              fontSize: "12px",
              color: "#1E40AF",
              bgcolor: "#EFF6FF",
              border: "1px solid #DBEAFE",
              px: 1.25,
              py: 0.35,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontWeight: 500,
            }}
          >
            <span>📍</span>{" "}
            {country
              ? `Nhấp vào bản đồ để chọn vị trí (${country.name})`
              : "Chọn quốc gia trước khi chọn vị trí"}
          </Typography>
        </Box>
      </Box>

      {/* Container bản đồ */}
      <Box
        ref={mapContainerRef}
        sx={{
          width: "100%",
          height: { xs: 240, sm: 360, md: 450 },
          bgcolor: "#E2E8F0",
          cursor: "crosshair !important",
          "& .leaflet-container": {
            cursor: "crosshair !important",
          },
          "& .leaflet-grab": {
            cursor: "crosshair !important",
          },
        }}
      />

      {/* Footer bar */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          bgcolor: warning ? "#FFFDF5" : "#FFFFFF",
          borderTop: `1px solid ${warning ? "#FDE68A" : "#E2E8F0"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.25,
          minHeight: 48,
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
      >
        {hasValidCoords ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              flexWrap: "wrap",
            }}
          >
            {/* Tọa độ badge */}
            <Box
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: warning ? "#92400E" : "#1E40AF",
                bgcolor: warning ? "#FEF3C7" : "#EFF6FF",
                border: `1px solid ${warning ? "#FCD34D" : "#DBEAFE"}`,
                px: 1.25,
                py: 0.35,
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <span>📍</span>
              <span>
                {typeof latitude === "number" ? latitude.toFixed(6) : latitude},{" "}
                {typeof longitude === "number" ? longitude.toFixed(6) : longitude}
              </span>
            </Box>

            {/* Cảnh báo đã dời vị trí so với ban đầu + Nút hoàn tác */}
            {isCoordsChangedFromInitial && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#FEF9C3",
                  border: "1px solid #FDE047",
                  color: "#854D0E",
                  px: 1.25,
                  py: 0.35,
                  borderRadius: "6px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  flexWrap: "wrap",
                }}
              >
                <span>🔄 Đã dời {movedDistanceText} so với ban đầu</span>
                <Button
                  size="small"
                  onClick={handleRevertToInitial}
                  sx={{
                    minWidth: "auto",
                    p: "1px 8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "none",
                    color: "#1D4ED8",
                    bgcolor: "rgba(255,255,255,0.9)",
                    border: "1px solid #BFDBFE",
                    borderRadius: "4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    "&:hover": {
                      bgcolor: "#EFF6FF",
                      borderColor: "#93C5FD",
                    },
                  }}
                >
                  Khôi phục vị trí cũ
                </Button>
              </Box>
            )}

            {/* Cảnh báo hiển thị thẳng hàng cùng dòng với tọa độ */}
            {warning ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#B45309",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <span>⚠️</span>
                <span>{warning}</span>
              </Box>
            ) : !isCoordsChangedFromInitial && (
              <Typography sx={{ fontSize: "11.5px", color: "#64748B" }}>
                (Nhấp vào bản đồ hoặc kéo ghim để đổi vị trí)
              </Typography>
            )}
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: "12px",
              color: "#64748B",
              fontStyle: "italic",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <span>💡</span>{" "}
            {country
              ? `Nhấp vào bản đồ để chọn vị trí điểm đến (${country.name})`
              : "Vui lòng chọn quốc gia ở trên trước để hiển thị vùng bản đồ tương ứng"}
          </Typography>
        )}

        {hasValidCoords && warning && (
          <Typography sx={{ fontSize: "11.5px", color: "#94A3B8" }}>
            (Nhấp hoặc kéo ghim để chỉnh lại)
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export type LocationFormSubmitResult =
  | { success: boolean; error?: string | null }
  | boolean
  | void;

interface LocationFormDialogProps {
  open: boolean;
  initialData?: ILocation | null;
  existingLocations?: ILocation[];
  onClose: () => void;
  onSubmit: (
    formData: ILocationFormData,
  ) => Promise<LocationFormSubmitResult> | LocationFormSubmitResult;
}

function getInitialFormData(
  initialData?: ILocation | null,
  initialCountry?: IGlobalCountry | null,
): ILocationFormData {
  if (initialData) {
    const locName = initialData.locationName || initialData.name || "";
    return {
      countryCode: initialData.countryCode || initialCountry?.iso2,
      countryName: initialData.countryName || initialCountry?.name,
      locationName: locName,
      latitude:
        initialData.latitude !== undefined && initialData.latitude !== null
          ? initialData.latitude
          : "",
      longitude:
        initialData.longitude !== undefined && initialData.longitude !== null
          ? initialData.longitude
          : "",
      coverImage: initialData.coverImage || "",
      imageFile: null,
      imagePath:
        initialData.imagePath ||
        extractRelativeImagePath(initialData.coverImage),
      status: initialData.status ?? null,
      description: initialData.description || "",
      notes: initialData.notes || "",
      googleMapsUrl: initialData.googleMapsUrl || "",
    };
  }

  return {
    countryCode: undefined,
    countryName: undefined,
    locationName: "",
    latitude: "",
    longitude: "",
    coverImage: "",
    imageFile: null,
    imagePath: undefined,
    status: null,
    description: "",
    notes: "",
    googleMapsUrl: "",
  };
}

interface FormInnerProps {
  initialData?: ILocation | null;
  existingLocations?: ILocation[];
  onClose: () => void;
  onSubmit: (
    formData: ILocationFormData,
  ) => Promise<LocationFormSubmitResult> | LocationFormSubmitResult;
}

const LocationFormInner: React.FC<FormInnerProps> = ({
  initialData,
  existingLocations,
  onClose,
  onSubmit,
}) => {
  const isEdit = Boolean(initialData);
  const { findCountry, findLegacyDestination } = useGlobalGeo();

  // Xác định Quốc gia ban đầu khi mở form
  const initialResolved = useMemo<{
    country: IGlobalCountry | null;
  }>(() => {
    if (!initialData) return { country: null };

    if (initialData.countryCode) {
      const c = findCountry(initialData.countryCode) || null;
      if (c) return { country: c };
    }

    const legacy = findLegacyDestination(
      initialData.locationName || initialData.name || initialData.address,
    );
    if (legacy) {
      return { country: legacy.country };
    }

    return { country: null };
  }, [initialData, findCountry, findLegacyDestination]);

  // Tọa độ gốc ban đầu khi chỉnh sửa địa điểm
  const initialCoordinates = useMemo<{ lat: number; lng: number } | null>(() => {
    if (
      initialData &&
      initialData.latitude !== null &&
      initialData.latitude !== undefined &&
      !isNaN(Number(initialData.latitude)) &&
      initialData.longitude !== null &&
      initialData.longitude !== undefined &&
      !isNaN(Number(initialData.longitude))
    ) {
      return {
        lat: Number(initialData.latitude),
        lng: Number(initialData.longitude),
      };
    }
    return null;
  }, [initialData]);

  const [selectedCountry, setSelectedCountry] = useState<IGlobalCountry | null>(
    initialResolved.country,
  );

  const allCountries = useCountries();

  const [formData, setFormData] = useState<ILocationFormData>(() =>
    getInitialFormData(initialData, initialResolved.country),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationWarning, setLocationWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tải trước dữ liệu GeoJSON ranh giới các quốc gia
  useEffect(() => {
    loadCountryBoundaries();
  }, []);

  // File upload & Drag-and-drop cho ảnh đại diện
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const processImageFile = (file: File) => {
    setImageError(null);
    if (!file.type.startsWith("image/")) {
      setImageError("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError("Kích thước tệp quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({
          ...prev,
          coverImage: reader.result as string,
          imageFile: file,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: "",
      imageFile: null,
      imagePath: "",
    }));
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xử lý khi thay đổi Quốc gia
  const handleCountryChange = (newCountry: IGlobalCountry | null) => {
    setSelectedCountry(newCountry);
    setLocationWarning(null);

    setFormData((prev) => ({
      ...prev,
      countryCode: newCountry?.iso2,
      countryName: newCountry?.name,
      latitude: "",
      longitude: "",
      googleMapsUrl: "",
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next.country;
      delete next.coordinates;
      return next;
    });
  };

  // Xử lý khi người dùng click hoặc kéo ghim trên bản đồ để chọn tọa độ
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    const autoMapUrl = getGoogleMapsUrl(lat, lng) || "";
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      googleMapsUrl:
        !prev.googleMapsUrl ||
        prev.googleMapsUrl.startsWith("https://www.google.com/maps?q=")
          ? autoMapUrl
          : prev.googleMapsUrl,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.coordinates;
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCountry) {
      newErrors.country = "Vui lòng chọn quốc gia";
    }

    if (!formData.locationName || !formData.locationName.trim()) {
      newErrors.locationName = "Vui lòng nhập tên điểm đến";
    }

    if (!formData.status) {
      newErrors.status = "Vui lòng chọn trạng thái";
    }

    if (formData.googleMapsUrl && formData.googleMapsUrl.trim()) {
      try {
        new URL(formData.googleMapsUrl.trim());
      } catch {
        newErrors.googleMapsUrl = "Đường dẫn Google Maps không hợp lệ";
      }
    }

    const hasLat =
      formData.latitude !== "" &&
      formData.latitude !== null &&
      formData.latitude !== undefined;
    const hasLng =
      formData.longitude !== "" &&
      formData.longitude !== null &&
      formData.longitude !== undefined;

    if (hasLat !== hasLng) {
      newErrors.coordinates =
        "Vĩ độ và kinh độ phải cùng có giá trị hoặc cùng để trống";
    } else if (hasLat && hasLng) {
      const latNum = Number(formData.latitude);
      const lngNum = Number(formData.longitude);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        newErrors.coordinates = "Vĩ độ phải nằm trong khoảng từ -90 đến 90";
      } else if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        newErrors.coordinates = "Kinh độ phải nằm trong khoảng từ -180 đến 180";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (typeof result === "object" && result !== null) {
        if (!result.success) {
          return;
        }
        onClose();
      } else if (result === false) {
        return;
      } else {
        onClose();
      }
    } catch {
      // Toast notification tại trang cha sẽ hiển thị thông báo lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2.5 },
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
              component="h2"
              sx={{ fontWeight: 700, color: "#0F172A", fontSize: "1.15rem" }}
            >
              {isEdit ? "Chỉnh sửa điểm đến" : "Thêm điểm đến mới"}
            </Typography>
            <Typography
              variant="caption"
              component="p"
              sx={{ color: "#64748B", fontSize: "0.825rem" }}
            >
              {isEdit
                ? "Cập nhật thông tin điểm đến và vị trí trên bản đồ"
                : "Thêm điểm đến và chọn vị trí trực tiếp trên bản đồ"}
            </Typography>
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{ color: "#64748B" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: "14px !important", pb: 2.5 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* BỘ CHỌN 2 TRƯỜNG CÙNG HÀNG: QUỐC GIA & TÊN ĐIỂM ĐẾN */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {/* SELECTBOX: QUỐC GIA */}
            <Autocomplete<IGlobalCountry, false, false, false>
              sx={{ width: "100%" }}
              options={allCountries}
              getOptionLabel={(option) =>
                option.vietnameseName !== option.name
                  ? `${option.vietnameseName} (${option.name})`
                  : option.name
              }
              value={selectedCountry}
              isOptionEqualToValue={(option, value) =>
                option.iso2 === value.iso2
              }
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

            {/* TEXT INPUT: TÊN ĐIỂM ĐẾN */}
            <TextField
              label="Tên điểm đến *"
              placeholder="Ví dụ: Đà Lạt, Hà Nội, Tokyo, Manchester..."
              value={formData.locationName}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  locationName: val,
                  name: val,
                }));
                if (errors.locationName) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.locationName;
                    return next;
                  });
                }
              }}
              error={Boolean(errors.locationName)}
              helperText={
                errors.locationName ||
                "Nhập tên điểm đến bạn muốn lưu (thành phố, địa danh...)"
              }
              fullWidth
              size="small"
            />
          </Box>

          {/* BẢN ĐỒ TƯƠNG TÁC (Cho phép click chọn vị trí hoặc kéo ghim) */}
          <DestinationMapPreview
            country={selectedCountry}
            latitude={formData.latitude}
            longitude={formData.longitude}
            warning={locationWarning}
            onLocationSelect={handleLocationSelect}
            onLocationWarning={setLocationWarning}
            existingLocations={existingLocations}
            currentLocationId={initialData?.id}
            initialCoordinates={initialCoordinates}
          />

          {/* VĨ ĐỘ & KINH ĐỘ (READ-ONLY, tự động theo vị trí chọn từ bản đồ) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <TextField
              label="Vĩ độ (Latitude)"
              value={
                formData.latitude !== "" && formData.latitude !== null
                  ? formData.latitude
                  : "—"
              }
              fullWidth
              size="small"
              helperText="Chọn từ bản đồ (Không chỉnh sửa thủ công)"
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
              helperText="Chọn từ bản đồ (Không chỉnh sửa thủ công)"
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

          {/* Trạng thái (1 hàng riêng, mặc định null khi tạo mới, không chọn sẵn) */}
          <TextField
            select
            fullWidth
            size="small"
            label="Trạng thái *"
            value={formData.status || ""}
            error={Boolean(errors.status)}
            helperText={errors.status}
            onChange={(e) => {
              const val = e.target.value as LocationStatus;
              setFormData((prev) => ({
                ...prev,
                status: val || null,
              }));
              if (errors.status) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.status;
                  return next;
                });
              }
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              select: {
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return (
                      <Typography
                        component="span"
                        sx={{ color: "#94A3B8", fontSize: "14px" }}
                      >
                        -- Chọn trạng thái --
                      </Typography>
                    );
                  }
                  return selected === LocationStatus.Visited
                    ? "Đã ghé thăm (Visited)"
                    : "Muốn đến (Wishlist)";
                },
              },
            }}
          >
            <MenuItem value="" disabled sx={{ color: "#94A3B8" }}>
              <em>-- Chọn trạng thái --</em>
            </MenuItem>
            <MenuItem value={LocationStatus.Visited}>Đã ghé thăm (Visited)</MenuItem>
            <MenuItem value={LocationStatus.Wishlist}>Muốn đến (Wishlist)</MenuItem>
          </TextField>

          {/* Đường dẫn Google Maps (1 hàng riêng, tùy chọn) */}
          <TextField
            label="Đường dẫn Google Maps (Tùy chọn)"
            placeholder="https://www.google.com/maps?q=..."
            value={formData.googleMapsUrl || ""}
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
              "Tùy chọn liên kết xem trên Google Maps (tự động tạo theo tọa độ nếu có)."
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

          {/* Ảnh đại diện (Kéo thả hoặc chọn tệp) */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#1E293B" }}
              >
                Ảnh đại diện điểm đến
              </Typography>
              {formData.coverImage && (
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  startIcon={<DeleteOutlinedIcon fontSize="small" />}
                  onClick={handleRemoveImage}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    p: 0.5,
                  }}
                >
                  Xoá ảnh
                </Button>
              )}
            </Box>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />

            {formData.coverImage ? (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 180,
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <Box
                  component="img"
                  src={formData.coverImage || DEFAULT_NO_IMAGE}
                  alt="Ảnh đại diện điểm đến"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = DEFAULT_NO_IMAGE;
                    img.style.objectFit = "contain";
                    img.style.padding = "16px";
                    img.style.backgroundColor = "#F8FAFC";
                  }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit:
                      !formData.coverImage ||
                      formData.coverImage === DEFAULT_NO_IMAGE
                        ? "contain"
                        : "cover",
                    p:
                      !formData.coverImage ||
                      formData.coverImage === DEFAULT_NO_IMAGE
                        ? 2
                        : 0,
                    bgcolor:
                      !formData.coverImage ||
                      formData.coverImage === DEFAULT_NO_IMAGE
                        ? "#F8FAFC"
                        : "transparent",
                    boxSizing: "border-box",
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    bgcolor: "rgba(15, 23, 42, 0.8)",
                    backdropFilter: "blur(4px)",
                    color: "#FFFFFF",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                    "&:hover": { bgcolor: "rgba(15, 23, 42, 0.95)" },
                  }}
                >
                  Thay đổi ảnh
                </Button>
              </Box>
            ) : (
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  p: 3,
                  border: "2px dashed",
                  borderColor: isDragging ? "#2563EB" : "#CBD5E1",
                  borderRadius: "12px",
                  bgcolor: isDragging ? "#EFF6FF" : "#F8FAFC",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    borderColor: "#2563EB",
                    bgcolor: "#F1F5F9",
                  },
                }}
              >
                <CloudUploadOutlinedIcon
                  sx={{
                    fontSize: 40,
                    color: isDragging ? "#2563EB" : "#94A3B8",
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#1E293B" }}
                >
                  Kéo và thả ảnh vào đây, hoặc{" "}
                  <Box
                    component="span"
                    sx={{ color: "#2563EB", textDecoration: "underline" }}
                  >
                    chọn ảnh từ thiết bị
                  </Box>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#64748B", mt: 0.5 }}
                >
                  Hỗ trợ PNG, JPG, WebP (Tối đa 10MB)
                </Typography>
              </Box>
            )}

            {imageError && (
              <Typography variant="caption" sx={{ color: "#DC2626", mt: 0.5 }}>
                {imageError}
              </Typography>
            )}
          </Box>

          {/* Giới thiệu điểm đến (Textarea) */}
          <TextField
            label="Giới thiệu điểm đến"
            placeholder="Đặc điểm nổi bật, cảnh quan, khí hậu vùng miền..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            multiline
            minRows={3}
            fullWidth
            sx={{
              "& textarea": {
                resize: "vertical",
              },
            }}
          />

          {/* Ghi chú cá nhân / Kinh nghiệm (Textarea) */}
          <TextField
            label="Ghi chú cá nhân / Kinh nghiệm"
            placeholder="Lưu ý thời gian đi, mùa đẹp nhất, đặc sản nên thử..."
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            multiline
            minRows={3}
            fullWidth
            sx={{
              "& textarea": {
                resize: "vertical",
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderTop: "1px solid #F1F5F9",
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
          fullWidth
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            color: "#64748B",
            borderColor: "#CBD5E1",
            px: 2.5,
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSubmitting}
          fullWidth
          startIcon={
            isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3.5,
            boxShadow: "none",
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          {isSubmitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Lưu điểm đến"}
        </Button>
      </DialogActions>
    </>
  );
};

export const LocationFormDialog: React.FC<LocationFormDialogProps> = ({
  open,
  initialData,
  existingLocations,
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
            maxHeight: { xs: "96vh", sm: "92vh" },
            m: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "100%" },
          },
        },
      }}
    >
      {open && (
        <LocationFormInner
          key={initialData?.id || "new"}
          initialData={initialData}
          existingLocations={existingLocations}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
};
