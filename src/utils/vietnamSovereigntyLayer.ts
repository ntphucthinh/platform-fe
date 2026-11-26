import L from "leaflet";
import {
  VN_MARITIME_GEOJSON,
  VN_MARITIME_LABELS,
  VN_NATURAL_ISLANDS_GEOJSON,
  VN_OCEAN_MASK_GEOJSON,
  VN_SOVEREIGNTY_SPOTS,
} from "@/constants/vietnamSovereignty";

export interface VietnamSovereigntyLayerHandle {
  layerGroup: L.LayerGroup;
  cleanup: () => void;
}

/** Màu nước biển tiêu chuẩn của OpenStreetMap Carto */
const OSM_OCEAN_WATER_HEX = "#aad3df";
/** Màu đất đảo tiêu chuẩn của OpenStreetMap Carto */
const OSM_ISLAND_LAND_HEX = "#f2efe9";

interface ZoomAwareMarkerEntry {
  marker: L.Marker;
  minZoom: number;
}

/**
 * Khởi tạo Layer Chủ quyền Biển đảo Việt Nam (Hoàng Sa & Trường Sa)
 * - Lớp phủ mặt nước biển (Water Masking Overlay #aad3df) xóa sạch 100% chữ Trung Quốc & đường biên phi pháp trên tile OSM
 * - Vẽ thềm san hô và hình thể đảo tự nhiên tại tọa độ thực tế
 * - Vẽ ranh giới lãnh thổ vùng biển đảo Việt Nam (VN_MARITIME_GEOJSON)
 * - Hiển thị nhãn danh xưng chủ quyền chuẩn xác (VN_MARITIME_LABELS)
 * - Hiển thị các thực thể đảo/đá kèm nhãn tên tiếng Việt trực tiếp trên bản đồ (VN_SOVEREIGNTY_SPOTS)
 */
