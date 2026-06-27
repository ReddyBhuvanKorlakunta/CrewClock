import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ArrowRight, Bell, Circle, MessageSquare, Mic, Phone, Play, Radio, Send, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function EmergencyCommunications() {
  const [selectedBroadcastType, setSelectedBroadcastType] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');

  const emergencyTypes = [
    { id: 'evacuation', label: 'Evacuation Required', color: 'bg-red-500', icon: AlertCircle },
    { id: 'weather', label: 'Severe Weather', color: 'bg-orange-500', icon: AlertCircle },
    { id: 'medical', label: 'Medical Emergency', color: 'bg-blue-500', icon: Phone },
    { id: 'security', label: 'Security Incident', color: 'bg-purple-500', icon: AlertCircle },
    { id: 'system', label: 'System Outage', color: 'bg-gray-500', icon: Radio },
    { id: 'custom', label: 'Custom Alert', color: 'bg-green-500', icon: Bell }
  ];

  const recentBroadcasts = [
    {
      id: 1,
      type: 'weather',
      title: 'Severe Weather Alert',
      message: 'All outdoor activities suspended due to severe thunderstorm warning',
      timestamp: '2024-01-15 2:45 PM',
      recipients: 'All Staff',
      acknowledgedCount: 12,
      totalRecipients: 15,
      priority: 'high'
    },
    {
      id: 2,
      type: 'system',
      title: 'POS System Update',
      message: 'Point of sale system will be updated at 11 PM tonight. Expect 15 minute downtime.',
      timestamp: '2024-01-14 4:30 PM',
      recipients: 'Store Managers',
      acknowledgedCount: 3,
      totalRecipients: 3,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'custom',
      title: 'Team Meeting Reminder',
      message: 'Mandatory safety training tomorrow at 9 AM in conference room.',
      timestamp: '2024-01-13 5:15 PM',
      recipients: 'Store #1 Staff',
      acknowledgedCount: 8,
      totalRecipients: 10,
      priority: 'low'
    }
  ];

  const handoffNotes = [
    {
      id: 1,
      from: 'Sarah Johnson',
      to: 'Mike Chen',
      shift: 'Morning → Afternoon',
      timestamp: '1:00 PM',
      priority: 'high',
      notes: 'Register 3 is having intermittent issues with card reader. Customer complained about slow service. Inventory count needed for dairy section.',
      hasVoiceMemo: true,
      voiceDuration: '2:34'
    },
    {
      id: 2,
      from: 'Emily Davis',
      to: 'Alex Rodriguez',
      shift: 'Day → Evening',
      timestamp: '5:30 PM',
      priority: 'medium',
      notes: 'New promotional displays set up in front windows. Reminder: evening deep clean scheduled for tonight.',
      hasVoiceMemo: false,
      voiceDuration: null
    }
  ];

  const onlineStaff = [
    { name: 'Sarah Johnson', location: 'Store #1', status: 'active', lastSeen: 'now' },
    { name: 'Mike Chen', location: 'Store #2', status: 'active', lastSeen: '2 min ago' },
    { name: 'Emily Davis', location: 'Store #1', status: 'away', lastSeen: '15 min ago' },
    { name: 'Alex Rodriguez', location: 'Store #2', status: 'active', lastSeen: '1 min ago' },
  ];

  const getPriorityColor = (priority: any) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Emergency Communications</h1>
          <p className="text-muted-foreground">Broadcast alerts, manage handoffs, and emergency protocols</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Circle className="w-4 h-4 mr-2" />
                Emergency Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <Circle className="w-5 h-5" />
                  Emergency Broadcast
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <Circle className="h-4 w-4" />
                  <AlertDescription>
                    Emergency broadcasts will be sent immediately to all selected recipients via push notifications, SMS, and in-app alerts.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Emergency Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select emergency type" />
                      </SelectTrigger>
                      <SelectContent>
                        {emergencyTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Recipients</Label>
                    <Select value={selectedBroadcastType} onValueChange={setSelectedBroadcastType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Staff (15 people)</SelectItem>
                        <SelectItem value="managers">Managers Only (3 people)</SelectItem>
                        <SelectItem value="store1">Store #1 Staff (8 people)</SelectItem>
                        <SelectItem value="store2">Store #2 Staff (7 people)</SelectItem>
                        <SelectItem value="online">Online Staff Only (4 people)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Emergency Message</Label>
                  <Textarea 
                    placeholder="Enter emergency message details..."
                    value={emergencyMessage}
                    onChange={(e) => setEmergencyMessage(e.target.value)}
                    className="min-h-20"
                  />
                </div>

                <div className="flex items-center gap-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">Voice Message</span>
                  </div>
                  <Button 
                    variant={isRecording ? "destructive" : "outline"} 
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <Circle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? 'Stop Recording' : 'Record Voice'}
                  </Button>
                  {isRecording && <Badge variant="destructive" className="animate-pulse">Recording...</Badge>}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="destructive" className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send Emergency Alert
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Quick Message
          </Button>
        </div>
      </div>

      {/* Online Staff Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="w-5 h-5" />
            Staff Status ({onlineStaff.filter(s => s.status === 'active').length} online)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {onlineStaff.map((staff, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(staff.status)} rounded-full border-2 border-white`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.location}</p>
                  <p className="text-xs text-muted-foreground">{staff.lastSeen}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="broadcasts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="broadcasts">Recent Broadcasts</TabsTrigger>
          <TabsTrigger value="handoffs">Shift Handoffs</TabsTrigger>
          <TabsTrigger value="protocols">Emergency Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="broadcasts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Emergency Broadcasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBroadcasts.map((broadcast: any) => {
                  const emergencyType = emergencyTypes.find(t => t.id === broadcast.type);
                  const acknowledgeRate = (broadcast.acknowledgedCount / broadcast.totalRecipients) * 100;
                  
                  return (
                    <div key={broadcast.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${emergencyType?.color} rounded-lg flex items-center justify-center`}>
                            {emergencyType && <emergencyType.icon className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <h3 className="font-medium">{broadcast.title}</h3>
                            <p className="text-sm text-muted-foreground">{broadcast.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(broadcast.priority)}>
                            {broadcast.priority} priority
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm mb-3 p-3 bg-muted/50 rounded">{broadcast.message}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Recipients: {broadcast.recipients}</span>
                          <span>Acknowledged: {broadcast.acknowledgedCount}/{broadcast.totalRecipients} ({Math.round(acknowledgeRate)}%)</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Circle className="w-4 h-4 mr-2" />
                          Report
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handoffs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Shift Handoff Notes</span>
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create Handoff
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {handoffNotes.map((handoff) => (
                  <div key={handoff.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{handoff.from} → {handoff.to}</p>
                          <p className="text-sm text-muted-foreground">{handoff.shift} • {handoff.timestamp}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(handoff.priority)}>
                        {handoff.priority}
                      </Badge>
                    </div>

                    <div className="bg-muted/50 p-3 rounded mb-3">
                      <p className="text-sm">{handoff.notes}</p>
                    </div>

                    {handoff.hasVoiceMemo && (
                      <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                        <Volume2 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Voice Memo ({handoff.voiceDuration})</span>
                        <Button variant="ghost" size="sm">
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyTypes.map((protocol) => (
              <Card key={protocol.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-8 h-8 ${protocol.color} rounded-lg flex items-center justify-center`}>
                      <protocol.icon className="w-4 h-4 text-white" />
                    </div>
                    {protocol.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium mb-1">Immediate Actions:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Alert all on-duty staff immediately</li>
                        <li>Notify management and emergency contacts</li>
                        <li>Document incident details</li>
                        <li>Follow location-specific protocols</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Communication:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Send emergency broadcast</li>
                        <li>Update staff status board</li>
                        <li>Contact external authorities if needed</li>
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full mt-3">
                      View Full Protocol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}