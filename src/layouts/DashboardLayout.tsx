import { NavLink, Outlet } from 'react-router-dom';
import { Eye, FilePlus2, LayoutList } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/posts', label: 'All Posts', shortLabel: 'Posts', icon: LayoutList, end: true },
  { to: '/posts/new', label: 'Add New', shortLabel: 'Add', icon: FilePlus2, end: false },
  { to: '/preview', label: 'Preview', shortLabel: 'Preview', icon: Eye, end: false },
] as const;

/**
 * Dashboard shell with responsive navigation:
 * - Mobile: bottom tab bar
 * - Tablet: top bar with labeled links
 * - Desktop+: sticky sidebar
 */
export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r bg-sidebar px-3 py-5 text-sidebar-foreground lg:flex xl:w-64">
        <div className="mb-4 px-2">
          <p className="text-sm font-semibold tracking-tight">Article Desk</p>
          <p className="text-xs text-muted-foreground">Blog dashboard</p>
        </div>

        <Separator className="mb-3" />

        <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  buttonVariants({
                    variant: isActive ? 'secondary' : 'ghost',
                  }),
                  'w-full justify-start gap-2',
                  !isActive && 'text-muted-foreground',
                )
              }
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6 lg:hidden">
          <p className="shrink-0 text-sm font-semibold">Article Desk</p>
          <nav
            className="hidden min-w-0 items-center gap-1 sm:flex"
            aria-label="Main"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({
                      variant: isActive ? 'secondary' : 'ghost',
                      size: 'sm',
                    }),
                    'gap-1.5',
                    !isActive && 'text-muted-foreground',
                  )
                }
              >
                <item.icon className="size-4" aria-hidden />
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.shortLabel}</span>
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="min-w-0 flex-1 px-4 py-5 pb-24 sm:px-6 sm:py-6 sm:pb-6 md:px-8 lg:px-8 lg:py-8 xl:px-10">
          <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
            <Outlet />
          </div>
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-background/80 sm:hidden"
          aria-label="Main"
        >
          <div className="grid grid-cols-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn('size-5', isActive && 'stroke-[2.25]')}
                      aria-hidden
                    />
                    <span>{item.shortLabel}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
