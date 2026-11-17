import { IoIosArrowDropdown } from 'react-icons/io';
interface SkuSelectProps {
  placeholder: string;
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (value: string) => void;
  value?: string | null;
}
export default function SkuSelect({ placeholder, options, onChange, value }: SkuSelectProps) {
  return <div className="w-24 relative">
    <select aria-label={placeholder} className="border border-apple-gray-200 rounded-md w-24 py-2 px-3 bg-none bg-no-repeat appearance-none pr-8 dark:border-apple-gray-800 text-apple-text-light dark:text-apple-text-dark"
      value={value ?? ''} onChange={event => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>
    <div className="absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none"><IoIosArrowDropdown className="w-4 h-4" /></div>
  </div>;
}
