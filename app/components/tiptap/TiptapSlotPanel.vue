<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { HTMLAttributes } from 'vue'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { computed, reactive, watch } from 'vue'
import { useTiptapContext } from '.'

const props = defineProps<{
  editor?: Editor | null
  componentName?: string
  componentSlots?: Record<string, string>
  componentId?: string
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  'update:componentSlots': [slots: Record<string, string>]
}>()

// Get editor from context if not provided directly
const { editor: contextEditor } = useTiptapContext()
const editor = computed(() => props.editor ?? contextEditor.value)

// Create a reactive object to track current slot values
const slotContents = reactive<Record<string, string>>(props.componentSlots || {})

// Update form values when component slots change
watch(() => props.componentSlots, (newSlots) => {
  if (newSlots) {
    Object.keys(newSlots).forEach((key) => {
      slotContents[key] = newSlots[key]
    })
  }
}, { deep: true, immediate: true })

// Get component metadata based on component name
const componentMeta = computed(() => {
  // This would typically come from a composable or prop
  // For now, we'll return a simple mock structure
  return {
    name: props.componentName || 'Unknown',
    slots: [
      {
        name: 'default',
        description: 'Default content slot',
      },
      {
        name: 'icon',
        description: 'Icon content',
      },
      {
        name: 'description',
        description: 'Additional description text',
      },
    ],
  }
})

// Handle slot content updates
function updateSlotContent(slotName: string, content: string) {
  slotContents[slotName] = content
  emits('update:componentSlots', { ...slotContents })

  // If editor and componentId are available, update the node
  if (editor.value && props.componentId) {
    editor.value.chain().focus().updateComponentSlots(props.componentId, { ...slotContents }).run()
  }
}
</script>

<template>
  <div
    :class="cn(
      'tiptap-slot-panel',
      props.class,
    )"
    data-slot="tiptap-slot-panel"
  >
    <div class="space-y-4">
      <h3 class="text-sm font-medium">
        {{ componentName || componentMeta.name }} Slots
      </h3>

      <div class="space-y-6">
        <div
          v-for="slot in componentMeta.slots"
          :key="slot.name"
          class="space-y-2"
        >
          <div class="flex justify-between items-baseline">
            <Label :for="`slot-${slot.name}`">{{ slot.name }}</Label>
          </div>

          <Textarea
            :id="`slot-${slot.name}`"
            :value="slotContents[slot.name] || ''"
            :placeholder="slot.description || `Content for ${slot.name} slot`"
            rows="4"
            class="resize-y min-h-[100px]"
            @input="updateSlotContent(slot.name, $event.target.value)"
          />

          <p v-if="slot.description" class="text-xs text-muted-foreground">
            {{ slot.description }}
          </p>

          <div class="text-xs text-muted-foreground">
            <p>You can use HTML in slots. Examples:</p>
            <pre class="bg-muted p-1 rounded mt-1">&lt;p&gt;Text content&lt;/p&gt;</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
