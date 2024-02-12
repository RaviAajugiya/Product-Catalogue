import { Container, Divider } from "@mui/material";
import React from "react";
import Tags from "./Tags";
import Products from "./Procucts";

function Admin() {
  return (
    <Container className="flex mt-5 gap-10">
      <Products />
      <Divider orientation="vertical" flexItem className=""/>
      <Tags />
    </Container>
  );
}

export default Admin;
