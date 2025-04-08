<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { computed, onMounted, ref, watch } from 'vue'
import { provideTiptapContext } from '.'

const props = defineProps<{
  editor: Editor | undefined
}>()

// State management for the Tiptap context
const sidebarVisible = defineModel('sidebarVisible', { default: true })
const selectedNodeId = ref('')
const editorNodes = ref([])
const content = ref('')

// Update editor nodes when content changes
function updateEditorNodes() {
  if (!props.editor)
    return

  // Clear the nodes array when document is empty
  if (props.editor.isEmpty) {
    editorNodes.value = []
    return
  }

  const nodes = []

  // Process all nodes in the document
  props.editor.state.doc.descendants((node, pos) => {
    // Skip text nodes and inline nodes
    if (node.isText)
      return

    // Generate a unique ID for the node
    let nodeId
    let nodeName
    let nodeIcon
    let nodeContent = ''
    let depth = 0

    if (node.type.name === 'component') {
      // Handle component nodes specially
      nodeId = node.attrs.id || `component-${pos}`
      nodeName = node.attrs.componentName
      nodeIcon = 'mdi:puzzle-outline' // Default component icon
      depth = getNodeDepth(pos)
    }
    else {
      // Handle other node types
      nodeId = `${node.type.name}-${pos}`

      // Get a display name for the node type
      switch (node.type.name) {
        case 'paragraph':
          nodeName = 'Paragraph'
          nodeIcon = 'mdi:format-paragraph'
          nodeContent = getTextContentPreview(node)
          depth = getNodeDepth(pos)
          break
        case 'heading':
          const level = node.attrs.level
          nodeName = `Heading ${level}`
          nodeIcon = `mdi:format-header-${level}`
          nodeContent = getTextContentPreview(node)
          depth = getNodeDepth(pos)
          break
        case 'bulletList':
          nodeName = 'Bullet List'
          nodeIcon = 'mdi:format-list-bulleted'
          depth = getNodeDepth(pos)
          break
        case 'orderedList':
          nodeName = 'Numbered List'
          nodeIcon = 'mdi:format-list-numbered'
          depth = getNodeDepth(pos)
          break
        case 'listItem':
          nodeName = 'List Item'
          nodeIcon = 'mdi:minus-circle-outline'
          nodeContent = getTextContentPreview(node)
          depth = getNodeDepth(pos) + 1 // Indent list items
          break
        case 'blockquote':
          nodeName = 'Quote'
          nodeIcon = 'mdi:format-quote-close'
          nodeContent = getTextContentPreview(node)
          depth = getNodeDepth(pos)
          break
        case 'horizontalRule':
          nodeName = 'Divider'
          nodeIcon = 'mdi:minus'
          depth = getNodeDepth(pos)
          break
        case 'image':
          nodeName = 'Image'
          nodeIcon = 'mdi:image'
          depth = getNodeDepth(pos)
          break
        case 'codeBlock':
          nodeName = 'Code Block'
          nodeIcon = 'mdi:code-tags'
          depth = getNodeDepth(pos)
          break
        default:
          nodeName = node.type.name
          nodeIcon = 'mdi:code-braces'
          depth = getNodeDepth(pos)
      }
    }

    // Only add block-level nodes to the outline
    if (!node.isInline) {
      nodes.push({
        id: nodeId,
        name: nodeName,
        type: node.type.name,
        icon: nodeIcon,
        content: nodeContent,
        position: pos,
        nodeSize: node.nodeSize,
        selected: nodeId === selectedNodeId.value,
        depth,
      })
    }
  })

  editorNodes.value = nodes
}

// Get the text content of a node (for previews)
function getTextContentPreview(node) {
  let text = ''

  node.descendants((child) => {
    if (child.isText) {
      text += child.text
    }
  })

  // Limit the preview length
  if (text.length > 25) {
    text = `${text.substring(0, 25)}...`
  }

  return text || 'Empty'
}

// Get the depth level of a node based on its position
function getNodeDepth(pos) {
  if (!props.editor)
    return 0

  let depth = 0
  const node = props.editor.state.doc.resolve(pos)

  for (let i = 1; i <= node.depth; i++) {
    const parent = node.node(i)
    if (!parent.isText && !parent.isInline) {
      depth++
    }
  }

  return depth
}

// Select node by id
function selectNode(id) {
  if (!props.editor)
    return

  selectedNodeId.value = id

  // Find the node in the document and set the selection to it
  const nodePos = findNodePositionById(id)
  if (nodePos !== null) {
    const { from, to } = nodePos
    props.editor.chain().focus().setNodeSelection(from).run()
  }
}

// Find node position by ID
function findNodePositionById(id) {
  if (!props.editor)
    return null

  let result = null

  props.editor.state.doc.descendants((node, pos) => {
    if (node.attrs.id === id || `${node.type.name}-${pos}` === id) {
      result = { from: pos, to: pos + node.nodeSize }
      return false // Stop traversal
    }
  })

  return result
}

