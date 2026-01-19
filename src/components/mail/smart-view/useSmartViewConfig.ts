import { useState, useEffect, useMemo } from "react"
import { SmartFolderConfig, SmartViewMode, SmartViewTemplate, SmartViewRule } from "./types"
import { getEmailsForAccount } from "@/data/dataFoundation"
import { Email } from "@/types/mail"

const TEMPLATES: SmartViewTemplate[] = [
    {
        id: "sales_manager",
        name: "销售经理",
        description: "线索、合同、跟进",
        icon: "trending_up",
        color: "palette-9", // Orange
        folders: [
            { id: "leads", name: "销售线索", icon: "person_search", color: "palette-9" },
            { id: "contracts", name: "合同协议", icon: "ink_pen", color: "palette-4" },
            { id: "followups", name: "跟进提醒", icon: "schedule_send", color: "palette-1" }
        ]
    },
    {
        id: "founder",
        name: "创业者 / CEO",
        description: "投资人、产品规划、招聘",
        icon: "rocket_launch",
        color: "palette-10", // Red/Pink
        folders: [
            { id: "investors", name: "投资人", icon: "attach_money", color: "palette-10" },
            { id: "product", name: "产品规划", icon: "lightbulb", color: "palette-3" },
            { id: "hiring", name: "核心招聘", icon: "badge", color: "palette-12" }
        ]
    },
    {
        id: "rd_engineer",
        name: "研发工程师",
        description: "技术文档、任务票、代码",
        icon: "code",
        color: "palette-1", // Blue
        folders: [
            { id: "specs", name: "技术方案", icon: "menu_book", color: "palette-1" },
            { id: "tickets", name: "JIRA 任务", icon: "bug_report", color: "palette-8" },
            { id: "pr", name: "代码审查", icon: "merge", color: "palette-4" }
        ]
    },
    {
        id: "freelancer",
        name: "自由职业者",
        description: "项目、发票、合同",
        icon: "work_history",
        color: "palette-3", // Yellow/Gold
        folders: [
            { id: "projects", name: "活跃项目", icon: "folder_managed", color: "palette-3" },
            { id: "invoices-free", name: "待付发票", icon: "receipt_long", color: "palette-9" },
            { id: "contracts-free", name: "服务合同", icon: "gavel", color: "palette-6" }
        ]
    },
    {
        id: "marketing",
        name: "市场主管",
        description: "营销活动、素材、分析",
        icon: "campaign",
        color: "palette-7", // Pink
        folders: [
            { id: "campaigns", name: "营销战役", icon: "campaign", color: "palette-7" },
            { id: "assets", name: "创意素材", icon: "image", color: "palette-2" },
            { id: "analytics", name: "数据分析", icon: "bar_chart", color: "palette-11" }
        ]
    },
    {
        id: "student",
        name: "学生 / 研究生",
        description: "课程、作业、实习",
        icon: "school",
        color: "palette-5", // Indigo
        folders: [
            { id: "courses", name: "课程通知", icon: "class", color: "palette-5" },
            { id: "assignments", name: "作业截止", icon: "assignment_late", color: "palette-10" },
            { id: "internship", name: "实习机会", icon: "work_outline", color: "palette-1" }
        ]
    },
    {
        id: "hr_recruiter",
        name: "人事招聘",
        description: "简历、面试、Offer",
        icon: "groups",
        color: "palette-6", // Purple
        folders: [
            { id: "resumes", name: "候选简历", icon: "description", color: "palette-6" },
            { id: "interviews", name: "面试安排", icon: "calendar_today", color: "palette-1" },
            { id: "offers", name: "Offer 发放", icon: "celebration", color: "palette-4" }
        ]
    },
    {
        id: "finance",
        name: "财务经理",
        description: "发票、报表、审批",
        icon: "payments",
        color: "palette-4", // Green
        folders: [
            { id: "invoices", name: "发票处理", icon: "receipt", color: "palette-4" },
            { id: "reports", name: "财务报表", icon: "analytics", color: "palette-1" },
            { id: "approvals", name: "报销审批", icon: "fact_check", color: "palette-9" }
        ]
    },
    {
        id: "support",
        name: "客服支持",
        description: "工单、反馈、升级",
        icon: "support_agent",
        color: "palette-2", // Cyan
        folders: [
            { id: "tickets", name: "用户工单", icon: "confirmation_number", color: "palette-2" },
            { id: "feedback", name: "用户反馈", icon: "rate_review", color: "palette-5" },
            { id: "escalations", name: "紧急升级", icon: "priority_high", color: "palette-8" }
        ]
    },
    {
        id: "personal",
        name: "个人生活",
        description: "账单、旅行、家庭",
        icon: "face",
        color: "palette-11", // Teal
        folders: [
            { id: "bills", name: "生活账单", icon: "account_balance_wallet", color: "palette-11" },
            { id: "travel", name: "旅行计划", icon: "flight", color: "palette-3" },
            { id: "family", name: "家庭事务", icon: "home", color: "palette-7" }
        ]
    }
]

