import { acceptHMRUpdate, defineStore } from 'pinia'
import * as Y from 'yjs'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

export const todoDoc = new Y.Doc()

function AbstractTypeToJSON(value: Y.Array<any> | Y.Map<any>) {
  if (value instanceof Y.Array)
    return value.toArray().map((item): any => AbstractTypeToJSON(item))
  if (value instanceof Y.Map) {
    const record: Record<string, any> = {}
    value.forEach((value, key) => {
      record[key] = AbstractTypeToJSON(value)
    })

    return record
  }
  return value
}

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
        const map = todoDoc.getMap(key)

        const value = map.get('VALUE') as any

        return JSON.stringify(AbstractTypeToJSON(value))
      },
      setItem(key: string, _value: string) {
        const data = JSON.parse(_value) as any

        const map = todoDoc.getMap(key)

        if (!map.get('VALUE')) {
          if (Array.isArray(data))
            map.set('VALUE', new Y.Array())
          else if (typeof data === 'object')
            map.set('VALUE', new Y.Map())
        }
        const value = map.get('VALUE')
      },
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore as any, import.meta.hot))
