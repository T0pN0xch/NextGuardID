import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileKey,
  Link2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  MapPin,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useOnboarding } from '@/context/OnboardingContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ShieldAlert, label: 'Suspicious Activity', path: '/suspicious' },
  { icon: BookOpen, label: 'Audit Log', path: '/audit-log' },
  { icon: FileKey, label: 'Consent', path: '/consent' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { showOnboarding, currentStep } = useOnboarding();
  const location = useLocation();

  // Map route paths to step numbers
  const stepRoutes: Record<string, number> = {
    '/dashboard': 1,
    '/audit-log': 2,
    '/suspicious': 3,
    '/consent': 4,
    '/settings': 5,
  };

  const currentPathStep = stepRoutes[location.pathname];
  const isCurrentStepPath = currentPathStep === currentStep && showOnboarding;

  return (
    <aside
      className={cn(
        "glass-elevated h-[calc(100vh-4rem)] sticky top-16 border-r border-border/50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-3 flex flex-col h-full">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                  showOnboarding && stepRoutes[item.path] === currentStep ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/30" : ""
                )
              }
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110"
              )} />
              {!collapsed && (
                <span className="font-medium text-sm animate-fade-in">{item.label}</span>
              )}
              {/* Onboarding indicator */}
              {showOnboarding && stepRoutes[item.path] === currentStep && (
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="self-end mt-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  );
}
