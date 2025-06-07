<template>
    <div class="chatbot-container" :class="{ 'fullscreen': isFullscreen }">
        <div v-if="!isChatOpen" class="chatbot-button" @click="toggleChat">
            <a-button type="primary" shape="circle" size="large" class="!w-[50px] !h-[50px] !text-2xl">
                <template #icon><message-outlined /></template>
            </a-button>
        </div>
        <div v-else class="chatbot-panel">
            <div class="chatbot-header">
                <div class="chatbot-title">ITVee - Trợ lý thông minh</div>
                <div class="chatbot-actions">
                    <a-button type="text" @click="toggleFullscreen" class="fullscreen-button" :title="isFullscreen ? 'Thu nhỏ' : 'Phóng to'">
                        <template #icon><fullscreen-outlined v-if="!isFullscreen" /><fullscreen-exit-outlined v-else /></template>
                    </a-button>
                    <a-button type="text" @click="resetChat" class="reset-button" title="Bắt đầu cuộc trò chuyện mới">
                        <template #icon><reload-outlined /></template>
                    </a-button>
                    <a-button type="text" @click="toggleChat" class="close-button">
                        <template #icon><close-outlined /></template>
                    </a-button>
                </div>
            </div>
            <div class="chatbot-messages" ref="messagesContainer">
                <template v-for="(message, index) in messages" :key="index">
                    <div v-if="message.role !== 'system'" 
                        :class="['message', message.role === 'user' ? 'user-message' : 'bot-message']">
                        <a-avatar v-if="message.role !== 'user'" :size="40" class="mr-2" src="/avt-chatbot.png"></a-avatar>
                        <div class="message-content">
                            <VueMarkdown :source="message.content" />
                        </div>
                        <a-avatar v-if="message.role === 'user'" :size="40" class="ml-2">
                            <template #icon><user-outlined /></template>
                        </a-avatar>
                    </div>
                </template>
                <div class="bot-message loading-message" v-if="isLoading && !streamingText">
                    <a-avatar :size="40" class="mr-2" src="/avt-chatbot.png"></a-avatar>
                    <a-spin />
                </div>
                <div class="bot-message loading-message" v-if="streamingText">
                    <a-avatar :size="40" class="mr-2" src="/avt-chatbot.png"></a-avatar>
                    <div class="message-content streaming-content">
                        <VueMarkdown :source="streamingText" />
                    </div>
                </div>
            </div>
            <div class="chatbot-input">
                <a-input 
                    v-model:value="userInput" 
                    placeholder="Nhập tin nhắn..." 
                    @pressEnter="sendMessage"
                    :disabled="isLoading"
                />
                <a-button 
                    type="primary" 
                    @click="sendMessage" 
                    :disabled="!userInput.trim() || isLoading"
                >
                    <template #icon><send-outlined /></template>
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import OpenAI from 'openai';
import VueMarkdown from 'vue-markdown-render';

import { 
    MessageOutlined, 
    CloseOutlined, 
    UserOutlined, 
    SendOutlined,
    ReloadOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined
} from '@ant-design/icons-vue';
import { knowledgeBaseMessages, systemMessage, welcomeMessage } from '../until/dataTrain';

// Trạng thái của chatbot
const isChatOpen = ref(false);
const isFullscreen = ref(false);
const userInput = ref('');
const messages = ref<{role: 'user' | 'assistant' | 'system', content: string}[]>([]); // Sẽ được khởi tạo sau

const isLoading = ref(false);
const streamingText = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

