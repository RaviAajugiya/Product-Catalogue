import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  useAddProductMutation,
  useEditProductMutation,
  useGetProductByIdQuery,
} from "../../redux/api/productApi";
import { useAddTagsMutation, useGetTagsQuery } from "../../redux/api/tagsApi";
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
import { UploadFile } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import { URL } from "../config/URLHelper";
import { useNavigate } from "react-router-dom";

function Products() {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const [addProduct] = useAddProductMutation();
  const [editProduct] = useEditProductMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [addImage] = useAddImageMutation();
  const [addTags] = useAddTagsMutation();

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
        selectedTags: product?.tags || [],
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

    // Filter out duplicates from new sub-images
    const uniqueNewSubImages = files.filter(
      (file) => !subImagesValue.includes(file)
    );

    // Concatenate new sub-images with existing ones
    const newSubImages = subImagesValue.concat(Array.from(uniqueNewSubImages));
    setSubImagesValue(newSubImages);

    // Display previews of unique new sub-images
    const readers = uniqueNewSubImages.map((file) => {
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

  const handleSubmit = async (values, { resetForm }) => {
    console.log(values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("mainImage", mainImageValue);

    subImagesValue.forEach((image, index) => {
      formData.append(`subImages`, image);
    });
    values.selectedTags.forEach((tag) => [
      formData.append(`tagIds`, tag.tagId),
    ]);

    console.log("main Image", formData.get("mainImage"));
    console.log("SubImages", formData.getAll("subImages"));

    productId
      ? editProduct({ id: productId, data: formData }).then(() => {
          toast.success("Product edited successfully");
          navigate(URL.HOME);
        })
      : addProduct(formData).then(() => {
          toast.success("Product added successfully");
        });
    resetForm();
    setMainImageValue(null);
    setSubImagesValue([]);
    setMainImagePreview(null);
    setSubImagesPreview([]);
  };

  return (
    <Box className="w-full md:w-[60%]">
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
              <Autocomplete
                multiple
                id="selected-tags"
                options={tags || []}
                getOptionLabel={(tag) => tag.name}
                value={formikProps.values?.selectedTags || []}
                onChange={(event, newValue) => {
                  formikProps.setFieldValue("selectedTags", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    error={
                      formikProps.touched.selectedTags &&
                      Boolean(formikProps.errors.selectedTags)
                    }
                    helperText={
                      formikProps.touched.selectedTags &&
                      formikProps.errors.selectedTags
                    }
                    inputProps={{
                      ...params.inputProps,
                      onKeyDown: (event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          const newInputValue = event.target.value.trim();
                          if (newInputValue) {
                            addTags({ name: [newInputValue] });
                            event.target.value = "";
                          }
                        }
                      },
                    }}
                  />
                )}
              />
            </FormControl>

            <Box className="flex gap-2 w-full mt-3">
              <Box
                className="w-1/3 flex flex-col min-h-[56px]"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}>
                <Files
                  className="files-dropzone"
                  onChange={handleMainImageChange}
                  accepts={[".jpg", ".png", ".jpeg"]}
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable>
                  <div className="cursor-pointer mt-[7px] text-[#666666] p-2 flex gap-2 items-center">
                    <UploadFile /> Main image
                  </div>
                </Files>

                {mainImagePreview && (
                  <Box className="w-fit px-3 py-1 relative">
                    <div className="relative">
                      <img
                        src={mainImagePreview}
                        alt="Main Image Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <Cancel
                        onClick={() => {
                          confirm({
                            description: `Delete  This action cannot be undone.`,
                          }).then(() => {
                            handleRemoveMainImage();
                          });
                        }}
                        className="bg-white rounded-full absolute -top-2 -right-2"
                      />
                    </div>
                  </Box>
                )}
              </Box>
              <Box
                className="w-2/3 flex flex-col min-h-[56px] justify-center"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}>
                <Files
                  className="files-dropzone"
                  onChange={handleSubImagesChange}
                  accepts={[".jpg", ".png", ".jpeg"]}
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable>
                  <div className="cursor-pointer text-[#666666] p-2 mt-[7px] flex gap-2 items-center">
                    <UploadFile /> Sub images
                  </div>
                </Files>
                <Box className="flex px-3 py-1  gap-2  flex-wrap">
                  {subImagesPreview?.map((preview, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={productId ? preview.imagePath : preview}
                        alt={`Sub Image Preview ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <Cancel
                        onClick={() => {
                          confirm({
                            description: `Delete  This action cannot be undone.`,
                          }).then(() => {
                            handleRemoveSubImage(index);
                            deleteImage(preview.subImageId);
                          });
                        }}
                        className="bg-white rounded-full absolute -top-2 -right-2"
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Button
              sx={{ textTransform: "none" }}
              className="w-full mt-5"
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
