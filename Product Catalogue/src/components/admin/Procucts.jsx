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
import {
  useAddProductMutation,
  useEditProductMutation,
  useGetProductByIdQuery,
} from "../../redux/api/productApi";
import { useGetTagsQuery } from "../../redux/api/tagsApi";
import Files from "react-files";
import { Cancel } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import {
  useAddImageMutation,
  useDeleteImageMutation,
  useGetImagesByProductIdQuery,
} from "../../redux/api/subImageApi";

function Products() {
  const [addProduct] = useAddProductMutation();
  const [editProduct] = useEditProductMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [addImage] = useAddImageMutation();

  const { data: tags } = useGetTagsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    price: "",
    selectedTags: [],
  });

  const productId = searchParams.get("id");

  const { data: imgData } = useGetImagesByProductIdQuery(productId);
  const { data: product } = useGetProductByIdQuery(productId);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required"),
  });

  useEffect(() => {
    if (product) {
      setInitialValues({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        selectedTags: (product?.tags || []).map((tag) => tag.tagId),
      });
    }
  }, [product]);

  console.log(initialValues);

  const [mainImageValue, setMainImageValue] = useState(null);
  const [subImagesValue, setSubImagesValue] = useState([]);

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImagesPreview, setSubImagesPreview] = useState([]);

  useEffect(() => {
    if (product) {
      setMainImagePreview(`src/assets/images/${product.mainImage}`);

      if (productId) {
        setSubImagesPreview(
          imgData?.map((subImage) => {
            return {
              ...subImage,
              imagePath: `src/assets/images/${subImage.imagePath}`,
            };
          })
        );
      } else {
        product?.subImages.forEach((img) =>
          setSubImagesPreview(`src/assets/images/${img.imagePath}`)
        );
      }
    }
  }, [product, imgData]);

  const handleMainImageChange = (files) => {
    const file = files[0];
    setMainImageValue(file);
    const reader = new FileReader();
    reader.onload = () => {
      setMainImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubImagesChange = (files) => {
    console.log(files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`SubImages`, file);
    });
    addImage({ id: productId, data: formData });

    const newSubImages = Array.from(files);
    setSubImagesValue(newSubImages);
    const readers = newSubImages.map((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setSubImagesPreview((prevPreviews) => [...prevPreviews, reader.result]);
      };
      reader.readAsDataURL(file);
      return reader;
    });
  };

  const handleRemoveMainImage = () => {
    setMainImageValue(null);
    setMainImagePreview(null);
  };

  const handleRemoveSubImage = (index) => {
    setSubImagesValue((prevSubImages) =>
      prevSubImages.filter((_, i) => i !== index)
    );
    setSubImagesPreview((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("mainImage", mainImageValue);

    subImagesValue.forEach((image, index) => {
      formData.append(`subImages`, image);
    });
    values.selectedTags.forEach((tag) => [formData.append(`tagIds`, tag)]);

    console.log("main Image", formData.get("mainImage"));
    console.log("SubImages", formData.getAll("subImages"));

    productId
      ? editProduct({ id: productId, data: formData })
      : addProduct(formData);
  };

  return (
    <Box className="w-2/3">
      <Typography
        borderBottom={1}
        borderColor="grey.500"
        variant="h6"
        className="w-fit mb-2 pb-1 m-auto text-2xl">
        Product Management
      </Typography>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <TextField
              size="small"
              fullWidth
              margin="normal"
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              value={formikProps.values?.name}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={
                formikProps.touched.name && Boolean(formikProps.errors.name)
              }
              helperText={formikProps.touched.name && formikProps.errors.name}
            />
            <TextField
              size="small"
              fullWidth
              margin="normal"
              id="description"
              name="description"
              label="Description"
              variant="outlined"
              value={formikProps.values?.description}
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
              size="small"
              fullWidth
              margin="normal"
              id="price"
              name="price"
              label="Price"
              variant="outlined"
              value={formikProps.values?.price}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={
                formikProps.touched.price && Boolean(formikProps.errors.price)
              }
              helperText={formikProps.touched.price && formikProps.errors.price}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="selected-tags-label">Tags</InputLabel>
              <Select
                size="small"
                labelId="selected-tags-label"
                id="selected-tags"
                label="Tags"
                name="selectedTags"
                multiple
                value={formikProps.values?.selectedTags || []}
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

            <Box className="flex gap-2 w-full mt-3">
              <Box
                className="w-1/3"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}>
                <Files
                  className="files-dropzone"
                  onChange={handleMainImageChange}
                  accepts={[".jpg", ".png", ".jpeg"]}
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable>
                  <div className="cursor-pointer">
                    click to upload main image
                  </div>
                </Files>

                {mainImagePreview && (
                  <Box className="w-fit mt-4 relative">
                    <img
                      src={mainImagePreview}
                      alt="Main Image Preview"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                    />
                    <Cancel
                      onClick={handleRemoveMainImage}
                      className="bg-white rounded-full absolute -top-2 -right-2"
                    />
                  </Box>
                )}
              </Box>
              <Box
                className="w-2/3"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}>
                <Files
                  className="files-dropzone"
                  onChange={handleSubImagesChange}
                  accepts={[".jpg", ".png", ".jpeg"]}
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable>
                  <div className="cursor-pointer">
                    click to upload main image
                  </div>
                </Files>
                <Box className="flex gap-2 mt-4 flex-wrap">
                  {subImagesPreview?.map((preview, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={productId ? preview.imagePath : preview}
                        alt={`Sub Image Preview ${index}`}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                      />
                      <Cancel
                        onClick={() => {
                          handleRemoveSubImage(index);
                          deleteImage(preview.subImageId);
                        }}
                        className="bg-white rounded-full absolute -top-2 -right-2"
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

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
