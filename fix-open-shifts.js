const fs = require('fs');

// Read the OpenShifts.tsx file
let content = fs.readFileSync('src/components/OpenShifts.tsx', 'utf8');

// Find the problematic area around line 538 and fix it
// The issue seems to be with the function structure
const lines = content.split('\n');

// Find where the return statement starts
const returnIndex = lines.findIndex(line => line.trim().startsWith('return ('));
if (returnIndex !== -1) {
  // Ensure the function has proper structure
  console.log('Found return statement at line:', returnIndex + 1);
  
  // Check if there are any obvious syntax issues
  let braceCount = 0;
  let parenCount = 0;
  
  for (let i = returnIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Count braces and parentheses
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
    }
    
    // If we find unbalanced parentheses or braces, there might be an issue
    if (i === lines.length - 1) {
      console.log('Final brace count:', braceCount, 'paren count:', parenCount);
      
      // If there are unbalanced parentheses, try to fix
      if (parenCount !== 0) {
        console.log('Unbalanced parentheses detected, attempting to fix...');
        // This might be the issue - let's check the function structure
      }
    }
  }
}

// Let's try a different approach - check if there's a missing closing brace
// Look for the function declaration
const functionStart = lines.findIndex(line => line.includes('export function OpenShifts'));
if (functionStart !== -1) {
  console.log('Found function at line:', functionStart + 1);
  
  // Look for the return statement
  const returnStart = lines.findIndex(line => line.trim().startsWith('return ('));
  if (returnStart !== -1) {
    console.log('Found return at line:', returnStart + 1);
    
    // Look for the end of the return statement
    const returnEnd = lines.findIndex((line, index) => 
      index > returnStart && line.trim() === ');'
    );
    
    if (returnEnd !== -1) {
      console.log('Found return end at line:', returnEnd + 1);
      
      // Check if there's a closing brace after the return
      const functionEnd = lines.findIndex((line, index) => 
        index > returnEnd && line.trim() === '}'
      );
      
      if (functionEnd !== -1) {
        console.log('Found function end at line:', functionEnd + 1);
      } else {
        console.log('Missing closing brace for function!');
        // Add the missing closing brace
        lines.push('}');
        content = lines.join('\n');
        fs.writeFileSync('src/components/OpenShifts.tsx', content);
        console.log('Fixed: Added missing closing brace');
      }
    }
  }
}

console.log('OpenShifts.tsx check complete');
