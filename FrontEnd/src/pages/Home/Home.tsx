import Loading from "@/components/common/Loading/Loading";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEquipmentList } from "@/hooks/equipment/useEquipment";
import {
  faClock,
  faStar,
  faUsers,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, Suspense, useMemo, useEffect, useState } from "react";
import {
  getActiveAdsByPosition,
  trackAdClick,
  trackAdView,
} from "@/services/adCampaign.service";
import { AdPosition } from "@/types/adCampaign.type";
import type { AdCampaignPublic } from "@/types/adCampaign.type";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import { useTopRentedEquipment } from "@/hooks/equipment/useEquipmentUser";

// Lazy load the DashboardSection component
const DashboardSection = lazy(() => import("../customer/DashboardSection"));

const Home = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  // fetch studios data from API
  const { data: topRentedData } = useEquipmentList(1, 3, "studio", "");
  const dataSource = topRentedData?.data?.items || [];

  const studios = dataSource
    .map((item) => ({
      image: item.imageUrl,
      name: item.name,
      description: item.description,
      price: item.dailyPrice
        ? `${item.dailyPrice.toLocaleString("vi-VN")}đ/ngày`
        : item.price
        ? `${item.price.toLocaleString("vi-VN")}đ`
        : "Liên hệ",
      equipmentId: item.equipmentId,
    }))
    .sort(() => 0.5 - Math.random()); // random order

  // Fetch equipment data from API
  const { data: equipmentData, isLoading: isLoadingEquipment } =
    useEquipmentList(1, 100, "all", "");

  // Get 3 random equipment items
  const featuredEquipment = useMemo(() => {
    if (!equipmentData?.data?.items || equipmentData.data.items.length === 0) {
      return [];
    }

    const items = [...equipmentData.data.items];
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((item) => ({
      equipmentId: item.equipmentId,
      imageUrl:
        item.imageUrl ||
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a",
      title: item.name,
      description: item.description || "",
      price: item.dailyPrice
        ? `${item.dailyPrice.toLocaleString("vi-VN")}đ/ngày`
        : item.price
        ? `${item.price.toLocaleString("vi-VN")}đ`
        : "Liên hệ",
      isDailyPrice: !!item.dailyPrice,
    }));
  }, [equipmentData]);

  // #region Sample data for studios and equipment
  // const studios = [
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  //     title: "Studio Modern A",
  //     description: "Studio hiện đại với không gian rộng rãi",
  //     price: "1.200.000đ/ngày",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  //     title: "Studio Vintage B",
  //     description: "",
  //     price: "1.500.000đ/ngày",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  //     title: "Studio Minimalist C",
  //     description:
  //       "Thiết kế tối giản với tông màu trắng chủ đạo, phù hợp cho chụp ảnh sản phẩm và concept clean.Thiết kế tối giản với tông màu trắng chủ đạo, phù hợp cho chụp ảnh sản phẩm và concept clean.",
  //     price: "1.000.000đ/ngày",
  //   },
  // ];
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

  // Ads: top banner and sidebar/promotions
  const [topAds, setTopAds] = useState<AdCampaignPublic[]>([]);
  const [promoAds, setPromoAds] = useState<AdCampaignPublic[]>([]);
  const [loadingAds, setLoadingAds] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resTop = await getActiveAdsByPosition(AdPosition.HomePageTop);
        const resPromo = await getActiveAdsByPosition(
          AdPosition.SidebarFeatured
        );

        const extract = (res: any) => {
          // Support either paginated response or direct array
          if (!res) return [] as AdCampaignPublic[];
          const maybeItems = res.data?.items ?? res.data ?? res.items ?? res;
          return Array.isArray(maybeItems) ? maybeItems : [];
        };

        const top = extract(resTop);
        const promo = extract(resPromo);

        if (!mounted) return;
        setTopAds(top);
        setPromoAds(promo);

        // Fire-and-forget: track views for visible ads
        top.forEach((a) => trackAdView(a.campaignId).catch(() => {}));
        promo.forEach((a) => trackAdView(a.campaignId).catch(() => {}));
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoadingAds(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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
              <a href="/studios" className="btn-primary me-3">
                Đặt lịch Studio
              </a>
              <a href="/cameras" className="btn-outline-primary">
                Thuê máy ảnh
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Top Ad Banner */}
      {!loadingAds && topAds.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="card-outstanding ad-top animate-fade-in-up">
              <img
                src={
                  topAds[0].imageUrl ||
                  "https://via.placeholder.com/1200x300?text=Promotion"
                }
                onError={(e) => {
                  e.currentTarget.src = "../../assets/defaultPic1.jpg";
                }}
                alt={topAds[0].title}
                className="card-outstanding-img-top"
              />
              <div className="card-outstanding-body text-center">
                <h3 className="text-2xl font-bold card-title">
                  {topAds[0].title}
                </h3>
                {topAds[0].description && (
                  <p className="card-text line-clamp-2">
                    {topAds[0].description}
                  </p>
                )}
                <div className="mt-3">
                  <a
                    href={topAds[0].targetUrl}
                    onClick={() =>
                      trackAdClick(topAds[0].campaignId).catch(() => {})
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Promotions Grid / Sidebar Featured Ads */}
      {!loadingAds && promoAds.length > 0 && (
        <section className="section bg-[var(--bg-light)]">
          <div className="container">
            <h2 className="section-title text-center">Khuyến mãi nổi bật</h2>
            <p className="section-subtitle text-center mb-4">
              Các chiến dịch được tài trợ
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoAds.map((ad, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={`promo-${ad.campaignId}-${idx}`}
                  className="rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        ad.imageUrl ||
                        "https://via.placeholder.com/400x200?text=Ad"
                      }
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute top-3 right-3 bg-white/80 backdrop-blur px-2 py-1 rounded-md text-xs font-medium text-gray-800 shadow">
                      Được tài trợ
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col h-full">
                    <h5 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {ad.title}
                    </h5>

                    {ad.description && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                        {ad.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4">
                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                    w-full inline-flex items-center justify-center 
                    px-4 py-2 rounded-lg 
                    bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]
                    text-white font-medium shadow-md hover:shadow-lg transition-all
                  "
                        onClick={() =>
                          trackAdClick(ad.campaignId).catch(() => {})
                        }
                      >
                        Tìm hiểu
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {role && role !== "admin" && (
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
            {studios.length > 0 &&
              studios.map((studio, index) => (
                <div
                  className="col-md-4 mb-5 "
                  key={`studio-${studio.name}-${index}`}
                >
                  <div className="card-outstanding animate-fade-in-up h-full">
                    <img
                      src={studio.image}
                      alt={studio.name}
                      className="card-outstanding-img-top"
                    />
                    <div className="card-outstanding-body">
                      <h5 className="text-xl font-bold card-title">
                        {studio.name}
                      </h5>
                      <p className="card-text">{studio.description}</p>
                      <div className="price">{studio.price}</div>
                      <button
                        className="btn-primary book-btn"
                        data-studio-name={studio.name}
                        onClick={() => navigate(`/studios`)}
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

          {isLoadingEquipment ? (
            <div className="text-center py-5">
              <Loading />
            </div>
          ) : (
            <>
              <div className="row">
                {featuredEquipment.map((equipment, index) => (
                  <div
                    className="col-md-4 mb-4"
                    key={`equipment-${equipment.equipmentId}-${index}`}
                  >
                    <div className="card-outstanding animate-fade-in-up h-full">
                      <img
                        src={equipment.imageUrl}
                        alt={equipment.title}
                        className="card-outstanding-img-top"
                      />
                      <div className="card-outstanding-body">
                        <h5 className="card-title">{equipment.title}</h5>
                        <p className="card-text line-clamp-3">
                          {equipment.description}
                        </p>
                        <div className="price">{equipment.price}</div>
                        <a
                          href={
                            equipment.isDailyPrice ? "/cameras" : "/products"
                          }
                          className="btn-primary book-btn"
                        >
                          {equipment.isDailyPrice ? "Thuê ngay" : "Mua ngay"}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <a href="/cameras" className="btn-outline-primary me-3">
                  Xem thiết bị cho thuê
                </a>
                <a href="/products" className="btn-outline-primary">
                  Xem thiết bị bán
                </a>
              </div>
            </>
          )}
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
