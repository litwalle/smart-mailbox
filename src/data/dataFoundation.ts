import { Email, Folder, User } from "../types/mail";
import { FocusCard, MorningBriefing } from "@/types/focus";

// ------------------------------------------------------------------
// 1. Interfaces
// ------------------------------------------------------------------

export interface Account {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
}

interface AccountData {
    user: User; // The user object for this account (same as Account but consistent with User type)
    folders: Folder[];
    emails: Email[];
    focusBriefing: MorningBriefing;
}

// ------------------------------------------------------------------
// 2. Helper Functions (Migrated from mock-data.ts & focus-mock.ts)
// ------------------------------------------------------------------

const generateLongContent = (subject: string, topic: string) => `
    <p>Dear All,</p>
    <p>I hope this email finds you well. I am writing to provide a comprehensive update regarding the status of <strong>${topic}</strong>.</p>
    <p>Over the past few weeks, we have made significant strides.</p>
    <h3>1. Strategic Alignment</h3>
    <p>We must ensure execution strategy is fully integrated.</p>
    <h3>2. Operational Efficiency</h3>
    <p>We have noticed some bottlenecks in our current workflow, particularly in the ${topic} approval process.</p>
    <p>Best regards,</p>
    <p><strong>The Management Team</strong></p>
`;

function transformEmailToTodoCard(email: Email): FocusCard {
    const isToday = email.aiTodos?.[0]?.deadline?.includes('Today') || false;
    const isTomorrow = email.aiTodos?.[0]?.deadline?.includes('Tomorrow');

    let guidanceText = "Upcoming";
    let guidanceIcon = "event_note";
    let timeDisplay = email.aiTodos?.[0]?.deadline || "No Deadline";

    if (isToday) {
        guidanceText = "Today";
        guidanceIcon = "check_circle";
    } else if (isTomorrow) {
        guidanceText = "Tomorrow";
        guidanceIcon = "event_upcoming";
    } else {
        guidanceText = "Later";
        guidanceIcon = "date_range";
    }

    return {
        id: `todo-from-${email.id}`,
        type: 'todo',
        priority: email.priority === 'high' ? 80 : 50,
        guidanceIcon,
        guidanceText,
        title: email.subject,
        summary: email.aiSummary || email.preview,
        timeDisplay,
        relatedEmailId: email.id,
        relatedEmail: email,
        todoList: email.aiTodos?.map(t => ({
            id: t.id,
            content: t.content,
            isDone: t.isCompleted,
            deadline: t.deadline,
            isUrgent: t.priority === 'high',
            relatedEmailId: email.id,
            action: t.action ? {
                label: t.action.label,
                onClick: () => console.log('Action clicked:', t.action?.url)
            } : undefined
        })) || [],
        actions: [
            { label: "View Email", actionType: "open", isPrimary: true }
        ]
    };
}

// ------------------------------------------------------------------
// 3. Data Providers
// ------------------------------------------------------------------

// --- Account 1: Alex Executive (Original Data) ---
const alexUser: User = {
    id: "u1",
    name: "Alex Executive",
    email: "alex@company.com",
    avatar: "https://i.pravatar.cc/150?u=u1",
    role: "Product Director"
};

const alexFolders: Folder[] = [
    { id: "focus", name: "焦点收件箱", icon: "wb_sunny", type: "system", color: "text-amber-500" },
    { id: "todo", name: "待办事项", icon: "check_circle", type: "system", color: "text-green-500" },
    { id: "vip", name: "重要联系人", icon: "stars", type: "smart", color: "text-yellow-500" },
    { id: "meetings", name: "会议纪要", icon: "history_edu", type: "smart", color: "text-blue-400" },
    { id: "approvals", name: "审批", icon: "fact_check", type: "smart", color: "text-purple-500" },
    { id: "inbox", name: "收件箱", icon: "inbox", type: "system", unreadCount: 12 },
    { id: "sent", name: "已发送", icon: "send", type: "system" },
    { id: "archive", name: "归档", icon: "inventory_2", type: "system" },
    { id: "trash", name: "已删除", icon: "delete", type: "system" },
    { id: "project-alpha", name: "Alpha 项目", icon: "folder", type: "user", color: "text-slate-500" },
    { id: "finance", name: "财务报表", icon: "folder", type: "user", color: "text-slate-500" }
];

