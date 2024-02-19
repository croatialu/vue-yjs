import { WebrtcProvider } from 'y-webrtc'
import type * as Y from 'yjs'

async function connectWebRTC(doc: Y.Doc, roomName: string) {
  return new WebrtcProvider(roomName, doc, { signaling: ['ws://localhost:4444'] })
}
