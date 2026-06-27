import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowRightLeft, Bell, CalendarDays, Circle, Coffee, Home, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChatSystem } from './ChatSystem';
interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  requiredPermissions: string[];
}

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  requiredPermissions: string[];
}

interface RoleBasedLayoutProps {
  currentUser: any;
  children: React.ReactNode;
  availableLocations: string[];
  currentLocation: string;
  onLocationChange: (location: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  notifications: number;
}

const rolePermissions = {
  owner: [
    'view_all', 'manage_schedules', 'manage_employees', 'view_payroll', 'manage_payroll',
    'view_analytics', 'manage_settings', 'manage_locations', 'manage_roles',
    'view_emergency', 'manage_emergency', 'view_privacy', 'manage_privacy', 'view_chat'
  ],
  district_manager: [
    'view_all', 'manage_schedules', 'manage_employees', 'view_payroll', 
    'view_analytics', 'manage_settings', 'view_emergency', 'manage_emergency', 'view_chat'
  ],
  store_manager: [
    'view_location', 'manage_schedules', 'manage_employees', 'view_payroll',
    'view_analytics', 'view_settings', 'view_emergency', 'view_chat'
  ],
  supervisor: [
    'view_location', 'manage_schedules', 'view_employees', 
    'view_analytics', 'view_emergency', 'view_chat'
  ],
  employee: [
    'view_own', 'view_schedule', 'manage_swaps', 'view_chat'
  ]
};

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: Home, requiredPermissions: ['view_location', 'view_all'] },
  { id: 'scheduling', label: 'Scheduling', icon: Calendar, requiredPermissions: ['manage_schedules'] },
  { id: 'employees', label: 'Employees', icon: Calendar, requiredPermissions: ['view_employees', 'manage_employees'] },
  { id: 'time-tracking', label: 'Time Tracking', icon: Calendar, requiredPermissions: ['view_location', 'view_all'] },
  { id: 'leave', label: 'Leave Management', icon: Coffee, requiredPermissions: ['view_employees', 'manage_employees'] },
  { id: 'open-shifts', label: 'Open Shifts', icon: CalendarDays, requiredPermissions: ['view_schedule', 'manage_schedules'] },
  { id: 'swaps', label: 'Shift Swaps', icon: ArrowRightLeft, requiredPermissions: ['manage_swaps', 'manage_schedules'] },
  { id: 'payroll', label: 'Payroll', icon: Calendar, requiredPermissions: ['view_payroll', 'manage_payroll'] },
  { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp, requiredPermissions: ['view_analytics'] },
  { id: 'emergency', label: 'Emergency Comms', icon: Calendar, requiredPermissions: ['view_emergency', 'manage_emergency'] },
  { id: 'privacy', label: 'Privacy Dashboard', icon: Calendar, requiredPermissions: ['view_privacy', 'manage_privacy'] },
  { id: 'chat', label: 'Team Chat', icon: MessageSquare, requiredPermissions: ['view_chat'] },
];

export function RoleBasedLayout({
  currentUser,
  children,
  availableLocations,
  currentLocation,
  onLocationChange,
  activeView,
  onViewChange,
  notifications
}: RoleBasedLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const userPermissions = rolePermissions[currentUser.role] || [];
  
  const hasPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  };

  const filteredSidebarItems = sidebarItems.filter(item => 
    hasPermission(item.requiredPermissions)
  );

  const getRoleDisplayName = (role: string): string => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getLocationOptions = (): string[] => {
    // Owners and district managers can see all locations
    if (['owner', 'district_manager'].includes(currentUser.role)) {
      return availableLocations;
    }
    // Store managers, supervisors, and employees can only see their location
    return [currentUser.location];
  };

  const canChangeLocation = (): boolean => {
    return ['owner', 'district_manager'].includes(currentUser.role);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Circle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">CrewClock</h1>
                <p className="text-sm text-muted-foreground">Workforce Management</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2 flex flex-col h-full">
            <div className="flex-1">
              <SidebarMenu>
                {filteredSidebarItems.map((item) => (<SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => {
                        if (item.id === 'chat') {
                          setIsChatOpen(true);
                        } else {
                          onViewChange(item.id);
                        }
                      }}
                      isActive={activeView === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.id === 'chat' && notifications > 0 && (
                        <Badge className="ml-auto bg-red-500 text-white text-xs">
                          {notifications}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
            
            <div className="mt-auto space-y-2">
              {hasPermission(['view_settings', 'manage_settings']) && (
                <div className="border-t border-sidebar-border pt-2">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => onViewChange('settings')}
                        isActive={activeView === 'settings'}
                        className="w-full justify-start"
                      >
                        <Circle className="w-4 h-4" />
                        <span></span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              )}
              
              {/* Profile Section */}
              <div className="border-t border-sidebar-border pt-3 px-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
                    <p className="text-xs text-sidebar-foreground/70 truncate">{getRoleDisplayName(currentUser.role)}</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">{currentUser.email}</p>
                  </div>
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
                  <Circle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="employees, shifts, requests..."
                    className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Location Selector - only show if user can change locations */}
                {canChangeLocation() && (
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground" />
                    <select 
                      value={currentLocation} 
                      onChange={(e) => onLocationChange(e.target.value)}
                      className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                    >
                      {getLocationOptions().map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Current Location Display for restricted users */}
                {!canChangeLocation() && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Circle className="w-4 h-4" />
                    <span>{currentUser.location}</span>
                  </div>
                )}

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
                    <span className="text-sm font-medium text-blue-600">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getRoleDisplayName(currentUser.role)} • {currentUser.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="w-full min-h-full">
              {children}
            </div>
          </main>
        </SidebarInset>

        {/* Chat Dialog */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent className="max-w-6xl w-full h-[80vh] max-h-[800px]">
            <DialogHeader>
              <DialogTitle>Team Chat - {currentLocation}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 h-full">
              <ChatSystem 
                currentUserId={currentUser.id} 
                currentLocation={currentLocation} 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}