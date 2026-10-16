import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Paper, Tooltip } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import WifiOffOutlinedIcon from "@mui/icons-material/WifiOffOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import {
  VIETNAM_DEFAULT_CENTER,
  VIETNAM_DEFAULT_ZOOM,
} from "@/constants/travelMapConstant";

interface TravelLeafletMapProps {
  locations: ILocationWithDetails[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
  onSwitchToList: () => void;
  panelOpen: boolean;
}

export const TravelLeafletMap: React.FC<TravelLeafletMapProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onSwitchToList,
  panelOpen,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
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
      minZoom: 4,
      maxZoom: 18,
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
    mapInstanceRef.current = map;

    return () => {
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
    }, 280);
    return () => clearTimeout(timer);
  }, [panelOpen]);

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

      const iconHtml = `
        <div class="travel-map-custom-marker ${isSelected ? "selected" : ""}" style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transform: translate(-50%, -100%);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
          <div style="
            width: ${isSelected ? "38px" : "32px"};
            height: ${isSelected ? "38px" : "32px"};
            background-color: ${pinColor};
            border: 2.5px solid #FFFFFF;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: ${
              isSelected
                ? `0 0 0 5px rgba(25, 118, 210, 0.3), 0 8px 16px rgba(0,0,0,0.3)`
                : `0 4px 10px rgba(0,0,0,0.2)`
            };
          ">
            <span style="
              transform: rotate(45deg);
              color: #FFFFFF;
              font-weight: 700;
              font-size: 13px;
              line-height: 1;
            ">${badgeText || (isVisited ? "✓" : "★")}</span>
          </div>
          <div style="
            margin-top: 4px;
            background-color: rgba(15, 23, 42, 0.85);
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 6px;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            pointer-events: none;
            backdrop-filter: blur(4px);
          ">
            ${loc.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: iconHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      });

      marker.on("click", () => {
        onSelectLocation(loc.id);
      });

      marker.addTo(markersGroup);
    });
  }, [locations, selectedLocationId, onSelectLocation]);

  // 4. Pan to selected location smoothly
  useEffect(() => {
    if (!selectedLocationId || !mapInstanceRef.current) return;
    const target = locations.find((l) => l.id === selectedLocationId);
    if (target) {
      mapInstanceRef.current.flyTo([target.latitude, target.longitude], 10, {
        duration: 1,
      });
    }
  }, [selectedLocationId, locations]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.flyTo(VIETNAM_DEFAULT_CENTER, VIETNAM_DEFAULT_ZOOM, {
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
