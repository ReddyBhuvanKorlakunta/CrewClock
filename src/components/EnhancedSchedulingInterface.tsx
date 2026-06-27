import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Circle, Eye, Plus, CheckCircle, XCircle, Save, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { Alert } from './ui/alert';

import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';

interface Employee {
  id: number;
  name: string;
  role: string;
  skills: string[];
  availability: { [key: string]: string[] };
  hourlyRate: number;
  maxHoursPerWeek: number;
  location: string;
  phone: string;
  email: string;
  hireDate: string;
  certifications: string[];
  preferredShifts: string[];
}

interface Shift {
  id: string;
  employeeId?: number;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  location: string;
  skills: string[];
  notes?: string;
  isPublished: boolean;
  status: 'draft' | 'published' | 'filled' | 'pending';
  createdBy: number;
}

interface TimeSlot {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

const employees: Employee[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Cashier Lead',
    skills: ['cashier', 'customer_service', 'training'],
    availability: {
      monday: ['6:00-14:00', '14:00-22:00'],
      tuesday: ['6:00-14:00'],
      wednesday: ['6:00-14:00', '14:00-22:00'],
      thursday: ['6:00-14:00'],
      friday: ['6:00-14:00', '14:00-22:00'],
      saturday: ['8:00-16:00'],
      sunday: ['unavailable']
    },
    hourlyRate: 16.50,
    maxHoursPerWeek: 40,
    location: 'Store #1',
    phone: '(555) 123-4567',
    email: 'sarah.j@crewclock.com',
    hireDate: '2023-03-15',
    certifications: ['Food Safety', 'Cash Handling'],
    preferredShifts: ['morning', 'day']
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'Kitchen Staff',
    skills: ['cooking', 'food_prep', 'inventory'],
    availability: {
      monday: ['8:00-16:00', '16:00-24:00'],
      tuesday: ['8:00-16:00', '16:00-24:00'],
      wednesday: ['8:00-16:00'],
      thursday: ['8:00-16:00', '16:00-24:00'],
      friday: ['8:00-16:00', '16:00-24:00'],
      saturday: ['10:00-18:00'],
      sunday: ['12:00-20:00']
    },
    hourlyRate: 17.25,
    maxHoursPerWeek: 38,
    location: 'Store #1',
    phone: '(555) 234-5678',
    email: 'mike.c@crewclock.com',
    hireDate: '2022-11-08',
    certifications: ['Food Safety', 'ServSafe'],
    preferredShifts: ['day', 'evening']
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Store Manager',
    skills: ['management', 'scheduling', 'training', 'cashier', 'inventory'],
    availability: {
      monday: ['6:00-22:00'],
      tuesday: ['6:00-22:00'],
      wednesday: ['6:00-22:00'],
      thursday: ['6:00-22:00'],
      friday: ['6:00-22:00'],
      saturday: ['8:00-18:00'],
      sunday: ['10:00-18:00']
    },
    hourlyRate: 24.00,
    maxHoursPerWeek: 45,
    location: 'Store #1',
    phone: '(555) 345-6789',
    email: 'emily.d@crewclock.com',
    hireDate: '2021-06-12',
    certifications: ['Management', 'Food Safety', 'First Aid'],
    preferredShifts: ['morning', 'day', 'evening']
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    role: 'Delivery Driver',
    skills: ['driving', 'customer_service', 'navigation'],
    availability: {
      monday: ['16:00-24:00'],
      tuesday: ['16:00-24:00'],
      wednesday: ['16:00-24:00'],
      thursday: ['16:00-24:00'],
      friday: ['16:00-24:00'],
      saturday: ['12:00-24:00'],
      sunday: ['12:00-22:00']
    },
    hourlyRate: 15.00,
    maxHoursPerWeek: 35,
    location: 'Store #1',
    phone: '(555) 456-7890',
    email: 'alex.r@crewclock.com',
    hireDate: '2023-08-22',
    certifications: ['Valid Driver License', 'Food Delivery'],
    preferredShifts: ['evening', 'night']
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Cashier',
    skills: ['cashier', 'customer_service'],
    availability: {
      monday: ['14:00-22:00'],
      tuesday: ['14:00-22:00'],
      wednesday: ['unavailable'],
      thursday: ['14:00-22:00'],
      friday: ['14:00-22:00'],
      saturday: ['8:00-18:00'],
      sunday: ['10:00-18:00']
    },
    hourlyRate: 15.50,
    maxHoursPerWeek: 32,
    location: 'Store #1',
    phone: '(555) 567-8901',
    email: 'lisa.t@crewclock.com',
    hireDate: '2023-12-03',
    certifications: ['Cash Handling'],
    preferredShifts: ['afternoon', 'evening']
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Assistant Manager',
    skills: ['management', 'cashier', 'training', 'inventory'],
    availability: {
      monday: ['6:00-18:00'],
      tuesday: ['6:00-18:00'],
      wednesday: ['6:00-18:00'],
      thursday: ['6:00-18:00'],
      friday: ['6:00-18:00'],
      saturday: ['unavailable'],
      sunday: ['8:00-16:00']
    },
    hourlyRate: 20.50,
    maxHoursPerWeek: 40,
    location: 'Store #2',
    phone: '(555) 678-9012',
    email: 'david.k@crewclock.com',
    hireDate: '2022-01-15',
    certifications: ['Management', 'Food Safety'],
    preferredShifts: ['morning', 'day']
  },
  {
    id: 7,
    name: 'Jessica Martinez',
    role: 'Kitchen Staff',
    skills: ['cooking', 'food_prep', 'cleaning'],
    availability: {
      monday: ['6:00-14:00'],
      tuesday: ['6:00-14:00'],
      wednesday: ['6:00-14:00'],
      thursday: ['6:00-14:00'],
      friday: ['6:00-14:00'],
      saturday: ['8:00-16:00'],
      sunday: ['unavailable']
    },
    hourlyRate: 16.75,
    maxHoursPerWeek: 40,
    location: 'Store #2',
    phone: '(555) 789-0123',
    email: 'jessica.m@crewclock.com',
    hireDate: '2023-05-20',
    certifications: ['Food Safety'],
    preferredShifts: ['morning', 'day']
  },
  {
    id: 8,
    name: 'Ryan O\'Connor',
    role: 'Cashier',
    skills: ['cashier', 'customer_service', 'stocking'],
    availability: {
      monday: ['16:00-24:00'],
      tuesday: ['16:00-24:00'],
      wednesday: ['16:00-24:00'],
      thursday: ['unavailable'],
      friday: ['16:00-24:00'],
      saturday: ['12:00-24:00'],
      sunday: ['12:00-22:00']
    },
    hourlyRate: 15.25,
    maxHoursPerWeek: 35,
    location: 'Store #2',
    phone: '(555) 890-1234',
    email: 'ryan.o@crewclock.com',
    hireDate: '2023-09-10',
    certifications: ['Cash Handling'],
    preferredShifts: ['evening', 'night']
  },
  {
    id: 9,
    name: 'Amanda Foster',
    role: 'Supervisor',
    skills: ['management', 'training', 'cashier', 'customer_service'],
    availability: {
      monday: ['8:00-20:00'],
      tuesday: ['8:00-20:00'],
      wednesday: ['8:00-20:00'],
      thursday: ['8:00-20:00'],
      friday: ['8:00-20:00'],
      saturday: ['10:00-18:00'],
      sunday: ['unavailable']
    },
    hourlyRate: 19.00,
    maxHoursPerWeek: 42,
    location: 'Store #1',
    phone: '(555) 901-2345',
    email: 'amanda.f@crewclock.com',
    hireDate: '2022-07-18',
    certifications: ['Management', 'Training'],
    preferredShifts: ['day', 'evening']
  },
  {
    id: 10,
    name: 'Carlos Gonzalez',
    role: 'Maintenance',
    skills: ['maintenance', 'cleaning', 'repairs'],
    availability: {
      monday: ['22:00-6:00'],
      tuesday: ['22:00-6:00'],
      wednesday: ['22:00-6:00'],
      thursday: ['22:00-6:00'],
      friday: ['22:00-6:00'],
      saturday: ['unavailable'],
      sunday: ['unavailable']
    },
    hourlyRate: 18.50,
    maxHoursPerWeek: 40,
    location: 'Store #1',
    phone: '(555) 012-3456',
    email: 'carlos.g@crewclock.com',
    hireDate: '2021-12-05',
    certifications: ['Equipment Maintenance'],
    preferredShifts: ['night', 'overnight']
  },
  {
    id: 11,
    name: 'Rachel Green',
    role: 'Barista',
    skills: ['barista', 'customer_service', 'cashier'],
    availability: {
      monday: ['5:00-13:00'],
      tuesday: ['5:00-13:00'],
      wednesday: ['5:00-13:00'],
      thursday: ['5:00-13:00'],
      friday: ['5:00-13:00'],
      saturday: ['6:00-14:00'],
      sunday: ['7:00-15:00']
    },
    hourlyRate: 16.00,
    maxHoursPerWeek: 38,
    location: 'Store #1',
    phone: '(555) 123-4568',
    email: 'rachel.g@crewclock.com',
    hireDate: '2023-02-28',
    certifications: ['Barista', 'Food Safety'],
    preferredShifts: ['morning', 'day']
  },
  {
    id: 12,
    name: 'Tom Wilson',
    role: 'Stock Clerk',
    skills: ['stocking', 'inventory', 'receiving'],
    availability: {
      monday: ['4:00-12:00'],
      tuesday: ['4:00-12:00'],
      wednesday: ['4:00-12:00'],
      thursday: ['4:00-12:00'],
      friday: ['4:00-12:00'],
      saturday: ['6:00-14:00'],
      sunday: ['unavailable']
    },
    hourlyRate: 15.75,
    maxHoursPerWeek: 40,
    location: 'Store #2',
    phone: '(555) 234-5679',
    email: 'tom.w@crewclock.com',
    hireDate: '2023-07-11',
    certifications: ['Forklift', 'Inventory Management'],
    preferredShifts: ['morning', 'early']
  }
];

