import { Container, Divider } from "@mui/material";
import React from "react";
import Tags from "./Tags";
import Products from "./Procucts";

function Admin() {
  return (
    <Container className="flex mt-5 gap-10 flex-wrap justify-between">
      <Products />
      <Divider orientation="vertical" flexItem className="hidden  md:block " />
      <Tags />
    </Container>
  );
}

export default Admin;

<p>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae distinctio
  nostrum itaque deleniti, saepe nisi sapiente, autem incidunt deserunt, debitis
  commodi quam nobis. Nisi officia repellendus iusto esse? Odio, assumenda!
</p>;
