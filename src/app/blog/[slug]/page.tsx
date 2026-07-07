import { Metadata } from 'next'
import { blogPosts } from '@/data/blogData'
import BlogPostClient from './BlogPostClient'

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    authors: [{ name: post.author, url: 'https://budgetgear.in/about/' }],
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.metaDescription,
      url: `https://budgetgear.in/blog/${post.slug}/`,
      siteName: 'BudgetGear',
      locale: 'en_IN',
      publishedTime: post.publishedDate,
      modifiedTime: post.lastUpdated,
      authors: [post.author],
      images: [
        {
          url: 'https://budgetgear.in/icon-512.png',
          width: 512,
          height: 512,
          alt: 'BudgetGear Car Finance Calculator Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: ['https://budgetgear.in/icon-512.png'],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  const structuredData = post ? [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.metaDescription,
      "author": {
        "@type": "Person",
        "name": post.author,
        "url": "https://budgetgear.in/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "BudgetGear",
        "logo": {
          "@type": "ImageObject",
          "url": "https://budgetgear.in/icon-512.png",
          "width": 512,
          "height": 512
        }
      },
      "datePublished": post.publishedDate,
      "dateModified": post.lastUpdated,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://budgetgear.in/blog/${post.slug}/`
      },
      "image": "https://budgetgear.in/icon-512.png",
      "inLanguage": "en-IN",
      "keywords": post.keywords.join(", ")
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://budgetgear.in/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://budgetgear.in/blog/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `https://budgetgear.in/blog/${post.slug}/`
        }
      ]
    }
  ] : null

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <BlogPostClient params={params} />
    </>
  )
}
