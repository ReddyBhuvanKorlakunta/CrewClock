const fs = require('fs');
const path = require('path');

// Function to fix duplicate imports and unused variables
function fixImportsAndUnused(content, filePath) {
  let fixed = content;
  
  // Remove duplicate React imports
  fixed = fixed.replace(/import React, { useState, useEffect, useRef } from 'react';\s*\n\s*import { useState } from 'react';/g, 'import React, { useState, useEffect, useRef } from \'react\';');
  
  // Remove unused React imports if React is not used
  if (!fixed.includes('<React.') && !fixed.includes('React.')) {
    fixed = fixed.replace(/import React, { useState, useEffect, useRef } from 'react';\s*\n/g, 'import { useState, useEffect, useRef } from \'react\';\n');
  }
  
  // Remove unused imports
  const unusedImports = [
    'Alert',
    'Avatar', 
    'User',
    'Plus',
    'Receipt',
    'formatHour',
    'calculateMatchScore',
    'selectedPeriod',
    'setSelectedPeriod'
  ];
  
  unusedImports.forEach(importName => {
    // Remove from import statements
    const importRegex = new RegExp(`import\\s*{[^}]*\\b${importName}\\b[^}]*}\\s*from\\s*['"][^'"]+['"];?\\s*\\n?`, 'g');
    fixed = fixed.replace(importRegex, '');
    
    // Remove standalone import lines
    const standaloneRegex = new RegExp(`^\\s*import\\s*{\\s*${importName}\\s*}\\s*from\\s*['"][^'"]+['"];?\\s*\\n?`, 'gm');
    fixed = fixed.replace(standaloneRegex, '');
  });
  
  // Fix duplicate useState imports
  fixed = fixed.replace(/import { useState } from 'react';\s*\n\s*import { useState } from 'react';/g, 'import { useState } from \'react\';');
  
  // Remove unused variables
  const unusedVars = [
    'idx',
    'empIndex', 
    'index',
    'entry',
    'doc',
    'n'
  ];
  
  unusedVars.forEach(varName => {
    // Remove unused parameters in map functions
    fixed = fixed.replace(new RegExp(`\\([^)]*\\b${varName}\\b[^)]*\\)\\s*=>`, 'g'), (match) => {
      const params = match.slice(1, -3).split(',').map(p => p.trim()).filter(p => p !== varName);
      return params.length > 0 ? `(${params.join(', ')}) =>` : '() =>';
    });
  });
  
  return fixed;
}

// Function to fix type annotations
function fixTypeAnnotations(content) {
  let fixed = content;
  
  // Fix function parameter types
  fixed = fixed.replace(/const\s+(\w+)\s*=\s*\(\s*{\s*([^}]+)\s*}\s*\)\s*=>\s*{/g, (match, funcName, params) => {
    if (params.includes(':')) return match; // Already has types
    
    const typedParams = params.split(',').map(param => {
      const trimmed = param.trim();
      if (trimmed === '') return trimmed;
      if (trimmed.includes(':')) return trimmed; // Already has type
      return `${trimmed}: any`;
    }).join(', ');
    
    return `const ${funcName} = ({ ${typedParams} }) => {`;
  });
  
  // Fix arrow function parameters in JSX
  fixed = fixed.replace(/\(([^)]*)\)\s*=>\s*{/g, (match, params) => {
    if (params.includes(':')) return match; // Already has types
    
    const typedParams = params.split(',').map(param => {
      const trimmed = param.trim();
      if (trimmed === '') return trimmed;
      if (trimmed.includes(':')) return trimmed; // Already has type
      if (trimmed === 'n' || trimmed === 'idx' || trimmed === 'index' || trimmed === 'empIndex') {
        return `${trimmed}: number`;
      }
      if (trimmed === 'skill' || trimmed === 'employee' || trimmed === 'member' || trimmed === 'doc') {
        return `${trimmed}: any`;
      }
      if (trimmed === 'priority' || trimmed === 'status' || trimmed === 'score' || trimmed === 'category') {
        return `${trimmed}: string`;
      }
      return `${trimmed}: any`;
    }).join(', ');
    
    return `(${typedParams}) => {`;
  });
  
  return fixed;
}

// Function to fix specific component issues
function fixComponentIssues(content, filePath) {
  let fixed = content;
  
  // Fix EnhancedSchedulingInterface TimeSlot issues
  if (filePath.includes('EnhancedSchedulingInterface.tsx')) {
    // Fix TimeSlot type issues
    fixed = fixed.replace(/startTime:\s*TimeSlot;/, 'startTime: { hour: number; minute: number; period: "AM" | "PM" };');
    fixed = fixed.replace(/endTime:\s*TimeSlot;/, 'endTime: { hour: number; minute: number; period: "AM" | "PM" };');
    
    // Fix TimePicker component parameter destructuring
    fixed = fixed.replace(/>\s*=\s*\(\s*{\s*value:\s*any,\s*onChange:\s*any,\s*label\s*}\s*:\s*any\s*\)\s*=>\s*{/g, '> = ({ value, onChange, label }: { value: any; onChange: any; label: string }) => {');
  }
  
  // Fix RoleBasedLayout interface issues
  if (filePath.includes('RoleBasedLayout.tsx')) {
    // Fix SidebarItem interface mismatch
    fixed = fixed.replace(/interface SidebarItem\s*{[\s\S]*?}/g, `interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  requiredPermissions: string[];
}`);
  }
  
  // Fix form.tsx ref issue
  if (filePath.includes('form.tsx')) {
    fixed = fixed.replace(/React\.forwardRef<HTMLElement/, 'React.forwardRef<HTMLLabelElement');
  }
  
  return fixed;
}

// Main function to process all files
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Apply fixes
    content = fixImportsAndUnused(content, filePath);
    content = fixTypeAnnotations(content);
    content = fixComponentIssues(content, filePath);
    
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

// Also fix the form.tsx file
const formPath = path.join(componentDir, 'ui', 'form.tsx');
if (fs.existsSync(formPath)) {
  if (processFile(formPath)) {
    fixedCount++;
  }
}

console.log(`\nFixed ${fixedCount} files!`);
