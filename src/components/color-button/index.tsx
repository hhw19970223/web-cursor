import { cn } from "@/utils/cn";

export function ColorButton({ type, className, label, disable }: { disable: boolean, label: string, type: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | string, className?: string }) {
  return <div className="h-btn">
    <button disabled={disable} className={cn('w-[220px] h-[80px] text-xl rounded-xl', {[`color-${type} h-btn-hover`]: !disable}, className, { 'h-is-active': !disable})}>{ label }</button>
  </div>   
}