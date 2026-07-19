'use client'

import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import { blogPosts } from '@/data/blogData'
import { getArticleContent } from '@/data/articleContent'

export default function BlogPostClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { isLight } = useTheme()

  const post = blogPosts.find(p => p.slug === slug)
  const content = getArticleContent(slug)

  if (!post) {
    return <div>Post not found</div>
  }

  // Same-category posts first, then others, excluding the current post
  const relatedPosts = [
    ...blogPosts.filter(p => p.slug !== slug && p.category === post.category),
    ...blogPosts.filter(p => p.slug !== slug && p.category !== post.category),
  ].slice(0, 3)

  return (
    <>
      <main className={`min-h-screen ${isLight ? 'bg-[#F4F5F8]' : 'bg-black'}`}>
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

      <article className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title }
            ]} />
            
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 mt-8 ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
              {post.category}
            </div>
            
            <h1 className={`text-4xl sm:text-5xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {post.title}
            </h1>
            
            <div className={`flex flex-wrap items-center gap-4 mb-6 text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
              <span>By {post.author}</span>
              <span>•</span>
              <time dateTime={post.publishedDate}>Published: {post.date}</time>
              <span>•</span>
              <time dateTime={post.lastUpdated}>Updated: {new Date(post.lastUpdated).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <div className={`prose prose-lg max-w-none ${isLight ? 'prose-slate' : 'prose-invert'}`}>
              {content}
            </div>

            {/* Related guides */}
            <div className="mt-12">
              <h2 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Related Guides
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {relatedPosts.map(related => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className={`block p-5 rounded-2xl transition-all ${isLight ? 'bg-white border border-slate-200 shadow-sm hover:shadow-md' : 'bg-slate-800/40 border border-slate-700 hover:bg-slate-800/70'}`}
                  >
                    <span className={`text-xs font-semibold uppercase tracking-wide ${isLight ? 'text-[#E8542F]' : 'text-blue-400'}`}>
                      {related.category}
                    </span>
                    <h3 className={`mt-2 font-semibold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {related.title}
                    </h3>
                    <span className={`mt-2 block text-sm ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                      {related.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className={`mt-12 p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800/30 border border-slate-700'}`}>
              <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/40 text-blue-300'}`}>
                AM
              </div>
              <div>
                <p className={`text-sm font-semibold uppercase tracking-wide mb-1 ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                  About the author
                </p>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {post.author}
                </h3>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                  Arjun is a software engineer and the creator of BudgetGear. He builds the calculators on this site
                  and writes practical guides on car loans, EMI planning, and smart car buying in India, based on
                  publicly available data from the RBI and major Indian banks.{' '}
                  <Link href="/about" className="text-blue-600 hover:underline">Learn more about BudgetGear</Link>.
                </p>
              </div>
            </div>

            <div className={`mt-12 p-8 rounded-2xl ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/50'}`}>
              <h3 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Ready to Calculate Your Car Budget?
              </h3>
              <p className={`mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Use our free calculators to determine how much car you can afford and plan your loan prepayments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/car-affordability-calculator" className="inline-block bg-[#E8542F] hover:bg-[#D64A28] text-white font-semibold px-6 py-3 rounded-full transition-all">
                  Car Affordability Calculator
                </Link>
                <Link href="/car-loan-prepayment-calculator" className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-full transition-all">
                  Prepayment Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
    </>
  )
}
