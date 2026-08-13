const blogs = [
  { blogId: "1", file: "1.md" },
  { blogId: "2", file: "2.md" },
  { blogId: "3", file: "3.md" },
]

export async function generateStaticParams() {
  return blogs.map((blog) => ({ blogId: blog.blogId }))
}

//TODO: Blog page
export default async function BlogPage({
  params,
}: {
  params: Promise<{ blogId: string }>
}) {
  const { blogId } = await params

  return (
    <div>
      <p>{blogId}</p>
    </div>
  )
}
