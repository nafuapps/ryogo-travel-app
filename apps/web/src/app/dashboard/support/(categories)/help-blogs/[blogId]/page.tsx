const blogs = [
  { blogId: "1", file: "1.md" },
  { blogId: "2", file: "2.md" },
  { blogId: "3", file: "3.md" },
]

export async function generateStaticParams() {
  return blogs.map((blog) => ({ blogId: blog.blogId }))
}

export default async function SupportBlogPage({
  params,
}: {
  params: Promise<{
    blogId: string
  }>
}) {
  const { blogId } = await params
  return <div>{blogId}</div>
}
