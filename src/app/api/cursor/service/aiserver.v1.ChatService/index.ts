// import { StreamUnifiedChatResponse, StreamUnifiedChatRequest } from './streamUnifiedChat'
// import { StreamUnifiedChatResponseWithTools, StreamUnifiedChatRequestWithTools } from './streamUnifiedChatWithTools'

import { _tt, ome, pc, uPe } from "../common";

export const chatService = {
  typeName: "aiserver.v1.ChatService",
  methods: {
    streamUnifiedChat: {
      name: "StreamUnifiedChat",
      I: pc,
      O: uPe,
      kind: 1,
    },
    streamUnifiedChatWithTools: {
      name: "StreamUnifiedChatWithTools",
      I: _tt,
      O: ome,
      kind: 3,
    },
  },
}  