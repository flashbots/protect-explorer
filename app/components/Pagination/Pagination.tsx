// components/Pagination.tsx
import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, handlePageChange }) => {
  const maxVisiblePages = 10;
  const currentSet = Math.floor((currentPage - 1) / maxVisiblePages);
  const startPage = currentSet * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  return (
    <div className={styles.pagination}>
      {startPage > 1 && (
        <button
          className={styles.pageButton}
          onClick={() => handlePageChange(startPage - 1)}
        >
          ← Previous pages
        </button>
      )}
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const page = startPage + index;
        return (
          <button
            key={page}
            className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        );
      })}
      {totalPages > endPage && (
        <button
          className={styles.pageButton}
          onClick={() => handlePageChange(endPage + 1)}
        >
          More pages →
        </button>
      )}
    </div>
  );
};

export default Pagination;
