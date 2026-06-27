import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, AlertTriangle, Award, CheckCircle, Circle, Eye, Info, Scale, TrendingUp, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AdvancedAnalytics() {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Fairness Algorithm Data
  const fairnessMetrics = {
    overallScore: 87,
    weekendShifts: { variance: 12, target: 10 },
    closingShifts: { variance: 15, target: 10 },
    totalHours: { variance: 8, target: 15 },
    shiftTypes: { variance: 20, target: 25 }
  };

  const fairnessData = [
    { employee: 'Sarah Johnson', weekendShifts: 6, closingShifts: 4, totalHours: 38, fairnessScore: 92 },
    { employee: 'Mike Chen', weekendShifts: 4, closingShifts: 6, totalHours: 40, fairnessScore: 88 },
    { employee: 'Emily Davis', weekendShifts: 8, closingShifts: 2, totalHours: 45, fairnessScore: 75 },
    { employee: 'Alex Rodriguez', weekendShifts: 5, closingShifts: 5, totalHours: 36, fairnessScore: 91 },
    { employee: 'Lisa Thompson', weekendShifts: 3, closingShifts: 3, totalHours: 28, fairnessScore: 85 }
  ];

  // Compliance Data
  const complianceMetrics = {
    overallScore: 94,
    issues: [
      { type: 'Overtime Violations', count: 2, severity: 'high' },
      { type: 'Break Policy', count: 1, severity: 'medium' },
      { type: 'Clopening Prevention', count: 0, severity: 'low' },
      { type: 'Meal Penalties', count: 3, severity: 'high' }
    ]
  };

  const laborCostData = [
    { week: 'Week 1', budgeted: 12000, actual: 11750, variance: -250 },
    { week: 'Week 2', budgeted: 11500, actual: 12200, variance: 700 },
    { week: 'Week 3', budgeted: 12800, actual: 12400, variance: -400 },
    { week: 'Week 4', budgeted: 11200, actual: 11900, variance: 700 }
  ];

  const overtimeData = [
    { month: 'Jan', regular: 1280, overtime: 120, total: 1400 },
    { month: 'Feb', regular: 1150, overtime: 95, total: 1245 },
    { month: 'Mar', regular: 1340, overtime: 160, total: 1500 },
    { month: 'Apr', regular: 1220, overtime: 80, total: 1300 }
  ];

  const skillDistribution = [
    { name: 'Cashier', value: 35, count: 7 },
    { name: 'Kitchen', value: 25, count: 5 },
    { name: 'Management', value: 15, count: 3 },
    { name: 'Delivery', value: 25, count: 5 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const getFairnessColor = (score: any) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getComplianceColor = (severity: any) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Advanced Analytics</h1>
          <p className="text-muted-foreground">Fairness algorithms, compliance tracking, and performance insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="store1">Store #1</SelectItem>
              <SelectItem value="store2">Store #2</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fairness Score</p>
                <p className="text-2xl font-semibold">{fairnessMetrics.overallScore}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Progress value={fairnessMetrics.overallScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-semibold">{complianceMetrics.overallScore}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Progress value={complianceMetrics.overallScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget Variance</p>
                <p className="text-2xl font-semibold">+2.1%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">$750 over budget this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Issues</p>
                <p className="text-2xl font-semibold">{complianceMetrics.issues.filter(i => i.count > 0).length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {complianceMetrics.issues.reduce((sum, issue) => sum + issue.count, 0)} total incidents
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fairness" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="fairness">Fairness Engine</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="labor-costs">Labor Costs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="fairness" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Fairness Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Weekend Shift Distribution</span>
                    <div className="flex items-center gap-2">
                      <Progress value={100 - (fairnessMetrics.weekendShifts.variance / fairnessMetrics.weekendShifts.target) * 100} className="w-20" />
                      <Badge variant={fairnessMetrics.weekendShifts.variance <= fairnessMetrics.weekendShifts.target ? "default" : "destructive"}>
                        {fairnessMetrics.weekendShifts.variance}% variance
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Closing Shift Distribution</span>
                    <div className="flex items-center gap-2">
                      <Progress value={100 - (fairnessMetrics.closingShifts.variance / fairnessMetrics.closingShifts.target) * 100} className="w-20" />
                      <Badge variant={fairnessMetrics.closingShifts.variance <= fairnessMetrics.closingShifts.target ? "default" : "destructive"}>
                        {fairnessMetrics.closingShifts.variance}% variance
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Total Hours Distribution</span>
                    <div className="flex items-center gap-2">
                      <Progress value={100 - (fairnessMetrics.totalHours.variance / fairnessMetrics.totalHours.target) * 100} className="w-20" />
                      <Badge variant={fairnessMetrics.totalHours.variance <= fairnessMetrics.totalHours.target ? "default" : "destructive"}>
                        {fairnessMetrics.totalHours.variance}% variance
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Fairness Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fairnessData.map((employee, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {employee.employee.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium">{employee.employee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <p className="font-medium">{employee.fairnessScore}</p>
                        </div>
                        <Badge className={getFairnessColor(employee.fairnessScore)}>
                          {employee.fairnessScore >= 90 ? 'Excellent' :
                           employee.fairnessScore >= 80 ? 'Good' : 'Needs Attention'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="w-5 h-5" />
                  Compliance Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceMetrics.issues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">{issue.type}</p>
                        <p className="text-sm text-muted-foreground">{issue.count} incidents this month</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getComplianceColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        {issue.count > 0 && (
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overtime Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={overtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="regular" stackId="a" fill="#8884d8" />
                    <Bar dataKey="overtime" stackId="a" fill="#ff7c7c" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="labor-costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={laborCostData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Line type="monotone" dataKey="budgeted" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={skillDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {skillDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Sarah Johnson', 'Alex Rodriguez', 'Mike Chen'].map((name, index) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-yellow-600">{index + 1}</span>
                      </div>
                      <span className="font-medium">{name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Attendance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">96.2%</div>
                  <Progress value={96.2} className="mb-2" />
                  <p className="text-sm text-muted-foreground">Above industry average</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="w-5 h-5" />
                  Goal Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Punctuality</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Schedule Adherence</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Break Compliance</span>
                      <span>98%</span>
                    </div>
                    <Progress value={98} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="w-5 h-5" />
                  Predictive Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-800">High Demand Period</p>
                    <p className="text-sm text-blue-600">Weekend shift requests expected to increase by 15% next month</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800">Staffing Alert</p>
                    <p className="text-sm text-yellow-600">Store #2 may need additional coverage during peak hours</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-800">Cost Optimization</p>
                    <p className="text-sm text-green-600">Current scheduling could save $340 in overtime costs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Redistribute closing shifts</p>
                      <p className="text-sm text-muted-foreground">Emily Davis has 40% more closing shifts than team average</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Schedule skill training</p>
                      <p className="text-sm text-muted-foreground">3 employees need kitchen certification renewal within 30 days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Optimize break schedules</p>
                      <p className="text-sm text-muted-foreground">Adjust break timing to reduce coverage gaps</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}