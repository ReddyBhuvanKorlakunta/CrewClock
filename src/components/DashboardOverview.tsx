import { Badge } from './ui/badge';
import { Circle, Info, Plus, Coffee, XCircle, UserCheck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';


export function DashboardOverview() {
  const currentlyWorking = [
    { name: 'Sarah Johnson', role: 'Cashier', location: 'Store #1', clockedIn: '9:00 AM', status: 'working' },
    { name: 'Mike Chen', role: 'Kitchen Staff', location: 'Store #2', clockedIn: '8:30 AM', status: 'working' },
    { name: 'Emily Davis', role: 'Store Manager', location: 'Store #1', clockedIn: '8:00 AM', status: 'break' },
    { name: 'Alex Rodriguez', role: 'Delivery Driver', location: 'Store #2', clockedIn: '10:00 AM', status: 'working' },
  ];

  const todayStats = {
    totalScheduled: 12,
    currentlyWorking: 4,
    onBreak: 1,
    absent: 1,
    coverageRate: 85
  };

  const recentNotifications = [
    { type: 'urgent', message: 'Sarah Johnson requested to swap Friday shift', time: '5 min ago' },
    { type: 'info', message: 'Weekly schedules published for next week', time: '1 hour ago' },
    { type: 'warning', message: 'Store #2 needs coverage for 2-6 PM today', time: '2 hours ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <UserCheck className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      case 'absent': return <Circle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (<div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Shift
          </Button>
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            View Schedule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Currently Working</p>
                <p className="text-2xl font-semibold">{todayStats.currentlyWorking}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scheduled</p>
                <p className="text-2xl font-semibold">{todayStats.totalScheduled}</p>
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
                <p className="text-sm text-muted-foreground">Coverage Rate</p>
                <p className="text-2xl font-semibold">{todayStats.coverageRate}%</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Circle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <Progress value={todayStats.coverageRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent Today</p>
                <p className="text-2xl font-semibold">{todayStats.absent}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currently Working */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="w-5 h-5" />
              Currently Working
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentlyWorking.map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{employee.clockedIn}</span>
                    <Badge className={`${getStatusColor(employee.status)} border-0`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(employee.status)}
                        <span className="capitalize">{employee.status}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Circle className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'urgent' ? 'bg-red-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="w-6 h-6 mb-2" />
              Create Shift
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Circle className="w-6 h-6 mb-2" />
              Manage Staff
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Circle className="w-6 h-6 mb-2" />
              Approve Timecards
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Circle className="w-6 h-6 mb-2" />
              View Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}