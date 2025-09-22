import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  const services = [
    { title: "Thuê Studio", to: "/studio-booking" },
    { title: "Thuê máy ảnh", to: "/camera-rental" },
    { title: "Chụp ảnh sự kiện", to: "#" },
    { title: "Quay video", to: "#" },
    { title: "Tư vấn concept", to: "#" },
  ];

  const support = [
    { title: "Liên hệ", to: "/contact" },
    { title: "Hướng dẫn đặt lịch", to: "#" },
    { title: "FAQ", to: "#" },
    { title: "Chính sách", to: "#" },
    { title: "Điều khoản", to: "#" },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Brand Info */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5>LENDCAMDIO</h5>
            <p>
              Không gian chụp ảnh chuyên nghiệp và dịch vụ cho thuê thiết bị
              hàng đầu tại Việt Nam.
            </p>
            <div className="social-links mt-3">
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5>Dịch vụ</h5>
            <ul className="footer-links">
              {services.map((service) => (
                <li key={service.title}>
                  <Link to={service.to}>
                    <FontAwesomeIcon icon={faChevronRight} />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5>Hỗ trợ</h5>
            <ul className="footer-links">
              {support.map((item) => (
                <li key={item.title}>
                  <Link to={item.to}>
                    <FontAwesomeIcon icon={faChevronRight} /> {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 col-sm-6 mb-4">
            <h5>Liên hệ</h5>
            <div className="contact-info">
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Đường ABC, Quận 1,
                TP.HCM
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} /> 0123-456-789
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} /> info@lenscamdio.com
              </p>
              <p>
                <FontAwesomeIcon icon={faClock} /> 8:00 - 22:00 (Thứ 2 - Chủ
                nhật)
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0">
                &copy; {new Date().getFullYear()} LENDCAMDIO. Tất cả quyền được
                bảo lưu.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">Thiết kế bởi LENDCAMDIO Team</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
