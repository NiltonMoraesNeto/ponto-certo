import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TokenPayload } from "../model/profile-model";
import { jwtDecode } from "jwt-decode";
import { AuthContextType } from "../model/auth-context-model";
import { fetchProfileById } from "../services/profile";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<TokenPayload | undefined>();
  const [profileUser, setProfileUser] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const decoded = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          const profileName = await fetchProfileById(decoded.perfil);
          setIsAuthenticated(true);
          setDataUser(decoded);
          setProfileUser(profileName[0].descricao);
        } else {
          localStorage.removeItem("auth_token");
        }
      }
    };
    checkAuth();
  }, []);

  const login = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      const profileName = await fetchProfileById(decoded.perfil);
      setDataUser(decoded);
      setProfileUser(profileName[0].descricao);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    setDataUser(undefined);
    setProfileUser("");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        dataUser,
        profileUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
