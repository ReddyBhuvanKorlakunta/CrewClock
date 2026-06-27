import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Calendar, Clock, Users, Bell, Search, Home, Coffee, ArrowRightLeft, CalendarDays, DollarSign, Shield, AlertTriangle, TrendingUp, Settings as SettingsIcon } from 'lucide-react';
import { DashboardOverview } from './components/DashboardOverview';
import { SchedulingInterface } from './components/SchedulingInterface';
import { EmployeeManagement } from './components/EmployeeManagement';
import { TimeTracking } from './components/TimeTracking';
import { LeaveManagement } from './components/LeaveManagement';
import { OpenShifts } from './components/OpenShifts';
import { SwapRequests } from './components/SwapRequests';
import { PayrollManagement } from './components/PayrollManagement';
import { Settings } from './components/Settings';
import { PrivacyDashboard } from './components/PrivacyDashboard';
import { EmergencyCommunications } from './components/EmergencyCommunications';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [notifications] = useState(3);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'time-tracking', label: 'Time Tracking', icon: Clock },
    { id: 'leave', label: 'Leave Management', icon: Coffee },
    { id: 'open-shifts', label: 'Open Shifts', icon: CalendarDays },
    { id: 'swaps', label: 'Shift Swaps', icon: ArrowRightLeft },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
    { id: 'emergency', label: 'Emergency Comms', icon: AlertTriangle },
    { id: 'privacy', label: 'Privacy Dashboard', icon: Shield },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview />;
      case 'scheduling':
        return <SchedulingInterface />;
      case 'employees':
        return <EmployeeManagement />;
      case 'time-tracking':
        return <TimeTracking />;
      case 'leave':
        return <LeaveManagement />;
      case 'open-shifts':
        return <OpenShifts />;
      case 'swaps':
        return <SwapRequests />;
      case 'payroll':
        return <PayrollManagement />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'emergency':
        return <EmergencyCommunications />;
      case 'privacy':
        return <PrivacyDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">CrewClock</h1>
                <p className="text-sm text-muted-foreground">Workforce Management</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-2">
              <SidebarMenu className="space-y-1">
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => setActiveView(item.id)}
                      isActive={activeView === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
            
            <div className="border-t border-sidebar-border p-3 flex-shrink-0">
              {/* User Profile Section - Non-interactive */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/30">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">ED</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">Emily Davis</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">Store Manager</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">emily.davis@store.com</p>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex-1 flex items-center gap-4">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search employees, shifts, requests..."
                    className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">ED</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">Emily Davis</p>
                    <p className="text-xs text-muted-foreground">Store Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}