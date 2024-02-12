import React from "react";
import FormField from "./FormField";

const DynamicForm = ({ fields, values, onChange, errors, touched }) => {
  return (
    <>
      {fields.map((field) => (
        <div key={field.name}>
          <FormField
            type={field.type}
            label={field.label}
            name={field.name}
            value={values[field.name]}
            onChange={onChange}
            options={field.options}
          />
          {touched[field.name] && errors[field.name] && (
            <div className="text-red-500 text-left">{errors[field.name]}</div>
          )}
        </div>
      ))}
    </>
  );
};

export default DynamicForm;
