'use client'

import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import Head from 'next/head'
import { useTheme } from '@/contexts/ThemeContext'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import { blogPosts } from '@/data/blogData'
import { getArticleContent } from '@/data/articleContent'
import AdSenseAd from '@/components/AdSenseAd'

export default function BlogPostClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { isLight } = useTheme()
  
  const post = blogPosts.find(p => p.slug === slug)
  const content = getArticleContent(slug)
  
  if (!post) {
    return <div>Post not found</div>
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": "https://budgetgear.in/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BudgetGear",
      "logo": {
        "@type": "ImageObject",
        "url": "https://budgetgear.in/bck-logo.svg"
      }
    },
    "datePublished": post.publishedDate,
    "dateModified": post.lastUpdated,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://budgetgear.in/blog/${post.slug}`
    },
    "keywords": post.keywords.join(", ")
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://budgetgear.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://budgetgear.in/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://budgetgear.in/blog/${post.slug}`
      }
    ]
  }

  return (
    <>
      <Head>
        <title>{post.title} | BudgetGear</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <meta name="author" content={post.author} />
        <link rel="canonical" href={`https://budgetgear.in/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={`https://budgetgear.in/blog/${post.slug}`} />
        <meta property="og:site_name" content="BudgetGear" />
        <meta property="article:published_time" content={post.publishedDate} />
        <meta property="article:modified_time" content={post.lastUpdated} />
        <meta property="article:author" content={post.author} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
      </Head>

      <main className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50' : 'bg-black'}`}>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        
        {/* Schema Markup */}
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

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

            <div className="mt-12">
              <AdSenseAd slot="3456789012" style={{ margin: "24px 0" }} />
            </div>

            <div className={`mt-12 p-8 rounded-2xl ${isLight ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/50'}`}>
              <h3 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Ready to Calculate Your Car Budget?
              </h3>
              <p className={`mb-6 ${isLight ? 'text-slate-600' : 'text-white/80'}`}>
                Use our free calculators to determine how much car you can afford and plan your loan prepayments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/car-affordability-calculator" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-all">
                  Car Affordability Calculator
                </Link>
                <Link href="/car-loan-prepayment-calculator" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition-all">
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
