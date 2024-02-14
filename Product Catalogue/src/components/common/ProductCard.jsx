import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Modal, IconButton, Tooltip } from "@mui/material";
import ProductModel from "./ProductModel";
import theme from "./theme";
import { FavoriteBorder } from "@mui/icons-material";
import { useEffect } from "react";
import {
  useAddToWishlistMutation,
  useDeleteWishlistMutation,
  useGetWishlistProductQuery,
} from "../../redux/api/wishlistApi";
import { jwtDecode } from "jwt-decode";
import { Delete } from "@mui/icons-material";
import { Edit } from "@mui/icons-material";
import { useDeleteProductMutation } from "../../redux/api/productApi";
import { URL } from "../config/URLHelper";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";

function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProductWishlist, setIsProductWishlist] = useState(false);

  const { data: Wishlist } = useGetWishlistProductQuery();
  const [deleteWishlist] = useDeleteWishlistMutation();

  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(
    "../src/assets/images/" + product.mainImage
  );

  const [deleteProduct] = useDeleteProductMutation();

  const [addToWishlist] = useAddToWishlistMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    Wishlist?.forEach((wishlist) => {
      wishlist.productId === product.productId
        ? setIsProductWishlist(true)
        : null;
    });
  }, [Wishlist]);

  useEffect(() => {
    if (isHover) {
      setMainImage("../src/assets/images/" + product?.subImages[0]?.imagePath);
    } else {
      setMainImage("../src/assets/images/" + product.mainImage);
    }
  }, [isHover]);

  const localData = localStorage.getItem("userData");

  useEffect(() => {
    if (localData) {
      const token = JSON.parse(localData).token;
      const decodedToken = jwtDecode(token);
      setIsAdmin(
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "Admin"
      );
    }
  }, []);

  return (
    <Box className='min-w-[140px] relative' >
      <CardActionArea
        sx={{ border: `0.5px solid ${theme.palette.primary.border}` }}
        className="relative"
        onClick={handleOpen}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}>
        <CardMedia
          component="img"
          image={mainImage}
          alt="Product Image"
          className="h-[190px] sm:h-[300px] md:h-[350px]"
        />
        {isHover && (
          <Box className="flex gap-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <IconButton className="bg-white">
              {isProductWishlist ? (
                <Tooltip title="Remove from wishlist">
                  <FavoriteIcon
                    className="hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProductWishlist(false);
                      deleteWishlist(product.productId);
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Add to wishlist">
                  <FavoriteBorder
                    className="hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist(product.productId);
                    }}
                  />
                </Tooltip>
              )}
            </IconButton>
            {isAdmin && (
              <>
                <Tooltip title="Edit product">
                  <IconButton
                    className="bg-white"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation
                      // addToWishlist(product.productId);
                      navigate(`${URL.ADMIN}?id=${product.productId}`);
                    }}>
                    <Edit className="hover:scale-110" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete product">
                  <IconButton
                    className="bg-white"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event propagation
                      deleteProduct(product.productId);
                    }}>
                    <Delete className="hover:scale-110" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        )}
      </CardActionArea>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}>
          <Typography gutterBottom component="p" className="line-clamp-1">
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
