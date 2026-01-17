export interface ReplySuggestion {
    id: string;
    mailId: string; // The email this suggestion belongs to
    strategy: string; // The core strategy/intent (e.g. "Approve", "Decline")
    preview: string; // The detailed reply content
}

export const mockReplySuggestions: ReplySuggestion[] = [
    {
        id: "sugg-1",
        mailId: "e1", // Starship Launch email
        strategy: "同意并询问详细时间",
        preview: "嗨 Elon，\n\n很高兴听到发射成功的消息。关于助推器遥测数据的分析，我和团队会立即着手处理。\n\n我们会优先查看传感器日志，并在下班前提交初步报告。\n\n祝好，"
    },
    {
        id: "sugg-2",
        mailId: "e1",
        strategy: "确认收到并安排任务",
        preview: "收到。已通知团队 Flight 6 的数据分析是最高优先级。\n\n我们会专注于风切变数据和传感器日志的关联分析。"
    },
    {
        id: "sugg-3",
        mailId: "focus-meeting", // Project Alpha Sync
        strategy: "确认参加",
        preview: "好的，我会准时参加下午 2 点的 Project Alpha 同步会。\n\nQ3 报告我已经准备好了。"
    },
    {
        id: "sugg-4",
        mailId: "focus-meeting",
        strategy: "询问会议议程",
        preview: "嗨，\n\n关于下午的同步会，我们需要准备额外的材料吗？Q4 的规划文档是否需要在会前发给大家预览？"
    },
    {
        id: "sugg-5",
        mailId: "1", // Keep legacy just in case
        strategy: "Legacy Test",
        preview: "Test content."
    }
];

export const getSuggestionsForEmail = (mailId: string) => {
    return mockReplySuggestions.filter(s => s.mailId === mailId);
};
