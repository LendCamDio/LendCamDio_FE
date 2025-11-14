import { PaymentMethod } from "@/types/entity.type";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
  className?: string;
}

export const PaymentMethodSelector = ({
  value,
  onChange,
  disabled = false,
  className = "",
}: PaymentMethodSelectorProps) => {
  const paymentMethods: { value: PaymentMethod; label: string; icon: string; description: string }[] = [
    {
      value: PaymentMethod.PayOS,
      label: "PayOS",
      icon: "💳",
      description: "Thanh toán qua cổng PayOS (QR, ATM, Visa/MasterCard)",
    },
    {
      value: PaymentMethod.VNPay,
      label: "VNPay",
      icon: "🏦",
      description: "Thanh toán qua VNPay",
    },
    {
      value: PaymentMethod.Cash,
      label: "Tiền mặt",
      icon: "💵",
      description: "Thanh toán trực tiếp bằng tiền mặt",
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Phương thức thanh toán
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {paymentMethods.map((method) => (
          <button
            key={method.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(method.value)}
            className={`
              relative rounded-lg border-2 p-4 text-left transition-all
              ${
                value === method.value
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              }
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            `}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {method.label}
                  </h3>
                  {value === method.value && (
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {method.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
