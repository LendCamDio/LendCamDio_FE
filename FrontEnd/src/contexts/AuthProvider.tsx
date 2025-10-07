import { useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, JwtPayload } from "../types/index.type";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dán token và gắn user
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const timeExpMs = decoded.exp * 1000;

          // Check token expiration
          if (decoded.exp && Date.now() > timeExpMs) {
            handleLogout(); // Token hết hạn, đăng xuất
          } else {
            // Token hợp lệ, thiết lập user và role
            setUser({
              id: decoded.sub,
              email: decoded.email,
              role: decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
              ],
            });
            console.log("Decoded token:", decoded);
          }
        } catch {
          console.error("Invalid token");
          handleLogout(); // Token không hợp lệ, đăng xuất
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Hàm đăng nhập
  const login = async (newToken: string): Promise<void> => {
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

      // Set user immediately
      setUser({
        id: decoded.sub,
        email: decoded.email,
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      });

      console.log("Login successful. Decoded token:", decoded);
    } catch (error) {
      console.error("Login failed: Invalid token", error);
      handleLogout();
      throw error; // Re-throw to let the calling code handle it
    }
  };
  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user: user as AuthContextType["user"],
        role: (user as AuthContextType["user"])?.role || null,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
