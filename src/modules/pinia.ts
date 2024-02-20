import { createPinia } from 'pinia'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import PiniaPluginYjs from 'pinia-plugin-yjs'
import type { UserModule } from '~/types'

// Setup Pinia
// https://pinia.vuejs.org/
export const install: UserModule = ({ isClient, initialState, app }) => {
  const pinia = createPinia()

  pinia.use(PiniaPluginYjs)
  // pinia.use(piniaPluginPersistedstate)
  // pinia.use(({ store }) => {
  //   store.$subscribe((mutation, state) => {
  //     console.log(store.$id, mutation, JSON.parse(JSON.stringify(state)), 'mutation')
  //   })
  // })

  // pinia.use(({ store }) => {
  //   store.$onAction(({ after }) => {
  //     after(() => {
  //       console.log(`${store.$id}, store`, store.$state)
  //       // 拿 store 的值 同步到  yjs
  //     })
  //   })
  // })

  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
  if (isClient)
    pinia.state.value = (initialState.pinia) || {}

  else
    initialState.pinia = pinia.state.value
}
