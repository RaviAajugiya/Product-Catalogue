import React, { useState } from "react";
import RichTextEditor from "react-rte";

function RteDemo() {
  const [value, setValue] = useState(RichTextEditor.createEmptyValue());

  const onChange = (newValue) => {
    setValue(newValue);
    console.log(newValue.toString("html")); // Log HTML value
  };

  const toolbarConfig = {
    display: ['INLINE_STYLE_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
      { label: 'Italic', style: 'ITALIC' },
      { label: 'Underline', style: 'UNDERLINE' }
    ]
  };

  return (
    <div>
      <div>
        <RichTextEditor
          className="bg-gray-400"
          value={value}
          onChange={onChange}
          toolbarConfig={toolbarConfig} 
        />
      </div>
      <div>
        <p>Current Value:</p>
        <div dangerouslySetInnerHTML={{ __html: value.toString("html") }} />
      </div>
    </div>
  );
}

export default RteDemo;
