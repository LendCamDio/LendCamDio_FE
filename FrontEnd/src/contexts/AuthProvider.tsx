import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, JwtPayload } from "../types/index.type";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";
import { logout as apiLogout } from "@/services/authService";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hàm đăng xuất
  const logout = useCallback(async () => {
    try {
      await apiLogout(); // call backend
    } catch (err) {
      console.warn("Server logout failed, continuing local logout");
    }
    // Clear both storage locations
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("rememberedEmail");
    sessionStorage.removeItem("rememberedEmail");
    // Clear state
    setUser(null);
    setToken(null);
  }, []);

  // Dán token và gắn user
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const timeExpMs = decoded.exp * 1000;

          // Check token expiration
          if (decoded.exp && Date.now() > timeExpMs) {
            logout(); // Token hết hạn, đăng xuất
          } else {
            // Token hợp lệ, thiết lập user và role
            setUser({
              id: decoded.sub,
              email: decoded.email,
              fullName:
                decoded[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ], // Lấy tên đầy đủ
              role: decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ],
              isVerified: decoded.IsVerified === "True" && "true", // Chuyển đổi chuỗi "True" thành boolean
              avatarUrl: decoded.AvatarUrl,
            });
            // console.log("Decoded token:", decoded);
          }
        } catch {
          console.error("Invalid token");
          logout(); // Token không hợp lệ, đăng xuất
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Hàm đăng nhập
  const login = useCallback(
    async (newToken: string, rememberMe: boolean): Promise<void> => {
      try {
        // Validate token first
        const decoded = jwtDecode<JwtPayload>(newToken);
        const timeExpMs = decoded.exp * 1000;

        // Check token expiration
        if (decoded.exp && Date.now() > timeExpMs) {
          throw new Error("Token is expired");
        }

        // Token is valid, set it in localStorage and state
        localStorage.setItem("token", newToken);
        setToken(newToken);

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", decoded.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Set user immediately
        setUser({
          id: decoded.sub,
          email: decoded.email,
          role: decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ],
        });

        // console.log("Login successful. Decoded token:", decoded);
      } catch (error) {
        console.error("Login failed: Invalid token", error);
        logout();
        throw error; // Re-throw to let the calling code handle it
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        user: user as AuthContextType["user"],
        role: (user as AuthContextType["user"])?.role || null,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
