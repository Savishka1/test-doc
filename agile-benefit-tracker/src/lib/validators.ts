export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateAmount = (amount: number, remaining: number): boolean => {
  return amount > 0 && amount <= remaining;
};

export const validateClaimForm = (
  claimType: string,
  amount: number,
  description: string,
  billFile: File | null
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!claimType) {
    errors.push('Claim type is required');
  }

  if (!amount || amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!billFile) {
    errors.push('Bill upload is mandatory');
  } else {
    if (!validateFileType(billFile)) {
      errors.push('Only PDF, JPG, JPEG, and PNG files are allowed');
    }
    if (!validateFileSize(billFile)) {
      errors.push('File size must be less than 10 MB');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const getFileErrorMessage = (file: File): string | null => {
  if (!validateFileType(file)) {
    return 'Please upload a PDF/JPG/PNG file';
  }
  if (!validateFileSize(file)) {
    return 'Please upload a file under 10 MB';
  }
  return null;
};
