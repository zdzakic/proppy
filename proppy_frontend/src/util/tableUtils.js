/**
 * sortTableData
 *
 * Universal function for sorting array of objects by a given key and direction.
 * Can handle strings and numbers. Safe against null/undefined.
 */
export const sortTableData = (data, key, direction = 'asc') => {
    if (!Array.isArray(data)) return [];
  
    return [...data].sort((a, b) => {
      const aValue = a[key] ?? '';
      const bValue = b[key] ?? '';
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
  
      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };
  