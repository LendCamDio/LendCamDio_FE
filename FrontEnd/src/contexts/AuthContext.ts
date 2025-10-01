import { createContext } from "react";
import type { AuthContextType } from "../types/index.type";

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };
