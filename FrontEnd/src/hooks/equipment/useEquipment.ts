/**
 * DEPRECATED: This file is kept for backward compatibility only.
 * Please use the specific hooks instead:
 *
 * For USER features (available equipments only):
 * - import from '@/hooks/equipment/useEquipmentUser'
 *
 * For ADMIN features (all equipments):
 * - import from '@/hooks/equipment/useEquipmentAdmin'
 */

// Re-export USER hooks (for customers/regular users)
export { useEquipmentList, useEquipmentDetail } from "./useEquipmentUser";

// Re-export ADMIN hooks (for admin management)
export {
  useAllEquipmentList,
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
  useUpdateEquipmentAvailability,
  useUpdateEquipmentStock,
} from "./useEquipmentAdmin";
