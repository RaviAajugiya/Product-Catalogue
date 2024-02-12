import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const FormField = ({ type, label, name, value, onChange, options }) => {
  switch (type) {
    case "dropdown":
      return (
        <FormControl fullWidth>
          <InputLabel>{label}</InputLabel>
          <Select value={value} onChange={onChange} name={name} label={label}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
      
    default:
      return (
        <TextField
          fullWidth
          label={label}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          variant="outlined"
          margin="normal"
        />
      );
  }
};

export default FormField;
