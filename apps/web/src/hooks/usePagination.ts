import { useMemo, useState } from "react"

export function usePagination<T>(allItems: T[], itemsPerPage: number) {
  //pagination states
  const [selectedPage, setSelectedPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(allItems.length / itemsPerPage))
  const currentPage = Math.min(selectedPage, totalPages)

  // Calculate the items for the current page using useMemo for efficiency
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allItems.slice(startIndex, endIndex)
  }, [currentPage, allItems, itemsPerPage])

  const handlePageChange = (page: number) => {
    setSelectedPage(Math.min(Math.max(page, 1), totalPages))
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
