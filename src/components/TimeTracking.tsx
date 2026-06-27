import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Battery, Circle, Coffee, Edit, Info, Navigation, Play, Wifi, WifiOff } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

export function TimeTracking() {
  const [connectionStatus, setConnectionStatus] = useState('online');
  
  // Simulate GPS and connectivity status
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate network status changes
      const status = Math.random() > 0.95 ? 'offline' : 'online';
      setConnectionStatus(status);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const timeEntries = [
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      date: '2024-01-15',
      clockIn: '9:00 AM',
      clockOut: '5:30 PM',
      breakTime: 30,
      totalHours: 8.0,
      location: 'Store #1',
      status: 'approved',
      notes: ''
    },
    {
      id: 2,
      employeeName: 'Mike Chen',
      date: '2024-01-15',
      clockIn: '8:30 AM',
      clockOut: '4:45 PM',
      breakTime: 45,
      totalHours: 7.75,
      location: 'Store #2',
      status: 'pending',
      notes: 'Late start due to traffic'
    },
    {
      id: 3,
      employeeName: 'Emily Davis',
      date: '2024-01-15',
      clockIn: '10:00 AM',
      clockOut: '7:15 PM',
      breakTime: 60,
      totalHours: 8.25,
      location: 'Store #1',
      status: 'flagged',
      notes: 'Overtime needs approval'
    },
    {
      id: 4,
      employeeName: 'Alex Rodriguez',
      date: '2024-01-14',
      clockIn: '11:00 AM',
      clockOut: '8:00 PM',
      breakTime: 30,
      totalHours: 8.5,
      location: 'Store #2',
      status: 'approved',
      notes: ''
    },
    {
      id: 5,
      employeeName: 'Lisa Thompson',
      date: '2024-01-14',
      clockIn: '2:00 PM',
      clockOut: '10:30 PM',
      breakTime: 15,
      totalHours: 8.25,
      location: 'Store #1',
      status: 'pending',
      notes: 'Evening shift'
    }
  ];

  const liveTracking = [
    {
      employeeName: 'Sarah Johnson',
      clockedIn: '9:00 AM',
      currentDuration: '4h 23m',
      status: 'working',
      location: 'Store #1',
      gpsAccuracy: 12,
      locationType: 'gps',
      batteryOptimized: true,
      isInRange: true
    },
    {
      employeeName: 'Mike Chen',
      clockedIn: '8:30 AM',
      currentDuration: '4h 53m',
      status: 'working',
      location: 'Store #2',
      gpsAccuracy: 8,
      locationType: 'gps',
      batteryOptimized: true,
      isInRange: true
    },
    {
      employeeName: 'Emily Davis',
      clockedIn: '10:00 AM',
      currentDuration: '2h 23m',
      status: 'break',
      location: 'Store #1',
      gpsAccuracy: 0,
      locationType: 'wifi',
      batteryOptimized: false,
      isInRange: true
    }
  ];

  const locationSettings = {
    gpsToleranceMeters: 75,
    wifiFallbackEnabled: true,
    batteryOptimizationEnabled: true,
    autoDisableOffShift: true,
    smartSamplingEnabled: true
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'working': return 'bg-blue-100 text-blue-800';
      case 'break': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Circle className='w-4 h-4' />;
      case 'pending': return <Circle className='w-4 h-4' />;
      case 'flagged': return <AlertCircle className="w-4 h-4" />;
      case 'working': return <Play className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const totalHoursThisWeek = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const pendingApprovals = timeEntries.filter(entry => entry.status === 'pending').length;
  const flaggedEntries = timeEntries.filter(entry => entry.status === 'flagged').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Time Tracking</h1>
          <p className="text-muted-foreground">Monitor employee hours and manage timecards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            </Button>
          <Button>
            <Circle className="w-4 h-4 mr-2" />
            Approve All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Currently Working</p>
                <p className="text-2xl font-semibold">{liveTracking.filter(e => e.status === 'working').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours This Week</p>
                <p className="text-2xl font-semibold">{totalHoursThisWeek.toFixed(1)}</p>
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
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-semibold">{pendingApprovals}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged Entries</p>
                <p className="text-2xl font-semibold">{flaggedEntries}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="live" className="space-y-6">
        <TabsList>
          <TabsTrigger value="live">Live Tracking</TabsTrigger>
          <TabsTrigger value="timecards">Timecards</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          {/* Connection Status Alert */}
          {connectionStatus === 'offline' && (
            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                Offline mode active. events will be queued and synced when connection is restored.
              </AlertDescription>
            </Alert>
          )}

          {/* GPS & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Location & GPS </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4" />
                    <span className="text-sm font-medium">GPS Tolerance</span>
                  </div>
                  <Badge variant="outline">{locationSettings.gpsToleranceMeters}m</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">WiFi Fallback</span>
                  </div>
                  <Badge variant={locationSettings.wifiFallbackEnabled ? "default" : "secondary"}>
                    {locationSettings.wifiFallbackEnabled ? "ON" : "OFF"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    <span className="text-sm font-medium">Battery Opt</span>
                  </div>
                  <Badge variant={locationSettings.batteryOptimizationEnabled ? "default" : "secondary"}>
                    {locationSettings.batteryOptimizationEnabled ? "ON" : "OFF"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4" />
                    <span className="text-sm font-medium">Auto-Disable</span>
                  </div>
                  <Badge variant={locationSettings.autoDisableOffShift ? "default" : "secondary"}>
                    {locationSettings.autoDisableOffShift ? "ON" : "OFF"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Live Employee Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveTracking.map((employee, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center relative">
                          <span className="text-sm font-medium text-blue-600">
                            {employee.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                          {employee.batteryOptimized && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <Battery className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{employee.employeeName}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Clocked in: {employee.clockedIn}</span>
                            <div className="flex items-center gap-1">
                              {employee.locationType === 'gps' ? 
                                <Navigation className="w-3 h-3 text-green-600" /> : 
                                <Wifi className="w-3 h-3 text-blue-600" />
                              }
                              <span>{employee.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-lg">{employee.currentDuration}</p>
                          <p className="text-sm text-muted-foreground">Duration</p>
                        </div>
                        <Badge className={`${getStatusColor(employee.status)} border-0`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(employee.status)}
                            <span className="capitalize">{employee.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="grid grid-cols-3 gap-4 text-sm bg-muted/30 p-3 rounded-lg">
                      <div>
                        <p className="text-muted-foreground">Location Method</p>
                        <div className="flex items-center gap-1">
                          {employee.locationType === 'gps' ? 
                            <Navigation className="w-3 h-3 text-green-600" /> : 
                            <Wifi className="w-3 h-3 text-blue-600" />
                          }
                          <span className="font-medium capitalize">{employee.locationType}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Accuracy</p>
                        <p className="font-medium">
                          {employee.gpsAccuracy > 0 ? `±${employee.gpsAccuracy}m` : 'Network-based'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Range Status</p>
                        <Badge variant={employee.isInRange ? "default" : "destructive"} className="text-xs">
                          {employee.isInRange ? "In Range" : "Out of Range"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timecards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-5 h-5" />
                Employee Timecards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeEntries.map((entry) => (
                  <div key={entry.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {entry.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{entry.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{entry.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(entry.status)} border-0`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(entry.status)}
                            <span className="capitalize">{entry.status}</span>
                          </div>
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">In</p>
                        <p className="font-medium">{entry.clockIn}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Out</p>
                        <p className="font-medium">{entry.clockOut}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Break Time</p>
                        <p className="font-medium">{entry.breakTime} min</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Hours</p>
                        <p className="font-medium">{entry.totalHours}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{entry.location}</p>
                      </div>
                    </div>

                    {entry.notes && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm"><strong>Note:</strong> {entry.notes}</p>
                      </div>
                    )}

                    {entry.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="default">Approve</Button>
                        <Button size="sm" variant="outline">Request Changes</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Hours Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez', 'Lisa Thompson'].map((name: any, index: number) => {
                    const hours = [32, 40, 45, 35, 28][index];
                    const limit = [40, 40, 50, 40, 30][index];
                    const percentage = (hours / limit) * 100;
                    
                    return (
                      <div key={name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{name}</span>
                          <span className="text-muted-foreground">{hours}h / {limit}h</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { department: 'Cashiers', hours: '120h', employees: 3 },
                    { department: 'Kitchen Staff', hours: '80h', employees: 2 },
                    { department: 'Management', hours: '90h', employees: 2 },
                    { department: 'Delivery', hours: '70h', employees: 1 }
                  ].map((dept, index) => (
                    <div key={dept.department} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{dept.department}</p>
                        <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{dept.hours}</p>
                        <p className="text-sm text-muted-foreground">this week</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}