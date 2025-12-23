import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  FileKey,
  Link2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  MapPin,
  User,
  Lock,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ShieldAlert, label: 'Suspicious Activity', path: '/suspicious' },
  { icon: Lock, label: 'MyKad Audit Trail', path: '/mykad-audit-trail' },
  { icon: History, label: 'Audit History', path: '/audit-trail' },
  { icon: ListChecks, label: 'ID Usage', path: '/usage' },
  { icon: FileKey, label: 'Consent', path: '/consent' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )
              }
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110"
              )} />
              {!collapsed && (
                <span className="font-medium text-sm animate-fade-in">{item.label}</span>
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
