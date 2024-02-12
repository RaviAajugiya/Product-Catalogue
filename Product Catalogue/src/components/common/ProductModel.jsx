import React, { useState } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReactImageMagnify from "react-image-magnify";
import theme from "./theme";

function ImageZoom({ smallImage, largeImage }) {
  return (
    <Box
      sx={{ border: `0.5px solid ${theme.palette.primary.border}` }}
      className="h-[400px] md:w-[415px] md:h-[500px] m-auto relative border-0.5 border-gray-300">
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: "The house from the offer.",
            isFluidWidth: true,
            src: smallImage,
          },
          largeImage: {
            src: largeImage,
            width: 1300,
            height: 1300,
          },
          className: "!h-full",
          imageClassName: "object-cover !1w-full !h-full",
          enlargedImageContainerDimensions: {
            width: 660,
            height: 604,
          },
          enlargedImageContainerClassName: "z-50",
          lensStyle: { backgroundColor: "rgba(0,0,0,.6)" },
        }}
      />
    </Box>
  );
}

function ProductModel({ onClose, product }) {
  const [mainImage, setMainImage] = useState(
    "../src/assets/images/" + product.mainImage
  );

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleClose = () => {
    onClose();
    document.body.style.overflow = "auto";
  };

  document.body.style.overflow = "hidden";
  console.log(product.subImages[0]);

  return (
    <Box className="h-screen w-screen overflow-hidden flex justify-center items-center bg-gray-800 bg-opacity-50">
      <Box className="relative bg-white p-6 px-20 rounded-lg overflow-y-auto max-w-[95vw] max-h-[95vh]">
        <CloseIcon
          className="absolute text-3xl cursor-pointer right-4 top-4"
          onClick={handleClose}
        />

        <Box className="flex flex-col lg:flex-row gap-6">
          <Box className="flex flex-col flex-1">
            <Box>
              <ImageZoom smallImage={mainImage} largeImage={mainImage} />
              <Box className="flex justify-between w-1/4 h-[100px] md:w-[415px] md:mx-auto gap-1 mt-1">
                {product.subImages.map((subImage) => (
                  <Box
                    key={subImage}
                    component="img"
                    className="object-cover border border-gray-300 md:w-[100px] cursor-pointer"
                    alt="The house from the offer."
                    src={`../src/assets/images/${subImage.imagePath}`}
                    onClick={() =>
                      handleImageClick(`../src/assets/images/${subImage.imagePath}`)
                    }
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box className="flex flex-col flex-1 gap-6">
            <Typography variant="h5" className="font-semibold">
              {product.name}
            </Typography>
            <Typography className="text-2xl">${product.price}</Typography>
            <Typography>
              {product.description}
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Chip key={tag.tagId} label={tag.name} variant="filled" />
              ))}
            </Box>
            <Button
              variant="outlined"
              startIcon={<FavoriteIcon />}
              className="flex gap-3 py-2 w-max hover:bg-[#131118] hover:text-white">
              Add to Wishlist
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductModel;
