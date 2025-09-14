import { type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  onPageChange,
  onSort,
  loading = false,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const getCellValue = (row: T, column: Column<T>): ReactNode => {
    if (column.render) {
      const value = typeof column.key === 'string' && column.key.includes('.') 
        ? column.key.split('.').reduce((obj, key) => obj?.[key], row)
        : row[column.key as keyof T];
      return column.render(value, row);
    }
    
    if (typeof column.key === 'string' && column.key.includes('.')) {
      const value = column.key.split('.').reduce((obj, key) => obj?.[key], row);
      return String(value ?? '');
    }
    
    const value = row[column.key as keyof T];
    return String(value ?? '');
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-surface-variant border-b border-border"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface border-b border-border last:border-b-0"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-variant border-b border-border">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider ${
                    column.width ? `w-${column.width}` : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && onSort && (
                      <button
                        onClick={() => onSort(column.key as string, 'asc')}
                        className="text-text-disabled hover:text-text-secondary"
                      >
                        ↕
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-text-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-surface-variant transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="px-6 py-3 border-t border-border bg-surface-variant">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange?.(1)}
                disabled={pagination.page === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-text-primary px-3 py-1">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange?.(pagination.pages)}
                disabled={pagination.page === pagination.pages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
