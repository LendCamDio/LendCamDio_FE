import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../types/index.type";

export function useAuth() {
  const context = useContext(AuthContext);
  const [isTokenValid, setIsTokenValid] = useState(true);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { token, user, role, isLoading, login, logout } = context;

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          setIsTokenValid(false);
          logout();
        } else {
          setIsTokenValid(true);
        }
      } catch {
        setIsTokenValid(false);
        logout();
      }
    }
  }, [token, logout]);

  return {
    token: isTokenValid ? token : null,
    user,
    role,
    isLoading,
    login,
    logout,
    isTokenValid,
  };
}
