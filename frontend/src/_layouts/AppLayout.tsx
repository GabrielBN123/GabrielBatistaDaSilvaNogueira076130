import { Outlet } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { useAuth } from "@/context/AuthContext";

export function AppLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen min-w-screen flex flex-col">
      <Header 
        onSignOut={signOut} 
      />
      
      <div className="flex-1 bg-[url('@/assets/img/cubes.png')] bg-fixed bg-gradient-to-br">
        <Outlet />
      </div>
    </div>
  );
}