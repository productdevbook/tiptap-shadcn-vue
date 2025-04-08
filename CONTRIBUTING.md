# Contributing to Tiptap Shadcn Vue

First off, thanks for taking the time to contribute! ❤️

This document provides guidelines and instructions for contributing to this project. Your contributions are essential in keeping Tiptap Shadcn Vue powerful, flexible, and user-friendly.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Development Setup](#development-setup)
  - [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Pull Requests](#pull-requests)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Messages](#commit-messages)
- [Coding Guidelines](#coding-guidelines)
  - [Vue Best Practices](#vue-best-practices)
  - [TypeScript](#typescript)
  - [Styling](#styling)
- [Component Development](#component-development)
  - [Structure](#structure)
  - [Component Communication](#component-communication)
  - [Testing Changes](#testing-changes)
- [Release Process](#release-process)
- [Community](#community)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Practice empathy and kindness
- Provide constructive feedback
- Focus on the project's best interest

## Getting Started

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/productdevbook/tiptap-shadcn-vue.git
   cd tiptap-shadcn-vue
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Build registry** (if working on components):
   ```bash
   pnpm build:registry
   ```

### Project Structure

- `app/`: Main Nuxt application
  - `components/tiptap-editor/tiptap/`: Core Tiptap editor components
  - `lib/`: Utility functions
  - `composables/`: Vue composables
  - `pages/`: Demo pages
- `registry/`: Component registry
- `scripts/`: Build and utility scripts
- `public/`: Static assets

## How to Contribute

### Reporting Bugs

Before submitting a bug report:

1. Check the [GitHub Issues](https://github.com/productdevbook/tiptap-shadcn-vue/issues) to avoid duplicates
2. Use the bug report template
3. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

When suggesting features:

1. Use the feature request template
2. Explain the problem your feature solves
3. Describe how your solution would work
4. Consider edge cases and accessibility
5. Include examples or mockups if possible

### Pull Requests

1. Create a fork of the repository
2. Create a branch in your fork for your changes
3. Make your changes following our coding guidelines
4. Test your changes thoroughly
5. Submit a pull request with a clear description
6. Respond to feedback and make changes as needed

## Development Workflow

### Branching Strategy

- `main`: Latest stable release
- `dev`: Development branch for next release
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/issue-description`

### Commit Messages

Follow conventional commits for consistent commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting changes
- `refactor:` for code refactoring
- `perf:` for performance improvements
- `test:` for adding or refactoring tests
- `chore:` for maintenance tasks

## Coding Guidelines

### Vue Best Practices

- Use Vue 3 Composition API
- Keep components focused on a single responsibility
- Use props and events for component communication
- Document components with JSDoc comments

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` type
- Export types when they might be reused

### Styling

- Use Tailwind CSS for styling
- Follow ShadCN design patterns
- Use CSS variables for theming
- Keep styling consistent with existing components

## Component Development

### Structure

Components should follow a consistent structure:

```
components/tiptap/
├── TiptapEditor.vue
├── TiptapContent.vue
├── TiptapToolbar.vue
└── ...
```

### Component Communication

Components communicate through the editor instance provided by the `TiptapProvider`. When making changes:

- Maintain the existing props and events for compatibility
- Use the editor instance for commands and state management
- Emit appropriate events when modifying interactive elements

### Testing Changes

After modifying components:

1. Test across different content types
2. Verify behavior in different editor states
3. Check mobile responsiveness
4. Test accessibility (keyboard navigation, screen readers)
5. Verify performance with large documents

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a release PR to the main branch
4. After approval, merge and tag the release
5. Update documentation if needed

## Community

- **Questions & Discussions**: Use [GitHub Discussions](https://github.com/productdevbook/tiptap-shadcn-vue/discussions)
- **Documentation**: Check the [README](https://github.com/productdevbook/tiptap-shadcn-vue#readme)
- **Contributing**: You're already here! 🎉

---

Thank you for contributing to Tiptap Shadcn Vue! 🚀