// Re-creating the specific emails for Alex to ensure they are self-contained
const alexEmails: Email[] = [
    {
        id: "e1",
        from: { id: "u2", name: "Elon Musk", email: "elon@spacex.com", avatar: "https://i.pravatar.cc/150?u=u2" },
        to: [alexUser],
        subject: "Update on Starship Launch Flight 6",
        deadline: "Today, 13:00 PM",
        preview: "Launch was successful. We need the data telemetry for the booster catch mechanism immediately.",
        content: `
            <div style="font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6;">
                <p>Team,</p>
                <p>The launch of <strong>Flight 6</strong> was a resounding success. The Super Heavy booster catch attempt was scrubbed due to a sensor anomaly, but the ship successfully reached orbit and demonstrated a controlled reentry.</p>
                
                <h3 style="color: #0f172a; margin-top: 24px;">Critical Next Steps</h3>
                <p>We need to analyze the telemetry data from the booster catch mechanism to understand why the "catch" criteria were not met. This is critical for Flight 7.</p>
                
                <ul>
                    <li>Review sensor logs from the tower arms.</li>
                    <li>Correlate wind shear data with booster approach vector.</li>
                    <li>Prepare a preliminary report by EOD.</li>
                </ul>

                <p>Let's move fast. Mars isn't waiting.</p>

                <p>Best,<br>Elon</p>
            </div>
        `,
        translatedSubject: "关于 Starship 第 6 次飞行发射的更新",
        translatedContent: `
            <div style="font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6;">
                <p>团队们，</p>
                <p><strong>第 6 次飞行</strong>的发射取得了巨大成功。虽然由于传感器异常取消了超重型助推器的捕获尝试，但飞船成功进入轨道并演示了受控再入。</p>
                
                <h3 style="color: #0f172a; margin-top: 24px;">关键下一步</h3>
                <p>我们需要立即分析助推器捕获机制的遥测数据，以了解为何未满足"捕获"标准。这对第 7 次飞行至关重要。</p>
                
                <ul>
                    <li>审查塔臂的传感器日志。</li>
                    <li>将风切变数据与助推器接近矢量相关联。</li>
                    <li>在今天结束前准备一份初步报告。</li>
                </ul>

                <p>行动要快。火星不会等我们。</p>

                <p>祝好，<br>Elon</p>
            </div>
        `,
        isRead: false,
        size: "2.4 MB",
        cc: [
            { id: "u3-cc", name: "Gwynne Shotwell", email: "gwynne@spacex.com", avatar: "" },
            { id: "u4-cc", name: "Starship Team", email: "team@spacex.com", avatar: "" }
        ],
        bcc: [
            { id: "u-bcc", name: "Board Member", email: "board@spacex.com", avatar: "" }
        ],
        isStarred: true,
        sentAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        folderId: "inbox",
        labels: ["Work", "Urgent"],
        priority: "high",
        aiSummary: "The launch was successful, but the booster catch was aborted. Urgent analysis of telemetry data is required for Flight 7.",
        translatedSummary: "发射成功，但助推器回收取消。急需分析遥测数据以为第 7 次飞行做准备。",
        aiTodos: [{
            id: "t1",
            content: "Analyze booster telemetry data",
            isCompleted: false,
            sourceEmailId: "e1",
            priority: "high",
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
            action: { label: "View Telemetry", url: "#dashboard", type: "primary" }
        }],
        actionCapsules: [
            { id: "ac1", label: "查看遥测", type: "primary" },
            { id: "ac2", label: "回复", type: "secondary" },
            { id: "ac3", label: "转发", type: "secondary" }
        ],
        translatedTodos: [{
            id: "t1-trans",
            content: "分析助推器遥测数据",
            isCompleted: false,
            sourceEmailId: "e1",
            priority: "high",
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
            action: { label: "查看遥测", url: "#dashboard", type: "primary" }
        }]
    },
    {
        id: "focus-meeting",
        from: { id: "calendar", name: "Calendar", email: "calendar@company.com" },
        to: [alexUser],
        subject: "Project Alpha Sync",
        preview: "Room B • Attachment ready",
        size: "450 KB",
        cc: [
            { id: "u-sarah", name: "Sarah Johnson", email: "sarah.johnson@company.com", avatar: "https://i.pravatar.cc/150?u=sarah-johnson" },
            { id: "u-mike", name: "Mike Vendor", email: "mike@vendor.com", avatar: "" }
        ],
        content: "<p>Meeting reminder: Project Alpha Sync...</p>",
        translatedSubject: "Project Alpha 同步会",
        translatedContent: "<p>会议提醒：Project Alpha 同步会...</p>",
        isRead: true,
        isStarred: false,
        sentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        folderId: "inbox",
        labels: ["Meeting"],
        priority: "medium",
        aiSummary: "Reminder for Project Alpha Sync meeting.",
        translatedSummary: "Project Alpha 同步会议提醒",
        actionCapsules: [
            { id: "ac-meeting-1", label: "加入会议", type: "primary" },
            { id: "ac-meeting-2", label: "查看日程", type: "secondary" },
            { id: "ac-meeting-3", label: "发送消息", type: "secondary" }
        ],
        meetingRequest: {
            id: 'mr-focus-1',
            title: 'Project Alpha Sync',
            translatedTitle: 'Project Alpha 同步会',
            start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
            timeZone: 'Asia/Shanghai',
            location: 'Room B',
            translatedLocation: '会议室 B',
            joinUrl: 'https://zoom.us/j/123456789',
            meetingType: 'internal',
            description: '<p>Review Q3 metrics and plan for Q4 launch.</p>',
            translatedDescription: '<p>回顾 Q3 指标并规划 Q4 发布。</p>',
            attendees: [
                { name: 'Calendar', email: 'calendar@company.com', role: 'organizer', type: 'internal', status: 'accepted', avatar: '' },
                { name: 'Alex Executive', email: 'alex@company.com', role: 'required', type: 'internal', status: 'accepted', avatar: 'https://i.pravatar.cc/150?u=u1' },
                { name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'required', type: 'internal', status: 'accepted', avatar: 'https://i.pravatar.cc/150?u=sarah-johnson' },
                { name: 'Mike Vendor', email: 'mike@vendor.com', role: 'optional', type: 'external', status: 'pending', avatar: '' }
            ],
            agendaItems: [
                { id: 'ag1', title: 'Welcome & Sync', translatedTitle: '欢迎与同步', type: 'Discussion', translatedType: '讨论', duration: '5m', time: '14:00 - 14:05' },
                { id: 'ag2', title: 'Q3 Metrics Review', translatedTitle: 'Q3 指标回顾', type: 'Presentation', translatedType: '演示', duration: '25m', time: '14:05 - 14:30', description: 'Deep dive into user growth', translatedDescription: '深入分析用户增长' },
                { id: 'ag3', title: 'Q4 Planning', translatedTitle: 'Q4 规划', type: 'Workshop', translatedType: '研讨会', duration: '30m', time: '14:30 - 15:00' }
            ],
            materials: [
                { name: 'Q3_Report_Final.pdf', translatedName: 'Q3报告_终版.pdf', url: '#', type: 'doc' },
                { name: 'Q4_Roadmap_Draft', translatedName: 'Q4路线图_草稿', url: '#', type: 'slide' }
            ],
            notices: [
                'Please join 5 minutes early to test audio.',
                'Materials are confidential.',
                'Meeting will be recorded.'
            ],
            translatedNotices: [
                '请提前5分钟加入以测试音频。',
                '资料为机密文件。',
                '会议将被录制。'
            ]
        }
    },
    {
        id: "focus-meeting-design",
        from: { id: "design-lead", name: "Design Team", email: "design@company.com" },
        to: [alexUser],
        subject: "Product Design Review (UX)",
        size: "12 MB",
        preview: "Zoom • V2 Component Library Review",
        content: "<p>Review V2 Component Library UX changes...</p>",
        translatedSubject: "产品设计评审 (UX)",
        translatedContent: "<p>审查 V2 组件库 UX 变更...</p>",
        isRead: false,
        isStarred: false,
        sentAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        folderId: "inbox",
        labels: ["Meeting", "Design"],
        priority: "medium",
        aiSummary: "UX Review: V2 Component Library",
        translatedSummary: "UX 评审：V2 组件库",
        aiTodos: [{
            id: "todo-2",
            content: "回复设计团队的评审反馈",
            isCompleted: false,
            sourceEmailId: "focus-meeting-design",
            priority: "medium",
            deadline: "今天 16:00"
        }],
        translatedTodos: [{
            id: "todo-2-trans",
            content: "回复设计团队的评审反馈",
            isCompleted: false,
            sourceEmailId: "focus-meeting-design",
            priority: "medium",
            deadline: "今天 16:00"
        }],
        meetingRequest: {
            id: 'mr-design-1',
            title: 'Product Design Review (UX)',
            start: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(16, 30, 0, 0)).toISOString(),
            timeZone: 'Asia/Shanghai',
            location: 'Zoom',
            attendees: [{ name: 'Alex Executive', email: 'alex@company.com', status: 'accepted' }],
            description: '<p>Review V2 updates.</p>'
        }
    },
    {
        id: "focus-meeting-client",
        from: { id: "sales", name: "Sales Team", email: "sales@company.com" },
        to: [alexUser],
        subject: "Client Requirement Sync",
        size: "1.8 MB",
        preview: "Room A • Requirement Clarification",
        content: "<p>Client Sync regarding Q4 requirements.</p>",
        translatedSubject: "客户需求沟通",
        translatedContent: "<p>关于 Q4 需求的客户沟通。</p>",
        isRead: true,
        isStarred: true,
        sentAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        folderId: "inbox",
        labels: ["Meeting", "External"],
        priority: "high",
        aiSummary: "Client requirements discussion for Q4.",
        translatedSummary: "Q4 客户需求讨论。",
        aiTodos: [{
            id: "todo-3",
            content: "准备客户会议材料",
            isCompleted: true,
            sourceEmailId: "focus-meeting-client",
            priority: "medium",
            deadline: "今天 17:00"
        }],
        translatedTodos: [{
            id: "todo-3-trans",
            content: "准备客户会议材料",
            isCompleted: true,
            sourceEmailId: "focus-meeting-client",
            priority: "medium",
            deadline: "今天 17:00"
        }],
        meetingRequest: {
            id: 'mr-client-1',
            title: 'Client Requirement Sync',
            start: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
            timeZone: 'Asia/Shanghai',
            location: 'Room A',
            attendees: [{ name: 'Alex Executive', email: 'alex@company.com', status: 'accepted' }],
            description: '<p>Clarify requirements.</p>'
        }
    },
    {
        id: "focus-sarah",
        from: { id: "sarah", name: "Sarah Johnson", email: "sarah.johnson@company.com", avatar: "https://i.pravatar.cc/150?u=sarah-johnson" },
        to: [alexUser],
        subject: "Offer Acceptance - Project Manager Position",
        preview: "Candidate accepted offer. Waiting for final signature.",
        content: "<p>Hi Alex, I have officially decided to accept the offer...</p>",
        translatedSubject: "Offer 接受 - 项目经理职位",
        translatedContent: "<p>嗨 Alex，我已正式决定接受 Offer...</p>",
        isRead: false,
        isStarred: true,
        sentAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        folderId: "inbox",
        labels: ["HR", "Urgent"],
        priority: "high",
        aiSummary: "Candidate accepted offer. Waiting for final signature.",
        translatedSummary: "候选人已接受 Offer，等待最终签字。",
        aiTodos: [{
            id: "t_sarah_1", content: "Approve onboarding documents", isCompleted: false, sourceEmailId: "focus-sarah", priority: "high", deadline: "Today 12:00 PM",
            action: { label: "Approve", url: "#approve", type: "primary" }
        }],
        translatedTodos: [{
            id: "t_sarah_1-trans", content: "批准入职文件", isCompleted: false, sourceEmailId: "focus-sarah", priority: "high", deadline: "今天 12:00 PM",
            action: { label: "批准", url: "#approve", type: "primary" }
        }]
    },
    {
        id: 'e_insight',
        subject: 'Gartner Trend Insight: Vibe Coding',
        preview: 'Latest research on how AI driven coding is changing...',
        from: { id: 'u_gartner', name: 'Gartner Research', email: 'insights@gartner.com', avatar: '' },
        to: [{ id: 'me', name: 'Me', email: 'me@example.com' }],
        sentAt: new Date().toISOString(),
        content: `
            <div style="font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6;">
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 32px; border-radius: 12px; margin-bottom: 24px;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Gartner Technology Trends 2026</h1>
                    <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Special Report: The Rise of Vibe Coding</p>
                </div>

                <p style="font-size: 16px;"><strong>Executive Summary:</strong> The software development landscape is undergoing its most significant shift since the advent of open source. "Vibe Coding" represents a paradigm where AI-augmented intent supersedes syntax.</p>

                <h3 style="color: #1e293b; margin-top: 24px;">What is Vibe Coding?</h3>
                <p>Vibe Coding isn't just about using Copilot or ChatGPT. It's a workflow where developers act as <em>Architects of Intent</em>. Instead of writing boilerplate, they curate the "vibe"—the architectural patterns, behavioral constraints, and aesthetic goals—and let purpose-built AI agents handle the implementation.</p>

                <div style="background: #f1f5f9; border-left: 4px solid #4f46e5; padding: 16px; margin: 24px 0;">
                    <strong>Key Prediction:</strong> By 2027, 65% of enterprise application code will be generated by AI agents managed by "Vibe Coders" rather than written by hand.
                </div>

                <h3 style="color: #1e293b;">Core Pillars</h3>
                <ul>
                    <li><strong>Natural Language Logic:</strong> Describing complex state machines in plain English.</li>
                    <li><strong>Contextual Resonance:</strong> AI agents that "grok" the entire repository's style and conventions instantly.</li>
                    <li><strong>Review over Writing:</strong> The developer's primary loop shifts from typing to reviewing and refining AI outputs.</li>
                </ul>

                <p>This shift requires a new set of skills: <strong>Prompt Engineering (Advanced)</strong>, <strong>System Design</strong>, and <strong>Code Review</strong> proficiency are becoming more valuable than rote syntax memorization.</p>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                
                <p style="font-size: 12px; color: #94a3b8;">&copy; 2026 Gartner, Inc. and/or its affiliates. All rights reserved.</p>
            </div>
        `,
        translatedSubject: "Gartner 趋势洞察：Vibe Coding",
        translatedSummary: "2026 技术趋势：Vibe Coding 正在重塑开发体验。",
        translatedContent: `
             <div style="font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6;">
                <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 32px; border-radius: 12px; margin-bottom: 24px;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Gartner 2026 技术趋势</h1>
                    <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">特别报告：Vibe Coding 的崛起</p>
                </div>

                <p style="font-size: 16px;"><strong>执行摘要：</strong> 软件开发领域正在经历自开源以来最重大的转变。"Vibe Coding" 代表了一种范式，即 AI 增强的意图取代了语法。</p>

                <h3 style="color: #1e293b; margin-top: 24px;">什么是 Vibe Coding？</h3>
                <p>Vibe Coding 不仅仅是使用 Copilot 或 ChatGPT。这是一个工作流程，开发人员充当<em>意图架构师</em>。他们不再编写样板代码，而是策划"Vibe"——架构模式、行为约束和审美目标——并让专用 AI 代理处理实施。</p>

                <div style="background: #f1f5f9; border-left: 4px solid #4f46e5; padding: 16px; margin: 24px 0;">
                    <strong>关键预测：</strong> 到 2027 年，65% 的企业应用代码将由"Vibe Coder"管理的 AI 代理生成，而不是手动编写。
                </div>

                <h3 style="color: #1e293b;">核心支柱</h3>
                <ul>
                    <li><strong>自然语言逻辑：</strong> 用简单的英语描述复杂的状态机。</li>
                    <li><strong>上下文共鸣：</strong> AI 代理能够瞬间"领悟"整个代码库的风格和惯例。</li>
                    <li><strong>审查于编写之上：</strong> 开发人员的主要循环从打字转变为审查和完善 AI 输出。</li>
                </ul>

                <p>这种转变需要一套新的技能：<strong>提示工程（高级）</strong>、<strong>系统设计</strong>和<strong>代码审查</strong>能力正变得比死记硬背语法更有价值。</p>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                
                <p style="font-size: 12px; color: #94a3b8;">&copy; 2026 Gartner, Inc. 及其关联公司。保留所有权利。</p>
            </div>
        `,
        isRead: true,
        isStarred: false,
        folderId: 'inbox',
        labels: ['Report'],
        priority: 'medium',
        aiSummary: "2026 Tech Trend: Vibe Coding is reshaping the development experience."
    },
    {
        id: "long-email-1",
        from: { id: "u-long", name: "System Admin", email: "admin@company.com" },
        to: [alexUser],
        subject: "Q4 System Logs & Audit Report (Full)",
        preview: "Attached is the full audit log for Q4. Please scroll down to review the entire history.",
        content: `
            <div style="font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6;">
                <h2>Q4 System Audit Logs</h2>
                <p>This is an automated report containing all system events for Q4. Please review carefully.</p>
                <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e2e8f0;" />
                
                ${Array.from({ length: 50 }).map((_, i) => `
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0; color: #1e293b;">Event #${5000 + i}: System Health Check</h4>
                        <p style="margin: 4px 0; font-size: 14px; color: #64748b;">Timestamp: 2024-12-${Math.floor(i / 2) + 1} 08:00:00</p>
                        <p>Status: <span style="color: #10b981; font-weight: 500;">Optimal</span>. All systems operations within normal parameters. Memory usage at 45%. CPU load at 12%. No anomalies detected in the primary cluster.</p>
                        <p style="font-size: 13px; color: #94a3b8;">Hash: a1b2c3d4e5f6-${i}</p>
                    </div>
                `).join('')}

                <div style="background: #f8fafc; padding: 24px; border-radius: 8px; margin-top: 32px;">
                    <h3>End of Report</h3>
                    <p>Generated by System Monitor v2.4</p>
                </div>
            </div>
        `,
        translatedSubject: "Q4 系统日志与审计报告（完整版）",
        translatedContent: `
             <div style="font-family: 'Inter', sans-serif; color: #334155; line-height: 1.6;">
                <h2>Q4 系统审计日志</h2>
                <p>这是一份自动生成的报告，包含 Q4 的所有系统事件。请仔细审查。</p>
                <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e2e8f0;" />
                
                ${Array.from({ length: 50 }).map((_, i) => `
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0; color: #1e293b;">事件 #${5000 + i}: 系统健康检查</h4>
                        <p style="margin: 4px 0; font-size: 14px; color: #64748b;">时间戳: 2024-12-${Math.floor(i / 2) + 1} 08:00:00</p>
                        <p>状态: <span style="color: #10b981; font-weight: 500;">最佳</span>。所有系统运行参数正常。内存使用率 45%。CPU 负载 12%。主集群未检测到异常。</p>
                        <p style="font-size: 13px; color: #94a3b8;">哈希: a1b2c3d4e5f6-${i}</p>
                    </div>
                `).join('')}

                <div style="background: #f8fafc; padding: 24px; border-radius: 8px; margin-top: 32px;">
                    <h3>报告结束</h3>
                    <p>由系统监控 v2.4 生成</p>
                </div>
            </div>
        `,
        isRead: false,
        isStarred: false,
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        folderId: "inbox",
        labels: ["System", "Report"],
        priority: "low",
        aiSummary: "Automated Q4 System Audit Logs. Contains 50+ event entries.",
        translatedSummary: "Q4 自动化系统审计日志。包含 50+ 条事件记录。"
    },
    // Generate filler emails
    ...Array.from({ length: 20 }).map((_, i) => ({
        id: `gen-${i}`,
        from: {
            id: `u-gen-${i}`,
            name: `User ${i}`,
            email: `user${i}@example.com`,
            avatar: `https://i.pravatar.cc/150?u=gen-${i}`
        },
        to: [alexUser],
        subject: `Project Update ${i}`,
        preview: `Preview of email ${i}...`,
        content: generateLongContent(`Topic ${i}`, `Detail ${i}`),
        translatedSubject: `项目更新 ${i}`,
        translatedContent: generateLongContent(`主题 ${i}`, `详情 ${i}`), // Lazy mock translation
        isRead: i > 5,
        isStarred: i % 10 === 0,
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * (i + 1) * 2).toISOString(),
        folderId: "inbox",
        labels: ["Work"],
        priority: i % 15 === 0 ? "high" : "low"
    })) as Email[]
];

