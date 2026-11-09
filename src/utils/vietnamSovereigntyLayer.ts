import L from "leaflet";
import {
  VN_MARITIME_GEOJSON,
  VN_MARITIME_LABELS,
  VN_SOVEREIGNTY_SPOTS,
} from "@/constants/vietnamSovereignty";

export interface VietnamSovereigntyLayerHandle {
  layerGroup: L.LayerGroup;
  cleanup: () => void;
}

/**
 * Khởi tạo Layer Chủ quyền Biển đảo Việt Nam (Hoàng Sa & Trường Sa)
 * - Vẽ ranh giới lãnh thổ vùng biển đảo (VN_MARITIME_GEOJSON)
 * - Hiển thị nhãn danh xưng chuẩn xác (VN_MARITIME_LABELS)
 * - Hiển thị 12 thực thể địa lý trọng yếu với nhãn chủ quyền song ngữ (VN_SOVEREIGNTY_SPOTS)
 * - Zoom-aware: hiển thị tối ưu theo mức zoom
 */
export function createVietnamSovereigntyLayer(
  map: L.Map,
): VietnamSovereigntyLayerHandle {
  const layerGroup = L.layerGroup();
  const detailMarkers: L.Marker[] = [];

  // 1. Vẽ ranh giới lãnh hải & vùng biển đảo Hoàng Sa & Trường Sa
  try {
    L.geoJSON(VN_MARITIME_GEOJSON, {
      style: {
        color: "#2563EB",
        weight: 1.5,
        opacity: 0.75,
        fillColor: "#60A5FA",
        fillOpacity: 0.03,
        dashArray: "6, 6",
      },
      interactive: false,
    }).addTo(layerGroup);
  } catch (err) {
    console.warn("Không thể vẽ ranh giới VN_MARITIME_GEOJSON:", err);
  }

  // 2. Tạo các nhãn danh xưng chủ quyền biển đảo (VN_MARITIME_LABELS)
  VN_MARITIME_LABELS.forEach((label) => {
    const isTitle = label.styleType === "title";

    const labelHtml = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: ${isTitle ? "12px" : "11px"};
        font-weight: ${isTitle ? "600" : "500"};
        color: #000000;
        text-shadow:
          -1px -1px 0 #ffffff,
           1px -1px 0 #ffffff,
          -1px  1px 0 #ffffff,
           1px  1px 0 #ffffff,
           0px  0px 3px #ffffff,
           0px  0px 4px #ffffff;
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
        pointer-events: auto;
        letter-spacing: 0.2px;
        line-height: 1.2;
      ">
        ${label.text}
      </div>
    `;

    const labelIcon = L.divIcon({
      className: "",
      html: labelHtml,
      iconSize: isTitle ? [140, 20] : [100, 18],
      iconAnchor: isTitle ? [70, 10] : [50, 9],
    });

    const labelMarker = L.marker([label.lat, label.lng], {
      icon: labelIcon,
      interactive: true,
      zIndexOffset: isTitle ? 500 : 400,
    });

    if (label.tooltip) {
      labelMarker.bindTooltip(label.tooltip, {
        direction: "top",
        offset: [0, -10],
        opacity: 0.95,
      });
    }

    const adminUnit =
      label.id === "label-hoang-sa"
        ? "Huyện Hoàng Sa, TP. Đà Nẵng, Việt Nam"
        : label.id === "label-truong-sa"
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
                label.id === "label-hoang-sa"
                  ? "Paracel Islands"
                  : label.id === "label-truong-sa"
                  ? "Spratly Islands"
                  : "Khanh Hoa Province"
              }
            </div>
          </div>
        </div>
        <div style="font-size: 11.5px; color: #1E293B; font-weight: 600; margin-bottom: 4px;">
          ${adminUnit}
        </div>
        <div style="font-size: 11px; color: #475569; line-height: 1.45; background: #F8FAFC; padding: 6px 8px; border-radius: 6px; border-left: 3px solid #DC2626;">
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
      map.flyTo([label.lat, label.lng], 7, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    });

    labelMarker.addTo(layerGroup);
  });

  // 3. Tạo 12 Marker cho các thực thể đảo & rạn san hô trọng yếu (VN_SOVEREIGNTY_SPOTS)
  VN_SOVEREIGNTY_SPOTS.forEach((spot) => {
    const isOccupied = spot.occupied;
    const dotColor = isOccupied ? "#DC2626" : "#059669";
    const dotBg = isOccupied
      ? "rgba(220, 38, 38, 0.15)"
      : "rgba(5, 150, 105, 0.15)";

    const spotHtml = `
      <div style="
        position: relative;
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        pointer-events: auto;
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
    `;

    const spotIcon = L.divIcon({
      className: "",
      html: spotHtml,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    const spotMarker = L.marker([spot.lat, spot.lng], {
      icon: spotIcon,
      interactive: true,
      zIndexOffset: 300,
    });

    const statusBadge = isOccupied
      ? `<span style="display: inline-block; background: rgba(239,68,68,0.12); color: #DC2626; border: 1px solid rgba(220,38,38,0.25); padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">
           Trung Quốc chiếm đóng trái phép · Vietnam sovereignty disputed
         </span>`
      : `<span style="display: inline-block; background: rgba(16,185,129,0.12); color: #059669; border: 1px solid rgba(5,150,105,0.25); padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">
           Việt Nam kiểm soát · Vietnam-administered
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

    spotMarker.bindTooltip(spot.nameVi, {
      direction: "top",
      offset: [0, -8],
      className: "vn-sovereignty-tooltip",
      opacity: 0.95,
    });

    detailMarkers.push(spotMarker);
    spotMarker.addTo(layerGroup);
  });

  // 4. Zoom-aware listener: chỉ hiển thị chi tiết 12 đảo khi zoom >= 7
  const updateVisibility = () => {
    const currentZoom = map.getZoom();
    const showDetails = currentZoom >= 7;

    detailMarkers.forEach((marker) => {
      const el = marker.getElement();
      if (el) {
        el.style.display = showDetails ? "" : "none";
      }
    });
  };

  map.on("zoomend", updateVisibility);
  // Khởi tạo trạng thái ban đầu
  setTimeout(updateVisibility, 50);

  return {
    layerGroup,
    cleanup: () => {
      map.off("zoomend", updateVisibility);
      layerGroup.clearLayers();
    },
  };
}
