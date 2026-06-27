const fs = require('fs');
const path = require('path');

// Comprehensive list of all icons that might be used
const allIcons = [
  // Basic icons
  'AlertCircle', 'AlertTriangle', 'Bell', 'Circle', 'Eye', 'Info', 'Plus', 'Star', 'UserPlus',
  'Coffee', 'Heart', 'CheckCircle', 'XCircle', 'Edit', 'Save', 'Copy', 'Search', 'Home',
  
  // Navigation icons
  'ChevronUp', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ArrowRightLeft', 'ArrowLeft', 'ArrowRight',
  
  // Media icons
  'Play', 'Pause', 'Phone', 'Video', 'MessageSquare', 'Send', 'Paperclip', 'Smile',
  
  // Business icons
  'Calculator', 'TrendingUp', 'Gavel', 'Scale', 'CreditCard', 'DollarSign',
  
  // User icons
  'User', 'UserCheck', 'Users',
  
  // Time icons
  'Clock', 'Calendar', 'CalendarDays',
  
  // Status icons
  'Shield', 'Lock', 'Unlock', 'Settings', 'Cog',
  
  // More specific icons
  'MoreVertical', 'MoreHorizontal', 'Pin', 'Trash', 'Download', 'Upload',
  
  // Alert components (these are not icons but components)
  'Alert', 'AlertDescription'
];

// Function to add missing icon imports to a file
function addMissingIcons(content, filePath) {
  let fixed = content;
  
  // Find which icons are used in the file
  const usedIcons = allIcons.filter(icon => {
    if (icon === 'Alert' || icon === 'AlertDescription') {
      // These are components, not icons
      return false;
    }
    const regex = new RegExp(`<${icon}\\s`, 'g');
    return regex.test(content);
  });
  
  if (usedIcons.length === 0) return content;
  
  console.log(`${filePath}: Found ${usedIcons.length} icons: ${usedIcons.join(', ')}`);
  
  // Check if lucide-react import exists
  const lucideImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];?/;
  const lucideMatch = content.match(lucideImportRegex);
  
  if (lucideMatch) {
    // Add missing icons to existing import
    const existingIcons = lucideMatch[1].split(',').map(icon => icon.trim());
    const newIcons = usedIcons.filter(icon => !existingIcons.includes(icon));
    
    if (newIcons.length > 0) {
      const allIconsSorted = [...new Set([...existingIcons, ...newIcons])].sort();
      const updatedImport = `import { ${allIconsSorted.join(', ')} } from 'lucide-react';`;
      fixed = fixed.replace(lucideImportRegex, updatedImport);
      console.log(`  Added: ${newIcons.join(', ')}`);
    }
  } else {
    // Add new lucide-react import
    const importStatement = `import { ${usedIcons.sort().join(', ')} } from 'lucide-react';\n`;
    
    // Find the best place to insert the import (after other imports)
    const importLines = content.split('\n');
    let insertIndex = 0;
    
    for (let i = 0; i < importLines.length; i++) {
      if (importLines[i].startsWith('import ')) {
        insertIndex = i + 1;
      } else if (importLines[i].trim() === '' && insertIndex > 0) {
        break;
      }
    }
    
    importLines.splice(insertIndex, 0, importStatement.trim());
    fixed = importLines.join('\n');
    console.log(`  Added new import: ${usedIcons.join(', ')}`);
  }
  
  return fixed;
}

// Function to add missing Alert imports
function addMissingAlertImports(content, filePath) {
  let fixed = content;
  
  const hasAlert = content.includes('<Alert');
  const hasAlertDescription = content.includes('<AlertDescription');
  
  if (hasAlert || hasAlertDescription) {
    // Check if Alert import exists
    const alertImportRegex = /import\s*{\s*([^}]*Alert[^}]*)\s*}\s*from\s*['"]\.\/ui\/alert['"];?/;
    const alertMatch = content.match(alertImportRegex);
    
    const neededComponents = [];
    if (hasAlert) neededComponents.push('Alert');
    if (hasAlertDescription) neededComponents.push('AlertDescription');
    
    if (alertMatch) {
      // Check if we need to add any components
      const existingComponents = alertMatch[1].split(',').map(comp => comp.trim());
      const missingComponents = neededComponents.filter(comp => !existingComponents.includes(comp));
      
      if (missingComponents.length > 0) {
        const allComponents = [...existingComponents, ...missingComponents].sort();
        const updatedImport = `import { ${allComponents.join(', ')} } from './ui/alert';`;
        fixed = fixed.replace(alertImportRegex, updatedImport);
        console.log(`  Added Alert components: ${missingComponents.join(', ')}`);
      }
    } else {
      // Add new alert import
      const alertImport = `import { ${neededComponents.sort().join(', ')} } from './ui/alert';\n`;
      
      // Find the best place to insert the import
      const importLines = content.split('\n');
      let insertIndex = 0;
      
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].startsWith('import ')) {
          insertIndex = i + 1;
        } else if (importLines[i].trim() === '' && insertIndex > 0) {
          break;
        }
      }
      
      importLines.splice(insertIndex, 0, alertImport.trim());
      fixed = importLines.join('\n');
      console.log(`  Added new Alert import: ${neededComponents.join(', ')}`);
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
  'PayrollManagement.tsx',
  'PrivacyDashboard.tsx',
  'RoleBasedLayout.tsx',
  'SchedulingInterface.tsx',
  'Settings.tsx',
  'SwapRequests.tsx',
  'TimeTracking.tsx'
];

let fixedCount = 0;
console.log('🔧 Fixing missing icons across all components...\n');

files.forEach(file => {
  const filePath = path.join(componentDir, file);
  if (fs.existsSync(filePath)) {
    if (processFile(filePath)) {
      fixedCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files!`);
console.log('🚀 Application should now load with all icons visible!');
