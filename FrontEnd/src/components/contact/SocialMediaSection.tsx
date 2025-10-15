import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTiktok,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SocialMediaSection = () => {
  return (
    <section className="section">
      <div className="container h-fit">
        <h2 className="section-title">Kết nối với chúng tôi</h2>
        <p className="section-subtitle">
          Theo dõi chúng tôi trên các mạng xã hội để cập nhật tin tức và ưu đãi
          mới nhất
        </p>
        <div className="row flex justify-center gap-4">
          {[
            { icon: faFacebook, color: "hover:text-blue-600" },
            { icon: faInstagram, color: "hover:text-pink-600" },
            { icon: faYoutube, color: "hover:text-red-600" },
            { icon: faTiktok, color: "hover:text-black" },
            { icon: faTelegram, color: "hover:text-blue-500" },
          ].map((social, index) => (
            <button
              key={index}
              className={`w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-xl`}
            >
              <FontAwesomeIcon icon={social.icon} size="lg" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
