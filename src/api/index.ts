const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 导出 API_BASE_URL 以便其他模块使用
export { API_BASE_URL };

// 或者导出一个默认的 API 配置对象
export default {
    baseUrl: API_BASE_URL,
    endpoints: {
        scripts: '/scripts',
        chat: '/chat',
        photoQa: '/photo-qa',
        bazi: '/bazi/analyze',
        train: '/train/tickets',
        travelPlan: '/travel/plan',
        travelPurchase: '/travel/purchase',
    }
};

// 如果不需要导出任何内容，只需添加一个空的 export 语句
// export {};

// 修改所有的 API 请求
// 从:

// 改为:
fetch(`${API_BASE_URL}/scripts`) 