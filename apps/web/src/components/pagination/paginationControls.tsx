"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const t = useTranslations("Pagination")

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }
  return (
    <Pagination>
      <PaginationContent className="mt-3 lg:mt-4">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePrevious()
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          >
            <RyogoCaption>{t("Previous")}</RyogoCaption>
          </PaginationPrevious>
        </PaginationItem>
        <RyogoCaption color="light" className="mx-3 lg:mx-4">
          {currentPage} / {totalPages}
        </RyogoCaption>
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleNext()
            }}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          >
            <RyogoCaption>{t("Next")}</RyogoCaption>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