// Khôi phục lịch sử chat từ localStorage khi component được tạo
onMounted(() => {
    loadChatHistory();
    // Đảm bảo tin nhắn chào mừng và các tin nhắn kiến thức xuất hiện sau lịch sử được tải
    if (messages.value.length <= 1) { // Nếu chỉ có systemMessage hoặc rỗng
        messages.value = [systemMessage, ...knowledgeBaseMessages, welcomeMessage];
    } else {
        // Nếu có lịch sử, đảm bảo systemMessage và knowledgeBaseMessages vẫn ở đầu
        const currentChatHistory = messages.value.filter(msg => msg.role !== 'system');
        messages.value = [systemMessage, ...knowledgeBaseMessages, ...currentChatHistory];
        // Đảm bảo welcome message chỉ xuất hiện một lần nếu không có lịch sử
        if (!messages.value.some(msg => msg.content === welcomeMessage.content)) {
             messages.value.push(welcomeMessage);
        }
    }
    nextTick(() => scrollToBottom());
});

// Lưu lịch sử chat vào localStorage
const saveChatHistory = () => {
    // Chỉ lưu tin nhắn của người dùng và trợ lý, không lưu tin nhắn hệ thống hay kiến thức nền
    const chatHistory = messages.value.filter(msg => msg.role === 'user' || msg.role === 'assistant');
    localStorage.setItem('itviec_chat_history', JSON.stringify(chatHistory));
};

// Tải lịch sử chat từ localStorage
const loadChatHistory = () => {
    try {
        const savedChat = localStorage.getItem('itviec_chat_history');
        if (savedChat) {
            const chatHistory = JSON.parse(savedChat);
            // Khôi phục lịch sử chat với tin nhắn hệ thống và kiến thức nền ở đầu
            messages.value = [systemMessage, ...knowledgeBaseMessages, ...chatHistory];
        } else {
            messages.value = [systemMessage, ...knowledgeBaseMessages, welcomeMessage];
        }
    } catch (error) {
        console.error('Lỗi khi tải lịch sử chat:', error);
        messages.value = [systemMessage, ...knowledgeBaseMessages, welcomeMessage]; // Khôi phục mặc định nếu lỗi
    }
};

// Reset lại cuộc trò chuyện
const resetChat = () => {
    if (confirm('Bạn có chắc chắn muốn bắt đầu cuộc trò chuyện mới không?')) {
        messages.value = [systemMessage, ...knowledgeBaseMessages, welcomeMessage]; // Reset về các tin nhắn ban đầu đã định nghĩa
        saveChatHistory();
        nextTick(() => scrollToBottom());
    }
};

// OpenAI client
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_KEY_CHATBOT,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "ITViec Assistant",
    },
    dangerouslyAllowBrowser: true, 
});

// Mở/đóng cửa sổ chat
const toggleChat = () => {
    if (isChatOpen.value && isFullscreen.value) {
        // Nếu đang mở và đang ở chế độ toàn màn hình, tắt chế độ toàn màn hình trước
        isFullscreen.value = false;
    }
    isChatOpen.value = !isChatOpen.value;
    if (isChatOpen.value) {
        nextTick(() => {
            scrollToBottom();
        });
    }
};

// Chuyển đổi chế độ toàn màn hình
const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
    nextTick(() => {
        scrollToBottom();
    });
};

// Gửi tin nhắn
const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return;
    
    // Thêm tin nhắn của người dùng
    const userMessageContent = userInput.value;
    messages.value.push({ role: 'user', content: userMessageContent });
    userInput.value = '';
    
    // Cuộn xuống dưới
    await nextTick();
    scrollToBottom();
    
    // Hiển thị trạng thái đang tải
    isLoading.value = true;
    streamingText.value = '';
    
    try {
        // Chuẩn bị tin nhắn để gửi đi (chỉ bao gồm system, assistant, user roles)
        // Loại bỏ các tin nhắn knowledgeBaseMessages nếu chúng có role 'system'
        const messagesForAPI = messages.value.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content
        }));

        const stream = await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-8b-instruct:free", // Hoặc một model khác phù hợp
            // model: "deepseek/deepseek-r1-0528:free", // Hoặc một model khác phù hợp
            messages: messagesForAPI,
            stream: true,
        });

        let fullText = '';

        // Xử lý từng phần của stream
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullText += content;
                streamingText.value = fullText;
                await nextTick();
                scrollToBottom();
            }
        }
        
        // Thêm phản hồi hoàn chỉnh vào messages
        messages.value.push({ 
            role: 'assistant', 
            content: fullText
        });
        
        // Lưu lịch sử chat vào localStorage sau khi nhận được phản hồi
        saveChatHistory();
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        messages.value.push({ 
            role: 'assistant', 
            content: 'Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ của ITViec.com.'
        });
        
        // Vẫn lưu lịch sử chat ngay cả khi có lỗi
        saveChatHistory();
    } finally {
        isLoading.value = false;
        streamingText.value = '';
        await nextTick();
        scrollToBottom();
    }
};

