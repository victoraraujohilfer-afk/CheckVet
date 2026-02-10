import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Users, BarChart3, Settings, LogOut } from "lucide-react";
import logo from "@/assets/checkvet-logo-new.png";

interface AdminSidebarProps {
    userName?: string;
    userRole?: string;
    userInitials?: string;
}

const AdminSidebar = ({
    userName = "Dr. Roberto Mendes",
    userRole = "Administrador",
    userInitials = "RM"
}: AdminSidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border flex flex-col">
            {/* Logo */}
            <div className=" border-b border-border">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 w-full"
                >
                    <img
                        src={logo}
                        alt="CheckVet"
                        className=" w-auto object-contain"
                    />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                <Button
                    variant={isActive("/admin/dashboard") ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    <Home className="h-4 w-4" />
                    Início
                </Button>
                <Button
                    variant={isActive("/admin/veterinarians") || isActive("/admin/veterinarians/new") ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => navigate("/admin/veterinarians")}
                >
                    <Users className="h-4 w-4" />
                    Veterinários
                </Button>
                <Button
                    variant={isActive("/admin/analytics") ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => navigate("/admin/analytics")}
                >
                    <BarChart3 className="h-4 w-4" />
                    Relatórios
                </Button>
                <Button
                    variant={isActive("/admin/settings") ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => navigate("/admin/settings")}
                >
                    <Settings className="h-4 w-4" />
                    Configurações
                </Button>
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                        <AvatarFallback className="bg-primary text-white">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{userRole}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate("/login")}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                </Button>
            </div>
        </aside>
    );
};

export default AdminSidebar;