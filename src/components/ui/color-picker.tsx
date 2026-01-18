"use client"

import * as React from "react"
import { HexColorPicker } from "react-colorful"
import { colord, extend } from "colord"
import namesPlugin from "colord/plugins/names"
import a11yPlugin from "colord/plugins/a11y"
import { ChevronDown, Pipette, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

extend([namesPlugin, a11yPlugin])

// --- Constants & Types ---
const PRESETS_BASIC = [
    // R1
    "#1677FF", "#13C2C2", "#52C41A", "#FADB14", "#FA8C16", "#F5222D", "#722ED1",
    // R2
    "#69B1FF", "#5CDBD3", "#95DE64", "#FFEC3D", "#FFC069", "#FF7875", "#9254DE",
    // R3
    "#91CAFF", "#87E8DE", "#B7EB8F", "#FFF566", "#FFD591", "#FF9C6E", "#B37FEB",
    // R4
    "#E6F4FF", "#E6FFFB", "#F6FFED", "#FEFFE6", "#FFF7E6", "#FFF1F0", "#F9F0FF",
    // R5
    "#FFFFFF", "#F0F0F0", "#D9D9D9", "#8C8C8C", "#595959", "#262626", "#000000"
]

const PRESETS_THEME_DARK = [
    "#1677ff", "#13c2c2", "#52c41a", "#fadb14", "#fa8c16", "#f5222d", "#722ed1"
]
const PRESETS_THEME_LIGHT = [
    "#e6f4ff", "#e6fffb", "#f6ffed", "#feffe6", "#fff7e6", "#fff1f0", "#f9f0ff"
]

interface ColorPickerProps {
    value?: string
    onChange?: (value: string) => void
    onChangeComplete?: (value: string) => void
    disabled?: boolean
    presets?: string[]
    showThemeColors?: boolean
    showRecentColors?: boolean
    className?: string
    children?: React.ReactNode
}

export function ColorPicker({
    value = "#000000",
    onChange,
    onChangeComplete,
    disabled = false,
    presets = PRESETS_BASIC,
    showThemeColors = true,
    showRecentColors = true,
    className,
    children,
}: ColorPickerProps) {
    const [color, setColor] = React.useState(value)
    const [isOpen, setIsOpen] = React.useState(false)
    const [view, setView] = React.useState<"grid" | "advanced">("grid")
    const [customColors, setCustomColors] = React.useState<string[]>([])
    const [recentColors, setRecentColors] = React.useState<string[]>([])

    const [activeSelection, setActiveSelection] = React.useState<{ section: string, index: string | number } | null>(null)

    React.useEffect(() => {
        setColor(value)
    }, [value])

    React.useEffect(() => {
        const storedCustom = localStorage.getItem("color-picker-custom")
        if (storedCustom) setCustomColors(JSON.parse(storedCustom))

        const storedRecent = localStorage.getItem("color-picker-recent")
        if (storedRecent) setRecentColors(JSON.parse(storedRecent))
    }, [])

    React.useEffect(() => {
        if (!isOpen) return

        const basicIdx = presets.indexOf(value)
        if (basicIdx !== -1) {
            setActiveSelection({ section: 'basic', index: basicIdx })
            return
        }

        const themeDarkIdx = PRESETS_THEME_DARK.indexOf(value.toLowerCase())
        if (themeDarkIdx !== -1) {
            setActiveSelection({ section: 'theme-dark', index: themeDarkIdx })
            return
        }

        const themeLightIdx = PRESETS_THEME_LIGHT.indexOf(value.toLowerCase())
        if (themeLightIdx !== -1) {
            setActiveSelection({ section: 'theme-light', index: themeLightIdx })
            return
        }

        const usedIdx = recentColors.indexOf(value)
        if (usedIdx !== -1) {
            setActiveSelection({ section: 'recent', index: usedIdx })
            return
        }

        const customIdx = customColors.indexOf(value)
        if (customIdx !== -1) {
            setActiveSelection({ section: 'custom', index: customIdx })
            return
        }
        setActiveSelection(null)
    }, [isOpen, value, presets, recentColors, customColors])


    const handleColorChange = (newColor: string, section: string, index: string | number) => {
        setColor(newColor)
        setActiveSelection({ section, index })
        onChange?.(newColor)
    }

    const handleComplete = (newColor: string) => {
        onChangeComplete?.(newColor)
        addToRecent(newColor)
    }

    const addToRecent = (newColor: string) => {
        if (!showRecentColors) return
        const updated = [newColor, ...recentColors.filter((c) => c !== newColor)].slice(0, 7)
        setRecentColors(updated)
        localStorage.setItem("color-picker-recent", JSON.stringify(updated))
    }

    const addToCustom = (newColor: string) => {
        const updated = [newColor, ...customColors.filter((c) => c !== newColor)].slice(0, 13)
        setCustomColors(updated)
        localStorage.setItem("color-picker-custom", JSON.stringify(updated))
        addToRecent(newColor)
    }

    const removeCustomColor = (colorToRemove: string) => {
        const updated = customColors.filter(c => c !== colorToRemove)
        setCustomColors(updated)
        localStorage.setItem("color-picker-custom", JSON.stringify(updated))
    }

    const openEyeDropper = async () => {
        if (!window.EyeDropper) {
            alert("Your browser does not support the EyeDropper API")
            return
        }
        const eyeDropper = new window.EyeDropper()
        try {
            const result = await eyeDropper.open()
            setColor(result.sRGBHex)
            onChange?.(result.sRGBHex)
            handleComplete(result.sRGBHex)
            setActiveSelection(null)
        } catch (e) {
            // Cancelled
        }
    }

    const renderCustomColors = () => {
        const displayColors = customColors.slice(0, 13)
        const showAddButton = displayColors.length < 13
        const totalUsed = displayColors.length + (showAddButton ? 1 : 0)
        const targetSize = totalUsed <= 7 ? 7 : 14
        const emptyCount = Math.max(0, targetSize - totalUsed)

        return (
            <div className="grid grid-cols-7 gap-3">
                {displayColors.map((c, i) => (
                    <ColorButton
                        key={c}
                        color={c}
                        isActive={activeSelection?.section === 'custom' && activeSelection?.index === i}
                        onClick={() => { handleColorChange(c, 'custom', i); handleComplete(c); }}
                        onContextMenu={(e) => {
                            e.preventDefault()
                            removeCustomColor(c)
                        }}
                    />
                ))}

                {showAddButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full shrink-0 bg-background-secondary border border-transparent hover:bg-muted"
                        onClick={() => setView("advanced")}
                        title="Add custom color"
                    >
                        <Plus className="h-5 w-5 text-muted-foreground" />
                    </Button>
                )}

                {Array.from({ length: emptyCount }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="h-9 w-9 rounded-full bg-muted/20"
                    />
                ))}
            </div>
        )
    }

    const isSelected = (section: string, index: number | string) => {
        return activeSelection?.section === section && activeSelection?.index === index
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                {children || (
                    <Button
                        variant="secondary"
                        className={cn("w-[220px] justify-start text-left font-normal", className)}
                        disabled={disabled}
                    >
                        <div
                            className="mr-2 h-4 w-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                        />
                        {color}
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent
                className="w-[320px] p-0 rounded-[16px] border-gray-200 shadow-xl"
                align="start"
                collisionPadding={16}
                sideOffset={8}
            >
                {view === "grid" ? (
                    <div className="p-4 space-y-4">
                        <div>
                            <div className="mb-2 text-[16px] font-medium text-foreground">基础色</div>
                            <div className="grid grid-cols-7 gap-3">
                                {presets.map((c, i) => (
                                    <div key={i} className="relative flex items-center justify-center">
                                        {i === 28 ? (
                                            <div className="relative h-9 w-9">
                                                <ColorButton
                                                    color={c}
                                                    isActive={isSelected('basic', i)}
                                                    onClick={() => { handleColorChange(c, 'basic', i); handleComplete(c); }}
                                                    className={cn("absolute inset-0 z-0", "border-slate-200")}
                                                />
                                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                                                    <div className="w-[1px] h-5 bg-slate-300 rotate-45" />
                                                </div>
                                            </div>
                                        ) : (
                                            <ColorButton
                                                color={c}
                                                isActive={isSelected('basic', i)}
                                                onClick={() => { handleColorChange(c, 'basic', i); handleComplete(c); }}
                                                className={cn(c.toUpperCase() === "#FFFFFF" && "border-slate-200")}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {showThemeColors && (
                            <div>
                                <div className="mb-2 text-[16px] font-medium text-foreground">主题色</div>
                                <div className="grid grid-cols-7 gap-3">
                                    {PRESETS_THEME_DARK.map((c, i) => (
                                        <ColorButton
                                            key={`dark-${i}`}
                                            color={c}
                                            isTheme
                                            textColor="white"
                                            isActive={isSelected('theme-dark', i)}
                                            onClick={() => { handleColorChange(c, 'theme-dark', i); handleComplete(c); }}
                                        />
                                    ))}
                                    {PRESETS_THEME_LIGHT.map((c, i) => (
                                        <ColorButton
                                            key={`light-${i}`}
                                            color={c}
                                            isTheme
                                            textColor={PRESETS_THEME_DARK[i]}
                                            isActive={isSelected('theme-light', i)}
                                            onClick={() => { handleColorChange(c, 'theme-light', i); handleComplete(c); }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {showRecentColors && recentColors.length > 0 && (
                            <div>
                                <div className="mb-2 text-[16px] font-medium text-foreground">已使用颜色</div>
                                <div className="grid grid-cols-7 gap-3">
                                    {recentColors.slice(0, 7).map((c, i) => (
                                        <ColorButton
                                            key={c}
                                            color={c}
                                            isActive={isSelected('recent', i)}
                                            onClick={() => { handleColorChange(c, 'recent', i); handleComplete(c); }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-[16px] font-medium text-foreground">自定义颜色</div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-background-secondary" onClick={openEyeDropper} title="Pick color">
                                        <Pipette className="h-5 w-5 text-foreground" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 p-0 rounded-full hover:scale-105 transition-transform overflow-hidden"
                                        onClick={() => setView("advanced")}
                                        title="Advanced"
                                    >
                                        <svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
                                            <defs>
                                                <linearGradient id="paint_custom_gradient_0">
                                                    <stop stopColor="rgb(255,30,30)" offset="0" stopOpacity="1" />
                                                    <stop stopColor="rgb(255,0,13)" offset="0.0486894697" stopOpacity="1" />
                                                </linearGradient>
                                                <mask id="outline_mask_0">
                                                    <path d="M16.4991 1.47531C11.2387 -1.56175 4.51237 0.240578 1.47531 5.50092C-1.56175 10.7613 0.240578 17.4876 5.50092 20.5247C10.7613 23.5618 17.4876 21.7594 20.5247 16.4991C23.5618 11.2387 21.7594 4.51237 16.4991 1.47531Z" fill="rgb(255,255,255)" fillRule="evenodd" />
                                                </mask>
                                                <radialGradient id="paint_radial_0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(7.36784,-0.780466,0.780466,7.36784,11,11)">
                                                    <stop stopColor="rgb(255,255,255)" offset="0" stopOpacity="1" />
                                                    <stop stopColor="rgb(255,255,255)" offset="1" stopOpacity="0" />
                                                </radialGradient>
                                            </defs>
                                            <path id="path_1" d="M16.4991 1.47531C11.2387 -1.56175 4.51237 0.240578 1.47531 5.50092C-1.56175 10.7613 0.240578 17.4876 5.50092 20.5247C10.7613 23.5618 17.4876 21.7594 20.5247 16.4991C23.5618 11.2387 21.7594 4.51237 16.4991 1.47531Z" fill="rgb(0,0,0)" fillOpacity="0" fillRule="evenodd" />
                                            <g id="custom_gradient_0" mask="url(#outline_mask_0)">
                                                <g>
                                                    <foreignObject width="22" height="22" x="0" y="0">
                                                        <div style={{
                                                            background: "conic-gradient(from 90deg, rgba(255,30,30,1) 0%, rgba(255,0,13,1) 4.86895%, rgba(255,0,176,1) 9.263%, rgba(255,0,247,1) 14.4231%, rgba(249,0,255,1) 18.344%, rgba(192,0,255,1) 24.7445%, rgba(125,0,243,1) 29.5979%, rgba(23,0,224,1) 34.6134%, rgba(4,72,255,1) 40.8014%, rgba(67,177,245,1) 45.9485%, rgba(0,235,255,1) 50.57%, rgba(70,244,209,1) 57.2398%, rgba(54,248,118,1) 62.9519%, rgba(95,252,32,1) 68.7577%, rgba(180,255,17,1) 74.9235%, rgba(247,255,0,1) 81.7546%, rgba(255,218,0,1) 86.442%, rgba(255,154,0,1) 91.5565%, rgba(255,0,0,1) 100%, rgba(255,30,30,1) 100%)",
                                                            width: "100%",
                                                            height: "100%"
                                                        }} />
                                                    </foreignObject>
                                                </g>
                                            </g>
                                            <path id="path_2" d="M16.4991 1.47531C11.2387 -1.56175 4.51237 0.240578 1.47531 5.50092C-1.56175 10.7613 0.240578 17.4876 5.50092 20.5247C10.7613 23.5618 17.4876 21.7594 20.5247 16.4991C23.5618 11.2387 21.7594 4.51237 16.4991 1.47531Z" fill="url(#paint_radial_0)" fillRule="evenodd" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>

                            {renderCustomColors()}
                        </div>

                    </div>
                ) : (
                    <div className="p-0">
                        <div className="flex items-center justify-between p-3 border-b bg-muted/10">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    addToCustom(color)
                                    setView("grid");
                                }}
                                className="h-7 px-2"
                            >
                                <ChevronDown className="mr-1 h-3 w-3 rotate-90" /> Back
                            </Button>
                            <div className="text-xs font-medium">高级设置</div>
                        </div>

                        <div className="p-4 space-y-4">
                            <HexColorPicker color={color} onChange={(c) => {
                                setColor(c)
                                onChange?.(c)
                                setActiveSelection(null)
                            }} className="!w-full !h-[180px]" />

                            <div className="flex items-center gap-2">
                                <div className="text-xs w-10 text-muted-foreground">Hex</div>
                                <Input
                                    value={color}
                                    onChange={(e) => {
                                        setColor(e.target.value)
                                        onChange?.(e.target.value)
                                        setActiveSelection(null)
                                    }}
                                    className="h-8 text-xs font-mono"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

function ColorButton({
    color,
    isActive,
    isTheme,
    width = "36px",
    height = "36px",
    onClick,
    onContextMenu,
    className,
    textColor
}: {
    color: string,
    isActive?: boolean,
    isTheme?: boolean,
    width?: string,
    height?: string,
    onClick: () => void,
    onContextMenu?: (e: React.MouseEvent) => void,
    className?: string,
    textColor?: string
}) {
    const ringClass = isActive ? "ring-4 ring-[#0A59F7] ring-offset-2 border-background" : "border-transparent"

    return (
        <button
            className={cn(
                "group relative rounded-full border shadow-sm transition-all hover:scale-110",
                "focus:outline-none focus:ring-2 focus:ring-[#0A59F7] focus:ring-offset-2",
                ringClass,
                isTheme && "flex items-center justify-center font-normal text-[20px]", // text size 20px
                className
            )}
            style={{
                backgroundColor: color,
                width: width === "36px" ? "1.75rem" : width, // 28px = 1.75rem
                height: height === "36px" ? "1.75rem" : height,
                color: textColor || "white" // Default white text
            }}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {isTheme && <span className="drop-shadow-sm opacity-80 group-hover:opacity-100">A</span>}
        </button>
    )
}

declare global {
    interface Window {
        EyeDropper: any
    }
}
