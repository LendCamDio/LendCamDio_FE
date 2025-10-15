import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import type { FieldError } from "react-hook-form";

export type FormFieldProps = {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  classNameField?: string;
  classNameLabel?: string;
};

export const FormField = ({
  label,
  error,
  children,
  classNameField,
  classNameLabel,
}: FormFieldProps) => (
  <div
    className={`flex flex-col gap-0.5 ${classNameField} relative
    ${error ? "border-red-400 ring-red-300" : ""}
  `}
  >
    <label
      className={`form-label font-semibold text-[var(--text-dark)] ${classNameLabel}`}
    >
      {label}
    </label>
    {children}
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          key={error.message}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.15 }}
          className="text-sm text-[var(--error-color)] font-medium 
          min-h-[1.25rem] pl-1
          absolute bottom-[-1.25rem]"
        >
          <FontAwesomeIcon icon={faXmark} />
          {error.message}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);
