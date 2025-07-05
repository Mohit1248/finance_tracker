import { useState } from 'react';

export default function usePagination(totalItems, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return { currentPage, totalPages, paginate };
}