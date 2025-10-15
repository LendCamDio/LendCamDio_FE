import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";

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
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

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
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="sort-select w-50 transition-colors duration-200 relative"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-sm">{getSelectedLabel()}</span>
        </button>
      </div>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              className="fixed shadow-custom-lg bg-white rounded-xl border border-gray-200"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: Math.max(dropdownPosition.width, 224), // min-width 224px (w-56)
                zIndex: 999999,
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <ul className="py-2" role="menu" aria-labelledby="sortSelect">
                {options.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => handleSelect(option.value)}
                      className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-[var(--text-dark)] hover:bg-[rgba(59,130,246,0.1)] transition-colors duration-200"
                    >
                      <span>{option.label}</span>
                      {selectedValue === option.value && (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-[var(--primary-color)] w-4 h-4"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
