const blogs = [
  { blogId: "1", file: "first.md" },
  { blogId: "2", file: "second.md" },
  { blogId: "3", file: "third.md" },
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
