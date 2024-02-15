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
import {
  useAddTagsMutation,
  useDeleteTagMutation,
  useGetTagsQuery,
} from "../../redux/api/tagsApi";
import { Cancel } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";

function Tags() {
  const [addTags] = useAddTagsMutation();
  const [deleteTag] = useDeleteTagMutation();
  const { data: tags } = useGetTagsQuery();
  const confirm = useConfirm();

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

  return (
    <Box className="w-full md:w-[32%] mb-5">
      <Box className="w-fit m-auto">
        <Typography
          borderBottom={1}
          borderColor="grey.500"
          variant="h6"
          className=" pb-1 text-center text-2xl">
          Tag Management
        </Typography>
      </Box>
      <Box className="mt-2">
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
                  sx={{ textTransform: "none" }}
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
              onDelete={() => {
                confirm({
                  description: `Delete "${tag.name}"? This action cannot be undone.`,
                }).then(() => {
                  deleteTag(tag.tagId).then(() =>
                    toast.success(`${tag.name} deleted successfully`)
                  );
                });
              }}
              deleteIcon={<Cancel className="" />}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Tags;
