import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {
  useGetProductByIdQuery,
  useGetProductQuery,
} from "../../redux/api/productApi";
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
  InputLabel,
  Autocomplete,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
  const { data: products, refetch } = useGetProductQuery({
    filter: selectedFilters.map((filter) => filter.tagId),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    search: searchText,
  });

  useEffect(() => {
    setFilteredProducts(products?.data);
  }, [products]);

  useEffect(() => {
    if (!initialSyncDone) {
      const params = new URLSearchParams(searchParams);
      setSearchText(params.get("search") || "");
      const filterParams = params.getAll("filter") || [];

      if (filterParams.length > 0) {
        const fetchData = async () => {
          const selectedTags = filterParams.map((tagId) =>
            tags.find((tag) => tag.tagId === tagId)
          );
          setSelectedFilters(selectedTags);
        };

        fetchData();
      }

      const minPrice = parseInt(params.get("minPrice")) || 0;
      const maxPrice = parseInt(params.get("maxPrice")) || 1000;
      setPriceRange([minPrice, maxPrice]);
      setInitialSyncDone(true);
    }
  }, [initialSyncDone]);

  useEffect(() => {
    console.log(searchParams.getAll("filter"));
    refetch({
      filter: searchParams.getAll("filter"), // Use map to extract tagIds
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      search: searchText,
    });
  }, [searchParams]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchText) params.append("search", searchText);
    selectedFilters.forEach((filter) => params.append("filter", filter.tagId));
    if (priceRange[0] !== 0) params.append("minPrice", priceRange[0]);
    if (priceRange[1] !== 100) params.append("maxPrice", priceRange[1]);

    setSearchParams(params.toString());
  }, [searchText, selectedFilters, priceRange, setSearchParams]);

  const handleFilterChange = (newValue) => {
    setSelectedFilters(newValue);
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box
        sx={{ border: `0.5px solid ${theme.palette.primary.border}` }}
        className="border p-2 px-3 mt-5 flex justify-between items-center gap-2 flex-wrap">
        <FormControl className="w-full md:w-80">
          {selectedFilters && (
            <Autocomplete
              size="small"
              multiple
              limitTags={2}
              id="tags-outlined"
              options={tags || []}
              getOptionLabel={(tag) => tag.name}
              value={selectedFilters}
              onChange={(event, newValue) => handleFilterChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  placeholder="Select Tags"
                  fullWidth
                />
              )}
            />
          )}
        </FormControl>

        <Divider orientation="vertical" flexItem />

        <Box className="w-full px-4 py-2 md:w-60 pr-5 gap-3 items-center">
          <Box className="text-center">
            Price: ${priceRange[0]} - ${priceRange[1]}
          </Box>
          <Slider
            className="p-0"
            size="small"
            value={priceRange}
            onChange={(event, newValue) => setPriceRange(newValue)}
            onChangeCommitted={(event, newValue) => {
              handlePriceChange(event, newValue);
              const params = new URLSearchParams();
              if (searchText) params.append("search", searchText);
              selectedFilters.forEach((filter) =>
                params.append("filter", filter.tagId)
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

        <Divider orientation="vertical" flexItem />

        <Box className="md:w-80 w-full" sx={{ position: "relative" }}>
          <TextField
            className="w-full"
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
                  params.append("filter", filter.tagId)
                ); // Use forEach to append each tagId
              if (priceRange[0] !== 0) params.append("minPrice", priceRange[0]);
              if (priceRange[1] !== 100)
                params.append("maxPrice", priceRange[1]);
              setSearchParams(params.toString());
            }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* <Box
        className="pt-2"
        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {selectedFilters?.map((filter) => (
          <Chip
            key={filter.tagId}
            label={filter.name}
            onDelete={() => {
              setSelectedFilters((prevFilters) =>
                prevFilters.filter((item) => item.tagId !== filter.tagId)
              );
            }}
            variant="outlined"
            sx={{ marginRight: 1, marginBottom: 1, width: 100 }}
          />
        ))}
      </Box> */}

      <Grid container spacing={2} className="mt-1">
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