// Delete a node by id
function deleteNode(id) {
  if (!props.editor)
    return

  // Find the node position in the document
  const nodePos = findNodePositionById(id)
  if (nodePos === null) {
    return
  }

  try {
    // Create a transaction to delete the node
    const tr = props.editor.state.tr
    const { from, to } = nodePos

    // Delete the node from the document
    tr.delete(from, to)

    // Apply the transaction
    props.editor.view.dispatch(tr)

    // Update nodes
    updateEditorNodes()

    // Update selectedNodeId if it was the deleted node
    if (selectedNodeId.value === id) {
      selectedNodeId.value = ''
    }

    return true
  }
  catch (error) {
    console.error('Error deleting node:', error)
    return false
  }
}

// Duplicate a node by id
function duplicateNode(id) {
  if (!props.editor)
    return

  // Find the node position in the document
  const nodePos = findNodePositionById(id)
  if (nodePos === null) {
    return false
  }

  try {
    const { from, to } = nodePos
    const slice = props.editor.state.doc.slice(from, to)

    // Create a transaction to insert the copy after the original
    const tr = props.editor.state.tr
    tr.insert(to, slice.content)

    // Apply the transaction
    props.editor.view.dispatch(tr)

    // Update nodes
    updateEditorNodes()

    return true
  }
  catch (error) {
    console.error('Error duplicating node:', error)
    return false
  }
}

// Reorder nodes in the document
function reorderNodes({ sourceId, targetId, position }: { sourceId: string, targetId: string, position: 'before' | 'after' }) {
  if (!props.editor)
    return false

  // Find the source and target node positions
  const sourcePos = findNodePositionById(sourceId)
  const targetPos = findNodePositionById(targetId)

  if (!sourcePos || !targetPos) {
    console.error('Could not find source or target node')
    return false
  }

  try {
    // Save the source node content as a slice
    const sourceNode = props.editor.state.doc.slice(sourcePos.from, sourcePos.to)

    // Create a transaction that first removes the source node
    let tr = props.editor.state.tr.delete(sourcePos.from, sourcePos.to)

    // Calculate insertion position based on whether it's before or after the target
    // Need to adjust position if target is after source (since deleting source shifts positions)
    let insertPos = position === 'before' ? targetPos.from : targetPos.to
    if (sourcePos.from < targetPos.from) {
      // If source was before target, adjust the target position to account for removed content
      insertPos -= (sourcePos.to - sourcePos.from)
    }

    // Insert the saved slice at the calculated position
    tr = tr.insert(insertPos, sourceNode.content)

    // Apply the transaction
    props.editor.view.dispatch(tr)

    // Update the nodes display
    updateEditorNodes()

    return true
  }
  catch (error) {
    console.error('Error reordering nodes:', error)
    return false
  }
}

// Toggle sidebar visibility
function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value
}

// Watch for editor changes
watch(() => props.editor?.getHTML(), () => {
  if (props.editor) {
    content.value = props.editor.getHTML()
    updateEditorNodes()
  }
}, { immediate: true })

// History management
const canUndo = computed(() => props.editor?.can().undo() ?? false)
const canRedo = computed(() => props.editor?.can().redo() ?? false)

// Add metadata for the document
const metadata = ref({
  lastSaved: null as Date | null,
  wordCount: 0,
  charCount: 0,
  readingTime: '0 min',
})

// Update metadata when content changes
function updateMetadata() {
  if (!props.editor)
    return

  const text = props.editor.state.doc.textContent
  metadata.value.charCount = text.length
  metadata.value.wordCount = text.split(/\s+/).filter(word => word.length > 0).length

  // Calculate reading time (average reading speed: 200 words per minute)
  const minutes = Math.max(1, Math.round(metadata.value.wordCount / 200))
  metadata.value.readingTime = `${minutes} min read`
}

// Track editor changes with debouncing
let updateTimeout: ReturnType<typeof setTimeout> | null = null
function debouncedUpdate() {
  if (updateTimeout)
    clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    updateEditorNodes()
    updateMetadata()
  }, 250)
}

// Watch for editor changes with debouncing
watch(() => props.editor, (newEditor) => {
  if (newEditor) {
    updateEditorNodes()
    updateMetadata()

    newEditor.on('update', () => {
      debouncedUpdate()
    })
  }

  return () => {
    if (updateTimeout)
      clearTimeout(updateTimeout)
  }
}, { immediate: true })

// Provide context to child components
provideTiptapContext({
  editor: computed(() => props.editor),
  editorNodes,
  sidebarVisible,
  selectedNodeId,
  toggleSidebar,
  selectNode,
  deleteNode,
  duplicateNode,
  reorderNodes, // Add the new method to the context
  updateEditorNodes,
  canUndo,
  canRedo,
  metadata: computed(() => metadata.value),
  updateMetadata,
})

// When the component mounts, initialize
onMounted(() => {
  if (props.editor) {
    updateEditorNodes()
  }
})
</script>

<template>
  <div data-slot="tiptap-provider">
    <slot />
  </div>
</template>
