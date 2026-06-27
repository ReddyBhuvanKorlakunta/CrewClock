const fs = require('fs');
const path = require('path');

// Function to add missing icon imports to a file
function addMissingIcons(content, filePath) {
  let fixed = content;
  
  // List of all icons that might be missing
  const allIcons = [
    'AlertCircle', 'AlertTriangle', 'Bell', 'Circle', 'Eye', 'Info', 'Plus', 'Star', 'UserPlus',
    'Coffee', 'Heart', 'CheckCircle', 'XCircle', 'Edit', 'Save', 'Copy', 'ChevronUp', 'ChevronDown',
    'ChevronLeft', 'ChevronRight', 'Play', 'Calculator', 'TrendingUp', 'Gavel', 'Scale',
    'ArrowRightLeft', 'MessageSquare', 'CreditCard', 'UserCheck', 'Alert', 'AlertDescription'
  ];
  
  // Find which icons are used in the file
  const usedIcons = allIcons.filter(icon => {
    const regex = new RegExp(`<${icon}\\s`, 'g');
    return regex.test(content);
  });
  
  if (usedIcons.length === 0) return content;
  
  // Check if lucide-react import exists
  const lucideImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?/;
  const lucideMatch = content.match(lucideImportRegex);
  
  if (lucideMatch) {
    // Add missing icons to existing import
    const existingIcons = lucideMatch[1].split(',').map(icon => icon.trim());
    const newIcons = usedIcons.filter(icon => !existingIcons.includes(icon));
    
    if (newIcons.length > 0) {
      const updatedImport = `import { ${[...existingIcons, ...newIcons].join(', ')} } from 'lucide-react';`;
      fixed = fixed.replace(lucideImportRegex, updatedImport);
    }
  } else {
    // Add new lucide-react import
    const importStatement = `import { ${usedIcons.join(', ')} } from 'lucide-react';\n`;
    
    // Find the best place to insert the import (after other imports)
    const lastImportRegex = /(import\s+[^;]+;)\s*$/m;
    const lastImportMatch = content.match(lastImportRegex);
    
    if (lastImportMatch) {
      fixed = content.replace(lastImportMatch[1], lastImportMatch[1] + '\n' + importStatement);
    } else {
      // Insert at the beginning if no imports found
      fixed = importStatement + content;
    }
  }
  
  return fixed;
}

// Function to add missing Alert imports
function addMissingAlertImports(content) {
  let fixed = content;
  
  if (content.includes('<Alert') && !content.includes("import { Alert")) {
    const alertImport = `import { Alert, AlertDescription } from './ui/alert';\n`;
    
    // Find the best place to insert the import
    const lastImportRegex = /(import\s+[^;]+;)\s*$/m;
    const lastImportMatch = content.match(lastImportRegex);
    
    if (lastImportMatch) {
      fixed = content.replace(lastImportMatch[1], lastImportMatch[1] + '\n' + alertImport);
    } else {
      fixed = alertImport + content;
    }
  }
  
  return fixed;
}

// Main function to process all files
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Apply fixes
    content = addMissingIcons(content, filePath);
    content = addMissingAlertImports(content, filePath);
    
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
