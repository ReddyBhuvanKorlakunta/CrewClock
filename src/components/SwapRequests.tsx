import { useState, useEffect, useRef } from 'react';
import { AlertCircle, AlertTriangle, Bell, Circle, Info, Plus, CheckCircle, ArrowRightLeft, MessageSquare } from 'lucide-react';
import { Alert } from './ui/alert';

import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function SwapRequests() {
  const [isCreateSwapOpen, setIsCreateSwapOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('pending');

  const swapRequests = [
    {
      id: 1,
      fromEmployee: { id: 1, name: 'Sarah Johnson', role: 'Cashier' },
      toEmployee: { id: 5, name: 'Lisa Thompson', role: 'Cashier' },
      shift: {
        date: '2024-02-16',
        startTime: '14:00',
        endTime: '22:00',
        location: 'Store #1',
        role: 'Cashier'
      },
      reason: 'Family emergency - need to attend to sick parent',
      requestedAt: '2024-02-14T10:30:00',
      status: 'pending',
      urgency: 'high',
      managerNotes: '',
      chatMessages: 2
    },
    {
      id: 2,
      fromEmployee: { id: 2, name: 'Mike Chen', role: 'Kitchen Staff' },
      toEmployee: { id: 4, name: 'Alex Rodriguez', role: 'Kitchen Staff' },
      shift: {
        date: '2024-02-18',
        startTime: '08:00',
        endTime: '16:00',
        location: 'Store #2',
        role: 'Kitchen Staff'
      },
      reason: 'Doctor appointment that could not be rescheduled',
      requestedAt: '2024-02-13T15:45:00',
      status: 'approved',
      urgency: 'medium',
      approvedAt: '2024-02-14T09:00:00',
      approvedBy: 'Emily Davis',
      managerNotes: 'Both employees agreed to the swap.',
      chatMessages: 5
    },
    {
      id: 3,
      fromEmployee: { id: 4, name: 'Alex Rodriguez', role: 'Delivery Driver' },
      toEmployee: { id: 2, name: 'Mike Chen', role: 'Kitchen Staff' },
      shift: {
        date: '2024-02-15',
        startTime: '18:00',
        endTime: '23:00',
        location: 'Store #2',
        role: 'Delivery Driver'
      },
      reason: 'Want to attend evening classes',
      requestedAt: '2024-02-12T12:00:00',
      status: 'rejected',
      urgency: 'low',
      rejectedAt: '2024-02-13T08:30:00',
      rejectedBy: 'Emily Davis',
      rejectionReason: 'Mike Chen is not qualified for delivery role - lacks driving certification',
      managerNotes: 'Different role requirements make this swap unsuitable.',
      chatMessages: 3
    },
    {
      id: 4,
      fromEmployee: { id: 5, name: 'Lisa Thompson', role: 'Cashier' },
      toEmployee: null,
      shift: {
        date: '2024-02-20',
        startTime: '10:00',
        endTime: '18:00',
        location: 'Store #1',
        role: 'Cashier'
      },
      reason: 'Birthday celebration with family',
      requestedAt: '2024-02-14T16:20:00',
      status: 'open',
      urgency: 'medium',
      managerNotes: 'Looking for qualified cashier to take this shift.',
      chatMessages: 0,
      interestedEmployees: [
        { id: 1, name: 'Sarah Johnson', respondedAt: '2024-02-14T17:00:00' }
      ]
    }
  ];

  const employees = [
    { id: 1, name: 'Sarah Johnson', role: 'Cashier', location: 'Store #1' },
    { id: 2, name: 'Mike Chen', role: 'Kitchen Staff', location: 'Store #2' },
    { id: 4, name: 'Alex Rodriguez', role: 'Delivery Driver', location: 'Store #2' },
    { id: 5, name: 'Lisa Thompson', role: 'Cashier', location: 'Store #1' }
  ];

  const shifts = [
    { id: 1, date: '2024-02-16', time: '14:00-22:00', role: 'Cashier', location: 'Store #1', employee: 'Sarah Johnson' },
    { id: 2, date: '2024-02-17', time: '08:00-16:00', role: 'Kitchen Staff', location: 'Store #2', employee: 'Mike Chen' },
    { id: 3, date: '2024-02-18', time: '18:00-23:00', role: 'Delivery', location: 'Store #2', employee: 'Alex Rodriguez' },
    { id: 4, date: '2024-02-19', time: '10:00-18:00', role: 'Cashier', location: 'Store #1', employee: 'Lisa Thompson' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Circle className='w-4 h-4' />;
      case 'approved': return <Circle className='w-4 h-4' />;
      case 'rejected': return <Circle className='w-4 h-4' />;
      case 'open': return <Circle className='w-4 h-4' />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingRequests = swapRequests.filter(req => req.status === 'pending' || req.status === 'open');
  const approvedRequests = swapRequests.filter(req => req.status === 'approved');
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Shift Swaps</h1>
          <p className="text-muted-foreground">Manage employee shift swap requests and approvals</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateSwapOpen} onOpenChange={setIsCreateSwapOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Swap Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Shift Swap Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fromEmployee">Requesting Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.name} - {emp.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="shift">Shift to Swap</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map(shift => (
                        <SelectItem key={shift.id} value={shift.id.toString()}>
                          {shift.date} • {shift.time} • {shift.role} • {shift.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="toEmployee">Swap With (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee or leave open" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Leave Open for Any Qualified Employee</SelectItem>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.name} - {emp.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Convenience</SelectItem>
                      <SelectItem value="medium">Medium - Important</SelectItem>
                      <SelectItem value="high">High - Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reason">Reason for Swap</Label>
                  <Textarea placeholder="Explain why you need to swap this shift..." />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Submit Request</Button>
                  <Button variant="outline" onClick={() => setIsCreateSwapOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            </Button>
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-semibold">{pendingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved This Week</p>
                <p className="text-2xl font-semibold">{approvedRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Swaps</p>
                <p className="text-2xl font-semibold">
                  {swapRequests.filter(req => req.status === 'open').length}
                </p>
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
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-semibold">
                  {swapRequests.filter(req => req.urgency === 'high' && req.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="open">Open Swaps</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="space-y-4">
            {pendingRequests.filter(req => req.status === 'pending').map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <ArrowRightLeft className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {request.fromEmployee.name} → {request.toEmployee?.name || 'Open Swap'}
                          </h3>
                          <Badge className={`${getUrgencyColor(request.urgency)} border-0`}>
                            {request.urgency} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Requested {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={`${getStatusColor(request.status)} border-0`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(request.shift.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{request.shift.startTime} - {request.shift.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">{request.shift.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{request.shift.location}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Reason</p>
                    <p className="text-sm bg-muted/50 p-2 rounded">{request.reason}</p>
                  </div>

                  {request.chatMessages > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600">{request.chatMessages} messages</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="default">Approve</Button>
                    <Button size="sm" variant="outline">Reject</Button>
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button size="sm" variant="ghost">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="open" className="space-y-6">
          <div className="space-y-4">
            {swapRequests.filter(req => req.status === 'open').map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Info className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {request.fromEmployee.name} - Looking for Cover
                          </h3>
                          <Badge className={`${getUrgencyColor(request.urgency)} border-0`}>
                            {request.urgency} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Requested {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={`${getStatusColor(request.status)} border-0`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        <span>Open for Applications</span>
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(request.shift.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{request.shift.startTime} - {request.shift.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">{request.shift.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{request.shift.location}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Reason</p>
                    <p className="text-sm bg-muted/50 p-2 rounded">{request.reason}</p>
                  </div>

                  {request.interestedEmployees && request.interestedEmployees.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Interested Employees ({request.interestedEmployees.length})</p>
                      <div className="space-y-2">
                        {request.interestedEmployees.map((employee, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-green-600">
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-sm font-medium">{employee.name}</span>
                              <span className="text-xs text-muted-foreground">
                                Responded {new Date(employee.respondedAt).toLocaleString()}
                              </span>
                            </div>
                            <Button size="sm">Assign</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Notify Qualified Staff
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button size="sm" variant="ghost">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          <div className="space-y-4">
            {approvedRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {request.fromEmployee.name} ↔ {request.toEmployee?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Approved by {request.approvedBy} on {new Date(request.approvedAt!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={`${getStatusColor(request.status)} border-0`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(request.shift.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{request.shift.startTime} - {request.shift.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">{request.shift.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{request.shift.location}</p>
                    </div>
                  </div>

                  {request.managerNotes && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Manager Notes</p>
                      <p className="text-sm bg-green-50 border border-green-200 p-2 rounded">{request.managerNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}