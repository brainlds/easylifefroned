// 消息类型
export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// 模型提供商映射
export const MODEL_PROVIDER_MAP = {
    'gpt': 'openai',
    'deepseek': 'deepseek',
    'qianwen': 'dashscope'
} as const;

// 模型类型
export interface Model {
    id: keyof typeof MODEL_PROVIDER_MAP;
    name: string;
    icon: string;
}

// ChatWindow 组件 Props 类型
export interface ChatWindowProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    selectedModel: Model;
}

// MessageBubble 组件 Props 类型
export interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
} 