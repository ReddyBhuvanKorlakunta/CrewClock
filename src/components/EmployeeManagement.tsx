import { useState } from 'react';
import { AlertTriangle, Circle, Edit, Info, Phone, Plus, UserCheck, UserX, Mail } from 'lucide-react';

import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const employees = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      role: 'Cashier',
      location: 'Store #1',
      status: 'active',
      hireDate: '2023-03-15',
      hourlyRate: 15.50,
      skills: ['Customer Service', 'POS Systems', 'Cash Handling'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      hoursThisWeek: 32,
      hoursLimit: 40,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 234-5678',
      role: 'Kitchen Staff',
      location: 'Store #2',
      status: 'active',
      hireDate: '2023-01-20',
      hourlyRate: 17.00,
      skills: ['Food Preparation', 'Kitchen Safety', 'Inventory Management'],
      availability: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      hoursThisWeek: 40,
      hoursLimit: 40,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '(555) 345-6789',
      role: 'Manager',
      location: 'Store #1',
      status: 'active',
      hireDate: '2022-08-10',
      hourlyRate: 22.00,
      skills: ['Leadership', 'Scheduling', 'Training', 'Customer Service'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hoursThisWeek: 45,
      hoursLimit: 50,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      phone: '(555) 456-7890',
      role: 'Delivery Driver',
      location: 'Store #2',
      status: 'inactive',
      hireDate: '2023-06-05',
      hourlyRate: 16.00,
      skills: ['Driving', 'Customer Service', 'Navigation'],
      availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
      hoursThisWeek: 0,
      hoursLimit: 35,
      rating: 4.5
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '(555) 567-8901',
      role: 'Cashier',
      location: 'Store #1',
      status: 'active',
      hireDate: '2023-09-12',
      hourlyRate: 14.50,
      skills: ['Customer Service', 'POS Systems'],
      availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hoursThisWeek: 28,
      hoursLimit: 30,
      rating: 4.6
    }
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />;
  };

  const EmployeeCard = ({ employee }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-blue-600">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(employee.status)} border-0`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(employee.status)}
              <span className="capitalize">{employee.status}</span>
            </div>
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Circle className="w-4 h-4" />
            <span>{employee.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Circle className="w-4 h-4" />
            <span>${employee.hourlyRate}/hour</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{employee.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Circle className="w-4 h-4" />
            <span>{employee.hoursThisWeek}/{employee.hoursLimit}h this week</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {employee.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {employee.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{employee.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Employee Management</h1>
          <p className="text-muted-foreground">Manage your team members and their information</p>
        </div>
        <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </TabsContent>
              
              <TabsContent value="employment" className="space-y-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashier">Cashier</SelectItem>
                      <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="delivery">Delivery Driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store1">Store #1</SelectItem>
                      <SelectItem value="store2">Store #2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <Input id="hourlyRate" type="number" step="0.50" placeholder="15.00" />
                  </div>
                  <div>
                    <Label htmlFor="hoursLimit">Weekly Hours Limit</Label>
                    <Input id="hoursLimit" type="number" placeholder="40" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="availability" className="space-y-4">
                <div>
                  <Label>Available Days</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <label key={day} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Add Employee</Button>
              <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>Cancel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Circle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="employees by name, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="delivery">Delivery Driver</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-semibold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold">{employees.filter(e => e.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Circle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Hours/Week</p>
                <p className="text-2xl font-semibold">33</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-semibold">4.7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(employee => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first employee'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddEmployeeOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}