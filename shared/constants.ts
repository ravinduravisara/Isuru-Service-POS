export const USER_ROLES = ['Admin', 'User'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const VEHICLE_TYPES = ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const PAYMENT_METHODS = ['Cash', 'Credit', 'Cheque', 'Card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ['Paid', 'Pending', 'unpaid', 'paid', 'pending'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const DEFAULT_SERVICES = [
  { category: 'Car', name: 'Engine Oil Change', price: 0 },
  { category: 'Car', name: 'Full Service / Body Wash', price: 0 },
  { category: 'Car', name: 'Interior Cleaning', price: 0 },
  { category: 'Car', name: 'Vacuum', price: 0 },
  { category: 'Car', name: 'Tune-up', price: 0 },
  { category: 'Car', name: 'Filters Replacement', price: 0 },
  { category: 'Car', name: 'Labor Charges', price: 0 },
  { category: 'Car', name: 'Custom Item', price: 0 },
  { category: 'Bike', name: 'Engine Oil Change', price: 0 },
  { category: 'Bike', name: 'Tune-up', price: 0 },
  { category: 'Bike', name: 'Custom Item', price: 0 },
  { category: 'Van', name: 'Engine Oil Change', price: 0 },
  { category: 'Van', name: 'Full Service / Body Wash', price: 0 },
  { category: 'Van', name: 'Tune-up', price: 0 },
  { category: 'Van', name: 'Custom Item', price: 0 },
  { category: 'Bus', name: 'Engine Oil Change', price: 0 },
  { category: 'Bus', name: 'Full Service / Body Wash', price: 0 },
  { category: 'Bus', name: 'Tune-up', price: 0 },
  { category: 'Bus', name: 'Custom Item', price: 0 },
  { category: 'Lorry', name: 'Engine Oil Change', price: 0 },
  { category: 'Lorry', name: 'Full Service / Body Wash', price: 0 },
  { category: 'Lorry', name: 'Tune-up', price: 0 },
  { category: 'Lorry', name: 'Custom Item', price: 0 },
  { category: 'Others', name: 'Custom Item', price: 0 },
] as const;

export const CURRENCY = {
  CODE: 'LKR',
  SYMBOL: 'Rs.',
  TIMEZONE: 'Asia/Colombo',
} as const;
