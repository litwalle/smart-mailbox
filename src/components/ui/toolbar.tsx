import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// --- Toolbar Container ---

const toolbarVariants = cva(
    "flex h-[56px] items-center bg-background-primary w-full overflow-hidden",
    {
        variants: {
            mode: {
                "icon-only": "justify-start px-6", // Removed default gap-6
                vertical: "justify-around px-0",
                horizontal: "justify-start px-6", // Removed default gap-6
            },
            spacing: {
                4: "gap-1",
                8: "gap-2",
                12: "gap-3",
                24: "gap-6",
            }
        },
        defaultVariants: {
            mode: "icon-only",
            spacing: 24, // Default to 24
        },
    }
)

export interface ToolbarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toolbarVariants> {
    mode?: "icon-only" | "vertical" | "horizontal"
    spacing?: 4 | 8 | 12 | 24
    selectedVariant?: "border" | "accent" | "gray" // border: default blue border; accent: blue text/icon; gray: gray background
    collapsible?: boolean
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
    ({ className, mode, spacing, selectedVariant, collapsible, children, ...props }, ref) => {
        const [containerWidth, setContainerWidth] = React.useState(0)
        const [visibleCount, setVisibleCount] = React.useState<number>(React.Children.count(children))
        const containerRef = React.useRef<HTMLDivElement>(null)
        const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([])

        // Initialize itemRefs array
        itemRefs.current = itemRefs.current.slice(0, React.Children.count(children))

        // Resize Observer for container
        React.useEffect(() => {
            if (!collapsible || !containerRef.current) {
                setVisibleCount(React.Children.count(children))
                return
            }

            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setContainerWidth(entry.contentRect.width)
                }
            })

