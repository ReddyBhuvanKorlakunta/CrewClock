import { useState, useEffect, useRef } from 'react';
import { AlertCircle, Circle, Eye, Info, CheckCircle, XCircle, Play, Calculator, TrendingUp, Gavel, Scale } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

export function PayrollManagement() {
  const [isRunPayrollOpen, setIsRunPayrollOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('current');

  const payPeriods = [
    {
      id: 'current',
      startDate: '2024-02-05',
      endDate: '2024-02-18',
      status: 'open',
      totalHours: 324.5,
      totalRegularHours: 280.0,
      totalOvertimeHours: 44.5,
      totalCost: 8642.25,
      employees: 5,
      timecardsPending: 2,
      timecardsApproved: 12,
      description: 'Current Pay Period'
    },
    {
      id: 'last',
      startDate: '2024-01-22',
      endDate: '2024-02-04',
      status: 'closed',
      totalHours: 312.0,
      totalRegularHours: 268.0,
      totalOvertimeHours: 44.0,
      totalCost: 8234.50,
      employees: 5,
      timecardsPending: 0,
      timecardsApproved: 15,
      payrollRanAt: '2024-02-06T10:00:00',
      description: 'Previous Pay Period'
    },
    {
      id: 'next',
      startDate: '2024-02-19',
      endDate: '2024-03-03',
      status: 'future',
      totalHours: 0,
      totalRegularHours: 0,
      totalOvertimeHours: 0,
      totalCost: 0,
      employees: 5,
      timecardsPending: 0,
      timecardsApproved: 0,
      description: 'Next Pay Period'
    }
  ];

  const paySlips = [
    {
      id: 1,
      employeeName: 'Sarah Johnson',
      employeeId: 1,
      periodId: 'last',
      regularHours: 40.0,
      overtimeHours: 5.0,
      totalHours: 45.0,
      regularRate: 15.50,
      overtimeRate: 23.25,
      grossPay: 736.25,
      deductions: 147.25,
      netPay: 589.00,
      generatedAt: '2024-02-06T10:00:00',
      pdfUrl: '/payslips/sarah_johnson_20240206.pdf'
    },
    {
      id: 2,
      employeeName: 'Mike Chen',
      employeeId: 2,
      periodId: 'last',
      regularHours: 40.0,
      overtimeHours: 8.0,
      totalHours: 48.0,
      regularRate: 17.00,
      overtimeRate: 25.50,
      grossPay: 884.00,
      deductions: 176.80,
      netPay: 707.20,
      generatedAt: '2024-02-06T10:00:00',
      pdfUrl: '/payslips/mike_chen_20240206.pdf'
    },
    {
      id: 3,
      employeeName: 'Emily Davis',
      employeeId: 3,
      periodId: 'last',
      regularHours: 50.0,
      overtimeHours: 10.0,
      totalHours: 60.0,
      regularRate: 22.00,
      overtimeRate: 33.00,
      grossPay: 1430.00,
      deductions: 286.00,
      netPay: 1144.00,
      generatedAt: '2024-02-06T10:00:00',
      pdfUrl: '/payslips/emily_davis_20240206.pdf'
    }
  ];

  const laborCosts = [
    { department: 'Cashiers', regularHours: 120, overtimeHours: 15, cost: 2847.50 },
    { department: 'Kitchen Staff', regularHours: 80, overtimeHours: 16, cost: 2104.00 },
    { department: 'Management', regularHours: 100, overtimeHours: 20, cost: 2860.00 },
    { department: 'Delivery', regularHours: 48, overtimeHours: 8, cost: 1024.00 }
  ];

  const complianceData = {
    jurisdictions: [
      {
        location: 'California - Store #1',
        state: 'CA',
        minWage: 16.00,
        overtimeRules: 'Daily: >8hrs, Weekly: >40hrs',
        mealPenalties: 3,
        restBreakViolations: 0,
        lastAudit: '2024-01-15',
        complianceScore: 92
      },
      {
        location: 'Nevada - Store #2', 
        state: 'NV',
        minWage: 12.00,
        overtimeRules: 'Weekly: >40hrs only',
        mealPenalties: 0,
        restBreakViolations: 1,
        lastAudit: '2024-01-20',
        complianceScore: 95
      }
    ],
    violations: [
      {
        type: 'Meal Period Violation',
        location: 'Store #1',
        employee: 'Mike Chen',
        date: '2024-01-12',
        description: 'Missed 30-minute meal break on 8+ hour shift',
        penalty: 16.00,
        status: 'resolved'
      },
      {
        type: 'Overtime Calculation',
        location: 'Store #1', 
        employee: 'Sarah Johnson',
        date: '2024-01-10',
        description: 'California daily overtime (>8hrs) not calculated',
        penalty: 24.75,
        status: 'pending'
      }
    ],
    auditReadiness: {
      score: 94,
      missingDocuments: 2,
      outdatedPolicies: 1,
      trainingRecords: 'current',
      lastFullAudit: '2023-08-15'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'future': return 'bg-gray-100 text-gray-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Circle className='w-4 h-4' />;
      case 'closed': return <Circle className='w-4 h-4' />;
      case 'future': return <Circle className='w-4 h-4' />;
      case 'processing': return <Play className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const currentPeriod = payPeriods.find(p => p.id === 'current')!;
  const lastPeriod = payPeriods.find(p => p.id === 'last')!;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Payroll Management</h1>
          <p className="text-muted-foreground">Manage pay periods, run payroll, and generate pay slips</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isRunPayrollOpen} onOpenChange={setIsRunPayrollOpen}>
            <DialogTrigger asChild>
              <Button disabled={currentPeriod.timecardsPending > 0}>
                <Play className="w-4 h-4 mr-2" />
                Run Payroll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Run Payroll</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-medium">Payroll Summary</h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>Period: {currentPeriod.startDate} to {currentPeriod.endDate}</p>
                    <p>Total Hours: {currentPeriod.totalHours}</p>
                    <p>Total Cost: ${currentPeriod.totalCost.toLocaleString()}</p>
                    <p>Employees: {currentPeriod.employees}</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="payrollProvider">Export Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payroll provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quickbooks">QuickBooks</SelectItem>
                      <SelectItem value="gusto">Gusto</SelectItem>
                      <SelectItem value="adp">ADP</SelectItem>
                      <SelectItem value="csv">Generic CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Generate Payroll</Button>
                  <Button variant="outline" onClick={() => setIsRunPayrollOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button variant="outline">
            <Circle className="w-4 h-4 mr-2" />
            Payroll </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Period Cost</p>
                <p className="text-2xl font-semibold">${currentPeriod.totalCost.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-semibold">{currentPeriod.totalHours}</p>
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
                <p className="text-sm text-muted-foreground">Overtime Hours</p>
                <p className="text-2xl font-semibold">{currentPeriod.totalOvertimeHours}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Timecards</p>
                <p className="text-2xl font-semibold">{currentPeriod.timecardsPending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Period</TabsTrigger>
          <TabsTrigger value="periods">Pay Periods</TabsTrigger>
          <TabsTrigger value="payslips">Pay Slips</TabsTrigger>
          <TabsTrigger value="reports">Labor Cost Reports</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-5 h-5" />
                Current Pay Period Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Period Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium">{new Date(currentPeriod.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span className="font-medium">{new Date(currentPeriod.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={`${getStatusColor(currentPeriod.status)} border-0`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(currentPeriod.status)}
                            <span className="capitalize">{currentPeriod.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Timecard Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Approved Timecards</span>
                        <span className="font-medium">{currentPeriod.timecardsApproved}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pending Approval</span>
                        <span className="font-medium text-yellow-600">{currentPeriod.timecardsPending}</span>
                      </div>
                      <Progress 
                        value={(currentPeriod.timecardsApproved / (currentPeriod.timecardsApproved + currentPeriod.timecardsPending)) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Hours Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Regular Hours:</span>
                        <span className="font-medium">{currentPeriod.totalRegularHours.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Overtime Hours:</span>
                        <span className="font-medium">{currentPeriod.totalOvertimeHours.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Hours:</span>
                        <span className="font-medium">{currentPeriod.totalHours.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Cost Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Labor Cost:</span>
                        <span className="font-medium">${currentPeriod.totalCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average per Hour:</span>
                        <span className="font-medium">${(currentPeriod.totalCost / currentPeriod.totalHours).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employees:</span>
                        <span className="font-medium">{currentPeriod.employees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {currentPeriod.timecardsPending > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-medium">Action Required</h3>
                  </div>
                  <p className="text-sm text-yellow-800 mb-3">
                    You have {currentPeriod.timecardsPending} pending timecard{currentPeriod.timecardsPending !== 1 ? 's' : ''} that need approval before payroll can be run.
                  </p>
                  <Button size="sm" variant="outline">
                    Review Pending Timecards
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="periods" className="space-y-6">
          <div className="space-y-4">
            {payPeriods.map((period) => (
              <Card key={period.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{period.description}</h3>
                        <Badge className={`${getStatusColor(period.status)} border-0`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(period.status)}
                            <span className="capitalize">{period.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-semibold">${period.totalCost.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{period.totalHours} hours</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Regular Hours</p>
                      <p className="font-medium">{period.totalRegularHours.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Overtime Hours</p>
                      <p className="font-medium">{period.totalOvertimeHours.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Employees</p>
                      <p className="font-medium">{period.employees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg per Employee</p>
                      <p className="font-medium">${(period.totalCost / period.employees).toLocaleString()}</p>
                    </div>
                  </div>

                  {period.payrollRanAt && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                      <Circle className="w-4 h-4" />
                      <span>Payroll completed on {new Date(period.payrollRanAt).toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payslips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-5 h-5" />
                Employee Pay Slips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paySlips.map((payslip) => (
                  <div key={payslip.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600">
                            {payslip.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{payslip.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            Period ending {new Date(lastPeriod.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold">${payslip.netPay.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Net Pay</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Regular Hours</p>
                        <p className="font-medium">{payslip.regularHours.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Overtime Hours</p>
                        <p className="font-medium">{payslip.overtimeHours.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gross Pay</p>
                        <p className="font-medium">${payslip.grossPay.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deductions</p>
                        <p className="font-medium">${payslip.deductions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Hours</p>
                        <p className="font-medium">{payslip.totalHours.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Circle className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Labor Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {laborCosts.map((dept, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{dept.department}</h3>
                      <p className="text-lg font-semibold">${dept.cost.toLocaleString()}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Regular Hours</p>
                        <p className="font-medium">{dept.regularHours}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Overtime Hours</p>
                        <p className="font-medium">{dept.overtimeHours}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Hours</p>
                        <p className="font-medium">{dept.regularHours + dept.overtimeHours}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Hours Distribution</span>
                        <span>{((dept.overtimeHours / (dept.regularHours + dept.overtimeHours)) * 100).toFixed(1)}% OT</span>
                      </div>
                      <Progress 
                        value={(dept.overtimeHours / (dept.regularHours + dept.overtimeHours)) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                    <p className="text-2xl font-semibold">{complianceData.auditReadiness.score}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <Progress value={complianceData.auditReadiness.score} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Violations</p>
                    <p className="text-2xl font-semibold">{complianceData.violations.filter(v => v.status === 'pending').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  ${complianceData.violations.filter(v => v.status === 'pending').reduce((sum, v) => sum + v.penalty, 0).toFixed(2)} in penalties
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Audit</p>
                    <p className="text-2xl font-semibold">6mo</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Next audit recommended</p>
              </CardContent>
            </Card>
          </div>

          {/* Multi-Jurisdiction Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-5 h-5" />
                Multi-Jurisdiction Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.jurisdictions.map((jurisdiction, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{jurisdiction.location}</h3>
                          <p className="text-sm text-muted-foreground">State: {jurisdiction.state}</p>
                        </div>
                      </div>
                      <Badge className={jurisdiction.complianceScore >= 95 ? 'bg-green-100 text-green-800' : 
                                      jurisdiction.complianceScore >= 90 ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}>
                        {jurisdiction.complianceScore}% Compliant
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Minimum Wage</p>
                        <p className="font-medium">${jurisdiction.minWage.toFixed(2)}/hr</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Overtime Rules</p>
                        <p className="font-medium">{jurisdiction.overtimeRules}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Meal Penalties</p>
                        <p className="font-medium text-red-600">{jurisdiction.mealPenalties} this period</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rest Break Issues</p>
                        <p className="font-medium">{jurisdiction.restBreakViolations}</p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-muted/50 rounded">
                      <p className="text-sm">
                        <strong>Last Audit:</strong> {new Date(jurisdiction.lastAudit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Violations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-5 h-5" />
                Compliance Violations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.violations.map((violation, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-red-800">{violation.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {violation.employee} • {violation.location} • {new Date(violation.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">${violation.penalty.toFixed(2)}</p>
                        <Badge variant={violation.status === 'resolved' ? 'default' : 'destructive'}>
                          {violation.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-3 rounded">
                      <p className="text-sm text-red-800">{violation.description}</p>
                    </div>

                    {violation.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="destructive">Mark Resolved</Button>
                        <Button size="sm" variant="outline">Add to Payroll</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audit Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Audit Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Compliance Checklist</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Time tracking records complete</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Wage calculations verified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Break period documentation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">2 missing employee handbooks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">1 outdated safety policy</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Recommended Actions</h3>
                  <div className="space-y-3">
                    <Alert>
                      <Circle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>High Priority:</strong> Resolve pending meal penalty violations in California location.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <Circle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Documentation:</strong> Update employee handbooks with current wage rates.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <Circle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Schedule:</strong> Plan compliance audit within next 30 days.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button>
                  <Circle className="w-4 h-4 mr-2" />
                  Export Compliance Report
                </Button>
                <Button variant="outline">
                  <Circle className="w-4 h-4 mr-2" />
                  Configure Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}