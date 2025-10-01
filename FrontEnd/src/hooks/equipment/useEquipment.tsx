import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  type EquipmentImage,
  type EquipmentResponse,
  type ReviewAverage,
} from "@/types/index.type";
import {
  EQUIPMENT_ENDPOINTS,
  EQUIPMENT_IMAGE_ENDPOINTS,
  REVIEW_ENDPOINTS,
} from "../../constants/endpoints";
import { getEquipments } from "@/services/equipmentService";

const useEquipmentList = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["equipments", page, pageSize],
    queryFn: () => getEquipments(page, pageSize),
    staleTime: 1000 * 60 * 5, // keep data fresh for 5 minutes
  });
};

const useEquipmentWithImages = (page: number, pageSize: number) => {
  async function fetchEquipmentsWithImages(
    page: number,
    pageSize: number
  ): Promise<EquipmentResponse> {
    const res1 = await axios.get<EquipmentResponse>(EQUIPMENT_ENDPOINTS.LIST, {
      params: { page, pageSize },
    });

    const equipments = res1.data.data.items;
    const imagePromises = equipments.map((equipment) =>
      axios
        .get<EquipmentImage[] | EquipmentImage>(
          EQUIPMENT_IMAGE_ENDPOINTS.BY_EQUIPMENT(equipment.equipmentId || "")
        )
        .then((imageRes) => {
          const images = Array.isArray(imageRes.data)
            ? imageRes.data
            : [imageRes.data];

          equipment.images = images;
        })
        .catch(() => {
          // Nếu fetch images fail, set empty array
          equipment.images = [];
        })
    );
    await Promise.all(imagePromises);

    return res1.data;
  }

  return useQuery({
    queryKey: ["equipments-with-images", page, pageSize],
    queryFn: () => fetchEquipmentsWithImages(page, pageSize),
    staleTime: 1000 * 30 * 5, // keep data fresh for 5 minutes
  });
};

const useEquipmentWithImgsAndReviews = (page: number, pageSize: number) => {
  async function fetchEquipmentsWithImgsAndReviews(
    page: number,
    pageSize: number
  ): Promise<EquipmentResponse> {
    const res1 = await axios.get<EquipmentResponse>(EQUIPMENT_ENDPOINTS.LIST, {
      params: { page, pageSize },
    });

    const equipments = res1.data.data.items;
    const enrichPromises = equipments.map(async (equipment) => {
      const [imageRes, reviewRes] = await Promise.allSettled([
        axios.get<EquipmentImage[] | EquipmentImage>(
          EQUIPMENT_IMAGE_ENDPOINTS.BY_EQUIPMENT(equipment.equipmentId || "")
        ),
        axios.get<ReviewAverage[] | ReviewAverage>(
          REVIEW_ENDPOINTS.AVERAGE_RATING_BY_EQUIPMENT(
            equipment.equipmentId || ""
          )
        ),
      ]);
      // Handle images
      if (imageRes.status === "fulfilled") {
        equipment.images = Array.isArray(imageRes.value.data)
          ? imageRes.value.data
          : [];
      } else {
        equipment.images = [];
      }

      // Handle reviews
      if (reviewRes.status === "fulfilled") {
        equipment.rating = Array.isArray(reviewRes.value.data)
          ? reviewRes.value.data
          : [];
      } else {
        equipment.rating = [];
      }
    });
    await Promise.all(enrichPromises);

    return res1.data;
  }

  return useQuery({
    queryKey: ["equipments-with-details", page, pageSize],
    queryFn: () => fetchEquipmentsWithImgsAndReviews(page, pageSize),
    staleTime: 1000 * 60 * 5, // keep data fresh for 5 minutes
  });
};

export {
  useEquipmentList,
  useEquipmentWithImages,
  useEquipmentWithImgsAndReviews,
};
