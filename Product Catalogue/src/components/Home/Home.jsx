import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useGetProductByIdQuery, useGetProductQuery } from "../../redux/api/productApi";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Chip,
  Slider,
  Typography,
  Menu,
  IconButton,
  FormControl,
  InputLabel, // Import IconButton component
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Import SearchIcon component
import theme from "../common/theme";
import { useGetTagsQuery } from "../../redux/api/tagsApi";

function Home() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [initialSyncDone, setInitialSyncDone] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: tags } = useGetTagsQuery();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const { data: products, refetch } = useGetProductQuery({ filter: selectedFilters, minPrice: priceRange[0], maxPrice: priceRange[1], search: searchText });
  
  useEffect(() => {
    setFilteredProducts(products?.data);
  }, [products]);

  useEffect(() => {
    if (!initialSyncDone) {
      const params = new URLSearchParams(searchParams);
      setSearchText(params.get("search") || "");
      setSelectedFilters(params.getAll("filter") || []);
      const minPrice = parseInt(params.get("minPrice")) || 0;
      const maxPrice = parseInt(params.get("maxPrice")) || 100;
      setPriceRange([minPrice, maxPrice]);
      setInitialSyncDone(true);
    }
  }, [initialSyncDone, searchParams]);

  useEffect(() => {
    refetch({ filter: selectedFilters, minPrice: priceRange[0], maxPrice: priceRange[1], search: searchText });
  }, [searchParams]);
  

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchText) params.append("search", searchText);
    selectedFilters.forEach((filter) => params.append("filter", filter));
    if (priceRange[0] !== 0) params.append("minPrice", priceRange[0]);
    if (priceRange[1] !== 100) params.append("maxPrice", priceRange[1]);

    setSearchParams(params.toString());
  }, [searchText, selectedFilters, priceRange, setSearchParams]);

  const handleFilterChange = (event) => {
    setSelectedFilters(event.target.value);
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box
        sx={{ border: `0.5px solid ${theme.palette.primary.border}` }}
        className="border p-1 px-2 mt-5 flex justify-between items-center">
        <FormControl className="w-60" sx={{ m: 1, minWidth: 120 }}>
          <Select
            size="small"
            value={selectedFilters}
            onChange={handleFilterChange}
            displayEmpty
            multiple
            inputProps={{ "aria-label": "Without label" }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 500, // Set max height of the dropdown menu
                },
              },
            }}>
            {tags?.map((tag) => (
              <MenuItem value={tag.tagId}>{tag.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className="" sx={{ position: "relative" }}>
          <TextField
            className="w-60"
            size="small"
            variant="outlined"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IconButton
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => {
              const params = new URLSearchParams();
              if (searchText) params.append("search", searchText);
              if (selectedFilters.length > 0)
                selectedFilters.forEach((filter) =>
                  params.append("filter", filter)
                );
              if (priceRange[0] !== 0) params.append("minPrice", priceRange[0]);
              if (priceRange[1] !== 100)
                params.append("maxPrice", priceRange[1]);
              setSearchParams(params.toString());
            }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box className=" gap-3 items-center">
          <Box>
            Price: ${priceRange[0]} - ${priceRange[1]}
          </Box>
          <Slider
            className="w-52 p-0"
            size="small"
            value={priceRange}
            onChange={(event, newValue) => setPriceRange(newValue)}
            onChangeCommitted={(event, newValue) => {
              handlePriceChange(event, newValue);
              const params = new URLSearchParams();
              if (searchText) params.append("search", searchText);
              selectedFilters.forEach((filter) =>
                params.append("filter", filter)
              );
              if (newValue[0] !== 0) params.append("minPrice", newValue[0]);
              if (newValue[1] !== 100) params.append("maxPrice", newValue[1]);
              setSearchParams(params.toString());
            }}
            aria-labelledby="price-slider"
            min={0}
            max={products?.maxPrice}
          />
        </Box>
      </Box>

      <Box
        className="pt-2"
        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {selectedFilters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            onDelete={() => {
              setSelectedFilters(
                selectedFilters.filter((item) => item !== filter)
              );
            }}
            variant="outlined"
            sx={{ marginRight: 1, marginBottom: 1, width: 100 }} 
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        {filteredProducts?.map((product) => (
          <Grid item xs={6} sm={4} md={4} lg={3} xl={3} key={product.productId}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
