import { useMemo, useState } from "react"

export function usePagination<T>(allItems: T[], itemsPerPage: number) {
  //pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(allItems.length / itemsPerPage)

  // Calculate the items for the current page using useMemo for efficiency
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allItems.slice(startIndex, endIndex)
  }, [currentPage, allItems, itemsPerPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Optional: Scroll to top of the page on page change
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }
  return {
    currentItems,
    totalPages,
    currentPage,
    handlePageChange,
  }
}
