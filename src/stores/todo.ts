import { acceptHMRUpdate, defineStore } from 'pinia'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

export const todoDoc = new Y.Doc()

const webrtcProvider = new WebrtcProvider('roomName', todoDoc, { signaling: ['ws://localhost:4444'] })

export const useTodoStore = defineStore('todo', () => {
  const todos: Ref<TodoItem[]> = ref([])

  const doneTodos = computed(() => todos.value.filter(todo => todo.done))

  const addTodo = (text: string) => {
    todos.value.push({
      id: todos.value.length,
      text,
      done: false,
    })
  }

  const removeTodo = (id: number) => {
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  const updateTodo = (id: number, partial: Partial<TodoItem>) => {
    const index = todos.value.findIndex(todo => todo.id === id)

    if (index !== -1) {
      todos.value[index] = {
        ...todos.value[index],
        ...partial,
      }
    }
  }

  return {
    todos,
    doneTodos,
    addTodo,
    removeTodo,
    updateTodo,
  }
}, {
  doc: todoDoc,
  sharing: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore as any, import.meta.hot))
