// Date format utilities for dd/mm/yyyy format

/**
 * Converts yyyy-mm-dd to dd/mm/yyyy
 */
export const formatDateDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Converts dd/mm/yyyy to yyyy-mm-dd
 */
export const parseDateDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  const [day, month, year] = parts;
  // Validate
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
    return '';
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Converts Date object to dd/mm/yyyy
 */
export const dateToStringDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Gets today's date as dd/mm/yyyy
 */
export const getTodayDDMMYYYY = (): string => {
  return dateToStringDDMMYYYY(new Date());
};
