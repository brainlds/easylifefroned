/**
 * 工具分类ID类型
 */
export type ToolCategoryId = 'all' | 'image' | 'dev' | 'test' | 'crypto' | 'entertainment' | 'utils' | 'divination';

/**
 * 工具类型定义
 */
export interface Tool {
    id: string;
    name: string;
    description: string;
    category: ToolCategoryId;
    icon: string;
    isNew?: boolean;
    isFeatured?: boolean;
    disabled?: boolean;
    disabledReason?: string;
    link?: string;
}

/**
 * 工具分类类型
 */
export interface ToolCategory {
    id: ToolCategoryId;
    label: string;
    tags?: string[];
} 