import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const ContactInfoCards = () => {
  return (
    <section className="section py-8">
      <div className="container">
        <div className="row">
          {/* Address */}
          <div className="col-md-3">
            <div className="card-info">
              <div className="card-info-icon info-icon-location">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-[var(--primary-color)] text-2xl"
                />
              </div>
              <h5 className="text-lg font-semibold text-[var(--text-dark)] mb-3">
                Địa chỉ
              </h5>
              <p className="leading-relaxed">
                123 Đường Nguyễn Văn Cừ
                <br />
                Phường 4, Quận 5
                <br />
                TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-3">
            <div className="card-info">
              <div className="card-info-icon info-icon-phone">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-green-600 text-2xl"
                />
              </div>
              <h5 className="text-lg font-semibold text-[var(--text-dark)] mb-3">
                Điện thoại
              </h5>
              <p className="leading-relaxed">
                Hotline: 1900-xxxx
                <br />
                Mobile: 0123-456-789
                <br />
                Zalo: 0987-654-321
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="col-md-3">
            <div className="card-info">
              <div className="card-info-icon info-icon-email">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-purple-600 text-2xl"
                />
              </div>
              <h5 className="text-lg font-semibold text-[var(--text-dark)] mb-3">
                Email
              </h5>
              <p className="leading-relaxed">
                info@lenscamdio.com
                <br />
                booking@lenscamdio.com
                <br />
                support@lenscamdio.com
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="col-md-3 ">
            <div className="card-info">
              <div className="card-info-icon info-icon-clock">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-orange-600 text-2xl"
                />
              </div>
              <h5 className="text-lg font-semibold text-[var(--text-dark)] mb-3">
                Giờ mở cửa
              </h5>
              <p className="leading-relaxed">
                Thứ 2 - Thứ 6: 8:00 - 22:00
                <br />
                Thứ 7 - Chủ nhật: 9:00 - 21:00
                <br />
                Lễ tết: 10:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfoCards;
