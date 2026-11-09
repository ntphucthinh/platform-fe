import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Paper, Tooltip } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import WifiOffOutlinedIcon from "@mui/icons-material/WifiOffOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import type { Feature } from "geojson";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import {
  VIETNAM_DEFAULT_CENTER,
  VIETNAM_DEFAULT_ZOOM,
} from "@/constants/travelMap";
import {
  getCountryBoundary,
  getCountryCenterAndZoom,
  type CountryGeometry,
} from "@/utils/travelMapUtils";
import { createVietnamSovereigntyLayer } from "@/utils/vietnamSovereigntyLayer";

interface TravelLeafletMapProps {
  locations: ILocationWithDetails[];
  selectedLocationId: number | null;
  onSelectLocation: (id: number) => void;
  onSwitchToList: () => void;
  panelOpen: boolean;
  selectedCountryCode?: string | null;
}

export const TravelLeafletMap: React.FC<TravelLeafletMapProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onSwitchToList,
  panelOpen,
  selectedCountryCode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const highlightLayerRef = useRef<L.GeoJSON | null>(null);
  const prevCountryCodeRef = useRef<string | undefined>(undefined);
  const [tileError, setTileError] = useState(false);

  // 1. Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: VIETNAM_DEFAULT_CENTER,
      zoom: VIETNAM_DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    });

    // Clamp vertical dragging to prevent scrolling into blank polar void
    const MAX_LAT = 85.051129;
    const MIN_LAT = -85.051129;
    map.on("drag", () => {
      const center = map.getCenter();
      let clampedLat = center.lat;
      if (center.lat > MAX_LAT) {
        clampedLat = MAX_LAT;
      } else if (center.lat < MIN_LAT) {
        clampedLat = MIN_LAT;
      }
      if (center.lat !== clampedLat) {
        map.panTo([clampedLat, center.lng], { animate: false });
      }
    });

    const tileLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      },
    );

    tileLayer.on("tileerror", () => {
      setTileError(true);
    });

    tileLayer.addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Khởi tạo Layer Chủ quyền Biển đảo Việt Nam (Hoàng Sa & Trường Sa)
    const vnSovereignty = createVietnamSovereigntyLayer(map);
    vnSovereignty.layerGroup.addTo(map);

    // Cập nhật tỷ lệ kích thước marker động theo mức zoom bản đồ
    const updateMarkerScale = () => {
      if (!mapContainerRef.current) return;
      const zoom = map.getZoom();
      // Thu nhỏ mượt mà khi zoom out (zoom <= 5), mở rộng vừa vặn khi zoom in (zoom >= 7)
      const scale = Math.min(1.25, Math.max(0.5, 1.0 + (zoom - 6) * 0.15));
      mapContainerRef.current.style.setProperty(
        "--travel-marker-scale",
        scale.toFixed(2),
      );
      mapContainerRef.current.classList.toggle("map-zoom-low", zoom <= 3);
    };

    updateMarkerScale();
    map.on("zoom", updateMarkerScale);
    map.on("zoomend", updateMarkerScale);

    mapInstanceRef.current = map;

    return () => {
      map.off("zoom", updateMarkerScale);
      map.off("zoomend", updateMarkerScale);
      vnSovereignty.cleanup();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Invalidate size when panel toggles or window resizes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 330);
    return () => clearTimeout(timer);
  }, [panelOpen]);

  // Keep map dimensions strictly updated on container resize
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Render markers whenever locations or selectedLocationId change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocationId;
      const isVisited = loc.status === "Visited";

      // SVG Icon Pin
      const pinColor = isVisited ? "#1976D2" : "#D97706";
      const badgeText =
        isVisited && loc.visitCount > 1 ? `${loc.visitCount}` : "";

      const pinSize = isSelected ? "26px" : "20px";
      const iconFontSize = isSelected ? "11px" : "9px";
      const labelFontSize = isSelected ? "9.5px" : "9px";
      const labelPadding = isSelected ? "1.5px 6px" : "1px 5px";

      const iconHtml = `
        <div class="travel-map-custom-marker ${isSelected ? "selected" : ""}" style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transform-origin: 50% 100%;
          transform: translate(-50%, -100%) scale(var(--travel-marker-scale, 1));
          transition: transform 0.15s ease-out;
        ">
          <div class="travel-marker-pin" style="
            width: ${pinSize};
            height: ${pinSize};
            background-color: ${pinColor};
            border: ${isSelected ? "2px" : "1.8px"} solid #FFFFFF;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: ${
              isSelected
                ? `0 0 0 3px rgba(25, 118, 210, 0.3), 0 4px 10px rgba(0,0,0,0.25)`
                : `0 2px 5px rgba(0,0,0,0.2)`
            };
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          ">
            <span style="
              transform: rotate(45deg);
              color: #FFFFFF;
              font-weight: 700;
              font-size: ${iconFontSize};
              line-height: 1;
            ">${badgeText || (isVisited ? "✓" : "★")}</span>
          </div>
          <div class="travel-marker-label" style="
            margin-top: 2px;
            background-color: ${isSelected ? "rgba(15, 23, 42, 0.95)" : "rgba(15, 23, 42, 0.85)"};
            color: #FFFFFF;
            font-size: ${labelFontSize};
            font-weight: ${isSelected ? "700" : "600"};
            padding: ${labelPadding};
            border-radius: 4px;
            border: ${isSelected ? "1px solid rgba(255,255,255,0.4)" : "none"};
            white-space: nowrap;
            box-shadow: 0 1.5px 4px rgba(0,0,0,0.2);
            pointer-events: none;
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            gap: 3.5px;
            line-height: 1.2;
          ">
            ${
              loc.countryCode
                ? `<img src="https://flagcdn.com/${loc.countryCode.toLowerCase()}.svg" width="11" height="8" style="border-radius: 1px; object-fit: cover;" onerror="this.style.display='none'" />`
                : ""
            }
            <span>${loc.locationName || loc.name}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: iconHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      if (loc.latitude === null || loc.longitude === null) {
        return;
      }

      // Replicate markers on adjacent world copies (-360, 0, +360) so data remains visible when panning horizontally
      const WORLD_OFFSETS = [-360, 0, 360];
      WORLD_OFFSETS.forEach((offset) => {
        const marker = L.marker([loc.latitude!, loc.longitude! + offset], {
          icon: customIcon,
          zIndexOffset: isSelected ? 1000 : 100,
        });

        marker.on("click", () => {
          onSelectLocation(loc.id);
        });

        marker.addTo(markersGroup);
      });
    });
  }, [locations, selectedLocationId, onSelectLocation]);

  // 4. Pan to selected location smoothly
  useEffect(() => {
    if (!selectedLocationId || !mapInstanceRef.current) return;
    const target = locations.find((l) => l.id === selectedLocationId);
    if (target && target.latitude !== null && target.longitude !== null) {
      const currentCenter = mapInstanceRef.current.getCenter();
      // Target the closest world copy longitude to the current view center
      const diff = currentCenter.lng - target.longitude;
      const roundWorlds = Math.round(diff / 360);
      const targetLng = target.longitude + roundWorlds * 360;

      mapInstanceRef.current.flyTo([target.latitude, targetLng], 10, {
        duration: 1,
      });
    }
  }, [selectedLocationId, locations]);

  // 5. Highlight quốc gia và bay camera tới quốc gia được chọn
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let isCancelled = false;

    if (!selectedCountryCode || selectedCountryCode === "ALL") {
      prevCountryCodeRef.current = undefined;
      if (highlightLayerRef.current) {
        map.removeLayer(highlightLayerRef.current);
        highlightLayerRef.current = null;
      }
      return;
    }

    if (prevCountryCodeRef.current === selectedCountryCode) {
      return;
    }
    prevCountryCodeRef.current = selectedCountryCode;

    getCountryBoundary(selectedCountryCode).then(
      (geometry: CountryGeometry | null) => {
        if (isCancelled || !mapInstanceRef.current) return;

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

            const bounds = geoJsonLayer.getBounds();
            if (bounds.isValid()) {
              map.flyToBounds(bounds, {
                padding: [30, 30],
                maxZoom: selectedCountryCode.toUpperCase() === "SG" ? 11 : 8,
                duration: 1.5,
                easeLinearity: 0.25,
              });
              return;
            }
          } catch (err) {
            console.warn("Lỗi khi hiển thị highlight quốc gia trên bản đồ chính:", err);
          }
        }

        // Fallback flyTo nếu không có bounds GeoJSON
        const { center, zoom } = getCountryCenterAndZoom(selectedCountryCode);
        map.flyTo(center, zoom, {
          duration: 1.5,
          easeLinearity: 0.25,
        });
      },
    );

    return () => {
      isCancelled = true;
    };
  }, [selectedCountryCode]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const currentCenter = mapInstanceRef.current.getCenter();
    const diff = currentCenter.lng - VIETNAM_DEFAULT_CENTER[1];
    const roundWorlds = Math.round(diff / 360);
    const targetLng = VIETNAM_DEFAULT_CENTER[1] + roundWorlds * 360;

    mapInstanceRef.current.flyTo([VIETNAM_DEFAULT_CENTER[0], targetLng], VIETNAM_DEFAULT_ZOOM, {
      duration: 1,
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: { xs: 450, sm: 550, md: 620 },
        bgcolor: "#F1F5F9",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #E2E8F0",
      }}
    >
      {/* Map DOM Container */}
      <Box
        ref={mapContainerRef}
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "inherit",
          zIndex: 1,
          "& .custom-div-icon": {
            overflow: "visible",
          },
          "& .travel-map-custom-marker:hover": {
            zIndex: 9999,
            "& .travel-marker-pin": {
              transform: "rotate(-45deg) scale(1.12)",
            },
          },
          "&.map-zoom-low .travel-marker-label": {
            display: "none !important",
          },
        }}
      />

      {/* Floating Map Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 400,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: "10px",
            bgcolor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #E2E8F0",
          }}
        >
          <Tooltip title="Phóng to" placement="left">
            <Button
              onClick={handleZoomIn}
              sx={{
                minWidth: 38,
                width: 38,
                height: 38,
                color: "#334155",
                borderRadius: 0,
                borderBottom: "1px solid #E2E8F0",
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              <ZoomInIcon fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Thu nhỏ" placement="left">
            <Button
              onClick={handleZoomOut}
              sx={{
                minWidth: 38,
                width: 38,
                height: 38,
                color: "#334155",
                borderRadius: 0,
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              <ZoomOutIcon fontSize="small" />
            </Button>
          </Tooltip>
        </Paper>

        <Tooltip title="Về toàn cảnh Việt Nam" placement="left">
          <Paper
            elevation={2}
            sx={{
              borderRadius: "10px",
              bgcolor: "#FFFFFF",
              overflow: "hidden",
              border: "1px solid #E2E8F0",
            }}
          >
            <Button
              onClick={handleResetView}
              sx={{
                minWidth: 38,
                width: 38,
                height: 38,
                color: "#1976D2",
                "&:hover": { bgcolor: "#F0F7FF" },
              }}
            >
              <MyLocationIcon fontSize="small" />
            </Button>
          </Paper>
        </Tooltip>
      </Box>

      {/* Map Legend */}
      <Paper
        elevation={2}
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          zIndex: 400,
          bgcolor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(6px)",
          borderRadius: "10px",
          p: 1.5,
          border: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "#1976D2",
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155" }}>
            Đã ghé thăm (Visited)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "#D97706",
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155" }}>
            Muốn đến (Wishlist)
          </Typography>
        </Box>
      </Paper>

      {/* Tile load error fallback notice */}
      {tileError && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 400,
            maxWidth: 380,
            p: 2,
            bgcolor: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WifiOffOutlinedIcon sx={{ color: "#D97706", fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#92400E" }}>
              Bản đồ trực tuyến bị giới hạn
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#B45309", lineHeight: 1.4 }}>
            Không thể tải dữ liệu ảnh nền bản đồ OpenStreetMap. Marker và tọa độ vẫn
            hoạt động, hoặc bạn có thể chuyển sang chế độ Danh sách để duyệt tiện lợi hơn.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FormatListBulletedOutlinedIcon />}
            onClick={onSwitchToList}
            sx={{
              alignSelf: "flex-start",
              textTransform: "none",
              color: "#92400E",
              borderColor: "#FCD34D",
              fontWeight: 600,
              fontSize: "0.8rem",
              borderRadius: "6px",
            }}
          >
            Chuyển sang chế độ Danh sách
          </Button>
        </Paper>
      )}
    </Box>
  );
};
