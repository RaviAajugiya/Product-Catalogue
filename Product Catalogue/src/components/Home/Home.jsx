import React from "react";
import ProductCard from "../common/ProductCard";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ProductModel from "../common/ProductModel";

function Home() {
  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {[...Array(20)].map((_, index) => (
          <Grid item xs={6} sm={4} md={4} lg={3} xl={3} key={index}>
            <ProductCard />
          </Grid>
        ))}
      </Grid>      
    </Container>
  );
}

export default Home;
