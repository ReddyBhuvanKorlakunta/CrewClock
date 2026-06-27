#!/bin/bash

# Fix specific Radix UI imports that were incorrectly replaced

# Alert Dialog
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-alert-dialog"/g' {} \;

# Aspect Ratio
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-aspect-ratio"/g' {} \;

# Avatar
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-avatar"/g' {} \;

# Checkbox
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-checkbox"/g' {} \;

# Collapsible
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-collapsible"/g' {} \;

# Context Menu
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-context-menu"/g' {} \;

# Dialog
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-dialog"/g' {} \;

# Dropdown Menu
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-dropdown-menu"/g' {} \;

# Hover Card
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-hover-card"/g' {} \;

# Label
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-label"/g' {} \;

# Menubar
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-menubar"/g' {} \;

# Navigation Menu
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-navigation-menu"/g' {} \;

# Popover
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-popover"/g' {} \;

# Progress
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-progress"/g' {} \;

# Radio Group
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-radio-group"/g' {} \;

# Scroll Area
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-scroll-area"/g' {} \;

# Select
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-select"/g' {} \;

# Separator
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-separator"/g' {} \;

# Sheet
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-dialog"/g' {} \;

# Slider
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-slider"/g' {} \;

# Switch
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-switch"/g' {} \;

# Tabs
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-tabs"/g' {} \;

# Toggle
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-toggle"/g' {} \;

# Toggle Group
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-toggle-group"/g' {} \;

# Tooltip
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-tooltip"/g' {} \;

# Fix Slot imports
find src -name "*.tsx" -exec sed -i '' 's/@radix-ui\/react-accordion"/@radix-ui\/react-slot"/g' {} \;

echo "Radix UI import fixes completed!"