            observer.observe(containerRef.current)
            return () => observer.disconnect()
        }, [collapsible, children])

        // Calculate visible items based on width
        React.useLayoutEffect(() => {
            if (!collapsible || !containerRef.current || containerWidth === 0) return

            const paddingMap = { "icon-only": 48, "vertical": 0, "horizontal": 48 }
            const isTight = spacing === 4
            // Reduce padding for tight spacing to avoid unnecessary collapsing
            const padding = isTight ? 0 : (paddingMap[mode || "icon-only"] || 48)
            const gapMap = { 4: 4, 8: 8, 12: 12, 24: 24 }
            const gap = gapMap[spacing || 24] || 24
            const moreBtnWidth = 48

            let availableWidth = containerWidth - padding
            let currentWidth = 0
            let count = 0
            const totalItems = React.Children.count(children)
            // Estimation: Icon Only = 40px. Horizontal = 100px?
            const estimateWidth = mode === "horizontal" ? 120 : 40

            React.Children.forEach(children, (_, index) => {
                const itemEl = itemRefs.current[index]
                let itemWidth = itemEl?.getBoundingClientRect().width || 0
                if (itemWidth === 0) itemWidth = estimateWidth

                if (currentWidth + itemWidth + (count > 0 ? gap : 0) <= availableWidth) {
                    currentWidth += itemWidth + (count > 0 ? gap : 0)
                    count++
                }
            })

            // Adjustment for More button
            if (count < totalItems) {
                let strictWidth = 0
                let strictCount = 0
                let limit = availableWidth - moreBtnWidth - gap

                React.Children.forEach(children, (_, index) => {
                    const itemEl = itemRefs.current[index]
                    let itemWidth = itemEl?.getBoundingClientRect().width || 0
                    if (itemWidth === 0) itemWidth = estimateWidth

                    if (strictWidth + itemWidth + (strictCount > 0 ? gap : 0) <= limit) {
                        strictWidth += itemWidth + (strictCount > 0 ? gap : 0)
                        strictCount++
                    }
                })
                count = strictCount
            }

            // Ensure at least 1 item if possible? or 0.
            setVisibleCount(Math.max(0, count))

        }, [containerWidth, children, collapsible, mode, spacing])


        const childrenArray = React.Children.toArray(children)
        const visibleItems = collapsible ? childrenArray.slice(0, visibleCount) : childrenArray
        const overflowItems = collapsible ? childrenArray.slice(visibleCount) : []

        return (
            <div
                ref={ref}
                // Determine className: merge variant classes but ensure we can attach resize observer trigger if needed
                // actually we attach ref to the merge logic below
                className={cn("w-full relative", className)}
                {...props}
            >
                <div
                    ref={containerRef}
                    className={cn(toolbarVariants({ mode, spacing }), "w-full")}
                    role="toolbar"
                >
                    {visibleItems.map((child, index) => {
                        if (React.isValidElement(child)) {
                            // Clone to attach ref for valid toolbar items
                            // We only need to attach ref if it's a ToolbarItem or we want to measure it.
                            // We use cloneElement to inject props and ref.
                            return React.cloneElement(child as React.ReactElement<any>, {
                                mode,
                                selectedVariant,
                                ref: (el: HTMLButtonElement) => { itemRefs.current[index] = el }
                            })
                        }
                        return child
                    })}

                    {collapsible && overflowItems.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <ToolbarItem
                                    mode={mode as any}
                                    icon={<MoreIcon className="h-5 w-5" />}
                                    className="data-[state=open]:bg-comp-background-gray"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {overflowItems.map((child, idx) => {
                                    // Render overflow items as DropdownMenuItems
                                    // We need to extract props because DropdownMenuItem has different styling/layout
                                    // Ideally, ToolbarItem could support a "dropdown" mode?
                                    // Or we just wrap them.

                                    if (React.isValidElement(child)) {
                                        const { label, icon, onClick, disabled } = child.props as any
                                        return (
                                            <DropdownMenuItem
                                                key={idx}
                                                onClick={onClick}
                                                disabled={disabled}
                                                className="gap-2 cursor-pointer"
                                            >
                                                {icon && <span className="h-4 w-4 flex items-center justify-center">{icon}</span>}
                                                <span>{label || "Item"}</span>
                                            </DropdownMenuItem>
                                        )
                                    }
                                    return null
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        )
    }
)
Toolbar.displayName = "Toolbar"


const MoreIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 -3.2 24 24" className={cn("fill-current", className)} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="none" />
        <path d="M17.7598 1.63477C17.2637 1.63477 16.8477 1.80273 16.5117 2.13867C16.1758 2.47461 16.0078 2.89062 16.0078 3.38672C16.0078 3.86328 16.1758 4.27539 16.5117 4.62305C16.8477 4.9668 17.2637 5.13867 17.7598 5.13867C18.2402 5.13867 18.6523 4.9668 18.9961 4.62305C19.3398 4.27539 19.5117 3.86328 19.5117 3.38672C19.5117 2.89062 19.3398 2.47461 18.9961 2.13867C18.6523 1.80273 18.2402 1.63477 17.7598 1.63477ZM6.24023 1.63477C5.75977 1.63477 5.35156 1.80273 5.01562 2.13867C4.67969 2.47461 4.51172 2.89062 4.51172 3.38672C4.51172 3.86328 4.67969 4.27539 5.01562 4.62305C5.35156 4.9668 5.75977 5.13867 6.24023 5.13867C6.7207 5.13867 7.13281 4.9668 7.47656 4.62305C7.82031 4.27539 7.99219 3.86328 7.99219 3.38672C7.99219 2.89062 7.82031 2.47461 7.47656 2.13867C7.13281 1.80273 6.7207 1.63477 6.24023 1.63477ZM17.7598 12.6211C17.2637 12.6211 16.8477 12.7949 16.5117 13.1426C16.1758 13.4863 16.0078 13.8984 16.0078 14.3789C16.0078 14.8555 16.1758 15.2676 16.5117 15.6152C16.8477 15.959 17.2637 16.1309 17.7598 16.1309C18.2402 16.1309 18.6523 15.959 18.9961 15.6152C19.3398 15.2676 19.5117 14.8555 19.5117 14.3789C19.5117 13.8984 19.3398 13.4863 18.9961 13.1426C18.6523 12.7949 18.2402 12.6211 17.7598 12.6211ZM6.24023 12.6211C5.75977 12.6211 5.35156 12.7949 5.01562 13.1426C4.67969 13.4863 4.51172 13.8984 4.51172 14.3789C4.51172 14.8555 4.67969 15.2676 5.01562 15.6152C5.35156 15.959 5.75977 16.1309 6.24023 16.1309C6.7207 16.1309 7.13281 15.959 7.47656 15.6152C7.82031 15.2676 7.99219 14.8555 7.99219 14.3789C7.99219 13.8984 7.82031 13.4863 7.47656 13.1426C7.13281 12.7949 6.7207 12.6211 6.24023 12.6211Z" fillRule="nonzero" />
    </svg>
)

// --- Toolbar Item ---

const toolbarItemVariants = cva(
    "group relative flex cursor-pointer items-center justify-center transition-all duration-200 select-none rounded-[8px] border-2 border-transparent", // Base styles. Radius M=8px. Border for selected state.
    {
        variants: {
            mode: {
                "icon-only": "h-[40px] w-auto min-w-[40px] px-2 hover:bg-comp-background-gray active:bg-comp-emphasize-tertiary", // 40px height. Auto width to accommodate optional chevron/label.
                vertical: "h-full flex-col p-0 px-2 justify-center gap-[2px] w-auto min-w-[48px] hover:bg-comp-background-gray",
                horizontal: "h-[40px] flex-row px-3 gap-[4px] w-auto hover:bg-comp-background-gray", // Updated height to 40px
            },
            isSelected: {
                true: "", // Controlled by selectedVariant + compound
                false: "hover:bg-comp-background-gray",
            },
            isDisabled: {
                true: "opacity-50 cursor-not-allowed hover:bg-transparent",
                false: "",
            },
            selectedVariant: {
                border: "",
                accent: "",
                gray: "",
            }
        },
        compoundVariants: [
            // Border Style (Default)
            { isSelected: true, selectedVariant: "border", class: "border-brand bg-comp-emphasize-tertiary/10" },
            // Accent Style (Fig 1: Blue Icon/Text, Transparent BG)
            { isSelected: true, selectedVariant: "accent", class: "text-brand border-transparent" },
            // Gray Background Style
            { isSelected: true, selectedVariant: "gray", class: "bg-comp-background-gray border-transparent text-font-primary" },
        ],
        defaultVariants: {
            mode: "icon-only",
            isSelected: false,
            isDisabled: false,
            selectedVariant: "border", // Default to border as per original spec if not specified
        },
    }
)

export interface ToolbarItemProps
    extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toolbarItemVariants> {
    icon?: React.ReactNode
    label?: string
    isSelected?: boolean
    isDisabled?: boolean
    hasDropdown?: boolean
    mode?: "icon-only" | "vertical" | "horizontal" // Injected by parent
    selectedVariant?: "border" | "accent" | "gray" // Injected by parent
}

const ToolbarItem = React.forwardRef<HTMLButtonElement, ToolbarItemProps>(
    ({ className, mode, icon, label, isSelected, isDisabled, hasDropdown, selectedVariant, children, ...props }, ref) => {

        // Icon sizing wrapper: 24px
        // Updated to inherit color for "accent" mode
        const IconWrapper = ({ children }: { children: React.ReactNode }) => (
            <div className={cn(
                "flex h-6 w-6 items-center justify-center transition-colors",
                // If not selected or (selected but not accent style), use default colors.
                (!isSelected || selectedVariant !== "accent") && "text-icon-primary group-hover:text-icon-primary",
                // Legacy support/Border variant:
                (isSelected && selectedVariant === "border") && "text-brand",
                (isSelected && selectedVariant === "accent") && "text-brand" // Fig 1
            )}>
                {children}
            </div>
        )

        return (
            <button
                ref={ref}
                className={cn(toolbarItemVariants({ mode, isSelected, isDisabled, selectedVariant }), className)}
                disabled={isDisabled}
                data-selected={isSelected}
                role="button"
                tabIndex={isDisabled ? -1 : 0}
                {...props}
            >
                {icon && (
                    <IconWrapper>
                        {React.isValidElement(icon)
                            ? React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: 1.5 })
                            : icon}
                    </IconWrapper>
                )}

                {/* Label: Shown if not icon-only OR if icon-only but we want text? Spec says icon-only is icon only. */}
                {/* Actually, if hasDropdown is true, we might want to show it even in icon-only? No, usually just chevron. */}
                {mode !== "icon-only" && label && (
                    <span className={cn(
                        "whitespace-nowrap transition-colors",
                        mode === "vertical" ? "text-[10px] leading-[1.1]" : "text-[14px] leading-tight",
                        (!isSelected || selectedVariant !== "accent") && "text-font-primary",
                        (isSelected && selectedVariant === "accent") && "text-brand",
                        mode === "vertical" && "text-caption-l",
                        mode === "horizontal" && "text-subhead-s font-medium"
                    )}>
                        {label}
                    </span>
                )}

                {/* Dropdown Chevron */}
                {hasDropdown && (
                    <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-colors ml-1",
                        (!isSelected || selectedVariant !== "accent") ? "text-icon-primary" : "text-brand"
                    )} />
                )}

                {children}
            </button>
        )
    }
)
ToolbarItem.displayName = "ToolbarItem"

export { Toolbar, ToolbarItem }
