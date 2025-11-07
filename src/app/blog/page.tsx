'use client'

import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import { blogPosts } from '@/data/blogData'

export default function BlogPage() {
  const { isLight } = useTheme()

  return (
    <main className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`}>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
      />

      {/* Header */}
      <header className={`${isLight ? 'bg-white border-b border-slate-200/60' : 'bg-black border-b border-white/5'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/bck-logo.svg" alt="BudgetGear Logo" className="w-10 h-10 sm:w-12 sm:h-12" width={48} height={48} />
              <span className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>BudgetGear</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Home</Link>
              <Link href="/blog" className="font-medium text-blue-600">Blog</Link>
              <Link href="/about" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>About</Link>
              <Link href="/contact" className={`font-medium hover:text-blue-600 transition-colors ${isLight ? 'text-slate-600' : 'text-white/80'}`}>Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
            
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 mt-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Car Finance & Buying Guides
            </h1>
            <p className={`text-xl mb-12 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
              Expert insights on car loans, EMI calculations, and smart car buying strategies in India
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`block p-6 rounded-2xl border transition-all hover:scale-105 ${isLight ? 'bg-white border-slate-200 hover:shadow-xl' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60'}`}
                >
                  <div className={`text-sm font-semibold mb-3 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                    {post.category}
                  </div>
                  <h2 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {post.title}
                  </h2>
                  <p className={`text-sm mb-4 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                    {post.excerpt}
                  </p>
                  <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                    {post.readTime} • {post.date}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
