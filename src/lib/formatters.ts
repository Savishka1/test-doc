export const formatCurrency = (amount: number): string => {
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getQuarter = (date: Date = new Date()): number => {
  const month = date.getMonth();
  return Math.floor(month / 3) + 1;
};

export const getQuarterLabel = (quarter: number): string => {
  return `Q${quarter} ${new Date().getFullYear()}`;
};
