import { blogPosts } from '@/data/blogData'
import BlogPostClient from './BlogPostClient'

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogPostClient params={params} />
}
