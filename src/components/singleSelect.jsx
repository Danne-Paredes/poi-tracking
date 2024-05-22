import React, { useState } from "react";
import Select from "react-select";


const SingleSelect = React.forwardRef(({ options, placeholder, onChange, className, value,onKeyDown }, ref) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      alignItems: "center",
      backgroundColor: state.isSelected ? '#777777' : provided.backgroundColor,
      color: "black",
      display: "flex",
    }),
    // Add other component styles here if needed
  };

  const handleChange = (selectedOption) => {
    if(onChange) {
      // console.log(selectedOption)
      onChange(selectedOption);  // Call the passed down onChange method
    }
  };

  return (
    <div className="SingleSelect">
      <Select
        ref={ref}
        className={className + ' min-w-max'}
        onKeyDown={onKeyDown}
        styles={customStyles}
        placeholder={placeholder}
        value={value}
        closeMenuOnSelect={true}
        hideSelectedOptions={false}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
});

export default SingleSelect;