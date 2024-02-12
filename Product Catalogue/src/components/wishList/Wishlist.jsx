import React from "react";
import { useGetWishlistProductQuery } from "../../redux/api/wishlistApi";
import { Container, Grid } from "@mui/material";
import ProductCard from "../common/ProductCard";

export default function Wishlist() {
  const { data: Wishlist } = useGetWishlistProductQuery();
  console.log(Wishlist);
  return (
    <Container>
      <Grid className="mt-2" container spacing={2}>
        {Wishlist?.map((product) => (
          <Grid item xs={6} sm={4} md={4} lg={3} xl={3} key={product.productId}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
