import { HeadContent, Scripts, createRootRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { Train, HelpCircle } from 'lucide-react'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'IRCTC Journey Assurance – AI Travel Planner' },
      { name: 'description', content: 'AI-powered IRCTC journey planning with backup plans and Tatkal fallback.' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-50 min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
