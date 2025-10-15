import Loading from "@/components/common/Loading/Loading";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  faClock,
  faStar,
  faUsers,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, Suspense } from "react";

// Lazy load the DashboardSection component
const DashboardSection = lazy(() => import("../customer/DashboardSection"));

const Home = () => {
  const { role } = useAuth();

  // #region Sample data for studios and equipment
  const studios = [
    {
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Studio Modern A",
      description: "Studio hiện đại với không gian rộng rãi",
      price: "1.200.000đ/ngày",
    },
    {
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Studio Vintage B",
      description: "",
      price: "1.500.000đ/ngày",
    },
    {
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Studio Minimalist C",
      description:
        "Thiết kế tối giản với tông màu trắng chủ đạo, phù hợp cho chụp ảnh sản phẩm và concept clean.Thiết kế tối giản với tông màu trắng chủ đạo, phù hợp cho chụp ảnh sản phẩm và concept clean.",
      price: "1.000.000đ/ngày",
    },
  ];
  const featuredEquipment = [
    {
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      title: "Canon EOS R5",
      description: "Máy ảnh mirrorless full-frame cao cấp, 45MP.",
      price: "800.000đ/ngày",
    },
    {
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      title: "Sony A7 III",
      description:
        "Máy ảnh mirrorless full-frame, 24MP, khả năng chụp đêm tuyệt vời.",
      price: "700.000đ/ngày",
    },
    {
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      title: "Fujifilm X-T4",
      description: "Máy ảnh mirrorless APS-C, 26MP, màu sắc sống động.",
      price: "600.000đ/ngày",
    },
    {
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      title: "Nikon Z6 II",
      description: "Máy ảnh mirrorless full-frame, 24MP, quay video 4K.",
      price: "750.000đ/ngày",
    },
  ];
  const whyChooseUsSection = {
    title: "Tại sao chọn LENSCAMDIO?",
    features: [
      {
        icon: faStar,
        title: "Chất lượng cao",
        description:
          "Studio được trang bị hiện đại, thiết bị chuyên nghiệp từ các thương hiệu hàng đầu thế giới.",
      },
      {
        icon: faClock,
        title: "Linh hoạt 24/7",
        description:
          "Đặt lịch online dễ dàng, hỗ trợ khách hàng 24/7, linh hoạt về thời gian thuê.",
      },
      {
        icon: faUsers,
        title: "Hỗ trợ chuyên nghiệp",
        description:
          "Đội ngũ tư vấn giàu kinh nghiệm, hỗ trợ kỹ thuật và tư vấn concept chụp ảnh.",
      },
    ],
  };
  // #endregion

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="text-center">
            <h1>Chào mừng đến với LENDCAMDIO</h1>
            <p>
              Không gian chụp ảnh chuyên nghiệp và dịch vụ cho thuê thiết bị
              hàng đầu
            </p>
            <div className="mt-4">
              <a href="studio-booking.html" className="btn-primary me-3">
                Đặt lịch Studio
              </a>
              <a href="camera-rental.html" className="btn-outline-primary">
                Thuê máy ảnh
              </a>
            </div>
          </div>
        </div>
      </section>

      {role && role === "admin" && (
        <Suspense fallback={<Loading />}>
          <DashboardSection />
        </Suspense>
      )}

      {/* Studio nổi bật */}
      <section className="section">
        <div className="container min-h-[300px]">
          <h2 className="section-title">Studio nổi bật</h2>
          <p className="section-subtitle">
            Khám phá những studio chụp ảnh đẹp nhất của chúng tôi
          </p>
          <div className="row">
            {studios.map((studio, index) => (
              <div className="col-md-4 mb-5 " key={index}>
                <div className="card-outstanding animate-fade-in-up h-full">
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="card-outstanding-img-top"
                  />
                  <div className="card-outstanding-body">
                    <h5 className="card-title">{studio.title}</h5>
                    <p className="card-text">{studio.description}</p>
                    <div className="price">{studio.price}</div>
                    <button
                      className="btn-primary book-btn"
                      data-studio-name={studio.title}
                    >
                      Đặt lịch ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Camera Equipment Section */}
      <section className="section bg-[var(--bg-light)]">
        <div className="container">
          <h2 className="section-title">Thiết bị nổi bật</h2>
          <p className="section-subtitle">
            Máy ảnh và phụ kiện chuyên nghiệp cho thuê
          </p>

          <div className="row">
            {featuredEquipment.map((equipment, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <div className="card-outstanding animate-fade-in-up">
                  <img
                    src={equipment.image}
                    alt={equipment.title}
                    className="card-outstanding-img-top"
                  />
                  <div className="card-outstanding-body">
                    <h5 className="card-title">{equipment.title}</h5>
                    <p className="card-text">{equipment.description}</p>
                    <div className="price">{equipment.price}</div>
                    <button
                      className="btn-primary book-btn"
                      data-item-name={equipment.title}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <a href="camera-rental.html" className="btn-outline-primary">
              Xem tất cả thiết bị
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Tại sao chọn LENSCAMDIO?</h2>
          <div className="row">
            {whyChooseUsSection.features.map((feature, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="feature-box animate-fade-in-up">
                  <div className="feature-icon">
                    <FontAwesomeIcon
                      icon={feature.icon as IconDefinition}
                      size="2x"
                    />
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
