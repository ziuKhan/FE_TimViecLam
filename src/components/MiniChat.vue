<template>
  <div v-if="messageStore.showMiniChat" class="mini-chat-container">
    <div class="mini-chat-header">
      <div class="flex items-center">
        <a-avatar class="w-8 h-8" :src="messageStore.currentConversation?.otherUser?.avatar ? linkUploads('user/' + messageStore.currentConversation?.otherUser?.avatar) : 'https://placehold.co/100'" />
        <div class="ml-2 font-semibold">
          {{ messageStore.currentConversation?.otherUser?.name || 'Người dùng' }}
        </div>
      </div>
      <div class="flex gap-2">
        <a-button type="text" shape="circle" size="small" @click="minimizeChat">
          <template #icon><MinusOutlined /></template>
        </a-button>
        <a-button type="text" shape="circle" size="small" @click="messageStore.closeMiniChat">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </div>
    </div>
    
    <div ref="chatContainerRef" class="mini-chat-body">
      <div v-for="message in messageStore.messages" :key="message._id" class="message-container">
        <!-- Tin nhắn của người khác -->
        <div v-if="message.senderId._id !== currentUserId" class="other-message">
          <a-avatar size="small" :src="message.senderId?.avatar ? linkUploads('user/' + message.senderId?.avatar) : 'https://placehold.co/100'" />
          <div class="message-bubble other-bubble">
            <div>{{ message.textContent }}</div>
            <div class="message-time">{{ formatTimestamp(message.createdAt) }}</div>
          </div>
        </div>
        <!-- Tin nhắn của mình -->
        <div v-else class="my-message">
          <div class="message-bubble my-bubble">
            <div>{{ message.textContent }}</div>
            <div class="message-time">{{ formatTimestamp(message.createdAt) }}</div>
          </div>
        </div>
      </div>
      <div v-if="messageStore.isTyping.status && messageStore.isTyping.userId !== currentUserId" class="typing-indicator">
        Đang nhập...
      </div>
    </div>
    
    <div class="mini-chat-footer">
      <a-input 
        v-model:value="newMessage" 
        placeholder="Nhập tin nhắn..." 
        @pressEnter="sendMessage"
        @input="handleTyping"
      >
        <template #suffix>
          <a-button type="primary" size="small" @click="sendMessage" shape="circle">
            <template #icon><SendOutlined /></template>
          </a-button>
        </template>
      </a-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { CloseOutlined, MinusOutlined, SendOutlined } from '@ant-design/icons-vue'
import useMessageStore from '../stores/admin/MessageStore'
import dayjs from 'dayjs'
import accountService from '../services/account.service'
import { linkUploads } from '../constant/api'

const messageStore = useMessageStore()
const account = accountService.getAccount()?.account
const currentUserId = account?._id || ''
const newMessage = ref('')
const chatContainerRef = ref<HTMLElement | null>(null)
const minimized = ref(false)
let typingTimeout: number | null = null

// Hàm gửi tin nhắn
const sendMessage = async () => {
  if (!newMessage.value.trim() || !messageStore.currentConversation?._id) return

  // Cập nhật form để gửi tin nhắn
  messageStore.messageForm.textContent = newMessage.value
  messageStore.messageForm.contentType = 'text'
  
  // Gửi tin nhắn
  await messageStore.sendMessage()
  newMessage.value = ''
  
  // Cuộn xuống dưới sau khi gửi
  await scrollToBottom()
}

// Cuộn xuống cuối cùng của khung chat
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
  }
}

// Xử lý sự kiện đang gõ
const handleTyping = () => {
  // Hủy timeout cũ nếu có
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  
  // Gửi sự kiện đang gõ
  messageStore.sendTypingStatus(true)
  
  // Đặt timeout mới để gửi sự kiện ngừng gõ sau 2 giây
  typingTimeout = setTimeout(() => {
    messageStore.sendTypingStatus(false)
    typingTimeout = null
  }, 2000) as unknown as number
}

// Thu nhỏ cửa sổ chat
const minimizeChat = () => {
  minimized.value = !minimized.value
  const container = document.querySelector('.mini-chat-container') as HTMLElement
  if (container) {
    if (minimized.value) {
      container.classList.add('minimized')
    } else {
      container.classList.remove('minimized')
      scrollToBottom()
    }
  }
}

// Hàm định dạng thời gian
const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return ''
  return dayjs(timestamp).format('HH:mm')
}

// Cuộn xuống khi có tin nhắn mới
watch(
  () => messageStore.messages,
  async () => {
    await scrollToBottom()
  },
  { deep: true }
)

// Cuộn xuống khi cửa sổ chat được mở
watch(
  () => messageStore.showMiniChat,
  async (newVal) => {
    if (newVal) {
      await scrollToBottom()
    }
  }
)

onMounted(() => {
  scrollToBottom()
})

onBeforeUnmount(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})
</script>

<style scoped>
.mini-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 999;
  transition: height 0.3s ease;
  overflow: hidden;
}

.mini-chat-container.minimized {
  height: 50px;
}

.mini-chat-header {
  padding: 10px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.mini-chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.mini-chat-footer {
  padding: 10px;
  border-top: 1px solid #e9ecef;
}

.message-container {
  margin-bottom: 15px;
  max-width: 100%;
}

.my-message, .other-message {
  display: flex;
  margin-bottom: 8px;
}

.my-message {
  justify-content: flex-end;
}

.other-message {
  justify-content: flex-start;
}

.message-bubble {
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
  position: relative;
}

.my-bubble {
  background-color: #ef4444;
  color: white;
  margin-left: 12px;
}

.other-bubble {
  background-color: #f1f1f1;
  margin-left: 8px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
  margin-top: 4px;
}

.typing-indicator {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 8px;
  font-style: italic;
}

/* Định dạng thanh cuộn */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style> 