const alexBriefing: MorningBriefing = {
    dateDisplay: "10月24日 星期三",
    headline: "早上好, Alex.",
    summary: "今天您有 <b>5 个会议</b> 和 <b>3 个紧急事项</b>。您的第一个会议（Project Alpha 同步会）在下午 2 点，上午可以专注处理紧急审批。",
    cards: [
        {
            id: "focus-upcoming-meeting",
            type: "meeting",
            priority: 100,
            isImportant: true,
            guidanceIcon: "event_available",
            guidanceText: "即将开始：<b>Project Alpha 同步会</b> 将在下午 2 点开始，请做好准备。",
            title: "Project Alpha 同步会",
            summary: "Project Alpha 本周关键里程碑审查...",
            timeDisplay: "14:00 - 15:00",
            relatedEmailId: "focus-meeting",
            relatedEmail: alexEmails.find(e => e.id === 'focus-meeting'),
            meetingData: {
                id: 'm1-upcoming',
                title: 'Project Alpha 同步会',
                time: '14:00 - 15:00',
                location: '会议室 B',
                attendees: ['Sarah', 'Mike', '+2'],
                tags: ['内部', '即将开始']
            },
            actions: [{ label: "加入会议", actionType: "join", isPrimary: true }, { label: "查看详情", actionType: "open" }]
        },
        {
            id: "focus-1",
            type: "email",
            priority: 95,
            isImportant: true,
            guidanceIcon: "priority_high",
            guidanceText: "<b>财务部的 David</b> 标记了一个关于 Project Alpha 的紧急预算...",
            title: "David Smith · 财务部",
            summary: "Project Alpha 需要额外 $5,000 预算...",
            timeDisplay: "10:42 AM",
            relatedEmailId: "e1",
            relatedEmail: alexEmails.find(e => e.id === 'e1'),
            actions: [{ label: "批准预算", actionType: "approve", isPrimary: true }, { label: "拒绝", actionType: "reject" }, { label: "回复询问", actionType: "reply" }]
        },
        {
            id: 'focus-meetings-summary',
            type: 'meeting',
            priority: 90,
            isImportant: false,
            guidanceIcon: 'event_note',
            guidanceText: "今天下午还有 <b>3 场会议</b> 需要您关注。",
            title: "今日会议日程",
            summary: "下午主要集中在设计评审和客户沟通。",
            timeDisplay: "Today",
            meetingList: [
                { id: 'm1', time: '14:00 - 15:00', title: 'Project Alpha 同步会', location: '会议室 B', attendees: ['Sarah', 'Mike'], tags: ['内部'], relatedEmailId: 'focus-meeting' },
                { id: 'm2', time: '15:30 - 16:30', title: '产品设计评审 (UX)', location: 'Zoom', attendees: ['Design Team'], tags: ['评审'], relatedEmailId: 'focus-meeting-design' },
                { id: 'm3', time: '17:00 - 17:30', title: '客户需求沟通', location: '会议室 A', attendees: ['Client'], tags: ['外部'], relatedEmailId: 'focus-meeting-client' }
            ],
            actions: [{ label: '添加会议', actionType: 'create', isPrimary: true }, { label: '查看日历', actionType: 'open' }]
        },
        {
            id: 'focus-6-insight',
            type: 'report',
            priority: 2,
            guidanceIcon: 'lightbulb',
            guidanceText: "Gartner 给你发了最新的 Vibe Coding 趋势洞察...",
            title: "Gartner 趋势洞察",
            summary: "2026 技术趋势：Vibe Coding 正在重塑开发体验。",
            timeDisplay: "10:30 AM",
            insightData: {
                source: "Gartner Research",
                tag: "Technology Trends",
                imageUrl: "https://placehold.co/600x320/4f46e5/ffffff?text=Vibe+Coding+Trends"
            },
            relatedEmailId: 'e_insight',
            relatedEmail: alexEmails.find(e => e.id === 'e_insight'),
            actions: [{ label: '立即阅读', actionType: 'open', isPrimary: true }, { label: '稍后阅读', actionType: 'reschedule' }]
        },
        {
            id: 'focus-4',
            type: 'transit',
            priority: 85,
            guidanceIcon: 'directions_walk',
            guidanceText: '从C区出发去F区参加会议，建议 <b>13:40</b> 出发以确保准时到达。',
            title: '客户演示会议',
            summary: '步行约15分钟',
            timeDisplay: '13:40',
            transitData: {
                route: 'C区 → F区',
                departureTime: '13:40',
                pickupLocation: 'C区办公室',
                startLocation: 'C区办公室',
                endLocation: 'F区会议室 B',
                suggestedAction: '从C区出发去F区参加会议',
                steps: [
                    { type: 'walk', instruction: '步行至 F 区', time: '15 min', from: 'C区办公室', to: 'F区会议室 B' }
                ]
            },
            meetingData: {
                id: 'm-transit',
                title: '客户演示会议',
                time: '14:00 - 15:00',
                location: 'F区 3楼 会议室A',
                attendees: ['David Kim', 'Lisa Wang'],
                tags: ['客户', '重要']
            },
            actions: [{ label: '查看路线', actionType: 'shuttle_map', isPrimary: true }]
        },
        {
            id: 'focus-5-todo',
            type: 'todo',
            priority: 80,
            guidanceIcon: 'checklist',
            guidanceText: '您有 <b>3 个待办事项</b> 需要今天完成。',
            title: '今日待办',
            summary: '来自邮件的 AI 提取任务',
            timeDisplay: 'Today',
            todoList: [
                { id: 'todo-1', content: '分析助推器遥测数据', isDone: false, isUrgent: true, deadline: '3小时后', relatedEmailId: 'e1' },
                { id: 'todo-2', content: '回复设计团队的评审反馈', isDone: false, deadline: '今天 16:00', relatedEmailId: 'focus-meeting-design' },
                { id: 'todo-3', content: '准备客户会议材料', isDone: true, deadline: '今天 17:00', relatedEmailId: 'focus-meeting-client' }
            ],
            actions: [{ label: '添加任务', actionType: 'create', isPrimary: true }]
        },
        {
            id: 'focus-2',
            type: 'email',
            priority: 70,
            guidanceIcon: 'mail',
            guidanceText: '<b>设计团队</b> 发来了关于新版 UI 的评审请求...',
            title: 'Sarah Chen · 设计团队',
            summary: '新版邮箱 UI 设计稿已完成，请查阅并提供反馈。',
            timeDisplay: '昨天',
            relatedEmailId: 'focus-meeting-design',
            relatedEmail: alexEmails.find(e => e.id === 'focus-meeting-design'),
            actions: [{ label: '查看设计稿', actionType: 'open', isPrimary: true }, { label: '回复', actionType: 'reply' }]
        }
    ]
};