// Cuộn xuống dưới cùng của khung chat
const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

// Theo dõi thay đổi tin nhắn để cuộn xuống
watch(messages, () => {
    nextTick(() => {
        scrollToBottom();
    });
}, { deep: true });
</script>

<style scoped>
.chatbot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.chatbot-container.fullscreen {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
}

.chatbot-button {
    cursor: pointer;
    transition: all 0.3s;
}

.chatbot-button:hover {
    transform: scale(1.1);
}

.chatbot-panel {
    width: 450px;
    height: 600px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
}

.fullscreen .chatbot-panel {
    width: 80%;
    height: 80%;
    max-width: 1200px;
    max-height: 850px;
}

.chatbot-header {
    padding: 12px 16px;
    background-color: #FC3535;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chatbot-title {
    font-weight: 600;
    font-size: 16px;
}

.chatbot-actions {
    display: flex;
    gap: 8px;
}

.close-button, .reset-button, .fullscreen-button {
    color: white;
}

.chatbot-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
    animation: fadeIn 0.3s ease;
}

.user-message {
    justify-content: flex-end;
}

.bot-message {
    justify-content: flex-start;
}

.message-content {
    padding: 8px 12px;
    border-radius: 18px;
    max-width: 80%;
    word-break: break-word;
    font-size: 14px;
    line-height: 1.5;
}

.user-message .message-content {
    background-color: #FC3535;
    color: white;
}

.bot-message .message-content {
    background-color: #f0f2f5;
}

.loading-message {
    padding: 8px 0;
}

.streaming-content {
    position: relative;
}

.streaming-content::after {
    content: '|';
    display: inline-block;
    animation: blink 1s infinite;
}

.chatbot-input {
    padding: 12px;
    display: flex;
    gap: 8px;
    border-top: 1px solid #f0f0f0;
}

/* Tùy chỉnh kiểu dáng cho Markdown */
:deep(.message-content) {
    /* Giữ lại các kiểu dáng cơ bản */
    padding: 8px 12px;
    border-radius: 18px;
    max-width: 80%;
    word-break: break-word;
    font-size: 14px;
    line-height: 1.5;
}

:deep(.user-message .message-content) {
    background-color: #FC3535;
    color: white;
}

:deep(.bot-message .message-content) {
    background-color: #f0f2f5;
}

/* Tùy chỉnh kiểu dáng cho các phần tử Markdown */
:deep(.message-content p) {
    margin-top: 0;
    margin-bottom: 0.5em;
}

:deep(.message-content p:last-child) {
    margin-bottom: 0;
}

:deep(.message-content a) {
    color: inherit;
    text-decoration: underline;
}

:deep(.message-content ul, .message-content ol) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    padding-left: 1.5em;
}

:deep(.message-content li) {
    margin-bottom: 0.25em;
}

:deep(.message-content code) {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px 4px;
    border-radius: 3px;
}

:deep(.message-content pre) {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
    margin: 0.5em 0;
}

:deep(.message-content blockquote) {
    border-left: 3px solid rgba(0, 0, 0, 0.2);
    padding-left: 8px;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
}

/* Đảm bảo màu chữ trắng trong tin nhắn người dùng */
:deep(.user-message .message-content *) {
    color: white;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}
</style>