// Mock data generator for previews
function generateMockEmails(viewName: string): Email[] {
    const now = new Date();

    // Helper to generic consistent fake usage based on view name
    const getSubject = (idx: number) => {
        const topics: Record<string, string[]> = {
            "销售线索": ["关于企业版采购的咨询", "希望能安排一次产品演示", "Re: 上周的会议纪要", "新的合作意向询问", "Q4 采购预算确认"],
            "合同协议": ["签署待确认：服务合同 v2", "NDA 保密协议草案", "续约合同电子版", "法务部审核意见", "最终版合同 - 请查收"],
            "跟进提醒": ["跟进：下周二的回访", "记得发送产品报价单", "客户反馈 - 待处理", "项目进度同步会", "关于上次提的需求"],
            "投资人": ["Pre-A 轮融资意向书", "尽职调查所需的财务数据", "下周董事会会议安排", "Re: 12月份运营数据更新", "红杉中国 - 约见邀请"],
            "产品规划": ["2026 Q1 产品路线图草案", "[RFC] 新的 AI 功能设计规范", "竞品分析报告 - 1月刊", "用户体验改进建议", "功能评审会议纪要"],
            "核心招聘": ["技术总监候选人简历 - 张三", "面试评价：高级后端工程师", "Offer 审批流程提醒", "校园招聘启动计划", "猎头推荐候选人汇总"],
            "技术方案": ["[Design Doc] 分布式存储架构升级", "API 接口文档 v2.0", "关于数据库迁移的方案评审", "前端性能优化专项", "微服务拆分计划"],
            "JIRA 任务": ["[JIRA] PROJ-1234: 修复登录页崩溃问题", "分配给您的新任务：PROJ-5678", "Bug 优先级升级通知", "[JIRA] 状态更新：已解决", "Release Note 确认"],
            "代码审查": ["Review Request: feat/new-dashboard", "CI build failed: PR #892", "[GitHub] Comments on your PR", "Merge conflict in main", "Approved: fix/memory-leak"],
        };

        // Default subjects if exact match not found
        const defaults = [`关于 ${viewName} 的更新`, `待处理：${viewName} 相关`, `新的 ${viewName} 通知`, `回复：${viewName} 问题`, `${viewName} 进度汇报`];

        const list = topics[viewName] || defaults;
        return list[idx % list.length];
    }

    const mockSenders = [
        { id: "sender-1", name: "张明", email: "zhang.ming@example.com", avatar: "" },
        { id: "sender-2", name: "Sarah Chen", email: "sarah.c@techcorp.io", avatar: "" },
        { id: "sender-3", name: "李伟", email: "li.wei@startup.co", avatar: "" },
        { id: "sender-4", name: "Mike Ross", email: "mike.r@partner.net", avatar: "" },
        { id: "sender-5", name: "王芳", email: "wang.fang@client.com", avatar: "" },
    ];

    return Array.from({ length: 5 }).map((_, i) => ({
        id: `mock-${viewName}-${i}`,
        threadId: `mock-thread-${viewName}-${i}`,
        from: mockSenders[i % mockSenders.length],
        to: [{ id: "me", name: "我", email: "me@example.com", avatar: "" }],
        subject: getSubject(i),
        preview: `这是一封关于 ${viewName} 的示例邮件内容。Smart View 会自动根据您的规则将此类邮件归类到此视图中，帮助您更高效地处理工作。`,
        content: `这是一封关于 ${viewName} 的示例邮件内容。Smart View 会自动根据您的规则将此类邮件归类到此视图中，帮助您更高效地处理工作。`,
        hasAttachments: i % 3 === 0,
        isRead: i > 2,
        isStarred: i === 0,
        labels: [],
        priority: 'medium',
        folderId: 'inbox',
        sentAt: new Date(now.getTime() - i * 3600 * 1000 * (i + 1)).toISOString(), // Staggered times
    }));
}

// Simple rule parser (mock AI)
function parseRuleFromInput(input: string): SmartViewRule['parsed'] | null {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes('from:') || lowerInput.includes('发件人')) {
        const match = input.match(/@[\w.-]+|[\w.-]+@[\w.-]+/i)
        if (match) {
            return { field: 'from', operator: 'contains', value: match[0] }
        }
    }

    if (lowerInput.includes('subject:') || lowerInput.includes('主题')) {
        const colonIndex = input.indexOf(':')
        if (colonIndex > 0) {
            return { field: 'subject', operator: 'contains', value: input.slice(colonIndex + 1).trim() }
        }
    }

    // Fallback: treat as content search
    const keywords = input.replace(/筛选|过滤|包含|来自|的|邮件/g, '').trim()
    if (keywords.length > 0) {
        return { field: 'content', operator: 'contains', value: keywords }
    }

    return null
}

function generateRuleDisplayText(parsed: SmartViewRule['parsed']): string {
    const fieldMap = { from: '发件人', subject: '主题', content: '内容', label: '标签' }
    const operatorMap = { contains: '包含', equals: '等于', startsWith: '开头为' }
    return `${fieldMap[parsed.field]}${operatorMap[parsed.operator]}: ${parsed.value}`
}