// --- Account 2: Taylor Engineer (Mock) ---
const taylorUser: User = {
    id: "u2",
    name: "Taylor Engineer",
    email: "taylor@company.com",
    avatar: "https://i.pravatar.cc/150?u=u4",
    role: "Senior Engineer"
};

const taylorEmails: Email[] = [
    {
        id: "t_e1",
        from: { id: "u1", name: "Alex Executive", email: "alex@company.com" },
        to: [taylorUser],
        subject: "API Performance Issues",
        preview: "We need to fix the latency in the user module...",
        content: "<p>Taylor, please look into the latency issues.</p>",
        isRead: false,
        isStarred: false,
        sentAt: new Date().toISOString(),
        folderId: "inbox",
        labels: ["Bug", "High Priority"],
        priority: "high",
        aiSummary: "Fix latency in user module.",
        aiTodos: [{ id: "tt1", content: "Optimize SQL Query", isCompleted: false, sourceEmailId: "t_e1", priority: "high", deadline: "Today" }]
    }
];

const taylorBriefing: MorningBriefing = {
    dateDisplay: "WEDNESDAY, OCT 24",
    headline: "Morning, Taylor.",
    summary: "You have <b>1 critical bug</b> to fix today.",
    cards: [
        {
            id: "focus-taylor-1",
            type: "urgent",
            priority: 100,
            isImportant: true,
            guidanceIcon: "bug_report",
            guidanceText: "<b>Alex</b> reported a critical API latency issue.",
            title: "API Performance Issue",
            summary: "User module latency > 500ms. Needs immediate investigation.",
            timeDisplay: "Urgent",
            relatedEmailId: "t_e1",
            relatedEmail: taylorEmails[0],
            actions: [{ label: "View Logs", actionType: "open", isPrimary: true }]
        }
    ]
};

