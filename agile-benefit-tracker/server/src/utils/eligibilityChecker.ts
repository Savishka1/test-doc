import { ClaimType } from '../models/enums';

const WELLNESS_EQUIPMENT_KEYWORDS = [
  'equipment',
  'treadmill',
  'dumbbell',
  'weights',
  'machine',
  'bike',
  'cycle',
  'gym equipment',
];

export const checkWellnessEquipment = (description: string): boolean => {
  const lowerDesc = description.toLowerCase();
  return WELLNESS_EQUIPMENT_KEYWORDS.some((keyword) => lowerDesc.includes(keyword));
};

export const validateClaimEligibility = (
  claimType: ClaimType,
  description: string
): { eligible: boolean; reason?: string } => {
  // OPD claims have no restrictions
  if (claimType === ClaimType.OPD) {
    return { eligible: true };
  }

  // Wellness claims cannot include equipment
  if (claimType === ClaimType.WELLNESS) {
    if (checkWellnessEquipment(description)) {
      return {
        eligible: false,
        reason: 'Wellness claims cannot include equipment purchases',
      };
    }
  }

  return { eligible: true };
};

export const getCurrentQuarter = (date: Date = new Date()): number => {
  const month = date.getMonth();
  return Math.floor(month / 3) + 1;
};