const TimePickerScroll: React.FC<{
  value: TimeSlot;
  onChange: (time: TimeSlot) => void;
  label: string;
}> = ({ value, onChange, label }: { value: any; onChange: any; label: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];
  
  const formatTime = (time: TimeSlot) => {
    return `${time.hour}:${time.minute.toString().padStart(2, '0')} ${time.period}`;
  };

  return (
    <div className="relative">
      <Label>{label}</Label>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        {formatTime(value)}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-md shadow-lg">
          <div className="flex divide-x divide-border max-h-48">
            {/* Hours */}
            <ScrollArea className="flex-1 h-48">
              <div className="p-2">
                {hours.map(hour => (
                  <div
                    key={hour}
                    className={`p-2 cursor-pointer hover:bg-accent rounded ${
                      value.hour === hour ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => onChange({ ...value, hour })}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Minutes */}
            <ScrollArea className="flex-1 h-48">
              <div className="p-2">
                {minutes.map(minute => (
                  <div
                    key={minute}
                    className={`p-2 cursor-pointer hover:bg-accent rounded ${
                      value.minute === minute ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => onChange({ ...value, minute })}
                  >
                    {minute.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* AM/PM */}
            <div className="flex-1 p-2">
              {(['AM', 'PM'] as const).map(period => (
                <div
                  key={period}
                  className={`p-2 cursor-pointer hover:bg-accent rounded ${
                    value.period === period ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => {
                    onChange({ ...value, period });
                    setIsOpen(false);
                  }}
                >
                  {period}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function EnhancedSchedulingInterface() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [draggedShift, setDraggedShift] = useState<Shift | null>(null);
  const [isCreateShiftOpen, setIsCreateShiftOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSchedulePublished, setIsSchedulePublished] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'employee'>('week');
  const [skillMatchingEnabled, setSkillMatchingEnabled] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('Store #1');
  
  // New shift form state
  const [newShift, setNewShift] = useState({
    role: '',
    location: currentLocation,
    skills: [] as string[],
    date: '',
    startTime: { hour: 9, minute: 0, period: 'AM' as const },
    endTime: { hour: 5, minute: 0, period: 'PM' as const },
    notes: ''
  });

  const [autoAssignMode, setAutoAssignMode] = useState(false);
  
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const formatHour = (hour: number) => {
    return hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? `12:00 PM` : `${hour}:00 AM`;
  };

  const getWeekDates = (weekOffset: number = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)));
    return weekDays.map((_: any, i: any) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const currentWeekDates = getWeekDates(selectedWeek);

  const handleDragStart = (shift: Shift) => {
    setDraggedShift(shift);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, employeeId: number, date: string, timeSlot: string) => {
    e.preventDefault();
    
    if (!draggedShift) return;
    
    const updatedShift = {
      ...draggedShift,
      employeeId,
      date,
      startTime: timeSlot,
      endTime: getEndTime(timeSlot, 8) // 8-hour shift default
    };
    
    setShifts(prev => prev.map(s => s.id === draggedShift.id ? updatedShift : s));
    setDraggedShift(null);
  };

  const getEndTime = (startTime: string, hours: number): string => {
    const [time, period] = startTime.split(' ');
    const [hourStr] = time.split(':');
    let hour = parseInt(hourStr);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    hour += hours;
    
    const newPeriod = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    
    return `${displayHour}:00 ${newPeriod}`;
  };

  const getSkillMatchScore = (employee: Employee, requiredSkills: string[]): number => {
    if (requiredSkills.length === 0) return 100;
    const matchedSkills = employee.skills.filter(skill => requiredSkills.includes(skill));
    return Math.round((matchedSkills.length / requiredSkills.length) * 100);
  };

  const isEmployeeAvailable = (employee: Employee, date: string, startTime: string): boolean => {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availability = employee.availability[dayOfWeek];
    
    if (!availability || availability.includes('unavailable')) return false;
    
    // Check if the time slot overlaps with any availability window
    const [timeStr] = startTime.split(' ');
    const [hourStr] = timeStr.split(':');
    let hour = parseInt(hourStr);
    
    return availability.some(slot => {
      const [start, end] = slot.split('-');
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      return hour >= startHour && hour <= endHour;
    });
  };

  const autoAssignShift = (shift: Shift) => {
    const availableEmployees = employees
      .filter(emp => emp.location === shift.location)
      .filter(emp => isEmployeeAvailable(emp, shift.date, shift.startTime))
      .map(emp => ({
        ...emp,
        skillScore: getSkillMatchScore(emp, shift.skills)
      }))
      .sort((a, b) => b.skillScore - a.skillScore);

    if (availableEmployees.length > 0) {
      const bestMatch = availableEmployees[0];
      setShifts(prev => prev.map(s => 
        s.id === shift.id ? { ...s, employeeId: bestMatch.id } : s
      ));
    }
  };

  const createShift = () => {
    const timeSlotToString = (time: TimeSlot) => {
      return `${time.hour}:${time.minute.toString().padStart(2, '0')} ${time.period}`;
    };

    const shift: Shift = {
      id: `shift-${Date.now()}`,
      date: newShift.date,
      startTime: timeSlotToString(newShift.startTime),
      endTime: timeSlotToString(newShift.endTime),
      role: newShift.role,
      location: newShift.location,
      skills: newShift.skills,
      notes: newShift.notes,
      isPublished: false,
      status: 'draft',
      createdBy: 1
    };

    setShifts(prev => [...prev, shift]);
    
    if (autoAssignMode) {
      autoAssignShift(shift);
    }
    
    setIsCreateShiftOpen(false);
    resetShiftForm();
  };

  const resetShiftForm = () => {
    setNewShift({
      role: '',
      location: currentLocation,
      skills: [],
      date: '',
      startTime: { hour: 9, minute: 0, period: 'AM' },
      endTime: { hour: 5, minute: 0, period: 'PM' },
      notes: ''
    });
  };

  const employeesByLocation = employees.filter(emp => emp.location === currentLocation);

  return (
    <div className="w-full h-full">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl">Schedule Management</h1>
            <p className="text-sm text-muted-foreground">Create and manage employee schedules with smart skill matching</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select 
              value={currentLocation} 
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="text-sm border border-border rounded px-2 py-1"
            >
              <option value="Store #1">Store #1</option>
              <option value="Store #2">Store #2</option>
              <option value="Store #3">Store #3</option>
            </select>

            <Dialog open={isCreateShiftOpen} onOpenChange={setIsCreateShiftOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Create Shift</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Shift</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Role</Label>
                      <Select value={newShift.role} onValueChange={(value) => 
                        setNewShift(prev => ({ ...prev, role: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cashier">Cashier</SelectItem>
                          <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="delivery">Delivery Driver</SelectItem>
                          <SelectItem value="barista">Barista</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Date</Label>
                      <Input 
                        type="date" 
                        value={newShift.date}
                        onChange={(e) => setNewShift(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <TimePickerScroll
                      label="Start Time"
                      value={newShift.startTime}
                      onChange={(time) => setNewShift(prev => ({ ...prev, startTime: time }))}
                    />
                    
                    <TimePickerScroll
                      label="End Time"
                      value={newShift.endTime}
                      onChange={(time) => setNewShift(prev => ({ ...prev, endTime: time }))}
                    />
                  </div>

                  <div>
                    <Label>Notes (optional)</Label>
                    <Textarea 
                      placeholder="Special instructions or requirements..."
                      value={newShift.notes}
                      onChange={(e) => setNewShift(prev => ({ ...prev, notes: e.target.value }))}
                      className="resize-none"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={autoAssignMode}
                      onCheckedChange={setAutoAssignMode}
                    />
                    <Label className="text-sm">Auto-assign best match</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createShift} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Create Shift
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateShiftOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Copy Week</span>
            </Button>
            
            <Button 
              variant={isSchedulePublished ? "secondary" : "default"}
              size="sm"
              onClick={() => setIsSchedulePublished(!isSchedulePublished)}
            >
              {isSchedulePublished ? 'Published' : 'Publish Schedule'}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedWeek(prev => prev - 1)}
            >
              Previous Week
            </Button>
            <span className="text-sm font-medium px-2">
              Week of {new Date(currentWeekDates[0]).toLocaleDateString()}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedWeek(prev => prev + 1)}
            >
              Next Week
            </Button>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <Switch 
                checked={skillMatchingEnabled}
                onCheckedChange={setSkillMatchingEnabled}
              />
              <Label className="text-sm">Skill Matching</Label>
            </div>
            
            <select 
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'week' | 'employee')}
              className="text-sm border border-border rounded px-2 py-1"
            >
              <option value="week">Week View</option>
              <option value="employee">Employee View</option>
            </select>
          </div>
        </div>

        {/* Schedule Grid */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-8 border-b border-border">
                  <div className="p-2 md:p-3 bg-muted/50 text-sm font-medium border-r border-border">
                    <Circle className="w-4 h-4 inline mr-2" />
                    Employee ({employeesByLocation.length})
                  </div>
                  {weekDays.map((day, i) => (
                    <div key={day} className="p-2 md:p-3 bg-muted/50 text-center text-sm font-medium border-r border-border last:border-r-0">
                      <div>{day}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(currentWeekDates[i]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>

                {employeesByLocation.map((employee, empIndex) => (
                  <div key={employee.id} className="grid grid-cols-8 border-b border-border last:border-b-0">
                    <div 
                      className="p-2 md:p-3 border-r border-border bg-background cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs md:text-sm font-medium text-blue-600">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{employee.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {employee.skills.slice(0, 2).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs px-1">
                                {skill}
                              </Badge>
                            ))}
                            {employee.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs px-1">
                                +{employee.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {weekDays.map((day, dayIndex) => (
                      <div 
                        key={`${employee.id}-${day}`}
                        className="p-1 md:p-2 border-r border-border last:border-r-0 min-h-[80px] md:min-h-[120px]"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, employee.id, currentWeekDates[dayIndex], '9:00 AM')}
                      >
                        {shifts
                          .filter(shift => 
                            shift.employeeId === employee.id && 
                            shift.date === currentWeekDates[dayIndex]
                          )
                          .map(shift => (
                            <div
                              key={shift.id}
                              draggable
                              onDragStart={() => handleDragStart(shift)}
                              className="bg-blue-100 border border-blue-200 rounded p-1 md:p-2 mb-1 cursor-move hover:bg-blue-200 transition-colors"
                            >
                              <div className="text-xs font-medium text-blue-800">
                                {shift.role}
                              </div>
                              <div className="text-xs text-blue-600">
                                {shift.startTime} - {shift.endTime}
                              </div>
                              {skillMatchingEnabled && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs">
                                    {getSkillMatchScore(employee, shift.skills)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          ))
                        }
                        
                        {/* Show availability indicator */}
                        <div className="text-xs text-muted-foreground mt-1">
                          {isEmployeeAvailable(employee, currentWeekDates[dayIndex], '9:00 AM') ? (
                            <CheckCircle className="w-3 h-3 text-green-500 inline" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-500 inline" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Profile Dialog */}
        {selectedEmployee && (
          <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {selectedEmployee.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{selectedEmployee.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedEmployee.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="font-medium">${selectedEmployee.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Hours/Week</p>
                    <p className="font-medium">{selectedEmployee.maxHoursPerWeek}h</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployee.skills.map(skill => (
                      <Badge key={skill} variant="secondary">
                        {skill.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployee.certifications.map(cert => (
                      <Badge key={cert} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Contact</p>
                  <p className="text-sm">{selectedEmployee.phone}</p>
                  <p className="text-sm">{selectedEmployee.email}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Circle className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}