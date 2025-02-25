import React from 'react'

import PageButton from './PageButton/PageButton'
import ArrowButton from './ArrowButton/ArrowButton'

import { usePages } from './util'


export type PaginationProps = {
  className?: string
  page: number
  total: number
  setPage: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const { className, page, total, setPage } = props

  const pages = usePages({ page, total })

  const isDisabledNext = page === total
  const isDisabledPrev = page === 1

  return (
    <div className={className}>
      {
        total > 0 && (
          <div className="mt-24">
            <div className="flex justify-center gap-8">
              <ArrowButton
                iconName="arrow/left"
                disabled={isDisabledPrev}
                dataTestId="pagination-prev"
                onClick={() => setPage(page - 1)}
              />
              {
                pages.map((pageValue) => (
                  <PageButton
                    key={pageValue}
                    page={pageValue}
                    isActive={pageValue === page}
                    dataTestId={`pagination-page-${pageValue}`}
                    onClick={() => setPage(pageValue)}
                  />
                ))
              }
              <ArrowButton
                iconName="arrow/right"
                disabled={isDisabledNext}
                dataTestId="pagination-next"
                onClick={() => setPage(page + 1)}
              />
            </div>
          </div>
        )
      }
    </div>
  )
}


export default React.memo(Pagination)