// --- Account 3: Jordan Sales (Mock) ---
const jordanUser: User = {
    id: "u3",
    name: "Jordan Sales",
    email: "jordan@company.com",
    avatar: "https://i.pravatar.cc/150?u=u5",
    role: "Sales Manager"
};

const jordanEmails: Email[] = [
    {
        id: "j_e1",
        from: { id: "c1", name: "Client A", email: "clientA@example.com" },
        to: [jordanUser],
        subject: "Contract Signed",
        preview: "We have signed the contract for Q4.",
        content: "<p>See attached.</p>",
        isRead: false,
        isStarred: false,
        sentAt: new Date().toISOString(),
        folderId: "inbox",
        labels: ["Contract", "Won"],
        priority: "high"
    }
];

const jordanBriefing: MorningBriefing = {
    dateDisplay: "WEDNESDAY, OCT 24",
    headline: "Great start, Jordan.",
    summary: "<b>Client A</b> just signed the contract!",
    cards: [
        {
            id: "focus-jordan-1",
            type: "urgent",
            priority: 100,
            isImportant: true,
            guidanceIcon: "verified",
            guidanceText: "<b>Client A</b> sent the signed contract.",
            title: "Connect Signed: Client A",
            summary: "Q4 Renewal contract signed and attached.",
            timeDisplay: "Just now",
            relatedEmailId: "j_e1",
            relatedEmail: jordanEmails[0],
            actions: [{ label: "View Contract", actionType: "open", isPrimary: true }]
        }
    ]
};


