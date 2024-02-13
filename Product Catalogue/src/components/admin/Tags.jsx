import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import DynamicForm from "../common/form/DynamicForm";
import * as Yup from "yup";
import { useAddTagsMutation, useGetTagsQuery } from "../../redux/api/tagsApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { Cancel } from "@mui/icons-material";

function Tags() {
  const [addTags] = useAddTagsMutation();
  const { data: tags } = useGetTagsQuery();
  // console.log(tags);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tag name is required"),
  });

  const initialValues = { name: "" };

  const fields = [
    {
      type: "text",
      label: "Tag name",
      name: "name",
    },
  ];

  const handleSubmit = (values) => {
    const tags = values.name.split(",").map((tag) => tag.trim());
    addTags({
      name: tags,
    });
  };

  const handleDeleteTag = (tag) => {
    // console.log("Delete tag:", tag);
  };

  return (
    <Box className="w-1/3">
      <Box className="w-fit m-auto">
        <Typography
          borderBottom={1}
          borderColor="grey.500"
          variant="h6"
          className="mb-2 pb-1 text-center text-2xl">
          Tag Management
        </Typography>
      </Box>
      <Box className="mt-5">
        <Box className="">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validationSchema={validationSchema}>
            {(formikProps) => (
              <form onSubmit={formikProps.handleSubmit}>
                <DynamicForm
                  fields={fields}
                  values={formikProps.values}
                  onChange={formikProps.handleChange}
                  errors={formikProps.errors}
                  touched={formikProps.touched}
                />
                <Button
                  type="submit"
                  className="mt-2"
                  variant="contained"
                  color="primary"
                  fullWidth>
                  Submit
                </Button>
              </form>
            )}
          </Formik>
        </Box>
        <Divider className="my-5" variant="middle" />
        <Box className="flex gap-3 flex-wrap">
          {tags?.map((tag, index) => (
            <Chip
              className="w-fit"
              key={tag.tadId}
              label={tag.name}
              onDelete={() => handleDeleteTag(tag)} 
              deleteIcon={<Cancel className=""/>}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Tags;
