import { useUiStore } from '@/shared/store'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui'
import { SidebarNav } from './SidebarNav'

/** Мобильный сайдбар (drawer). Открывается бургером из шапки. */
export function MobileSidebar() {
  const open = useUiStore((s) => s.mobileSidebarOpen)
  const setOpen = useUiStore((s) => s.setMobileSidebarOpen)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-64 gap-0 p-0">
        <SheetHeader>
          <SheetTitle className="font-heading text-lg">Mini-CRM</SheetTitle>
        </SheetHeader>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
