import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "@/services/userService";
import { useAuth } from "../auth/useAuth";

const useUser = () => {
  const { user: authUser } = useAuth();

  return useQuery({
    queryKey: ["user", authUser?.id],
    queryFn: () => getUserProfile(),
    enabled: Boolean(authUser?.id),
    staleTime: 1000 * 60 * 60, // 1 hour
    select: (data) => data?.data,
  });
};

export { useUser };
