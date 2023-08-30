import { useState } from "react";
import Select, { components } from "react-select";

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#777777";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "black",
    display: "flex "
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <input type="checkbox" checked={isSelected} />
      {children}
    </components.Option>
  );
};

// const allOptions = options.map(option => ({
//   value: option,
//   label: option
// }));

const MultiSelect = ({ options, placeholder }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const allOptions = options ? options.map(option => ({
    value: option,
    label: option
  })) : [];

  const CustomOption = (props) => (
    <InputOption {...props} options={options} />
  );

  return (
    <div className="MultiSelect">
      <Select
        defaultValue={[]}
        placeholder={placeholder}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        onChange={(options) => {
          if (Array.isArray(options)) {
            setSelectedOptions(options.map((opt) => opt.value));
          }
        }}
        options={allOptions}
        components={{
          Option: CustomOption
        }}
      />
    </div>
  );
}

export default MultiSelect;

