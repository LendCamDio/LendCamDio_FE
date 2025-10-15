import { useEffect, useState } from "react";

const Cart = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>
      <p>Chức năng giỏ hàng đang được phát triển.</p>
    </div>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

const CartItem = ({
  item,
  index,
  updateQuantity,
  removeFromCart,
}: {
  item: any;
  index: number;
  updateQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
}) => {
  return (
    <div className="cart-item flex items-center mb-4 p-4">
      <div className="item-image mr-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>
      <div className="item-details flex-1">
        <h5 className="item-name text-lg font-semibold">{item.name}</h5>
        <p className="item-category text-sm text-gray-500">{item.category}</p>
        <div className="item-price font-bold text-blue-600">
          {formatCurrency(item.price)}/ngày
        </div>
      </div>
      <div className="item-quantity flex items-center gap-2">
        <button
          className="btn-outline-secondary"
          onClick={() => updateQuantity(index, item.quantity - 1)}
        >
          <i className="fa fa-minus"></i>
        </button>
        <span>{item.quantity}</span>
        <button
          className="btn-outline-secondary"
          onClick={() => updateQuantity(index, item.quantity + 1)}
        >
          <i className="fa fa-plus"></i>
        </button>
      </div>
      <div className="item-total ml-4 font-bold">
        {formatCurrency(item.price * item.quantity)}
      </div>
      <div className="item-actions ml-3">
        <button
          className="btn-outline-danger"
          onClick={() => removeFromCart(index)}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

const PaymentModal = ({
  isOpen,
  closeModal,
  cart,
  processPayment,
  updateCheckoutSummary,
}: {
  isOpen: boolean;
  closeModal: () => void;
  cart: any[];
  processPayment: () => void;
  updateCheckoutSummary: () => void;
}) => {
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [orderCode] = useState(`LC${Date.now().toString().slice(-6)}`);

  useEffect(() => {
    if (isOpen) {
      updateCheckoutSummary();
    }
  }, [isOpen]);

  return (
    <div className={`modal ${isOpen ? "block" : "hidden"}`}>
      <div className="modal-dialog max-w-4xl mx-auto">
        <div className="modal-content">
          <div className="modal-header p-4 border-b">
            <h5 className="modal-title text-xl font-semibold">
              Thanh toán đơn hàng
            </h5>
            <button className="btn-close text-2xl" onClick={closeModal}>
              &times;
            </button>
          </div>
          <div className="modal-body p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h6 className="mb-4 font-semibold">
                  Chọn phương thức thanh toán
                </h6>
                <div className="payment-methods flex flex-col gap-2">
                  {[
                    { method: "qr", icon: "fa-qrcode", label: "Quét mã QR" },
                    {
                      method: "card",
                      icon: "fa-credit-card",
                      label: "Thẻ tín dụng",
                    },
                    {
                      method: "bank",
                      icon: "fa-university",
                      label: "Chuyển khoản",
                    },
                  ].map((pm) => (
                    <div
                      key={pm.method}
                      className={`payment-method flex items-center p-4 ${
                        paymentMethod === pm.method ? "active" : ""
                      }`}
                      data-method={pm.method}
                      onClick={() => setPaymentMethod(pm.method)}
                    >
                      <i className={`fa ${pm.icon} mr-3 text-blue-600`}></i>
                      <span>{pm.label}</span>
                    </div>
                  ))}
                </div>
                <div
                  id="qr-payment"
                  className={`payment-content ${
                    paymentMethod === "qr" ? "active" : ""
                  }`}
                >
                  <div className="text-center">
                    <h6 className="mb-4">Quét mã QR để thanh toán</h6>
                    <div className="qr-code-container p-4 bg-gray-50 rounded-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LENSCAMDIO-${orderCode}`}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto border-2 border-gray-200 rounded-lg"
                      />
                    </div>
                    <p className="mt-3 text-gray-500">
                      Mở ứng dụng ngân hàng và quét mã QR để thanh toán
                    </p>
                    <div className="bank-info mt-4 p-4 bg-gray-50 rounded-lg">
                      <h6>Thông tin chuyển khoản</h6>
                      <p>
                        <strong>Ngân hàng:</strong> Vietcombank
                        <br />
                        <strong>Số tài khoản:</strong> 1234567890
                        <br />
                        <strong>Chủ tài khoản:</strong> LENSCAMDIO JSC
                        <br />
                        <strong>Nội dung:</strong>{" "}
                        <span id="transfer-content">
                          LENSCAMDIO {orderCode}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  id="card-payment"
                  className={`payment-content ${
                    paymentMethod === "card" ? "active" : ""
                  }`}
                >
                  <div className="sample-card-info mb-4 p-3 bg-blue-50 border border-blue-500 rounded-lg text-sm">
                    <div className="flex items-center mb-2 text-blue-700">
                      <i className="fa fa-credit-card mr-2"></i>
                      <strong>Thẻ demo:</strong>
                    </div>
                    <div className="font-mono">
                      <div className="mb-1">
                        <strong>Số thẻ:</strong> 4111 1111 1111 1111
                      </div>
                      <div className="flex gap-4">
                        <span>
                          <strong>Hạn:</strong> 12/25
                        </span>
                        <span>
                          <strong>CVV:</strong> 123
                        </span>
                        <span>
                          <strong>Tên:</strong> NGUYEN VAN A
                        </span>
                      </div>
                    </div>
                  </div>
                  <form id="card-form">
                    <div className="form-group mb-4">
                      <label className="form-label">Số thẻ</label>
                      <input
                        type="text"
                        className="form-control"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="form-label">Tháng/Năm</label>
                        <input
                          type="text"
                          className="form-control"
                          id="card-expiry"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          id="card-cvv"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <div className="form-group mt-4">
                      <label className="form-label">Tên trên thẻ</label>
                      <input
                        type="text"
                        className="form-control"
                        id="card-name"
                        placeholder="NGUYEN VAN A"
                      />
                    </div>
                  </form>
                </div>
                <div
                  id="bank-payment"
                  className={`payment-content ${
                    paymentMethod === "bank" ? "active" : ""
                  }`}
                >
                  <div className="bank-info p-4 bg-gray-50 rounded-lg">
                    <h6>Thông tin chuyển khoản</h6>
                    <p>
                      <strong>Ngân hàng:</strong> Vietcombank
                      <br />
                      <strong>Số tài khoản:</strong> 1234567890
                      <br />
                      <strong>Chủ tài khoản:</strong> CÔNG TY TNHH LENSCAMDIO
                      <br />
                      <strong>Chi nhánh:</strong> Hồ Chí Minh
                      <br />
                      <strong>Nội dung:</strong>{" "}
                      <span id="bank-transfer-content">
                        LENSCAMDIO {orderCode}
                      </span>
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <i className="fa fa-info-circle mr-2 text-blue-600"></i>
                      Vui lòng chuyển khoản đúng số tiền và ghi đúng nội dung để
                      đơn hàng được xử lý tự động.
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <h6 className="mb-4 font-semibold">Thông tin đơn hàng</h6>
                <div className="order-summary p-4 bg-gray-50 rounded-lg">
                  <div id="checkout-items"></div>
                  <div className="order-total mt-4 pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between py-2">
                      <span>Tạm tính:</span>
                      <span id="subtotal">0đ</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Phí dịch vụ:</span>
                      <span id="service-fee">50.000đ</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Giảm giá:</span>
                      <span id="discount">-0đ</span>
                    </div>
                    <div className="flex justify-between py-2 border-t-2 border-gray-200 font-bold text-lg">
                      <strong>Tổng cộng:</strong>
                      <strong id="final-total">0đ</strong>
                    </div>
                  </div>
                </div>
                <div className="customer-info mt-4">
                  <h6 className="mb-4 font-semibold">Thông tin khách hàng</h6>
                  <form id="customer-form">
                    <div className="form-group mb-4">
                      <label className="form-label">Họ và tên *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="customer-name"
                        required
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label">Số điện thoại *</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="customer-phone"
                        required
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="customer-email"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label">Ghi chú</label>
                      <textarea
                        className="form-control"
                        id="customer-note"
                        rows={3}
                        placeholder="Ghi chú đặc biệt..."
                      ></textarea>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer p-4 border-t flex justify-end gap-4">
            <button className="btn-outline-primary" onClick={closeModal}>
              Đóng
            </button>
            <button className="btn-primary" onClick={processPayment}>
              <i className="fa fa-credit-card mr-2"></i> Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({
  isOpen,
  closeModal,
  orderCode,
  goToOrderTracking,
}: {
  isOpen: boolean;
  closeModal: () => void;
  orderCode: string;
  goToOrderTracking: () => void;
}) => {
  return (
    <div className={`modal ${isOpen ? "block" : "hidden"}`}>
      <div className="modal-dialog max-w-md mx-auto">
        <div className="modal-content">
          <div className="modal-body text-center py-12">
            <div className="success-icon mb-4">
              <i className="fa fa-check-circle text-6xl text-green-500"></i>
            </div>
            <h3 className="mb-4 text-2xl font-bold">Thanh toán thành công!</h3>
            <p className="mb-4">
              Đơn hàng của bạn đã được xác nhận. Mã đơn hàng:{" "}
              <strong id="order-code">{orderCode}</strong>
            </p>
            <div className="action-buttons flex justify-center gap-4">
              <button className="btn-outline-primary" onClick={closeModal}>
                Đóng
              </button>
              <button className="btn-primary" onClick={goToOrderTracking}>
                <i className="fa fa-truck mr-2"></i> Theo dõi đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
