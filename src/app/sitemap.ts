import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blogData'

// Required for static export
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogUrls = blogPosts.map((post) => ({
    url: `https://budgetgear.in/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://budgetgear.in',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://budgetgear.in/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://budgetgear.in/car-affordability-calculator',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://budgetgear.in/car-loan-prepayment-calculator',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://budgetgear.in/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://budgetgear.in/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...blogUrls,
  ]
}