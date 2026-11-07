export const USER_ROLES = ['Admin', 'User'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const VEHICLE_TYPES = ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const PAYMENT_METHODS = ['Cash', 'Credit', 'Cheque', 'Card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ['Paid', 'Pending', 'unpaid', 'paid', 'pending'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const STANDARD_SERVICES = ['FullService', 'Body Wash', 'Custom'] as const;
export type StandardService = (typeof STANDARD_SERVICES)[number];

export const DEFAULT_SERVICES = [
  // Car
  { category: 'Car', name: 'FullService', price: 0 },
  { category: 'Car', name: 'Body Wash', price: 0 },
  { category: 'Car', name: 'Custom', price: 0 },
  // Bike
  { category: 'Bike', name: 'FullService', price: 0 },
  { category: 'Bike', name: 'Body Wash', price: 0 },
  { category: 'Bike', name: 'Custom', price: 0 },
  // Van
  { category: 'Van', name: 'FullService', price: 2800 },
  { category: 'Van', name: 'Body Wash', price: 0 },
  { category: 'Van', name: 'Custom', price: 0 },
  // Bus
  { category: 'Bus', name: 'FullService', price: 0 },
  { category: 'Bus', name: 'Body Wash', price: 0 },
  { category: 'Bus', name: 'Custom', price: 0 },
  // Lorry
  { category: 'Lorry', name: 'FullService', price: 0 },
  { category: 'Lorry', name: 'Body Wash', price: 0 },
  { category: 'Lorry', name: 'Custom', price: 0 },
  // Others
  { category: 'Others', name: 'FullService', price: 0 },
  { category: 'Others', name: 'Body Wash', price: 0 },
  { category: 'Others', name: 'Custom', price: 0 },
] as const;

export const CURRENCY = {
  CODE: 'LKR',
  SYMBOL: 'Rs.',
  TIMEZONE: 'Asia/Colombo',
} as const;
