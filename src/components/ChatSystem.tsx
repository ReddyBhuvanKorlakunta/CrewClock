import React, { useState, useEffect, useRef } from 'react';
import { Circle, MessageSquare, MoreVertical, Paperclip, Phone, Pin, Plus, Send, Smile, Video } from 'lucide-react';

import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
interface ChatMessage {
  id: string;
  senderId: number;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  reactions?: { emoji: string; users: number[] }[];
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'group' | 'direct';
  location?: string;
  members: number[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned: boolean;
}

const employees = [
  { id: 1, name: 'Sarah Johnson', role: 'Cashier Lead', location: 'Store #1', avatar: 'SJ', online: true },
  { id: 2, name: 'Mike Chen', role: 'Kitchen Staff', location: 'Store #1', avatar: 'MC', online: true },
  { id: 3, name: 'Emily Davis', role: 'Store Manager', location: 'Store #1', avatar: 'ED', online: true },
  { id: 4, name: 'Alex Rodriguez', role: 'Delivery Driver', location: 'Store #1', avatar: 'AR', online: false },
  { id: 5, name: 'Lisa Thompson', role: 'Cashier', location: 'Store #1', avatar: 'LT', online: true },
  { id: 6, name: 'David Kim', role: 'Assistant Manager', location: 'Store #2', avatar: 'DK', online: true },
  { id: 7, name: 'Jessica Martinez', role: 'Kitchen Staff', location: 'Store #2', avatar: 'JM', online: false },
  { id: 8, name: 'Ryan O\'Connor', role: 'Cashier', location: 'Store #2', avatar: 'RO', online: true },
];

const initialChannels: ChatChannel[] = [
  {
    id: 'store1-general',
    name: 'Store #1 - General',
    type: 'group',
    location: 'Store #1',
    members: [1, 2, 3, 4, 5],
    unreadCount: 3,
    isPinned: true,
    lastMessage: {
      id: 'msg-1',
      senderId: 2,
      senderName: 'Mike Chen',
      senderRole: 'Kitchen Staff',
      content: 'Can someone help cover the morning prep? Running behind schedule.',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      type: 'text',
      isRead: false
    }
  },
  {
    id: 'store2-general',
    name: 'Store #2 - General',
    type: 'group',
    location: 'Store #2',
    members: [6, 7, 8],
    unreadCount: 0,
    isPinned: false,
    lastMessage: {
      id: 'msg-2',
      senderId: 6,
      senderName: 'David Kim',
      senderRole: 'Assistant Manager',
      content: 'Great job on today\'s sales numbers everyone!',
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      type: 'text',
      isRead: true
    }
  },
  {
    id: 'managers',
    name: 'Managers',
    type: 'group',
    members: [3, 6],
    unreadCount: 1,
    isPinned: true,
    lastMessage: {
      id: 'msg-3',
      senderId: 3,
      senderName: 'Emily Davis',
      senderRole: 'Store Manager',
      content: 'Schedule review meeting tomorrow at 2 PM',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      type: 'text',
      isRead: false
    }
  }
];

const initialMessages: { [channelId: string]: ChatMessage[] } = {
  'store1-general': [
    {
      id: 'msg-1',
      senderId: 3,
      senderName: 'Emily Davis',
      senderRole: 'Store Manager',
      content: 'Good morning team! Don\'t forget we have the health inspection today at 2 PM.',
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      type: 'text',
      isRead: true
    },
    {
      id: 'msg-2',
      senderId: 1,
      senderName: 'Sarah Johnson',
      senderRole: 'Cashier Lead',
      content: 'Thanks for the reminder! I\'ll make sure the front area is spotless.',
      timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
      type: 'text',
      isRead: true
    },
    {
      id: 'msg-3',
      senderId: 2,
      senderName: 'Mike Chen',
      senderRole: 'Kitchen Staff',
      content: 'Can someone help cover the morning prep? Running behind schedule.',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      type: 'text',
      isRead: false
    }
  ],
  'store2-general': [
    {
      id: 'msg-4',
      senderId: 6,
      senderName: 'David Kim',
      senderRole: 'Assistant Manager',
      content: 'Great job on today\'s sales numbers everyone!',
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      type: 'text',
      isRead: true
    }
  ],
  'managers': [
    {
      id: 'msg-5',
      senderId: 3,
      senderName: 'Emily Davis',
      senderRole: 'Store Manager',
      content: 'Schedule review meeting tomorrow at 2 PM',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      type: 'text',
      isRead: false
    }
  ]
};

export function ChatSystem({ currentUserId = 3, currentLocation = 'Store #1' }: { 
  currentUserId?: number; 
  currentLocation?: string; 
}) {
  const [channels, setChannels] = useState<ChatChannel[]>(initialChannels);
  const [messages, setMessages] = useState<{ [channelId: string]: ChatMessage[] }>(initialMessages);
  const [activeChannel, setActiveChannel] = useState<string>('store1-general');
  const [newMessage, setNewMessage] = useState('');
  const [isNewChannelOpen, setIsNewChannelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: employees.find(e => e.id === currentUserId)?.name || 'Current ',
      senderRole: employees.find(e => e.id === currentUserId)?.role || 'Employee',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: true
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), message]
    }));

    // Update last message in channel
    setChannels(prev => prev.map(channel => 
      channel.id === activeChannel 
        ? { ...channel, lastMessage: message }
        : channel
    ));

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getChannelMembers = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return [];
    
    return employees.filter(emp => channel.members.includes(emp.id));
  };

  const filteredChannels = channels.filter(channel => {
    if (searchQuery) {
      return channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const locationBasedChannels = filteredChannels.filter(channel => {
    if (channel.type === 'group' && channel.location) {
      return channel.location === currentLocation;
    }
    return true; // Include non-location-specific channels like managers
  });

  const activeChannelData = channels.find(c => c.id === activeChannel);
  const activeMessages = messages[activeChannel] || [];

  return (
    <div className="flex h-full">
      {/* Channels Sidebar */}
      <div className="w-80 border-r border-border bg-muted/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Team Chat</h2>
            <Dialog open={isNewChannelOpen} onOpenChange={setIsNewChannelOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Team Members</h4>
                    <div className="space-y-2">
                      {employees
                        .filter(emp => emp.location === currentLocation && emp.id !== currentUserId)
                        .map(employee => (
                          <div key={employee.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer">
                            <div className="relative">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {employee.avatar}
                                </span>
                              </div>
                              {employee.online && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">{employee.role}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="relative">
            <Circle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="channels..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {locationBasedChannels.map((channel) => (
              <div
                key={channel.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChannel === channel.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setActiveChannel(channel.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {channel.type === 'group' ? (
                        <Circle className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                      <span className="font-medium text-sm">{channel.name}</span>
                    </div>
                    {channel.isPinned && <Pin className="w-3 h-3" />}
                  </div>
                  {channel.unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs h-5 min-w-5 flex items-center justify-center">
                      {channel.unreadCount}
                    </Badge>
                  )}
                </div>
                
                {channel.lastMessage && (
                  <div className={`text-xs ${
                    activeChannel === channel.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    <span className="font-medium">{channel.lastMessage.senderName}: </span>
                    <span className="truncate">{channel.lastMessage.content}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChannelData && (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {activeChannelData.type === 'group' ? (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold">{activeChannelData.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getChannelMembers(activeChannel).slice(0, 3).map((member, idx) => (
                      <div key={member.id} className="relative">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {member.avatar}
                          </span>
                        </div>
                        {member.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
                        )}
                      </div>
                    ))}
                    {getChannelMembers(activeChannel).length > 3 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        +{getChannelMembers(activeChannel).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeMessages.map((message: any, index: number) => {
                  const prevMessage = activeMessages[index - 1];
                  const showDate = !prevMessage || 
                    new Date(message.timestamp).toDateString() !== new Date(prevMessage.timestamp).toDateString();
                  const isCurrentUser = message.senderId === currentUserId;

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-blue-600">
                            {employees.find(e => e.id === message.senderId)?.avatar || 'U'}
                          </span>
                        </div>
                        
                        <div className={`flex-1 max-w-xs md:max-w-md ${isCurrentUser ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{message.senderName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          
                          <div className={`p-3 rounded-lg ${
                            isCurrentUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="border-0 focus-visible:ring-0 flex-1"
                    />
                    <div className="flex items-center gap-1 pr-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}