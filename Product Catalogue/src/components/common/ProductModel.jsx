import React, { useState } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReactImageMagnify from "react-image-magnify";

function ImageZoom({ smallImage, largeImage }) {
  return (
    <Box className="w-[415px] h-[500px] m-auto relative border-0.5 border-gray-300">
      <ReactImageMagnify
        className=""
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
          imageClassName: "object-cover w-full h-full",
          enlargedImageContainerDimensions: {
            width: 660,
            height: 607,
          },
          enlargedImageContainerClassName: "z-50",
          lensStyle: { backgroundColor: "rgba(0,0,0,.6)" },
        }}
      />
    </Box>
  );
}

function ProductModel({ onClose }) {
  const [mainImage, setMainImage] = useState(
    "https://templatebeta.com/Prestashop/PRS01/TB_ps_fashion_zurea_122/58-large_default/adidas-t-shirts.jpg"
  );

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  return (
    <Box className="bg-white absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 max-w-[1300px] w-full flex p-10 gap-10 items-start">
      <CloseIcon
        className="absolute right-6 top-6 text-3xl cursor-pointer"
        onClick={onClose}
      />

      <Box className="flex flex-col flex-1 pr-20">
        <ImageZoom smallImage={mainImage} largeImage={mainImage} />
        <Box className="w-[415px] mx-auto mt-1 flex justify-between">
          {[100, 200, 300, 400].map((i) => (
            <Box
              key={i}
              component="img"
              className="w-1/4 object-cover border border-gray-300 cursor-pointer"
              alt="The house from the offer."
              src={`https://placehold.co/${i}`}
              onClick={() => handleImageClick(`https://placehold.co/${i}`)}
            />
          ))}
        </Box>
      </Box>

      <Box className="flex flex-col gap-2 w-1/2">
        <Typography variant="h5" className="font-semibold">
          MULTICOLOR SHIRTS
        </Typography>
        {/* StarRatings component */}
        <Typography className="text-2xl">$59.99</Typography>
        <Typography>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos earum
          vitae voluptatibus exercitationem, dignissimos neque consequuntur
          doloribus id totam sapiente? Adipisci quia laudantium veniam
        </Typography>
        <Box className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Chip key={i} label="Chip Outlined" variant="filled" />
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
  );
}

export default ProductModel;