export function useSmartViewConfig() {
    const [mode, setMode] = useState<SmartViewMode>('template')
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("sales_manager")
    const [folders, setFolders] = useState<SmartFolderConfig[]>([])
    const [selectedViewId, setSelectedViewId] = useState<string | null>(null)

    // Custom AI State
    const [customViewName, setCustomViewName] = useState("我的智能视图")
    const [customRule, setCustomRule] = useState("")
    const [rules, setRules] = useState<SmartViewRule[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    // Initialize logic: When template changes, update folders
    useEffect(() => {
        if (mode === 'template') {
            const template = TEMPLATES.find(t => t.id === selectedTemplateId)
            if (template) {
                const newFolders = template.folders.map(f => ({ ...f }))
                setFolders(newFolders)
                // Auto-select first folder
                if (newFolders.length > 0) {
                    setSelectedViewId(newFolders[0].id)
                }
            }
        }
    }, [selectedTemplateId, mode])

    // When switching to custom mode, create a single custom folder
    useEffect(() => {
        if (mode === 'custom') {
            const customFolder: SmartFolderConfig = {
                id: 'custom-view',
                name: customViewName,
                icon: 'auto_awesome',
                color: 'palette-1'
            }
            setFolders([customFolder])
            setSelectedViewId('custom-view')
        }
    }, [mode, customViewName])

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplateId(templateId)
        setMode('template')
    }

    const updateFolder = (id: string, updates: Partial<SmartFolderConfig>) => {
        setFolders(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    const removeFolder = (id: string) => {
        setFolders(prev => {
            const newFolders = prev.filter(f => f.id !== id)
            // If removed folder was selected, select first remaining
            if (selectedViewId === id && newFolders.length > 0) {
                setSelectedViewId(newFolders[0].id)
            } else if (newFolders.length === 0) {
                setSelectedViewId(null)
            }
            return newFolders
        })
    }

    // Add rule from user input
    const addRule = async () => {
        if (!customRule.trim()) return

        setIsGenerating(true)

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 800))

        const parsed = parseRuleFromInput(customRule)
        if (parsed) {
            const newRule: SmartViewRule = {
                id: `rule-${Date.now()}`,
                rawInput: customRule,
                parsed,
                displayText: generateRuleDisplayText(parsed)
            }
            setRules(prev => [...prev, newRule])
        }

        setCustomRule("")
        setIsGenerating(false)
    }

    const removeRule = (ruleId: string) => {
        setRules(prev => prev.filter(r => r.id !== ruleId))
    }

    // Get matching emails for a view (simple keyword matching)
    const getMatchingEmails = useMemo(() => {
        return (viewId: string, maxCount: number = 5) => {
            // Early return mock data for immediate feedback if no emails exist
            // OR if we want to ensure populated preview

            const folder = folders.find(f => f.id === viewId)
            if (!folder) return []

            const allEmails = getEmailsForAccount('u1')
            let matched: Email[] = []

            // For template mode: match by folder name/keywords
            if (mode === 'template') {
                const keywords = folder.name.toLowerCase().split(/\s+/)
                matched = allEmails
                    .filter(email => {
                        const searchText = `${email.subject} ${email.preview} ${email.from.name} ${email.from.email}`.toLowerCase()
                        return keywords.some(kw => searchText.includes(kw))
                    })
            } else {
                // For custom mode: match by rules
                if (rules.length === 0) matched = []
                else {
                    matched = allEmails
                        .filter(email => {
                            return rules.some(rule => {
                                const { field, value } = rule.parsed
                                const lowerValue = value.toLowerCase()

                                switch (field) {
                                    case 'from':
                                        return email.from.email.toLowerCase().includes(lowerValue) ||
                                            email.from.name.toLowerCase().includes(lowerValue)
                                    case 'subject':
                                        return email.subject.toLowerCase().includes(lowerValue)
                                    case 'content':
                                        return (email.content || '').toLowerCase().includes(lowerValue) ||
                                            email.preview.toLowerCase().includes(lowerValue)
                                    default:
                                        return false
                                }
                            })
                        })
                }
            }

            // Return mock data if no real matches found, so user sees something in preview
            if (matched.length === 0) {
                return generateMockEmails(folder.name).slice(0, maxCount)
            }

            return matched.slice(0, maxCount)
        }
    }, [folders, mode, rules])

    return {
        mode,
        setMode,
        selectedTemplateId,
        setSelectedTemplateId: handleTemplateSelect,
        folders,
        setFolders,
        updateFolder,
        removeFolder,
        selectedViewId,
        setSelectedViewId,

        // Custom mode
        customViewName,
        setCustomViewName,
        customRule,
        setCustomRule,
        rules,
        addRule,
        removeRule,
        isGenerating,

        // Helpers
        getMatchingEmails,
        templates: TEMPLATES
    }
}

