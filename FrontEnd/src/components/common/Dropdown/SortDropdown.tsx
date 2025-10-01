import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  onSort?: (value: string) => void;
  defaultValue?: string;
}

export default function SortDropdown({
  options,
  onSort,
  defaultValue,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || options[0]?.value
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    if (onSort) onSort(value);
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    return (
      options.find((option) => option.value === selectedValue)?.label || ""
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className=" sort-select w-50 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm">{getSelectedLabel()}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 w-56 mt-2 origin-top-right animate-fadeInDown shadow-custom-lg bg-white rounded-xl overflow-hidden">
          <div className="py-1 z-[1000] ">
            {options.map((option) => (
              <button
                key={option.value}
                className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-[var(--text-dark)] hover:bg-[rgba(59,130,246,0.1)] transition-colors duration-200"
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {selectedValue === option.value && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-[var(--primary-color)] w-4 h-4"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
