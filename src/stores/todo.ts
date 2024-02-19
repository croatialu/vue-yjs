import { acceptHMRUpdate, defineStore } from 'pinia'
import * as Y from 'yjs'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

export const todoDoc = new Y.Doc()

export const useTodoStore = defineStore('todo', () => {
  const todos: Ref<TodoItem[]> = shallowRef([])

  const addTodo = (text: string) => {
    todos.value = [
      ...todos.value,
      {
        id: todos.value.length,
        text,
        done: false,
      },
    ]
  }

  const removeTodo = (id: number) => {
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  const updateTodo = (id: number, partial: Partial<TodoItem>) => {
    todos.value = todos.value.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          ...partial,
        }
      }

      return todo
    })
  }

  return {
    todos,
    addTodo,
    removeTodo,
    updateTodo,
  }
}, {
  persist: {
    storage: {
      getItem(key: string) {
        // console.log('getItem', key, localStorage.getItem(key))

        const data = todoDoc.get(key)

        return localStorage.getItem(key)
      },
      setItem(key: string, value: string) {
        const data = JSON.parse(value)

        localStorage.setItem(key, value)
      },
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore as any, import.meta.hot))
