import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertCircle, AlertTriangle, Bell, Circle, Eye, Info, Plus, Star, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function OpenShifts() {
  const [isCreateOpenShiftOpen, setIsCreateOpenShiftOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('open');

  const openShifts = [
    {
      id: 1,
      date: '2024-02-15',
      startTime: '14:00',
      endTime: '22:00',
      role: 'Cashier',
      location: 'Store #1',
      hourlyRate: 15.50,
      requiredSkills: ['Customer Service', 'POS Systems'],
      minExperience: 6,
      priority: 'high',
      reason: 'Sarah Johnson called in sick',
      status: 'open',
      enrollments: [
        {
          employeeName: 'Mike Chen',
          enrolledAt: '2024-02-14T10:30:00Z',
          score: 95,
          weeklyHours: 32
        }
      ]
    },
    {
      id: 2,
      date: '2024-02-16',
      startTime: '09:00',
      endTime: '17:00',
      role: 'Kitchen Staff',
      location: 'Store #2',
      hourlyRate: 16.00,
      requiredSkills: ['Food Safety', 'Cooking'],
      minExperience: 12,
      priority: 'medium',
      reason: 'Regular staff requested time off',
      status: 'open',
      enrollments: []
    }
  ];

  const eligibleEmployees = [
    {
      id: 1,
      name: 'Alex Rodriguez',
      role: 'Cashier',
      location: 'Store #1',
      rating: 4.8,
      weeklyHours: 28,
      experienceMonths: 18,
      hourlyRate: 15.50,
      skills: ['Customer Service', 'POS Systems', 'Cash Handling'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 2,
      name: 'Maria Garcia',
      role: 'Kitchen Staff',
      location: 'Store #2',
      rating: 4.6,
      weeklyHours: 24,
      experienceMonths: 24,
      hourlyRate: 16.00,
      skills: ['Food Safety', 'Cooking', 'Inventory'],
      availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday']
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'filled': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openShiftsOnly = openShifts.filter(shift => shift.status === 'open');
  const filledShifts = openShifts.filter(shift => shift.status === 'filled');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Open Shifts</h1>
          <p className="text-muted-foreground">Manage unfilled shifts and employee enrollments</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOpenShiftOpen} onOpenChange={setIsCreateOpenShiftOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Open Shift
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post Open Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                        <SelectItem value="delivery">Delivery Driver</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input type="time" />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input type="time" />
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                    <Input type="number" step="0.50" placeholder="15.00" />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea placeholder="Why is this shift open? (e.g., employee called in sick)" />
                </div>
                <div>
                  <Label>Required Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Customer Service', 'POS Systems', 'Food Safety', 'Cooking', 'Cash Handling'].map((skill) => (
                      <label key={skill} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Post Shift</Button>
                  <Button variant="outline" onClick={() => setIsCreateOpenShiftOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            Auto-Fill
          </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notify All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Shifts</p>
                <p className="text-2xl font-semibold">{openShiftsOnly.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
                <p className="text-2xl font-semibold">
                  {openShifts.reduce((sum, shift) => sum + shift.enrollments.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filled Today</p>
                <p className="text-2xl font-semibold">{filledShifts.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-semibold">
                  {openShiftsOnly.filter(shift => shift.priority === 'high').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="open">Open Shifts</TabsTrigger>
          <TabsTrigger value="filled">Recently Filled</TabsTrigger>
          <TabsTrigger value="eligible">Eligible Employees</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-6">
          <div className="space-y-4">
            {openShiftsOnly.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Info className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{shift.role}</h3>
                          <Badge className={`${getPriorityColor(shift.priority)} border-0`}>
                            {shift.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Circle className="w-3 h-3" />
                            <span>{new Date(shift.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Circle className="w-3 h-3" />
                            <span>{shift.startTime} - {shift.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Circle className="w-3 h-3" />
                            <span>{shift.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Circle className="w-3 h-3" />
                            <span>${shift.hourlyRate}/hr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(shift.status)} border-0`}>
                      {shift.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {shift.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Reason</p>
                      <p className="text-sm text-muted-foreground">{shift.reason}</p>
                    </div>
                  </div>

                  {shift.enrollments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Enrollments ({shift.enrollments.length})</p>
                      <div className="space-y-2">
                        {shift.enrollments.map((enrollment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-green-600">
                                  {enrollment.employeeName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{enrollment.employeeName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Enrolled {new Date(enrollment.enrolledAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                  <span className="text-sm font-medium">{enrollment.score}% match</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{enrollment.weeklyHours}h this week</p>
                              </div>
                              <Button size="sm">Assign</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
   
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Send Reminders
                    </Button>
                    {shift.enrollments.length === 0 && (
                      <Button size="sm" variant="outline">
                        <Circle className="w-4 h-4 mr-2" />
                        Find Candidates
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
   
        <TabsContent value="eligible" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eligible Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eligibleEmployees.map((employee) => (
                  <div key={employee.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.role} • {employee.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{employee.rating}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{employee.weeklyHours}h this week</p>
                        </div>
                        <Button size="sm">Invite to Shift</Button>
                      </div>
                    </div>
   
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Experience</p>
                        <p className="font-medium">{employee.experienceMonths} months</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hourly Rate</p>
                        <p className="font-medium">${employee.hourlyRate}/hr</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Skills</p>
                        <p className="font-medium">{employee.skills.length} skills</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Availability</p>
                        <p className="font-medium">{employee.availability.length} days</p>
                      </div>
                    </div>
   
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}