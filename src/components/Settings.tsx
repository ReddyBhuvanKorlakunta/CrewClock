import { useState, useEffect, useRef } from 'react';
import { AlertCircle, AlertTriangle, Bell, Circle, Info, Plus, Edit, Save, CreditCard } from 'lucide-react';
import { Alert } from './ui/alert';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Settings() {
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('locations');

  const locations = [
    {
      id: 1,
      name: 'Store #1',
      address: '123 Main Street, Downtown',
      timezone: 'America/New_York',
      manager: 'Emily Davis',
      employees: 8,
      status: 'active',
      phone: '(555) 123-4567',
      openHours: '9:00 AM - 9:00 PM'
    },
    {
      id: 2,
      name: 'Store #2',
      address: '456 Oak Avenue, Uptown',
      timezone: 'America/New_York',
      manager: 'Emily Davis',
      employees: 6,
      status: 'active',
      phone: '(555) 234-5678',
      openHours: '8:00 AM - 10:00 PM'
    }
  ];

  const roles = [
    {
      id: 1,
      name: 'Cashier',
      color: '#3B82F6',
      defaultWage: 15.50,
      permissions: ['clock_in_out', 'view_schedule', 'request_time_off', 'swap_shifts'],
      skillsRequired: ['Customer Service', 'POS Systems'],
      description: 'Front-end customer service and payment processing'
    },
    {
      id: 2,
      name: 'Kitchen Staff',
      color: '#10B981',
      defaultWage: 17.00,
      permissions: ['clock_in_out', 'view_schedule', 'request_time_off', 'swap_shifts'],
      skillsRequired: ['Food Preparation', 'Kitchen Safety'],
      description: 'Food preparation and kitchen operations'
    },
    {
      id: 3,
      name: 'Manager',
      color: '#8B5CF6',
      defaultWage: 22.00,
      permissions: ['all_permissions'],
      skillsRequired: ['Leadership', 'Scheduling', 'Training'],
      description: 'Store management and team supervision'
    },
    {
      id: 4,
      name: 'Delivery Driver',
      color: '#F59E0B',
      defaultWage: 16.00,
      permissions: ['clock_in_out', 'view_schedule', 'request_time_off', 'swap_shifts'],
      skillsRequired: ['Driving', 'Customer Service', 'Navigation'],
      description: 'Food delivery and customer service'
    }
  ];

  const laborRules = {
    maxHoursPerDay: 10,
    maxHoursPerWeek: 40,
    minRestHours: 8,
    overtimeThreshold: 40,
    overtimeRate: 1.5,
    breakEveryHours: 4,
    mandatoryBreaks: [
      { start: 6, end: 8, label: 'Lunch Break (30 min)' }
    ],
    minShiftLength: 2,
    maxShiftLength: 12,
    minNoticeHours: 24,
    jurisdiction: 'New York'
  };

  const notificationSettings = [
    { id: 'schedule_published', label: 'Schedule Published', enabled: true, channels: ['push', 'email'] },
    { id: 'shift_reminders', label: 'Shift Reminders', enabled: true, channels: ['push'] },
    { id: 'swap_requests', label: 'Swap Requests', enabled: true, channels: ['push', 'email'] },
    { id: 'leave_requests', label: 'Leave Requests', enabled: true, channels: ['email'] },
    { id: 'open_shifts', label: 'Open Shift Alerts', enabled: true, channels: ['push'] },
    { id: 'payroll_ready', label: 'Payroll Ready', enabled: true, channels: ['email'] },
    { id: 'timecard_approval', label: 'Timecard Approval Needed', enabled: true, channels: ['push', 'email'] }
  ];

  const skills = [
    { id: 1, name: 'Customer Service', category: 'General', employees: 12 },
    { id: 2, name: 'POS Systems', category: 'Technical', employees: 8 },
    { id: 3, name: 'Cash Handling', category: 'Financial', employees: 6 },
    { id: 4, name: 'Food Preparation', category: 'Kitchen', employees: 4 },
    { id: 5, name: 'Kitchen Safety', category: 'Safety', employees: 4 },
    { id: 6, name: 'Driving', category: 'Transportation', employees: 2 },
    { id: 7, name: 'Leadership', category: 'Management', employees: 2 },
    { id: 8, name: 'Training', category: 'Management', employees: 3 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1></h1>
          <p className="text-muted-foreground">Configure your workspace and business rules</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="labor">Labor Rules</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2>Business Locations</h2>
            <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="locationName">Location Name</Label>
                      <Input placeholder="Store #3" />
                    </div>
                    <div>
                      <Label htmlFor="manager">Manager</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emily">Emily Davis</SelectItem>
                          <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea placeholder="Full business address" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america_new_york">Eastern Time</SelectItem>
                          <SelectItem value="america_chicago">Central Time</SelectItem>
                          <SelectItem value="america_denver">Mountain Time</SelectItem>
                          <SelectItem value="america_los_angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="hours">Operating Hours</Label>
                    <Input placeholder="9:00 AM - 9:00 PM" />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Add Location</Button>
                    <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {locations.map((location) => (
              <Card key={location.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Info className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{location.name}</h3>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 border-0">
                        <Circle className="w-3 h-3 mr-1" />
                        {location.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Manager</p>
                      <p className="font-medium">{location.manager}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Employees</p>
                      <p className="font-medium">{location.employees}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{location.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hours</p>
                      <p className="font-medium">{location.openHours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2>Employee Roles</h2>
            <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input placeholder="Supervisor" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Role Color</Label>
                      <Input type="color" defaultValue="#3B82F6" />
                    </div>
                    <div>
                      <Label htmlFor="defaultWage">Default Hourly Rate</Label>
                      <Input type="number" step="0.50" placeholder="18.00" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea placeholder="Brief description of role responsibilities" />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Create Role</Button>
                    <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (<Card key={role.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${role.color}20` }}
                      >
                        <Circle className="w-5 h-5" style={{ color: role.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">${role.defaultWage}/hour</p>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {role.skillsRequired.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Permissions</p>
                    <p className="text-xs text-muted-foreground">
                      {role.permissions[0] === 'all_permissions' ? 'All permissions' : `${role.permissions.length} permissions`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="labor" className="space-y-6">
          <h2>Labor Rules & Compliance</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Working Hours Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxDay">Max Hours per Day</Label>
                    <Input type="number" defaultValue={laborRules.maxHoursPerDay} />
                  </div>
                  <div>
                    <Label htmlFor="maxWeek">Max Hours per Week</Label>
                    <Input type="number" defaultValue={laborRules.maxHoursPerWeek} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minRest">Min Rest Hours</Label>
                    <Input type="number" defaultValue={laborRules.minRestHours} />
                  </div>
                  <div>
                    <Label htmlFor="minNotice">Min Notice (hours)</Label>
                    <Input type="number" defaultValue={laborRules.minNoticeHours} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overtime Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="otThreshold">Overtime Threshold</Label>
                    <Input type="number" defaultValue={laborRules.overtimeThreshold} />
                  </div>
                  <div>
                    <Label htmlFor="otRate">Overtime Multiplier</Label>
                    <Input type="number" step="0.1" defaultValue={laborRules.overtimeRate} />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select defaultValue={laborRules.jurisdiction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="California">California</SelectItem>
                      <SelectItem value="Texas">Texas</SelectItem>
                      <SelectItem value="Federal">Federal Rules</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Break Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="breakEvery">Break Required Every (hours)</Label>
                  <Input type="number" defaultValue={laborRules.breakEveryHours} />
                </div>
                
                <div>
                  <Label>Mandatory Breaks</Label>
                  <div className="space-y-2 mt-2">
                    {laborRules.mandatoryBreaks.map((breakRule, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <span className="text-sm">{breakRule.label}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          After {breakRule.start}h - Before {breakRule.end}h
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Break Rule
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shift Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minShift">Min Shift Length</Label>
                    <Input type="number" defaultValue={laborRules.minShiftLength} />
                  </div>
                  <div>
                    <Label htmlFor="maxShift">Max Shift Length</Label>
                    <Input type="number" defaultValue={laborRules.maxShiftLength} />
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Compliance Check</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Rules are automatically enforced during scheduling and timecard approval.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2>Employee Skills</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <h3 className="font-medium">{skill.name}</h3>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{skill.category}</p>
                  <p className="text-xs text-muted-foreground">{skill.employees} employees have this skill</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <h2>Notification </h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{setting.label}</h3>
                    <div className="flex gap-2 mt-1">
                      {setting.channels.map((channel) => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel === 'push' ? <Bell className="w-3 h-3 mr-1" /> : <Circle className="w-3 h-3 mr-1" />}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <h2>Billing & Subscription</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Professional Plan</h3>
                    <p className="text-sm text-muted-foreground">$29/month per location</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Next billing date:</span>
                      <span className="font-medium">March 15, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Locations:</span>
                      <span className="font-medium">2 locations</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly total:</span>
                      <span className="font-medium">$58.00</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Active employees:</span>
                    <span className="font-medium">14 / 25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Locations:</span>
                    <span className="font-medium">2 / 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage used:</span>
                    <span className="font-medium">2.1GB / 10GB</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}