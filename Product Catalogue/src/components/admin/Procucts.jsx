import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { MuiFileInput } from "mui-file-input";
import { useAddProductMutation } from "../../redux/api/productApi";
import { useGetTagsQuery } from "../../redux/api/tagsApi";

function Products() {
  const [addProduct] = useAddProductMutation();
  const { data: tags } = useGetTagsQuery();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required"),
    // selectedTags: Yup.array().min(1, "At least one tag is required"),
  });

  const initialValues = {
    name: "",
    description: "",
    price: "",
    selectedTags: [], // Initialize as an empty array
  };

  const [mainImageValue, setMainImageValue] = useState(null);
  const [subImagesValue, setSubImagesValue] = useState([]);

  const handleMainImageChange = (newValue, info, event) => {
    setMainImageValue(newValue);
  };

  const handleSubImagesChange = (newValues, info, event) => {
    const allSubImages = [...subImagesValue, ...Array.from(newValues)];
    const uniqueSubImages = Array.from(new Set(allSubImages));
    setSubImagesValue(uniqueSubImages);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("mainImage", mainImageValue);

    // Append each sub image
    subImagesValue.forEach((image, index) => {
      formData.append(`subImages`, image);
    });
    console.log(values.selectedTags);
    // Append tag ids as comma-separated string
    values.selectedTags.forEach((tag) => [formData.append(`tagIds`, tag)]);
    // formData.append("tagIds", values.selectedTags);

    try {
      const response = await addProduct(formData);
      console.log("Product added successfully:", response.data);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Box className="w-1/2">
      <Typography
        borderBottom={1}
        borderColor="grey.500"
        variant="h6"
        className="w-fit mb-2 pb-1 m-auto text-2xl">
        Product Management
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              value={formikProps.values.name}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={
                formikProps.touched.name && Boolean(formikProps.errors.name)
              }
              helperText={formikProps.touched.name && formikProps.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              id="description"
              name="description"
              label="Description"
              variant="outlined"
              value={formikProps.values.description}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={
                formikProps.touched.description &&
                Boolean(formikProps.errors.description)
              }
              helperText={
                formikProps.touched.description &&
                formikProps.errors.description
              }
            />
            <TextField
              fullWidth
              margin="normal"
              id="price"
              name="price"
              label="Price"
              variant="outlined"
              value={formikProps.values.price}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={
                formikProps.touched.price && Boolean(formikProps.errors.price)
              }
              helperText={formikProps.touched.price && formikProps.errors.price}
            />
            <MuiFileInput
              className="w-full my-4 mb-5"
              placeholder="Select main image"
              value={mainImageValue}
              onChange={handleMainImageChange}
            />
            <MuiFileInput
              className="w-full mt-1 mb-2"
              placeholder="Select sub images"
              value={subImagesValue}
              multiple
              onChange={handleSubImagesChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="selected-tags-label">Tags</InputLabel>
              <Select
                labelId="selected-tags-label"
                id="selected-tags"
                name="selectedTags"
                multiple
                value={formikProps.values.selectedTags}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={
                  formikProps.touched.selectedTags &&
                  Boolean(formikProps.errors.selectedTags)
                }
                renderValue={(selected) => selected.join(", ")}>
                {tags &&
                  tags.map((tag) => (
                    <MenuItem key={tag.tagId} value={tag.tagId}>
                      {tag.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {formikProps.touched.selectedTags &&
              formikProps.errors.selectedTags && (
                <Typography variant="caption" color="error">
                  {formikProps.errors.selectedTags}
                </Typography>
              )}
            <Button
              className="w-full mt-3"
              type="submit"
              variant="contained"
              color="primary">
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default Products;
