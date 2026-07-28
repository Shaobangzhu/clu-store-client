import { IoIosArrowDropdown } from "react-icons/io";
import { useState } from "react";

function SkuSelect({ placeholder, options }) {
  const [value, setValue] = useState("");
  console.log("当前选项: ", value);

  return (
    <div className="w-24 relative">
      <select
        className="
        border border-apple-gray-200
        rounded-md
        w-24 py-2 px-3
        bg-none bg-no-repeat appearance-none
        pr-8
        dark:border-apple-gray-800
        text-apple-text-light
        dark:text-apple-text-dark 
        "
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
        <IoIosArrowDropdown className="w-4 h-4 text-apple-text-light dark:text-apple-text-dark" />
      </div>
    </div>
  );
}

export default SkuSelect;
