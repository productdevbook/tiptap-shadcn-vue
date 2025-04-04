# Tiptap Shadcn Vue / Nuxt 🚀

This library aims to be a powerful and flexible editor within the Vue ecosystem, combining Tiptap with ShadCN for a seamless experience. ✨

👉 While it's not my main priority, I will provide active support.
👥 If you'd like to contribute, I can invite you to the project.
💡 Have an idea? Open an issue, and let's discuss!

Let's build an amazing editor for Vue together! 🎨🔥

![image](https://github.com/user-attachments/assets/5a959d3a-645e-44b2-80d5-b027628cba5e)


## Components

This package includes the following components:

- **TiptapEditor**: Main wrapper component
- **TiptapProvider**: Context provider for editor state
- **TiptapContent**: The editable content area
- **TiptapToolbar**: Rich formatting toolbar
- **TiptapTableToolbar**: Table manipulation tools
- **TiptapMobileToolbar**: Mobile-friendly toolbar
- **TiptapStatusBar**: Word count and editor status
- **TiptapTreeStructure**: Document structure navigator
- **TiptapTreeItem**: Individual document structure item
- **TiptapSlotPanel**: Component slot editor panel
- **TiptapKeyboardShortcuts**: Keyboard shortcut reference
- **TiptapIcon**: Icon wrapper for consistency

## Features

- Full-featured rich text editing
- Document structure navigation
- Drag and drop reordering
- Table support
- Component embedding
- Mobile toolbar
- Keyboard shortcuts
- Accessible design

## Installation

Make sure to install the required dependencies:

TODO: [CLI](https://github.com/productdevbook/tiptap-shadcn-vue/issues/1)

```bash
# Install Shadcn CLI - comming soon 
npx shadcn-vue@latest add "https://github.com/productdevbook/tiptap-shadcn-vue/component.json"
```

## Usage

```vue
<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  content: '<p>Hello World!</p>',
  extensions: [
    StarterKit,
    // Add other extensions as needed
  ],
})
</script>

<template>
  <TiptapProvider :editor="editor">
    <TiptapToolbar />
    <TiptapContent />
    <TiptapStatusBar show-word-count />
  </TiptapProvider>
</template>
```

## Shadcn-UI Components

This library uses the following shadcn-ui components:

- Button
- Separator
- Tooltip (TooltipContent, TooltipProvider, TooltipTrigger)
- Icon
- Dialog (DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle)
- Label
- Input
- Badge
- Textarea

Make sure these components are available in your project.

## Development

- pnpm install
- pnpm dev

This library is designed to be highly customizable. You can modify or extend any component to fit your specific needs:

### Component Structure

Components are located in the `components/tiptap` directory. Each component follows a consistent structure:

```
components/tiptap/
├── TiptapEditor.vue
├── TiptapContent.vue
├── TiptapToolbar.vue
└── ...
```

### Component Communication

Components communicate through the editor instance provided by the `TiptapProvider`. When making changes:

- Maintain the existing props and events to ensure compatibility
- Use the editor instance for commands and state management
- Emit appropriate events when modifying interactive elements

### Styling Guidelines

- Components use Tailwind CSS for styling
- Follow the ShadCN design patterns for consistency
- Use CSS variables defined in the theme for colors and spacing

### Testing Changes

After modifying components, test your changes thoroughly across different content types and editor states to ensure compatibility and stability.

## License

MIT