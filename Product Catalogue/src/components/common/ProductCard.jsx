import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea, Modal } from "@mui/material";
import ProductModel from "./ProductModel";

function ProductCard() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ minWidth: "150px" }}>
      <CardActionArea sx={{ border: "2px solid #eee" }} onClick={handleOpen}>
        <CardMedia
          component="img"
          image="https://templatebeta.com/Prestashop/PRS01/TB_ps_fashion_zurea_122/58-large_default/adidas-t-shirts.jpg"
          alt="green iguana"
        />
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
            Men Cap
          </Typography>
          <Typography sx={{ fontWeight: "bold" }} gutterBottom component="p">
            $39.99
          </Typography>
        </Box>
      </CardContent>
      <Modal open={open} onClose={handleClose}>
        <ProductModel onClose={handleClose} />
      </Modal>
    </Box>
  );
}

export default ProductCard;
