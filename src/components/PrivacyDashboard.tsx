import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Bell, Camera, Circle, Eye, Info, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function PrivacyDashboard() {
  const [locationTracking, setLocationTracking] = useState(true);
  const [chatAccess, setChatAccess] = useState(true);
  const [scheduleSharing, setScheduleSharing] = useState(false);
  const [photoAccess, setPhotoAccess] = useState(true);
  const [notificationPrefs, setNotificationPrefs] = useState({
    push: true,
    email: false,
    sms: false,
    quietHours: true
  });

  const dataCollected = [
    {
      type: 'Location Data',
      icon: AlertCircle, description: 'GPS coordinates when clocking in/out',
      frequency: 'During shifts only',
      retention: '90 days',
      canDisable: true,
      enabled: locationTracking
    },
    {
      type: 'Time Records',
      icon: AlertCircle, description: 'in/out times and break duration',
      frequency: 'Every clock event',
      retention: '7 years (compliance)',
      canDisable: false,
      enabled: true
    },
    {
      type: 'Chat Messages',
      icon: MessageSquare,
      description: 'Messages sent in team channels',
      frequency: 'When messaging',
      retention: '1 year',
      canDisable: true,
      enabled: chatAccess
    },
    {
      type: 'Schedule Access',
      icon: AlertCircle, description: 'Who can view your schedule',
      frequency: 'Continuous',
      retention: 'While employed',
      canDisable: true,
      enabled: scheduleSharing
    },
    {
      type: 'Profile Photos',
      icon: Camera,
      description: 'Profile and document photos',
      frequency: 'When uploaded',
      retention: '2 years after termination',
      canDisable: true,
      enabled: photoAccess
    }
  ];

  const privacyScore = Math.round(
    (dataCollected.filter(d => d.canDisable && !d.enabled).length / 
     dataCollected.filter(d => d.canDisable).length) * 100
  );

  const auditLog = [
    {
      timestamp: '2024-01-15 09:23 AM',
      action: 'Location access granted',
      details: 'GPS tracking enabled for clock-in verification',
      category: 'location'
    },
    {
      timestamp: '2024-01-14 03:45 PM',
      action: 'Schedule viewed by manager',
      details: 'Emily Davis accessed your schedule for next week',
      category: 'access'
    },
    {
      timestamp: '2024-01-13 11:12 AM',
      action: 'Data export requested',
      details: 'Payroll data exported for QuickBooks integration',
      category: 'export'
    },
    {
      timestamp: '2024-01-12 08:30 AM',
      action: 'Chat message sent',
      details: 'Message sent in General team channel',
      category: 'communication'
    }
  ];

  const getPrivacyScoreColor = (score: any) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCategoryIcon = (category: any) => {
    switch (category) {
      case 'location': return <Circle className="w-4 h-4" />;
      case 'access': return <Eye className="w-4 h-4" />;
      case 'export': return <Circle className="w-4 h-4" />;
      case 'communication': return <MessageSquare className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Privacy Dashboard</h1>
          <p className="text-muted-foreground">Control your data privacy and see what information is collected</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Circle className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Personal Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Request a complete export of all your personal data stored in CrewClock.
                </p>
                <div className="space-y-2">
                  <Label>Data to include:</Label>
                  <div className="space-y-2">
                    {['Time records', 'Schedule history', 'Chat messages', 'Location data', 'Profile information'].map(item => (
                      <div key={item} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <label className="text-sm">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full">Request Data Export</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            Privacy </Button>
        </div>
      </div>

      {/* Privacy Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="w-5 h-5" />
            Privacy Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getPrivacyScoreColor(privacyScore)}`}>
              <span className="text-2xl font-bold">{privacyScore}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium mb-2">Your privacy settings are optimized</p>
              <p className="text-sm text-muted-foreground mb-3">
                You have control over {dataCollected.filter(d => d.canDisable).length} out of {dataCollected.length} data collection types.
              </p>
              <Progress value={privacyScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="data-collection" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-collection">Data Collection</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="data-collection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What Data We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataCollected.map((item, index) => (<div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.type}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.canDisable ? (
                          <Switch 
                            checked={item.enabled} 
                            onCheckedChange={(checked: any) => {
                              // Handle toggle based on item type
                              if (item.type === 'Location Data') setLocationTracking(checked);
                              if (item.type === 'Chat Messages') setChatAccess(checked);
                              if (item.type === 'Schedule Access') setScheduleSharing(checked);
                              if (item.type === 'Profile Photos') setPhotoAccess(checked);
                            }}
                          />
                        ) : (
                          <Badge variant="secondary">Required</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg">
                      <div>
                        <p className="text-muted-foreground">Collection Frequency</p>
                        <p className="font-medium">{item.frequency}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Data Retention</p>
                        <p className="font-medium">{item.retention}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Location Services</p>
                      <p className="text-sm text-muted-foreground">GPS tracking for clock-in verification</p>
                    </div>
                  </div>
                  <Switch checked={locationTracking} onCheckedChange={setLocationTracking} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Schedule updates and shift reminders</p>
                    </div>
                  </div>
                  <Switch checked={notificationPrefs.push} onCheckedChange={(checked) => 
                    setNotificationPrefs(prev => ({ ...prev, push: checked }))
                  } />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Camera Access</p>
                      <p className="text-sm text-muted-foreground">Profile photos and document uploads</p>
                    </div>
                  </div>
                  <Switch checked={photoAccess} onCheckedChange={setPhotoAccess} />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Team Communication</p>
                      <p className="text-sm text-muted-foreground">Access to team chat and messages</p>
                    </div>
                  </div>
                  <Switch checked={chatAccess} onCheckedChange={setChatAccess} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-log" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLog.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      {getCategoryIcon(entry.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{entry.action}</p>
                        <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <Circle className="h-4 w-4" />
                  <AlertDescription>
                    We automatically delete your personal data according to legal requirements and your preferences.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Circle className="w-4 h-4" />
                      Time & Attendance Data
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">Retention: 7 years (tax compliance)</p>
                    <p className="text-xs text-muted-foreground">records, timecards, and payroll data must be kept for legal compliance.</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Circle className="w-4 h-4" />
                      Location Data
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">Retention: 90 days</p>
                    <p className="text-xs text-muted-foreground">GPS coordinates are automatically deleted after 90 days.</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4" />
                      Communication Data
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">Retention: 1 year</p>
                    <p className="text-xs text-muted-foreground">Chat messages and notifications are kept for one year.</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <Circle className="w-4 h-4" />
                      Profile Data
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">Retention: 2 years after termination</p>
                    <p className="text-xs text-muted-foreground">Profile information is deleted 2 years after employment ends.</p>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-800">Request Data Deletion</h4>
                      <p className="text-sm text-red-700">Permanently delete all your personal data (subject to legal requirements)</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Circle className="w-4 h-4 mr-2" />
                      Delete My Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}