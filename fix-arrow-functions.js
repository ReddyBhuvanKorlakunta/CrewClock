const fs = require('fs');
const path = require('path');

// Function to fix arrow function syntax in map functions
function fixArrowFunctions(content) {
  let fixed = content;
  
  // Fix map functions that are missing arrow syntax
  fixed = fixed.replace(/\.map\(\(([^)]*)\)\s*\)\s*=>\s*{/g, '.map(($1) => {');
  fixed = fixed.replace(/\.map\(\(([^)]*)\)\s*\)\s*=>\s*\(/g, '.map(($1) => (');
  
  // Fix specific patterns that were broken
  fixed = fixed.replace(/\.map\(\(([^)]*)\)\s*\)\s*=>\s*{/g, '.map(($1) => {');
  fixed = fixed.replace(/\.map\(\(([^)]*)\)\s*\)\s*=>\s*\(/g, '.map(($1) => (');
  
  // Fix useEffect and setInterval arrow functions
  fixed = fixed.replace(/useEffect\(\s*\(\s*:\s*any\s*\)\s*=>\s*{/g, 'useEffect(() => {');
  fixed = fixed.replace(/setInterval\(\s*\(\s*:\s*any\s*\)\s*=>\s*{/g, 'setInterval(() => {');
  
  // Fix onClick handlers
  fixed = fixed.replace(/onClick=\s*{\s*\(\s*:\s*any\s*\)\s*=>\s*{/g, 'onClick={() => {');
  
  // Fix reduce functions
  fixed = fixed.replace(/\.reduce\(\s*\(\s*sum,\s*entry\s*\)\s*\)\s*=>\s*sum\s*\+\s*entry\.totalHours,\s*0\s*\)/g, '.reduce((sum, entry) => sum + entry.totalHours, 0)');
  
  // Fix onCheckedChange handlers
  fixed = fixed.replace(/onCheckedChange=\s*{\s*\(\s*checked:\s*any\s*\)\s*\)\s*=>\s*{/g, 'onCheckedChange={(checked: any) => {');
  
  return fixed;
}

// Main function to process all files
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Apply fixes
    content = fixArrowFunctions(content);
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process all component files
const componentDir = path.join(__dirname, 'src', 'components');
const files = [
  'AdvancedAnalytics.tsx',
  'ChatSystem.tsx', 
  'DashboardOverview.tsx',
  'EmergencyCommunications.tsx',
  'EmployeeManagement.tsx',
  'EnhancedSchedulingInterface.tsx',
  'LeaveManagement.tsx',
  'OpenShifts.tsx',
  'PayrollManagement.tsx',
  'PrivacyDashboard.tsx',
  'RoleBasedLayout.tsx',
  'SchedulingInterface.tsx',
  'Settings.tsx',
  'SwapRequests.tsx',
  'TimeTracking.tsx'
];

let fixedCount = 0;
files.forEach(file => {
  const filePath = path.join(componentDir, file);
  if (fs.existsSync(filePath)) {
    if (processFile(filePath)) {
      fixedCount++;
    }
  }
});

console.log(`\nFixed ${fixedCount} files!`);
