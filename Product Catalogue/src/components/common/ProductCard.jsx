import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea, Modal } from "@mui/material";
import ProductModel from "./ProductModel";
import theme from "./theme";

// import "../../assets/images";

function ProductCard({ product }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(product.mainImage);
  return (
    <Box sx={{ minWidth: "150px" }}>
      <CardActionArea
        sx={{ border: `0.5px solid ${theme.palette.primary.border}` }}
        className=""
        onClick={handleOpen}>
        <CardMedia
          component="img"
          image={"../src/assets/images/" + product.mainImage}
          alt="Product Image"
        />
      </CardActionArea>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}>
          <Typography gutterBottom component="p">
            {product.name} {/* Use product name from props */}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} gutterBottom component="p">
            ${product.price.toFixed(2)} {/* Use product price from props */}
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
