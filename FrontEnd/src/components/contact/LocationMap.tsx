import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LocationMap = () => {
  return (
    <div className="card-outstanding p-6">
      <h4 className="text-2xl font-bold text-[var(--text-dark)] mb-6">
        Vị trí cửa hàng
      </h4>

      {/* Map Placeholder */}
      <div className="bg-gray-200 rounded-lg h-64 mb-6 flex items-center justify-center">
        <p className="text-gray-500">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          Map Integration Here
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h5 className="font-semibold text-[var(--text-dark)] mb-2">
            Địa chỉ:
          </h5>
          <p className="text-[var(--text-light)]">
            123 Đường Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-[var(--text-dark)] mb-2">
            Cách thức di chuyển:
          </h5>
          <ul className="text-[var(--text-light)] space-y-1">
            <li>• Bus: Tuyến 01, 02, 03 (dừng trước cửa hàng)</li>
            <li>• Xe máy: Có chỗ để xe miễn phí</li>
            <li>• Ô tô: Có bãi đậu xe trả phí</li>
            <li>• Grab/Taxi: Gọi đến "LENSCAMDIO"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
