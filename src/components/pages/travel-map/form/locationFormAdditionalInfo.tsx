import React from "react";
import { TextField } from "@mui/material";
import type { ILocationFormData } from "@/types/pages/travel-map/travelMap";

export interface LocationFormAdditionalInfoProps {
  formData: ILocationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ILocationFormData>>;
}

export const LocationFormAdditionalInfo: React.FC<
  LocationFormAdditionalInfoProps
> = ({ formData, setFormData }) => {
  return (
    <>
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
    </>
  );
};
