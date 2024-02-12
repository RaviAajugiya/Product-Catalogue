import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useGetProductQuery } from "../../redux/api/productApi";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Chip,
  Slider,
  Typography,
  Menu,
  IconButton, // Import IconButton component
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Import SearchIcon component
import theme from "../common/theme";

function Home() {
  const { data: products } = useGetProductQuery();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSorting, setSelectedSorting] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [initialSyncDone, setInitialSyncDone] = useState(false); // Flag to track initial state sync
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    if (!initialSyncDone) {
      const params = new URLSearchParams(searchParams);
      setSearchText(params.get("search") || "");
      setSelectedFilters(params.getAll("filter") || []);
      setSelectedSorting(params.get("sorting") || "");
      const minPrice = parseInt(params.get("minPrice")) || 0;
      const maxPrice = parseInt(params.get("maxPrice")) || 100;
      setPriceRange([minPrice, maxPrice]);

      setInitialSyncDone(true);
    }
  }, [initialSyncDone, searchParams]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchText) params.append("search", searchText);
    selectedFilters.forEach((filter) => params.append("filter", filter));
    if (selectedSorting) params.append("sorting", selectedSorting);
    if (priceRange[0] !== 0) params.append("minPrice", priceRange[0]);
    if (priceRange[1] !== 100) params.append("maxPrice", priceRange[1]);

    setSearchParams(params.toString());
  }, [
    selectedFilters,
    selectedSorting,
    setSearchParams,
  ]);


  const handleFilterChange = (event) => {
    setSelectedFilters(event.target.value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box
        sx={{ border: `0.5px solid ${theme.palette.primary.border}` }}
        className="border p-4 my-5 flex justify-between">
        <Box sx={{ position: "relative" }}>
          <TextField
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
              if (selectedSorting) params.append("sorting", selectedSorting);
              if (priceRange[0] !== 0) params.append("minPrice", priceRange[0]);
              if (priceRange[1] !== 100)
                params.append("maxPrice", priceRange[1]);
              setSearchParams(params.toString());
            }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Select
          size="small"
          multiple
          displayEmpty
          value={selectedFilters}
          onChange={handleFilterChange}
          variant="outlined"
          className="w-52"
          placeholder="Filter">
          <MenuItem selected>Filter by tags</MenuItem>
          <MenuItem value="filter1">Filter 1</MenuItem>
          <MenuItem value="filter2">Filter 2</MenuItem>
          <MenuItem value="filter3">Filter 3</MenuItem>
          <MenuItem value="filter4">Filter 4</MenuItem>
          <MenuItem value="filter5">Filter 5</MenuItem>
        </Select>

        <Select
          size="small"
          value={selectedSorting}
          onChange={(e) => setSelectedSorting(e.target.value)}
          variant="outlined"
          className="w-52">
          <MenuItem value="">Sort</MenuItem>
          <MenuItem value="nameAsc">Name Ascending</MenuItem>
          <MenuItem value="nameDesc">Name Descending</MenuItem>
        </Select>

        <Box>
          <MenuItem onClick={handleMenuOpen} style={{ cursor: "pointer" }}>
            Price: ${priceRange[0]} - ${priceRange[1]}
          </MenuItem>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}>
            <MenuItem>
              <Slider
                className="w-52"
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
                  if (selectedSorting)
                    params.append("sorting", selectedSorting);
                  if (newValue[0] !== 0) params.append("minPrice", newValue[0]);
                  if (newValue[1] !== 100)
                    params.append("maxPrice", newValue[1]);
                  setSearchParams(params.toString());
                }}
                aria-labelledby="price-slider"
                min={0}
                max={100}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
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
            sx={{ marginRight: 1, marginBottom: 1, width: 100 }} // Set fixed width
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
