<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { cn } from '@/lib/utils'
import { computed, type HTMLAttributes, ref } from 'vue'
import { useTiptapContext } from '.'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Icon from './TiptapIcon.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

const props = defineProps<{
  editor?: Editor | null
  class?: HTMLAttributes['class']
}>()

// Get editor from context if not provided directly
const { editor: contextEditor } = useTiptapContext()
const editor = computed(() => props.editor ?? contextEditor.value)

// Check if editor is ready and focused on a table
const isEditorReady = computed(() => editor.value && editor.value.isEditable)
const isTableSelected = computed(() => 
  isEditorReady.value && 
  (editor.value!.isActive('table') || 
   editor.value!.isActive('tableRow') || 
   editor.value!.isActive('tableCell') || 
   editor.value!.isActive('tableHeader'))
)

// Create new table dialog
const showCreateTableDialog = ref(false)
const newTableRows = ref(3)
const newTableCols = ref(3)

// Create new table
const createTable = () => {
  if (!isEditorReady.value) return
  
  editor.value!.chain().focus()
    .insertTable({ rows: newTableRows.value, cols: newTableCols.value, withHeaderRow: true })
    .run()
    
  showCreateTableDialog.value = false
}
</script>

<template>
  <div 
    :class="cn(
      'tiptap-table-toolbar flex flex-wrap gap-1 items-center',
      props.class
    )"
    data-slot="tiptap-table-toolbar"
  >
    <!-- Table creation -->
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            @click="showCreateTableDialog = true" 
            :disabled="!isEditorReady"
          >
            <Icon name="mdi:table" class="h-4 w-4 mr-2" />
            Insert Table
          </Button>
        </TooltipTrigger>
        <TooltipContent>Insert a new table</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    
    <!-- Table manipulation (only shown when a table is selected) -->
    <div v-if="isTableSelected" class="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().addColumnBefore().run()" 
              :disabled="!isEditorReady"
            >
              <Icon name="mdi:table-column-plus-before" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add column before</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().addColumnAfter().run()" 
              :disabled="!isEditorReady"
            >
              <Icon name="mdi:table-column-plus-after" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add column after</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().deleteColumn().run()" 
              :disabled="!isEditorReady"
            >
              <Icon name="mdi:table-column-remove" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete column</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" class="h-6" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().addRowBefore().run()" 
              :disabled="!isEditorReady"
            >
              <Icon name="mdi:table-row-plus-before" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add row before</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().addRowAfter().run()" 
              :disabled="!isEditorReady"
            >
              <Icon name="mdi:table-row-plus-after" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add row after</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().deleteRow().run()" 
              :disabled="!isEditorReady"
            >
              <Icon name="mdi:table-row-remove" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete row</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" class="h-6" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().toggleHeaderCell().run()" 
              :disabled="!isEditorReady"
            >
              <Icon name="mdi:format-header-pound" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle header cell</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().mergeOrSplit().run()" 
              :disabled="!isEditorReady"
            >
              <Icon name="mdi:table-merge-cells" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Merge or split cells</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              @click="editor?.chain().focus().deleteTable().run()" 
              :disabled="!isEditorReady"
              class="text-destructive hover:bg-destructive/10"
            >
              <Icon name="mdi:table-remove" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete table</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    
    <!-- Create table dialog -->
    <Dialog v-model:open="showCreateTableDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
          <DialogDescription>
            Choose the size of your new table.
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <Label for="rows">Rows</Label>
              <Input 
                id="rows" 
                v-model="newTableRows" 
                type="number" 
                min="1" 
                max="20" 
              />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="columns">Columns</Label>
              <Input 
                id="columns" 
                v-model="newTableCols" 
                type="number" 
                min="1" 
                max="10" 
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="showCreateTableDialog = false">Cancel</Button>
          <Button @click="createTable">Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
