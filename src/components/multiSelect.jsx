import { useState } from "react";
import Select, { components } from "react-select";

const MultiSelect = ({ options, placeholder, onChange }) => {
  const allOptions = options ? options.map(option => ({
    value: option,
    label: option
  })) : [];

  return (
    <div className="MultiSelect">
      <Select
        defaultValue={[]}
        placeholder={placeholder}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        onChange={(options) => {
          const selectedOptions = options ? options.map((opt) => opt.value) : [];
          onChange(selectedOptions);
        }}
        options={allOptions}
      />
    </div>
  );
}

export default MultiSelect;