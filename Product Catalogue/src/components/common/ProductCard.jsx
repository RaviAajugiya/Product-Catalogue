import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Modal, IconButton } from "@mui/material";
import ProductModel from "./ProductModel";
import theme from "./theme";
import { FavoriteBorder } from "@mui/icons-material";
import { useEffect } from "react";
import { useAddToWishlistMutation } from "../../redux/api/wishlistApi";

function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [mainImage, setMainImage] = useState(
    "../src/assets/images/" + product.mainImage
  );

  const [addToWishlist] = useAddToWishlistMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (isHover) {
      setMainImage("../src/assets/images/" + product?.subImages[0]?.imagePath);
    } else {
      setMainImage("../src/assets/images/" + product.mainImage);
    }
  }, [isHover]);

  return (
    <Box sx={{ position: "relative", minWidth: "150px" }}>
      <CardActionArea
        sx={{ border: `0.5px solid ${theme.palette.primary.border}` }}
        className="relative"
        onClick={handleOpen}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <CardMedia
          component="img"
          image={mainImage}
          alt="Product Image"
        />
        {isHover && (
          <IconButton
            className="bg-slate-300"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event propagation
              addToWishlist(product.productId);
            }}
          >
            <FavoriteBorder className="hover:scale-110" />
          </IconButton>
        )}
      </CardActionArea>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Typography gutterBottom component="p">
            {product.name}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} gutterBottom component="p">
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
      <Modal open={open} onClose={handleClose}>
        <ProductModel onClose={handleClose} product={product} />
      </Modal>
    </Box>
  );
}

export default ProductCard;
