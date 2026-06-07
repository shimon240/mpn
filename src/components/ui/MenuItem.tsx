import { cn } from '@/lib/utils'
import { Switch } from './Switch'

export interface MenuItemProps {
  label?: string
  leftIcon?: React.ReactNode
  rightText?: string
  rightIcon?: React.ReactNode
  toggle?: boolean
  defaultToggled?: boolean
  onToggleChange?: (checked: boolean) => void
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function MenuItem({
  label = 'Menu Item',
  leftIcon,
  rightText,
  rightIcon,
  toggle,
  defaultToggled = false,
  onToggleChange,
  onClick,
  className,
  disabled,
}: MenuItemProps) {
  return (
    <div
      role="menuitem"
      onClick={disabled ? undefined : onClick}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 rounded-sm w-full',
        'text-slate-700 text-sm font-medium leading-5',
        'cursor-default select-none outline-none',
        'hover:bg-slate-100 focus:bg-slate-100',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
    >
      {leftIcon && (
        <span className="shrink-0 size-4 flex items-center justify-center text-slate-700">
          {leftIcon}
        </span>
      )}

      <span className="flex-1 min-w-0 truncate">{label}</span>

      {rightText && (
        <span className="shrink-0 text-xs text-slate-500 font-medium">{rightText}</span>
      )}

      {rightIcon && !toggle && (
        <span className="shrink-0 size-4 flex items-center justify-center text-slate-500">
          {rightIcon}
        </span>
      )}

      {toggle && (
        <Switch
          defaultChecked={defaultToggled}
          onCheckedChange={onToggleChange}
          onClick={e => e.stopPropagation()}
        />
      )}
    </div>
  )
}
