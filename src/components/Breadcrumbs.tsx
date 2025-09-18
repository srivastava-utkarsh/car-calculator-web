'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { themeClass } from '@/utils/themeStyles'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { isLight } = useTheme()

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className={`w-4 h-4 mx-2 ${themeClass('text-slate-400', 'text-white/40', isLight)}`} />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={`hover:underline transition-colors ${themeClass('text-blue-600 hover:text-blue-700', 'text-blue-400 hover:text-blue-300', isLight)}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={`${themeClass('text-slate-700', 'text-white/70', isLight)}`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}