import { CalendarEvent } from "@/types/calendar";
import { getUserForAccount } from "./dataFoundation";

const mockUser = getUserForAccount("u1");

const baseDate = new Date('2024-08-05T00:00:00'); // Monday
const getTime = (dayOffset: number, hour: number, minute: number) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
};

export const mockEvents: CalendarEvent[] = [
    // --- Cancelled Event Demo (Tuesday Morning) ---
    {
        id: "ev-cancelled-demo",
        title: "头脑风暴会议",
        type: "meeting",
        start: getTime(1, 10, 0), // Tue 10:00 AM
        end: getTime(1, 11, 0), // Tue 11:00 AM
        location: "会议室 A",
        attendees: [mockUser],
        status: "cancelled",
        sourceEmailId: "e-cal-cancelled"
    },
    // --- Monday (Aug 5) ---
    {
        id: "ev-1",
        title: "Q3 战略同步会议",
        type: "meeting",
        start: getTime(0, 10, 0), // Mon 10:00 AM
        end: getTime(0, 11, 30), // Mon 11:30 AM
        location: "战略会议室 A",
        description: "与设计和工程团队的季度对齐会议。",
        attendees: [
            mockUser,
            { ...mockUser, id: "u2", name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=sarah" },
            { ...mockUser, id: "u3", name: "Mike Chen", avatar: "https://i.pravatar.cc/150?u=mike" },
            { ...mockUser, id: "u4", name: "Jessica Wu", avatar: "https://i.pravatar.cc/150?u=jessica" },
            { ...mockUser, id: "u5", name: "Tom Wilson", avatar: "https://i.pravatar.cc/150?u=tom" }
        ],
        sourceEmailId: "e-cal-1",
        sourceEmail: {
            id: "e-cal-1",
            subject: "周一会议议程",
            from: { id: "u2", name: "Sarah Jenkins", email: "sarah@company.com", avatar: "https://i.pravatar.cc/150?u=sarah" },
            to: [{ id: "me", name: "我", email: "me@company.com", avatar: "" }],
            sentAt: getTime(-1, 14, 30), // Yesterday
            content: "大家好，这是议程...",
            preview: "大家好，这是周一会议的议程...",
            hasAttachments: true,
            isRead: true,
            isStarred: false,
            folderId: "inbox",
            priority: "high",
            labels: [],
            aiSummary: "讨论 Q3 预算削减和市场路线图。",
            aiReason: "战略对齐",
            aiTags: ["会议"],
            aiTodos: []
        },
        aiContext: {
            summary: "这次会议是在'Q2 回顾'邮件讨论后安排的。主要讨论点包括市场预算削减。",
            note: "Sarah 在 Slack 消息中提到她会迟到 10 分钟。",
            attachments: [
                { name: "Q3_演示草案_v2.pdf", size: "2.4 MB", type: "pdf" }
            ]
        }
    },
    {
        id: "ev-mon-2",
        title: "周会",
        type: "meeting",
        start: getTime(0, 9, 0), // Mon 9:00 AM
        end: getTime(0, 9, 30), // Mon 9:30 AM
        location: "线上 - Zoom",
        attendees: [mockUser, { ...mockUser, id: "u3", name: "Mike Chen", avatar: "https://i.pravatar.cc/150?u=mike" }],
        isAllDay: false,
        sourceEmailId: "e-cal-zhouhui"
    },
    {
        id: "ev-mon-3",
        title: "每日站会",
        type: "meeting",
        start: getTime(0, 9, 30), // Mon 9:30 AM
        end: getTime(0, 9, 45), // Mon 9:45 AM
        location: "开放办公区",
        attendees: [mockUser],
        sourceEmailId: "e-cal-standup"
    },
    {
        id: "ev-mon-4",
        title: "准备客户演示",
        type: "task",
        start: getTime(0, 11, 30), // Mon 11:30 AM
        end: getTime(0, 12, 30), // Mon 12:30 PM
        description: "Review slides for Acme Corp.",
        attendees: [mockUser],
        sourceEmailId: "e-task-demo"
    },
    {
        id: "ev-mon-5",
        title: "午餐",
        type: "meeting",
        start: getTime(0, 12, 30), // Mon 12:30 PM
        end: getTime(0, 13, 30), // Mon 1:30 PM
        location: "Salad Bar",
        attendees: [mockUser],
        sourceEmailId: "e-cal-lunch"
    },
    {
        id: "ev-mon-6",
        title: "产品需求评审",
        type: "meeting",
        start: getTime(0, 13, 30), // Mon 1:30 PM
        end: getTime(0, 15, 0), // Mon 3:00 PM
        location: "会议室 C",
        attendees: [mockUser, { ...mockUser, id: "u4", name: "Jessica Wu" }],
        sourceEmailId: "e-cal-product-review"
    },
    {
        id: "ev-mon-7",
        title: "技术方案讨论",
        type: "meeting",
        start: getTime(0, 15, 0), // Mon 3:00 PM
        end: getTime(0, 16, 0), // Mon 4:00 PM
        location: "在线",
        attendees: [mockUser, { ...mockUser, id: "u3", name: "Mike Chen" }],
        sourceEmailId: "e-cal-tech-discuss"
    },
    {
        id: "ev-mon-8",
        title: "审批报销单",
        type: "task",
        start: getTime(0, 16, 0), // Mon 4:00 PM
        end: getTime(0, 16, 30), // Mon 4:30 PM
        attendees: [mockUser],
        sourceEmailId: "e-task-expense"
    },
    {
        id: "ev-mon-9",
        title: "阅读行业报告",
        type: "task",
        start: getTime(0, 16, 30), // Mon 4:30 PM
        end: getTime(0, 17, 30), // Mon 5:30 PM
        attendees: [mockUser],
        sourceEmailId: "e-task-report"
    },
    {
        id: "ev-mon-10",
        title: "代码审查",
        type: "task",
        start: getTime(0, 17, 30), // Mon 5:30 PM
        end: getTime(0, 18, 30), // Mon 6:30 PM
        attendees: [mockUser],
        sourceEmailId: "e-task-codereview"
    },
    {
        id: "ev-mon-11",
        title: "HR 面试",
        type: "meeting",
        start: getTime(0, 8, 30), // Mon 8:30 AM
        end: getTime(0, 9, 0), // Mon 9:00 AM
        location: "电话会议",
        attendees: [mockUser],
        sourceEmailId: "e-cal-hr-interview"
    },
    {
        id: "ev-mon-12",
        title: "整理工位",
        type: "task",
        start: getTime(0, 8, 0), // Mon 8:00 AM
        end: getTime(0, 8, 15),
        attendees: [mockUser],
        sourceEmailId: "e-task-clean-desk"
    },

    // --- Tuesday (Aug 6) ---
    {
        id: "ev-tue-1",
        title: "客户会议 - Acme Corp",
        type: "meeting",
        start: getTime(1, 14, 0), // Tue 2:00 PM
        end: getTime(1, 15, 0), // Tue 3:00 PM
        location: "会议室 C",
        description: "讨论新的合同条款。",
        attendees: [mockUser, { ...mockUser, id: "u6", name: "Client Lead", avatar: "" }],
        sourceEmailId: "e3", // Linking to existing mock email if possible, but here we define a new one for context
        sourceEmail: {
            id: "e-cal-2",
            subject: "Re: 合同审查",
            from: { id: "u6", name: "Acme Client", email: "client@acme.com", avatar: "" },
            to: [{ id: "me", name: "我", email: "me@company.com", avatar: "" }],
            sentAt: getTime(0, 16, 0),
            content: "我们对第 3 条款有些疑问...",
            preview: "我们对第 3 条款有些疑问，明天会议讨论。",
            isRead: true,
            isStarred: true,
            folderId: "inbox",
            priority: "medium",
            labels: ["Client"],
            aiSummary: "客户对条款 3 有异议，需要准备解释。",
            aiReason: "客户重要邮件",
            aiTags: ["合同"],
            aiTodos: []
        },
        aiContext: {
            summary: "客户主要关注付款周期和知识产权条款。",
            note: "记得带上上次签署的 NDA 副本。",
            attachments: [
                { name: "Acme_合同_v3.docx", size: "1.2 MB", type: "doc" }
            ]
        }
    },
    {
        id: "ev-tue-2",
        title: "深度工作",
        type: "task",
        start: getTime(1, 9, 0), // Tue 9:00 AM
        end: getTime(1, 11, 30), // Tue 11:30 AM
        location: "个人工位",
        description: "专注于 Q3 规划文档的编写，请勿打扰。",
        attendees: [mockUser],
        sourceEmailId: "e-task-deep-focus"
    },

    // --- Wednesday (Aug 7) ---
    {
        id: "ev-3",
        title: "设计同步",
        type: "meeting",
        start: getTime(2, 11, 0), // Wed 11:00 AM
        end: getTime(2, 12, 0), // Wed 12:00 PM
        location: "会议室 B",
        attendees: [mockUser],
        sourceEmailId: "e-cal-design-sync"
    },
    {
        id: "ev-4",
        title: "团队午餐",
        type: "meeting",
        start: getTime(2, 12, 0), // Wed 12:00 PM
        end: getTime(2, 13, 0), // Wed 1:00 PM
        location: "员工餐厅",
        attendees: [mockUser],
        sourceEmailId: "e-cal-team-lunch"
    },
    {
        id: "ev-wed-3",
        title: "审查设计稿",
        type: "task",
        start: getTime(2, 16, 0), // Wed 4:00 PM
        end: getTime(2, 17, 0), // Wed 5:00 PM
        attendees: [mockUser],
        sourceEmailId: "e-task-designreview"
    },

    // --- Thursday (Aug 8) ---
    {
        id: "ev-thu-1",
        title: "产品评审",
        type: "meeting",
        start: getTime(3, 10, 0), // Thu 10:00 AM
        end: getTime(3, 11, 30), // Thu 11:30 AM
        location: "主会议室",
        attendees: [
            mockUser,
            { ...mockUser, id: "u2", name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=sarah" },
            { ...mockUser, id: "u4", name: "Jessica Wu", avatar: "https://i.pravatar.cc/150?u=jessica" }
        ],
        aiContext: {
            summary: "本次评审重点是新的移动端交互流程。",
        }
    },
    {
        id: "ev-2",
        title: "提交费用报告",
        type: "task",
        start: getTime(3, 15, 0), // Thu 3:00 PM
        end: getTime(3, 16, 0), // Thu 4:00 PM - Giving it duration
        description: "财务团队提交月度费用的截止日期。",
        attendees: [mockUser],
        isAllDay: false,
        sourceEmailId: "e-task-feesubmit"
    },
    {
        id: "ev-thu-3",
        title: "健身",
        type: "reminder",
        start: getTime(3, 18, 0), // Thu 6:00 PM
        end: getTime(3, 19, 0), // Thu 7:00 PM
        attendees: [mockUser],
        description: "腿部训练日",
        sourceEmailId: "e-cal-gym"
    },

    // --- Friday (Aug 9) ---
    {
        id: "ev-fri-1",
        title: "1:1 经理沟通",
        type: "meeting",
        start: getTime(4, 10, 0), // Fri 10:00 AM
        end: getTime(4, 10, 30), // Fri 10:30 AM
        location: "经理办公室",
        attendees: [mockUser, { ...mockUser, id: "u2", name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=sarah" }],
        sourceEmailId: "e-cal-1on1"
    },
    {
        id: "ev-fri-2",
        title: "周报撰写",
        type: "task",
        start: getTime(4, 16, 0), // Fri 4:00 PM
        end: getTime(4, 17, 0), // Fri 5:00 PM
        attendees: [mockUser],
        sourceEmailId: "e-task-weeklyreport"
    },
    {
        id: "ev-fri-3",
        title: "周五欢乐时光",
        type: "meeting", // Social
        start: getTime(4, 17, 30), // Fri 5:30 PM
        end: getTime(4, 19, 0), // Fri 7:00 PM
        location: "附近的酒吧",
        attendees: [mockUser, { ...mockUser, id: "u3", name: "Mike Chen", avatar: "https://i.pravatar.cc/150?u=mike" }],
        description: "庆祝项目里程碑达成！",
        sourceEmailId: "e-cal-happy-hour"
    }
];
