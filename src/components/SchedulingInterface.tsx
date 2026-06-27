import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Circle, Info, Plus, CheckCircle, Edit, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert } from './ui/alert';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function SchedulingInterface() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [isCreateShiftOpen, setIsCreateShiftOpen] = useState(false);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const employees = [
    { id: 1, name: 'Sarah Johnson', role: 'Cashier', color: 'bg-blue-500' },
    { id: 2, name: 'Mike Chen', role: 'Kitchen Staff', color: 'bg-green-500' },
    { id: 3, name: 'Emily Davis', role: 'Manager', color: 'bg-purple-500' },
    { id: 4, name: 'Alex Rodriguez', role: 'Delivery', color: 'bg-orange-500' },
    { id: 5, name: 'Lisa Thompson', role: 'Cashier', color: 'bg-pink-500' },
  ];

  const shifts = [
    { id: 1, employeeId: 1, day: 0, startTime: '9:00', endTime: '17:00', location: 'Store #1', status: 'published' },
    { id: 2, employeeId: 2, day: 0, startTime: '8:00', endTime: '16:00', location: 'Store #2', status: 'published' },
    { id: 3, employeeId: 3, day: 1, startTime: '10:00', endTime: '18:00', location: 'Store #1', status: 'draft' },
    { id: 4, employeeId: 1, day: 2, startTime: '9:00', endTime: '17:00', location: 'Store #1', status: 'published' },
    { id: 5, employeeId: 4, day: 2, startTime: '11:00', endTime: '19:00', location: 'Store #2', status: 'published' },
    { id: 6, employeeId: 2, day: 3, startTime: '8:00', endTime: '16:00', location: 'Store #2', status: 'conflict' },
    { id: 7, employeeId: 5, day: 4, startTime: '14:00', endTime: '22:00', location: 'Store #1', status: 'published' },
  ];

  const getShiftsForDay = (dayIndex: number) => 
    shifts.filter(shift => shift.day === dayIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'conflict': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (selectedWeek * 7)));
    return weekDays.map((_: any, index: number) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Scheduling</h1>
          <p className="text-muted-foreground">Create and manage employee schedules</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateShiftOpen} onOpenChange={setIsCreateShiftOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input type="time" />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input type="time" />
                  </div>
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
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Create Shift</Button>
                  <Button variant="outline" onClick={() => setIsCreateShiftOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Copy Week
          </Button>
          <Button variant="outline">Publish Schedule</Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedWeek(selectedWeek - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h3>Week of {weekDates[0].toLocaleDateString()}</h3>
              <p className="text-sm text-muted-foreground">
                {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedWeek(selectedWeek + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="w-5 h-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="p-3 font-medium">Employee</div>
                {weekDays.map((day, index) => (
                  <div key={day} className="p-3 text-center">
                    <div className="font-medium">{day}</div>
                    <div className="text-sm text-muted-foreground">
                      {weekDates[index].getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Employee Rows */}
              {employees.map(employee => (
                <div key={employee.id} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${employee.color}`} />
                      <div>
                        <p className="font-medium text-sm">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  {weekDays.map((_: any, dayIndex: any) => {
                    const dayShifts = getShiftsForDay(dayIndex).filter(shift => shift.employeeId === employee.id);
                    
                    return (
                      <div key={dayIndex} className="p-2 border border-border rounded-lg min-h-[80px]">
                        {dayShifts.map(shift => (
                          <div key={shift.id} className="relative group">
                            <div className={`p-2 rounded text-xs mb-1 ${employee.color} text-white`}>
                              <div className="flex items-center gap-1 mb-1">
                                <Circle className="w-3 h-3" />
                                <span>{shift.startTime} - {shift.endTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Circle className="w-3 h-3" />
                                <span>{shift.location}</span>
                              </div>
                              {shift.status === 'conflict' && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Conflict</span>
                                </div>
                              )}
                            </div>
                            <Badge className={`${getStatusColor(shift.status)} text-xs border-0`}>
                              {shift.status}
                            </Badge>
                            
                            {/* Hover Actions */}
                            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="w-6 h-6">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="w-6 h-6">
                                  <Circle className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {dayShifts.length === 0 && (
                          <Button 
                            variant="ghost" 
                            className="w-full h-full border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40"
                            onClick={() => setIsCreateShiftOpen(true)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Total Shifts</p>
                <p className="text-2xl font-semibold">{shifts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Total Hours</p>
                <p className="text-2xl font-semibold">324</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium">Conflicts</p>
                <p className="text-2xl font-semibold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}