import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Circle, Info, Plus, Star, Coffee, Heart, CheckCircle } from 'lucide-react';
import { Alert } from './ui/alert';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function LeaveManagement() {
  const [isRequestLeaveOpen, setIsRequestLeaveOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('requests');

  const leaveCategories = [
    { id: 'vacation', label: 'Vacation', icon: Coffee, color: 'bg-blue-500', paid: true },
    { id: 'sick', label: 'Sick Leave', icon: Heart, color: 'bg-red-500', paid: true },
    { id: 'personal', label: 'Personal', icon: AlertCircle, color: 'bg-green-500', paid: false },
    { id: 'maternity', label: 'Maternity/Paternity', icon: AlertCircle, color: 'bg-purple-500', paid: true },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle, color: 'bg-orange-500', paid: false },
    { id: 'bereavement', label: 'Bereavement', icon: Heart, color: 'bg-gray-500', paid: true },
  ];

  const leaveRequests = [
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 1,
      category: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-19',
      days: 5,
      reason: 'Family vacation to Hawaii',
      status: 'pending',
      requestedAt: '2024-01-20',
      managerId: 3,
      managerName: 'Emily Davis',
      documents: [],
      coverageNote: 'Mike Chen will cover cashier duties'
    },
    {
      id: 2,
      employeeName: 'Mike Chen',
      employeeId: 2,
      category: 'sick',
      startDate: '2024-01-25',
      endDate: '2024-01-25',
      days: 1,
      reason: 'Doctor appointment',
      status: 'approved',
      requestedAt: '2024-01-22',
      managerId: 3,
      managerName: 'Emily Davis',
      documents: ['medical_note.pdf'],
      approvedAt: '2024-01-23'
    },
    {
      id: 3,
      employeeName: 'Alex Rodriguez',
      employeeId: 4,
      category: 'personal',
      startDate: '2024-02-10',
      endDate: '2024-02-10',
      days: 1,
      reason: 'Moving day',
      status: 'rejected',
      requestedAt: '2024-02-08',
      managerId: 3,
      managerName: 'Emily Davis',
      rejectionReason: 'Insufficient coverage available',
      rejectedAt: '2024-02-08'
    },
    {
      id: 4,
      employeeName: 'Lisa Thompson',
      employeeId: 5,
      category: 'vacation',
      startDate: '2024-03-01',
      endDate: '2024-03-03',
      days: 3,
      reason: 'Long weekend trip',
      status: 'pending',
      requestedAt: '2024-01-28',
      managerId: 3,
      managerName: 'Emily Davis',
      documents: [],
      coverageNote: ''
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Circle className='w-4 h-4' />;
      case 'pending': return <Circle className='w-4 h-4' />;
      case 'rejected': return <Circle className='w-4 h-4' />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    if (!leaveCategories || leaveCategories.length === 0) {
      return { id: 'unknown', label: 'Unknown', icon: AlertCircle, color: 'bg-gray-500', paid: false };
    }
    return leaveCategories.find(cat => cat.id === categoryId) || leaveCategories[0];
  };

  const pendingRequests = leaveRequests ? leaveRequests.filter(req => req.status === 'pending') : [];
  const approvedRequests = leaveRequests ? leaveRequests.filter(req => req.status === 'approved') : [];
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Leave Management</h1>
          <p className="text-muted-foreground">Manage time off requests and employee leave balances</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isRequestLeaveOpen} onOpenChange={setIsRequestLeaveOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Time Off</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employee">Employee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Chen</SelectItem>
                        <SelectItem value="alex">Alex Rodriguez</SelectItem>
                        <SelectItem value="lisa">Lisa Thompson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Leave Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveCategories && leaveCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <category.icon className="w-4 h-4" />
                              <span>{category.label}</span>
                              {category.paid && <Badge variant="secondary" className="text-xs">Paid</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea placeholder="Provide details about your time off request..." />
                </div>
                
                <div>
                  <Label htmlFor="coverage">Coverage Arrangements (optional)</Label>
                  <Textarea placeholder="Who will cover your shifts or responsibilities?" />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Submit Request</Button>
                  <Button variant="outline" onClick={() => setIsRequestLeaveOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            </Button>
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            Export
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
                <p className="text-sm text-muted-foreground">Approved This Month</p>
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
                <p className="text-sm text-muted-foreground">Out Today</p>
                <p className="text-2xl font-semibold">2</p>
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
                <p className="text-sm text-muted-foreground">Avg Days/Employee</p>
                <p className="text-2xl font-semibold">12.5</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="calendar">Leave </TabsTrigger>
          <TabsTrigger value="balances">Employee Balances</TabsTrigger>
          <TabsTrigger value="policies">Leave Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-5 h-5" />
                Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests && leaveRequests.map((request: any) => {
                  const categoryInfo = getCategoryInfo(request.category);
                  
                  return (
                    <div key={request.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {request.employeeName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{request.employeeName}</p>
                            <p className="text-sm text-muted-foreground">
                              Requested {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(request.status)} border-0`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{request.status}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <div className="flex items-center gap-2">
                            <categoryInfo.icon className="w-4 h-4" />
                            <span className="font-medium">{categoryInfo.label}</span>
                            {categoryInfo.paid && <Badge variant="secondary" className="text-xs">Paid</Badge>}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{new Date(request.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p className="font-medium">{new Date(request.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{request.days} day{request.days !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-1">Reason</p>
                        <p className="text-sm bg-muted/50 p-2 rounded">{request.reason}</p>
                      </div>

                      {request.coverageNote && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Coverage</p>
                          <p className="text-sm bg-blue-50 border border-blue-200 p-2 rounded">{request.coverageNote}</p>
                        </div>
                      )}

                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Rejection Reason</p>
                          <p className="text-sm bg-red-50 border border-red-200 p-2 rounded">{request.rejectionReason}</p>
                        </div>
                      )}

                      {request.documents && request.documents.length > 0 && (<div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Documents</p>
                          <div className="flex gap-2">
                            {request.documents.map((doc, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer">
                                <Circle className="w-3 h-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">Approve</Button>
                          <Button size="sm" variant="outline">Reject</Button>
                          <Button size="sm" variant="ghost">Request More Info</Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez', 'Lisa Thompson'].map((name: any) => {
                  const vacation = Math.floor(Math.random() * 15) + 5;
                  const sick = Math.floor(Math.random() * 8) + 2;
                  const personal = Math.floor(Math.random() * 3) + 1;
                  
                  return (
                    <div key={name} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-sm text-muted-foreground">As of {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Coffee className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">Vacation</span>
                          </div>
                          <p className="text-lg font-semibold">{vacation} days remaining</p>
                          <p className="text-sm text-muted-foreground">of 20 total</p>
                        </div>
                        
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-4 h-4 text-red-600" />
                            <span className="font-medium">Sick Leave</span>
                          </div>
                          <p className="text-lg font-semibold">{sick} days remaining</p>
                          <p className="text-sm text-muted-foreground">of 12 total</p>
                        </div>
                        
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Personal</span>
                          </div>
                          <p className="text-lg font-semibold">{personal} days remaining</p>
                          <p className="text-sm text-muted-foreground">of 5 total</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Categories & Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leaveCategories && leaveCategories.map(category => (
                  <div key={category.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.label}</h3>
                        <div className="flex gap-2">
                          <Badge variant={category.paid ? "default" : "secondary"} className="text-xs">
                            {category.paid ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Advance notice: 2 weeks</p>
                      <p>• Documentation required: {category.id === 'sick' ? 'Yes' : 'No'}</p>
                      <p>• Manager approval required: Yes</p>
                      <p>• Max consecutive days: {category.id === 'vacation' ? '10' : category.id === 'sick' ? '5' : '3'}</p>
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