export function createVietnamSovereigntyLayer(
  map: L.Map,
): VietnamSovereigntyLayerHandle {
  const layerGroup = L.layerGroup();
  const zoomAwareMarkers: ZoomAwareMarkerEntry[] = [];

  // Tạo custom pane nằm ngay trên tilePane (z-index 200) và dưới overlayPane (z-index 400)
  const maskPaneName = "vnOceanMaskPane";
  let maskPane = map.getPane(maskPaneName);
  if (!maskPane) {
    maskPane = map.createPane(maskPaneName);
    maskPane.style.zIndex = "250";
    maskPane.style.pointerEvents = "none";
  }

  // 1. Lớp phủ mặt nước biển (Water Masking Overlay) che triệt để chữ Trung Quốc trên tile PNG
  try {
    L.geoJSON(VN_OCEAN_MASK_GEOJSON, {
      pane: maskPaneName,
      style: {
        color: OSM_OCEAN_WATER_HEX,
        weight: 6,
        opacity: 1,
        fillColor: OSM_OCEAN_WATER_HEX,
        fillOpacity: 1,
      },
      interactive: false,
    }).addTo(layerGroup);

    // Phủ bổ sung theo đúng biên đa giác Hoàng Sa & Trường Sa để khử hoàn toàn viền xám của OSM
    L.geoJSON(VN_MARITIME_GEOJSON, {
      pane: maskPaneName,
      style: {
        color: OSM_OCEAN_WATER_HEX,
        weight: 10,
        opacity: 1,
        fillColor: OSM_OCEAN_WATER_HEX,
        fillOpacity: 1,
      },
      interactive: false,
    }).addTo(layerGroup);
  } catch (err) {
    console.warn("Không thể khởi tạo lớp phủ mặt nước VN_OCEAN_MASK_GEOJSON:", err);
  }

  // 1.5. Vẽ thềm san hô & thực thể đảo tự nhiên trên nền nước biển đã làm sạch (thay thế vòng tròn L.circle)
  try {
    L.geoJSON(VN_NATURAL_ISLANDS_GEOJSON, {
      pane: maskPaneName,
      style: (feature) => {
        const featType = feature?.properties?.type;
        if (featType === "reef") {
          return {
            color: "#96c4d4",
            weight: 1.2,
            opacity: 0.75,
            fillColor: "#b7dce8",
            fillOpacity: 0.7,
          };
        }
        if (featType === "lagoon") {
          return {
            color: "#8bc2d6",
            weight: 0.8,
            opacity: 0.5,
            fillColor: "#9ecfdf",
            fillOpacity: 0.5,
          };
        }
        if (featType === "vegetation") {
          return {
            color: "#9bc29e",
            weight: 0.8,
            opacity: 0.75,
            fillColor: "#cbe2ce",
            fillOpacity: 0.85,
          };
        }
        // Default: "land" - màu đất bãi cát đảo tự nhiên chuẩn OpenStreetMap
        return {
          color: "#d4cec3",
          weight: 1.1,
          opacity: 0.95,
          fillColor: OSM_ISLAND_LAND_HEX,
          fillOpacity: 0.98,
        };
      },
      interactive: false,
    }).addTo(layerGroup);
  } catch (err) {
    console.warn("Không thể vẽ hình thể đảo tự nhiên VN_NATURAL_ISLANDS_GEOJSON:", err);
  }

  // 2. Vẽ ranh giới lãnh hải & vùng biển đảo Hoàng Sa & Trường Sa của Việt Nam
  try {
    L.geoJSON(VN_MARITIME_GEOJSON, {
      style: {
        color: "#2563EB",
        weight: 1.6,
        opacity: 0.78,
        fillColor: "#60A5FA",
        fillOpacity: 0.04,
        dashArray: "6, 6",
      },
      interactive: false,
    }).addTo(layerGroup);
  } catch (err) {
    console.warn("Không thể vẽ ranh giới VN_MARITIME_GEOJSON:", err);
  }

  // 3. Tạo các nhãn danh xưng chủ quyền biển đảo (VN_MARITIME_LABELS)
  VN_MARITIME_LABELS.forEach((label) => {
    const isTitle = label.styleType === "title";
    const isSubgroup = label.styleType === "subgroup";

    const labelHtml = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
        pointer-events: auto;
      ">
        <span style="
          font-size: ${isTitle ? "12.5px" : isSubgroup ? "10.5px" : "11px"};
          font-weight: ${isTitle ? "700" : "600"};
          font-style: ${isSubgroup ? "italic" : "normal"};
          color: ${isTitle ? "#0F172A" : "#1E3A8A"};
          text-shadow:
            -1.5px -1.5px 0 #ffffff,
             1.5px -1.5px 0 #ffffff,
            -1.5px  1.5px 0 #ffffff,
             1.5px  1.5px 0 #ffffff,
             0px    0px   4px #ffffff,
             0px    0px   6px #ffffff;
          letter-spacing: ${isTitle ? "0.3px" : "0.15px"};
          line-height: 1.25;
        ">
          ${label.text}
        </span>
        ${
          label.subText
            ? `<span style="
                font-size: 10px;
                font-weight: 600;
                color: #1D4ED8;
                text-shadow:
                  -1px -1px 0 #ffffff,
                   1px -1px 0 #ffffff,
                  -1px  1px 0 #ffffff,
                   1px  1px 0 #ffffff,
                   0px  0px 3px #ffffff;
                line-height: 1.2;
                margin-top: 1px;
              ">
                (${label.subText})
              </span>`
            : ""
        }
      </div>
    `;

    const labelIcon = L.divIcon({
      className: "",
      html: labelHtml,
      iconSize: isTitle ? [180, 34] : [130, 20],
      iconAnchor: isTitle ? [90, 17] : [65, 10],
    });

    const labelMarker = L.marker([label.lat, label.lng], {
      icon: labelIcon,
      interactive: true,
      zIndexOffset: isTitle ? 500 : 420,
    });

    if (label.tooltip) {
      labelMarker.bindTooltip(label.tooltip, {
        direction: "top",
        offset: [0, -10],
        opacity: 0.95,
      });
    }

    const isHoangSa = label.id.includes("hoang-sa");
    const isTruongSa = label.id.includes("truong-sa");
    const adminUnit = isHoangSa
      ? "Huyện Hoàng Sa, TP. Đà Nẵng, Việt Nam"
      : isTruongSa
      ? "Huyện Trường Sa, Tỉnh Khánh Hòa, Việt Nam"
      : "Khu vực biển đảo Tỉnh Khánh Hòa, Việt Nam";

    const popupHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; padding: 4px 2px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
          <span style="font-size: 18px;">🇻🇳</span>
          <div>
            <div style="font-weight: 800; font-size: 13px; color: #DC2626;">${
              label.text
            }</div>
            <div style="font-size: 11px; color: #64748B;">
              ${
                isHoangSa
                  ? "Paracel Islands — Vietnam"
                  : isTruongSa
                  ? "Spratly Islands — Vietnam"
                  : "Khanh Hoa Province — Vietnam"
              }
            </div>
          </div>
        </div>
        <div style="font-size: 11.5px; color: #1E293B; font-weight: 600; margin-bottom: 4px;">
          ${adminUnit}
        </div>
        <div style="font-size: 11px; color: #475569; line-height: 1.45; background: #F8FAFC; padding: 6px 8px; border-radius: 6px; border: 1px solid #FECACA;">
          Chủ quyền lịch sử và pháp lý không thể tranh cãi của Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
        </div>
      </div>
    `;

    labelMarker.bindPopup(popupHtml, {
      className: "vn-sovereignty-popup",
      closeButton: true,
      autoPan: true,
    });

    labelMarker.on("click", () => {
      map.flyTo([label.lat, label.lng], Math.max(map.getZoom(), 7), {
        duration: 1.1,
        easeLinearity: 0.25,
      });
    });

    if (label.minZoom && label.minZoom > 1) {
      zoomAwareMarkers.push({
        marker: labelMarker,
        minZoom: label.minZoom,
      });
    }

    labelMarker.addTo(layerGroup);
  });

  // 4. Tạo Marker kèm nhãn tên tiếng Việt hiển thị trực tiếp cho các đảo & rạn san hô (VN_SOVEREIGNTY_SPOTS)
  VN_SOVEREIGNTY_SPOTS.forEach((spot) => {
    const isOccupied = spot.occupied;
    const dotColor = isOccupied ? "#DC2626" : "#059669";
    const dotBg = isOccupied
      ? "rgba(220, 38, 38, 0.16)"
      : "rgba(5, 150, 105, 0.16)";

    const spotHtml = `
      <div style="
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        pointer-events: auto;
        user-select: none;
        transform: translate(-9px, -9px);
      ">
        <div style="
          position: relative;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            position: absolute;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: ${dotBg};
          "></span>
          <span style="
            position: relative;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${dotColor};
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            border: 1.5px solid #FFFFFF;
          "></span>
        </div>
        <span style="
          margin-left: 4px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #172033;
          text-shadow:
            -1.2px -1.2px 0 #FFFFFF,
             1.2px -1.2px 0 #FFFFFF,
            -1.2px  1.2px 0 #FFFFFF,
             1.2px  1.2px 0 #FFFFFF,
             0px    0px   4px #FFFFFF;
          white-space: nowrap;
          line-height: 1.2;
        ">
          ${spot.nameVi}
        </span>
      </div>
    `;

    const spotIcon = L.divIcon({
      className: "",
      html: spotHtml,
      iconSize: [140, 20],
      iconAnchor: [0, 0],
    });

    const spotMarker = L.marker([spot.lat, spot.lng], {
      icon: spotIcon,
      interactive: true,
      zIndexOffset: 320,
    });

    const statusBadge = isOccupied
      ? `<span style="display: inline-block; background: rgba(239,68,68,0.12); color: #DC2626; border: 1px solid rgba(220,38,38,0.25); padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">
           Trung Quốc chiếm đóng trái phép · Vietnam sovereignty
         </span>`
      : `<span style="display: inline-block; background: rgba(16,185,129,0.12); color: #059669; border: 1px solid rgba(5,150,105,0.25); padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">
           Việt Nam quản lý &amp; bảo vệ · Vietnam-administered
         </span>`;

    const popupContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; max-width: 280px; padding: 2px;">
        <div style="font-weight: 700; font-size: 13.5px; color: #0F172A; margin-bottom: 1px;">
          ${spot.nameVi}
        </div>
        <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">
          ${spot.nameEn}
        </div>
        <div style="margin-bottom: 6px;">
          ${statusBadge}
        </div>
        <div style="font-size: 11px; color: #1E293B; font-weight: 500; margin-bottom: 4px;">
          ${spot.adminUnit}
        </div>
        <div style="font-size: 11px; color: #475569; line-height: 1.4; background: #F8FAFC; padding: 6px 8px; border-radius: 6px;">
          ${spot.noteVi}
        </div>
        <div style="margin-top: 6px; padding-top: 5px; border-top: 1px solid #E2E8F0; font-size: 9.5px; color: #94A3B8;">
          Tọa độ: ${spot.lat.toFixed(4)}°N, ${spot.lng.toFixed(4)}°E
        </div>
      </div>
    `;

    spotMarker.bindPopup(popupContent, {
      className: "vn-sovereignty-popup",
      closeButton: true,
      autoPan: true,
    });

    spotMarker.bindTooltip(`${spot.nameVi} (${spot.adminUnit})`, {
      direction: "top",
      offset: [0, -10],
      className: "vn-sovereignty-tooltip",
      opacity: 0.95,
    });

    zoomAwareMarkers.push({
      marker: spotMarker,
      minZoom: spot.minZoom ?? 7,
    });
    spotMarker.addTo(layerGroup);
  });

  // 5. Zoom-aware listener: hiển thị phân tầng nhãn đảo theo mức zoom để bản đồ luôn thoáng và rõ
  const updateVisibility = () => {
    const currentZoom = map.getZoom();

    zoomAwareMarkers.forEach(({ marker, minZoom }) => {
      const el = marker.getElement();
      if (el) {
        el.style.display = currentZoom >= minZoom ? "" : "none";
      }
    });
  };

  map.on("zoomend", updateVisibility);
  setTimeout(updateVisibility, 50);

  return {
    layerGroup,
    cleanup: () => {
      map.off("zoomend", updateVisibility);
      layerGroup.clearLayers();
    },
  };
}
