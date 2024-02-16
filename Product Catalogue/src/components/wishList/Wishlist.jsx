import React from "react";
import { useGetWishlistProductQuery } from "../../redux/api/wishlistApi";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import ProductCard from "../common/ProductCard";
import { URL } from "../config/URLHelper";
import { useGetPdfMutation } from "../../redux/api/pdfApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Wishlist() {
  const { data: wishlist } = useGetWishlistProductQuery();
  const [getPdf, { isLoading, isSuccess, isError }] = useGetPdfMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("PDF generated successfully!");
    }
  }, [isSuccess, isError]);

  return (
    <Container>
      {wishlist && wishlist.length > 0 ? (
        <div className="text-right">
          <Button
            variant="outlined"
            className="my-4 mb-4  w-fit m-auto"
            onClick={() => getPdf()}
            sx={{ textTransform: "none" }}>
            Print PDF
            {isLoading ? (
              <CircularProgress className="ml-3" size={15} color="inherit" />
            ) : null}
          </Button>
        </div>
      ) : null}

      <Grid className="" container spacing={2}>
        {wishlist && wishlist.length > 0 ? (
          wishlist.map((product) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={4}
              lg={3}
              xl={3}
              key={product.productId}>
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Box className="text-center m-auto h-full mt-10">
            <Typography variant="h5" align="center" gutterBottom>
              Your wishlist is empty. Start adding products you love!
            </Typography>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              color="primary"
              onClick={() => navigate(URL.HOME)}>
              Add here
            </Button>
          </Box>
        )}
      </Grid>
    </Container>
  );
}
