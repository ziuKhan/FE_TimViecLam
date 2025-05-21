import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { IPaginate, IMessage, IConversation, IConversationParticipant } from '../../types/backend'
import notificationService from '../../services/notification.service'
import accountService from '../../services/account.service'
import apiService from '../../services/api.service'
import { useWebSocketStore } from '../WebSocket'

const useMessageStore = defineStore('message', () => {
  const { account } = accountService.getAccount()
  const API_URL = 'messages'
  const dataMeta = ref<IPaginate>({
    current: 1,
    pageSize: 6,
    pages: 0,
    total: 0
  })

  const webSocketStore = useWebSocketStore()

  const conversations = ref<IConversation[]>([])
  const currentConversation = ref<IConversation | null>(null)
  const messages = ref<IMessage[]>([])
  const valueSearch = ref<string>('')
  const loading = ref<boolean>(false)
  const openModal = ref<boolean>(false)
  const openDrawer = ref<boolean>(false)
  const isTyping = ref<{ userId: string, status: boolean }>({ userId: '', status: false })
  const showMiniChat = ref<boolean>(false)

  // Form để tạo cuộc trò chuyện mới
  const form = reactive<{
    conversationName: string,
    userId: string[],
    message: {
      contentType: 'text' | 'file' | 'image' | 'system',
      textContent: string,
      file_name?: string,
      file_size?: number
    }
  }>({
    conversationName: '',
    userId: [],
    message: {
      contentType: 'text',
      textContent: '',
      file_name: '',
      file_size: 0
    }
  })

  // Form để gửi tin nhắn mới
  const messageForm = reactive<{
    conversationId: string,
    contentType: 'text' | 'file' | 'image' | 'system',
    textContent: string,
    file_name?: string,
    file_size?: number
  }>({
    conversationId: '',
    contentType: 'text',
    textContent: '',
    file_name: '',
    file_size: 0
  })

  const refreshInput = () => {
    form.conversationName = ''
    form.userId = []
    form.message.contentType = 'text'
    form.message.textContent = ''
    form.message.file_name = ''
    form.message.file_size = 0
  }

  const refreshMessageInput = () => {
    messageForm.textContent = ''
    messageForm.file_name = ''
    messageForm.file_size = 0
  }

  // Khởi tạo và thiết lập lắng nghe các sự kiện từ socket 
  const setupSocketListeners = () => {
    // Lắng nghe sự kiện tin nhắn mới
    webSocketStore.on('new_message', (data: any) => {
      if (currentConversation.value && currentConversation.value._id === data.conversationId) {
        // Nếu đang mở cuộc trò chuyện, thêm tin nhắn mới vào danh sách
        messages.value.push({
          _id: data.messageId,
          conversationId: data.conversationId,
          senderId: data.senderId,
          contentType: data.contentType,
          textContent: data.content
        })
        // Đánh dấu đã đọc tin nhắn
        markAsRead(data.conversationId, data.messageId)
      } else {
        // Nếu không đang mở cuộc trò chuyện, cập nhật danh sách cuộc trò chuyện
        getConversations()
      }
    })

    // Lắng nghe sự kiện tin nhắn đã đọc
    webSocketStore.on('message_read', (data: any) => {
      if (currentConversation.value && currentConversation.value._id === data.conversationId) {
        // Cập nhật trạng thái đã đọc cho tin nhắn
        const message = messages.value.find(m => m._id === data.messageId)
        if (message) {
          message.statusByRecipient = [...(message.statusByRecipient || []), data.userId]
        }
      }
    })

    // Lắng nghe sự kiện đang gõ
    webSocketStore.on('typing', (data: any) => {
      if (currentConversation.value && currentConversation.value._id === data.conversationId) {
        isTyping.value = { userId: data.userId, status: data.isTyping }
        
        // Tự động ẩn trạng thái đang gõ sau 3 giây
        if (data.isTyping) {
          setTimeout(() => {
            isTyping.value = { userId: '', status: false }
          }, 3000)
        }
      }
    })
  }

  // Hủy lắng nghe các sự kiện socket
  const removeSocketListeners = () => {
    webSocketStore.off('new_message')
    webSocketStore.off('message_read')
    webSocketStore.off('typing')
  }

  // Lấy danh sách cuộc trò chuyện
  const getConversations = async (search?: string) => {
    loading.value = true
    try {
      const params = `?page=${dataMeta.value?.current}&pageSize=${dataMeta.value?.pageSize}${search ? '&search=' + search : ''}`
      const res = await apiService.get(`${API_URL}/conversations${params}`)
      if (res) {
        conversations.value = res.data.result
        dataMeta.value = res.data.meta
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  // Lấy chi tiết cuộc trò chuyện
  const getConversationById = async (id: string) => {
    loading.value = true
    try {
      const res = await apiService.get(`${API_URL}/conversations/${id}`)
      if (res) {
        currentConversation.value = res.data
        // Cập nhật conversationId trong form gửi tin nhắn
        messageForm.conversationId = id
        // Lấy danh sách tin nhắn khi có cuộc trò chuyện
        getMessages(id)
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  // Lấy danh sách tin nhắn trong cuộc trò chuyện
  const getMessages = async (conversationId: string) => {
    loading.value = true
    try {
      const params = `?page=1&pageSize=20&filter=sort=createdAt`
      const res = await apiService.get(`${API_URL}/conversations/${conversationId}/messages${params}`)
      if (res) {
        messages.value = res.data.result
        // Đánh dấu tin nhắn đã đọc
        if (messages.value.length > 0) {
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage._id) {
            markAsRead(conversationId, lastMessage._id)
          }
        }
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  // Tạo cuộc trò chuyện mới
  const createConversation = async () => {
    loading.value = true
    try {
      const res = await apiService.add(`${API_URL}/conversations`, form)
      if (res) {
        message.success('Tạo cuộc trò chuyện thành công!')
        refreshInput()
        getConversations()
        // Đóng modal nếu đang mở
        openModal.value = false
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  // Gửi tin nhắn mới
  const sendMessage = async () => {
    if (!messageForm.textContent.trim() && messageForm.contentType === 'text') {
      return
    }
    
    loading.value = true
    try {
      const res = await apiService.add(`${API_URL}/send`, messageForm)
      if (res) {
        // Thêm tin nhắn mới vào danh sách
        messages.value.push(res.data)
        refreshMessageInput()
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  // Đánh dấu tin nhắn đã đọc
  const markAsRead = async (conversationId: string, messageId: string) => {
    try {
      await apiService.update(`${API_URL}/conversations/${conversationId}/read`, {
        messageId
      })
    } catch (error: any) {
      console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error)
    }
  }

  // Gửi sự kiện đang gõ
  const sendTypingStatus = (isTyping: boolean) => {
    if (currentConversation.value) {
      webSocketStore.emit('typing', {
        conversationId: currentConversation.value._id,
        isTyping
      })
    }
  }

  // Xóa cuộc trò chuyện
  const deleteConversation = async (id: string) => {
    loading.value = true
    try {
      const res = await apiService.delete(`${API_URL}/conversations/${id}`)
      if (res) {
        message.success('Xóa cuộc trò chuyện thành công!')
        getConversations()
        if (currentConversation.value && currentConversation.value._id === id) {
          currentConversation.value = null
          messages.value = []
        }
      }
    } catch (error: any) {
      message.error(error.response.data.message)
    } finally {
      loading.value = false
    }
  }

  const handleOpenModal = () => {
    refreshInput()
    openModal.value = true
  }

  // Kiểm tra xem có cuộc trò chuyện với người dùng đã tồn tại hay không
  const CheckChat = async (userId: string) => {
    loading.value = true
    try {
      const res = await apiService.add(`${API_URL}/check-one-to-one`, {
        otherUserId: userId
      })
      
      if (res && res.data) {
        if (res.data.exists) {
          // Nếu cuộc trò chuyện đã tồn tại, lấy thông tin và mở mini chat
          await getConversationById(res.data.conversationId)
        } else {
          // Nếu chưa tồn tại, tạo cuộc trò chuyện mới
          form.userId = [userId]
          await createOneToOneConversation(userId)
        }
        // Hiển thị mini chat
        showMiniChat.value = true
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra cuộc trò chuyện')
    } finally {
      loading.value = false
    }
  }

  // Tạo cuộc trò chuyện 1-1 mới
  const createOneToOneConversation = async (userId: string) => {
    loading.value = true
    try {
      const res = await apiService.add(`${API_URL}/conversations`, {
        userId: [userId],
        conversationName: '',
        message: {
          contentType: 'text',
          textContent: 'Xin chào! Tôi muốn trao đổi về hồ sơ của bạn.'
        }
      })
      
      if (res) {
        message.success('Tạo cuộc trò chuyện thành công!')
        await getConversationById(res.data._id)
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo cuộc trò chuyện mới')
    } finally {
      loading.value = false
    }
  }

  // Đóng mini chat
  const closeMiniChat = () => {
    showMiniChat.value = false
  }

  // Khi component sử dụng store này được mount, khởi tạo socket và lấy dữ liệu
  const initialize = () => {
    // Đảm bảo kết nối socket đã được khởi tạo
    webSocketStore.initSocket()
    setupSocketListeners()
    getConversations()
  }

  // Khởi tạo mini chat mà không lấy toàn bộ cuộc trò chuyện
  const initializeMiniChat = () => {
    webSocketStore.initSocket()
    setupSocketListeners()
  }

  // Khi component sử dụng store này bị unmount, hủy lắng nghe socket
  const cleanup = () => {
    removeSocketListeners()
  }

  return {
    openModal,
    openDrawer,
    form,
    loading,
    conversations,
    currentConversation,
    messages,
    dataMeta,
    valueSearch,
    messageForm,
    isTyping,
    showMiniChat,
    getConversations,
    getConversationById,
    getMessages,
    createConversation,
    sendMessage,
    markAsRead,
    sendTypingStatus,
    deleteConversation,
    handleOpenModal,
    initialize,
    initializeMiniChat,
    cleanup,
    refreshInput,
    CheckChat,
    refreshMessageInput,
    closeMiniChat,
    createOneToOneConversation
  }
})

export default useMessageStore
