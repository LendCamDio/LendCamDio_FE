import type { RentalStatus } from "@/types/entity.type";

export type statusConfigType = {
  [key in RentalStatus]: {
    label: string;
    color: string;
    icon: React.ElementType;
    dotColor: string;
  };
};
