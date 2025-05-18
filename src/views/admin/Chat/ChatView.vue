<template>
  <div class="flex h-[100vh] antialiased text-gray-800">
    <div class="flex flex-row h-full w-full overflow-x-hidden">
      <!-- Cột danh sách cuộc trò chuyện -->
      <div class="flex flex-col py-8 pl-6 pr-2 w-80 bg-white flex-shrink-0 h-full">
        <div class="flex flex-row items-center justify-center h-12 w-full">
          <div
            class="flex items-center justify-center rounded-2xl text-red-700 bg-red-100 h-10 w-10"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </div>
          <div class="ml-2 font-bold text-2xl">Chat</div>
        </div>
        <div
          class="flex  items-center gap-2  bg-red-50 border border-red-400 mt-4 w-full p-2 rounded-lg"
        >
          <div class="h-11 w-11 rounded-full border overflow-hidden">
              <img :src="account?.avatar ? linkUploads('user/' + account?.avatar) : 'https://placehold.co/100'" alt="My Avatar" class="h-full w-full object-cover" />
          </div>
          <div class="text-sm font-semibold ">{{ account?.name || '--' }}</div>
        </div>
        <!-- Danh sách cuộc trò chuyện -->
        <div class="flex flex-col mt-8">
          <div class="flex flex-row items-center justify-between text-xs">
            <span class="font-bold">Cuộc trò chuyện</span>
            <span class="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">{{
              messageStore.conversations.length
            }}</span>
          </div>
          <div class="flex flex-col space-y-1 mt-4 -mx-2 h-auto overflow-y-auto">
            <a-button
              v-for="conv in messageStore.conversations"
              :key="conv._id || ''"
              @click="selectConversation(conv._id || '')"
              :type="messageStore.currentConversation?._id === conv._id ? 'primary' : 'text'"
              class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 w-full text-left h-auto"
            >
            <a-avatar class="min-w-9 min-h-9"> 
                {{ (conv.name?.charAt(0) || 'C') }}
            </a-avatar>

              <div class="ml-2  font-semibold truncate">
                {{ conv.name }}
                <div
                  class="text-xs truncate"
                  :class="messageStore.currentConversation?._id === conv._id ? 'text-gray-200' : 'text-gray-500'"
                >
                  {{ conv.lastMessage?.textContent }}
                </div>
              </div>
              <div
                v-if="conv.unreadCount && conv.unreadCount > 0"
                class="ml-auto text-xs bg-red-500 text-white rounded-full px-2 py-0.5"
              >
                {{ conv.unreadCount }}
              </div>
            </a-button>
          </div>
        </div>
      </div>

      <!-- Cột cửa sổ chat chi tiết -->
      <div class="flex flex-col flex-auto h-full p-6">
        <div
          v-if="messageStore.currentConversation"
          class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
        >
          <!-- Header của cuộc trò chuyện -->
          <div class="flex items-center justify-between pb-2 border-b-2 mb-4">
            <div class="flex items-center">
              <div
                class="flex items-center justify-center h-10 w-10 rounded-full bg-red-500 text-white font-bold"
              >
                {{ messageStore.currentConversation.name?.charAt(0) || 'C' }}
              </div>
              <div class="ml-3">
                <p class="text-lg font-semibold mb-0">{{ messageStore.currentConversation.name }}</p>
                <p class="text-xs text-gray-500 mb-0" v-if="messageStore.isTyping.status && messageStore.isTyping.userId !== currentUserId">
                  Đang nhập...
                </p>
                <p class="text-xs text-gray-500 mb-0" v-else>
                  {{ messageStore.currentConversation.participantsCount || 2 }} thành viên
                </p>
              </div>
            </div>
          </div>
          <!-- Khu vực hiển thị tin nhắn -->
          <div ref="chatContainerRef" class="flex flex-col h-full overflow-x-auto mb-4">
            <div class="flex flex-col h-full">
              <div v-for="message in messageStore.messages" :key="message._id" class="grid grid-cols-12 gap-y-2">
                <!-- Tin nhắn của người khác -->
                <div
                  v-if="message.senderId !== currentUserId"
                  class="col-start-1 col-end-8 p-3 rounded-lg"
                >
                  <div class="flex flex-row items-center">
                    <a-avatar class="min-w-9 min-h-9"> U </a-avatar>
                    <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl ">
                      <div>{{ message.textContent }}</div>
                      <div class="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                        {{ formatTimestamp(message.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Tin nhắn của tôi -->
                <div v-else class="col-start-6 col-end-13 p-3 rounded-lg">
                  <div class="flex items-center justify-start flex-row-reverse">
                    <a-avatar class="min-w-9 min-h-9"> B </a-avatar>
                    <div class="relative mr-3 text-sm bg-red-100 py-2 px-4 shadow rounded-xl">
                      <div>{{ message.textContent }}</div>
                      <div class="absolute text-xs bottom-0 left-0 -mb-5 ml-2 text-gray-500">
                        {{ formatTimestamp(message.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Khu vực nhập tin nhắn -->
          <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full">
            <div class="flex-grow">
              <div class="relative w-full">
                <a-input
                  v-model:value="newMessage"
                  :bordered="false"
                  @pressEnter="sendMessage"
                  @input="handleTyping"
                  placeholder="Nhập tin nhắn..."
                >
                  <template #suffix>
                    <a-button type="text" shape="circle">
                      <template #icon><SmileOutlined /></template>
                    </a-button>
                  </template>
                </a-input>
              </div>
            </div>
            <div class="mr-4">
              <a-button type="primary" @click="sendMessage">
                Gửi
                <template #icon><SendOutlined /></template>
              </a-button>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center h-full">
          <div class="text-center">
            <MessageOutlined style="font-size: 64px; color: #cbd5e1" />
            <p class="mt-4 text-xl text-gray-500">Chọn một cuộc trò chuyện để bắt đầu nhắn tin.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  SendOutlined,
  SmileOutlined,
  InfoCircleOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import accountService from '../../../services/account.service'
import type { IUserbyAccount } from '../../../types/backend'
import { linkUploads } from '../../../constant/api'
import useMessageStore from '../../../stores/admin/MessageStore'

const account = ref<IUserbyAccount | null>(accountService.getAccount()?.account)
const messageStore = useMessageStore()
const currentUserId = ref(account.value?._id || '')
const newMessage = ref('')
const chatContainerRef = ref<HTMLElement | null>(null)
let typingTimeout: number | null = null;

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
  }
}

const selectConversation = async (convId: string) => {
  await messageStore.getConversationById(convId)
  await scrollToBottom()
}

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

// Hàm định dạng thời gian
const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return ''
  return dayjs(timestamp).format('HH:mm')
}

// Watcher để cuộn khi có tin nhắn mới
watch(
  () => messageStore.messages,
  async () => {
    await scrollToBottom()
  },
  { deep: true }
)

// Khởi tạo khi component được mount
onMounted(() => {
  // Khởi tạo MessageStore
  messageStore.initialize()
  
  // Lấy danh sách cuộc trò chuyện
  messageStore.getConversations()
})

// Dọn dẹp khi component bị unmount
onBeforeUnmount(() => {
  messageStore.cleanup()
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})
</script>

<style scoped>
/* Tailwind đã xử lý phần lớn, chỉ thêm các style cục bộ nếu cần */
/* Đảm bảo scrollbar đẹp hơn nếu cần */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
