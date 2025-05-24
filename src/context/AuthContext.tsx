
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        try {
          // Configure axios to use the token for all requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          
          // Fetch user profile
          const response = await axios.get("/api/users/profile");
          setUser(response.data);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem("token");
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/register", { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      toast({
        title: "Registration successful",
        description: `Welcome to Finanzo360, ${name}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
