import React from "react";
import { useGetWishlistProductQuery } from "../../redux/api/wishlistApi";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import ProductCard from "../common/ProductCard";
import { URL } from "../config/URLHelper";
import { useGetPdfMutation } from "../../redux/api/pdfApi";

export default function Wishlist() {
  const { data: wishlist } = useGetWishlistProductQuery();
  const [getPdf] = useGetPdfMutation();

  return (
    <Container>
      <div className="text-right">
        <Button
          variant="outlined"
          className="my-4 mb-4  w-fit m-auto"
          onClick={() => getPdf()}
          sx={{ textTransform: "none" }}>
          Print PDF
        </Button>
      </div>
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
            <Typography variant="h6" align="center" gutterBottom>
              Your wishlist is empty. Start adding products you love!
            </Typography>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              color="primary"
              onClick={() => Navigate(URL.HOME)}>
              Add here
            </Button>
          </Box>
        )}
      </Grid>
    </Container>
  );
}
