import React, { useState } from "react";
import { Box, CardMedia, Grid, Paper } from "@mui/material";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

export interface HomestayGalleryProps {
  mainImage: string;
  images: string[];
  title: string;
}

export const HomestayGallery: React.FC<HomestayGalleryProps> = ({
  mainImage,
  images,
  title,
}) => {
  const validImages = (images || []).filter((img) => Boolean(img) && img.trim() !== "");
  const fallbackImage = mainImage || validImages[0] || DEFAULT_NO_IMAGE;
  const allImages = validImages.length > 0 ? Array.from(new Set(validImages)) : [DEFAULT_NO_IMAGE];

  const [selectedImage, setSelectedImage] = useState<string>(
    allImages[0] || fallbackImage
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Main Image View */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
          position: "relative",
          pt: { xs: "65%", sm: "52%" },
          bgcolor: "#F8FAFC",
        }}
      >
        <CardMedia
          component="img"
          image={selectedImage || DEFAULT_NO_IMAGE}
          alt={title}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = DEFAULT_NO_IMAGE;
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.3s ease",
          }}
        />
      </Paper>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <Grid container spacing={1.5}>
          {allImages.map((imgUrl, index) => {
            const isSelected = imgUrl === selectedImage;
            return (
              <Grid size={{ xs: 3, sm: 2.4 }} key={index}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedImage(imgUrl)}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    pt: "75%",
                    border: "2px solid",
                    borderColor: isSelected ? "#2563EB" : "#E2E8F0",
                    opacity: isSelected ? 1 : 0.75,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      opacity: 1,
                      borderColor: isSelected ? "#2563EB" : "#CBD5E1",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={imgUrl}
                    alt={`${title} view ${index + 1}`}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
