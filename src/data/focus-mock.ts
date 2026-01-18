import { FocusCard } from "@/types/focus";

export const mockCards: FocusCard[] = [
    {
        id: "focus-1",
        type: "email",
        title: "Q3 Revenue Report - Action Required",
        summary: "Sarah requests review of Q3 report showing 15% YoY revenue growth.",
        priority: "high",
        timeDisplay: "2h ago",
        relatedEmailId: "e1",
        guidanceText: "Sarah sent you an <b>urgent report</b> that needs your review by EOD Friday.",
        actions: [
            { label: "Review", action: "open-email", isPrimary: true },
            { label: "Archive", action: "archive" }
        ]
    },
    {
        id: "focus-2",
        type: "meeting",
        title: "Project Alpha Sync",
        priority: "high",
        timeDisplay: "10:00",
        meetingData: {
            id: "m-1",
            title: "Project Alpha - Sprint Review",
            time: "2:00 PM - 3:00 PM",
            location: "Conference Room B / Zoom",
            attendees: ["Lisa Wang", "Sarah Johnson", "Mike Wilson"],
            tags: ["Sprint", "Team"]
        },
        relatedEmailId: "e3",
        guidanceText: "You have a <b>Sprint Review meeting</b> tomorrow at 2 PM.",
        actions: [
            { label: "Join", action: "join", isPrimary: true },
            { label: "View Agenda", action: "view-agenda" }
        ]
    },
    {
        id: "focus-3",
        type: "insight",
        title: "Market Alert: Competitor X",
        priority: "medium",
        timeDisplay: "11:30",
        insightData: {
            type: "competitor-news",
            title: "Competitor X launched new AI feature",
            content: "They released a similar AI-powered email assistant feature yesterday. This could impact our market positioning.",
            source: "TechCrunch",
            impact: "high"
        },
        guidanceText: "There's important <b>competitor news</b> you should be aware of.",
        actions: [
            { label: "Read More", action: "read" },
            { label: "Dismiss", action: "archive" }
        ]
    },
    {
        id: "focus-4",
        type: "transit",
        title: "从C区出发去F区参加会议",
        priority: "medium",
        timeDisplay: "13:40",
        transitData: {
            startLocation: "C区 办公室",
            endLocation: "F区 会议室",
            type: "taxi",
            plateNumber: "沪A·12345",
            driver: "张师傅",
            estimateTime: "15分钟",
            fee: "约¥25",
            status: "arriving",
            departureTime: "13:50",
            suggestedAction: "从C区出发去F区参加会议",
            steps: [
                { type: "walk", instruction: "步行至C区大堂", time: "3分钟", from: "C区办公室", to: "C区大堂" },
                { type: "bus", instruction: "乘坐班车", time: "8分钟", from: "C区大堂", to: "F区入口" },
                { type: "walk", instruction: "步行至会议室", time: "2分钟", from: "F区入口", to: "F区会议室" }
            ]
        },
        meetingData: {
            id: "m-2",
            title: "客户演示会议",
            time: "14:00 - 15:00",
            location: "F区 3楼 会议室A",
            attendees: ["David Kim", "Lisa Wang"],
            tags: ["客户", "重要"]
        },
        guidanceText: "您需要在 <b>13:40</b> 出发前往下一个会议。",
        actions: [
            { label: "开始导航", action: "navigate", isPrimary: true }
        ]
    },
    {
        id: "focus-5",
        type: "todo",
        title: "Today's Action Items",
        priority: "medium",
        timeDisplay: "15:00",
        todoList: [
            { id: "t-1", content: "Review Q3 Report", isDone: false, relatedEmailId: "e1" },
            { id: "t-2", content: "Schedule call with Mike", isDone: false, relatedEmailId: "e2" },
            { id: "t-3", content: "Respond to David about contract", isDone: true, relatedEmailId: "e4" }
        ],
        guidanceText: "You have <b>3 action items</b> to complete today.",
        actions: [
            { label: "View All", action: "view-todos" }
        ]
    },
    {
        id: "focus-6",
        type: "email",
        title: "Partnership proposal follow-up",
        summary: "Mike sent revised partnership proposal with 60/40 revenue split.",
        priority: "medium",
        timeDisplay: "1d ago",
        relatedEmailId: "e2",
        guidanceText: "Mike is waiting for your response on the <b>partnership proposal</b>.",
        actions: [
            { label: "Reply", action: "reply", isPrimary: true },
            { label: "Archive", action: "archive" }
        ]
    }
];

// Morning Briefing Data (used by BriefingHeader)
export const mockBriefing = {
    headline: "Good Morning, Alex",
    summary: "You have <b>3 meetings</b> and <b>5 important emails</b> today. Your first meeting starts in 30 minutes.",
    dateDisplay: "Wednesday, October 24"
};
