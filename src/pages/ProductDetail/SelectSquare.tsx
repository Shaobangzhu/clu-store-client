interface SelectSquareProps {
  name: string;
  spec?: string;
  price: string;
  isSelected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const SelectSquare = ({
  name,
  spec,
  price,
  isSelected = false,
  disabled = false,
  onClick,
}: SelectSquareProps) => {
  return (
    <div className="w-full flex justify-center">
      <button
        type="button"
        disabled={disabled}
        aria-pressed={isSelected}
        className={`w-[370px] h-25 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? "border-3 border-apple-blue"
            : "border border-apple-gray-300 hover:ring-2 hover:ring-apple-blue"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mt-2 px-2">
          <div className="ml-2 mt-2">
            <p>{name}</p> {spec && <span className="text-xs">({spec})</span>}
            <p className="text-sm mt-1 mr-2">{price}</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default SelectSquare;