// ------------------------------------------------------------------
// 4. Central Data Store
// ------------------------------------------------------------------

const accountDataMap: Record<string, AccountData> = {
    "u1": { user: alexUser, folders: alexFolders, emails: alexEmails, focusBriefing: alexBriefing },
    "u2": { user: taylorUser, folders: alexFolders, emails: taylorEmails, focusBriefing: taylorBriefing }, // Reusing folders for simplicity
    "u3": { user: jordanUser, folders: alexFolders, emails: jordanEmails, focusBriefing: jordanBriefing }
};

export const mockAccounts: Account[] = [
    { id: "u1", name: alexUser.name, email: alexUser.email, avatar: alexUser.avatar ?? "", role: alexUser.role ?? "" },
    { id: "u2", name: taylorUser.name, email: taylorUser.email, avatar: taylorUser.avatar ?? "", role: taylorUser.role ?? "" },
    { id: "u3", name: jordanUser.name, email: jordanUser.email, avatar: jordanUser.avatar ?? "", role: jordanUser.role ?? "" },
];

// ------------------------------------------------------------------
// 5. Public API
// ------------------------------------------------------------------

export const getAccounts = () => mockAccounts;

export const getUserForAccount = (accountId: string): User => {
    const data = accountDataMap[accountId];
    return data?.user || alexUser;
};

export const getFoldersForAccount = (accountId: string): Folder[] => {
    const data = accountDataMap[accountId];
    return data?.folders || alexFolders;
};

export const getDescriptionForAccount = (accountId: string) => {
    return accountDataMap[accountId] || accountDataMap["u1"];
};

export const getEmailsForAccount = (accountId: string) => {
    return accountDataMap[accountId]?.emails || [];
};

export const getFocusBriefingForAccount = (accountId: string) => {
    return accountDataMap[accountId]?.focusBriefing || alexBriefing;
};

// Dynamically derive todos from emails
export const getTodosForAccount = (accountId: string) => {
    const emails = getEmailsForAccount(accountId);
    return emails
        .filter(e => e.aiTodos && e.aiTodos.length > 0)
        .flatMap(e => e.aiTodos!.map(t => ({
            id: t.id,
            content: t.content,
            deadline: t.deadline,
            sourceEmailId: e.id,
            isCompleted: t.isCompleted,
            priority: t.priority
        })));
};
