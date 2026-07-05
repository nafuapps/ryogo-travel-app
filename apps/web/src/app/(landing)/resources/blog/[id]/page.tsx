const blogs = [
  { id: "1", file: "first.md" },
  { id: "2", file: "second.md" },
  { id: "3", file: "third.md" },
]

export async function generateStaticParams() {
  return blogs.map((blog) => ({ id: blog.id }))
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <p>{id}</p>
    </div>
  )
}
