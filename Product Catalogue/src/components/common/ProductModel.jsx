import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import theme from "./theme";
import StarRatings from "react-star-ratings";
import ReactImageMagnify from "react-image-magnify";

function ImageZoom({ smallImage, largeImage }) {
  return (
    <Box
      className="w-[415px] h-[500px] m-auto"
      sx={{
        position: "relative",
        border: `1px solid ${theme.palette.primary.border}`,
      }}
    >
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
          imageClassName: "object-cover !w-[413px] !h-[498px]",
          className: "!w-[413px] !h-[498px]",
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
    <Box
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: 1300,
        display: "flex",
        backgroundColor: "white",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "40px",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <CloseIcon
        className="absolute right-6 top-6 text-3xl cursor-pointer"
        onClick={onClose}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1",
          paddingRight: "20px",
        }}
      >
        <ImageZoom smallImage={mainImage} largeImage={mainImage} />
        <Box
          width="415px"
          display="flex"
          margin="auto"
          justifyContent="space-between"
          sx={{ mt: 1 }}
        >
          {[100, 200, 300, 400].map((i) => (
            <Box
              key={i}
              component="img"
              sx={{
                width: 100,
                objectFit: "cover",
                border: `1px solid ${theme.palette.primary.border}`,
                cursor: "pointer",
              }}
              alt="The house from the offer."
              src={`https://placehold.co/${i}`}
              onClick={() => handleImageClick(`https://placehold.co/${i}`)}
            />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "50%",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          MULTICOLOR SHIRTS
        </Typography>
        <StarRatings
          rating={3.5}
          starRatedColor="orange"
          numberOfStars={5}
          name="rating"
          starDimension="17px"
          starSpacing="2px"
        />
        <Typography
          sx={{ fontWeight: 500 }}
          className="text-2xl"
          color="initial"
        >
          $59.99
        </Typography>
        <Typography>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos earum
          vitae voluptatibus exercitationem, dignissimos neque consequuntur
          doloribus id totam sapiente? Adipisci quia laudantium veniam
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FavoriteIcon />}
          className="flex gap-3 w-fit py-2 hover:bg-[#131118] hover:text-white"
          sx={{
            borderRadius: "0px",
            borderColor: theme.palette.primary.border,
          }}
        >
          Add to Wishlist
        </Button>
      </Box>
    </Box>
  );
}

export default ProductModel;
