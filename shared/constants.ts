export const USER_ROLES = ['Admin', 'User'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const VEHICLE_TYPES = [
  'Car',
  'Three-Wheeler',
  'Van/Cab',
  '10 1/2 Lorry',
  '14 1/2 Lorry/ 10 1/2,16 1/2/Boom',
  'Ten-Wheel Lorry',
  'Tank Lorry / Cube 3,4 5Pc wheel/Tipper',
  'Cube Lorry / Small Tipper',
  'Batto Lorry',
  'Bus',
  'Bus (small)',
  'Bike',
  'Machine -30',
  'Custom',
  'Others',
] as const;
export type VehicleType = string;

export const PAYMENT_METHODS = ['Cash', 'Credit', 'Cheque', 'Card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ['Paid', 'Pending', 'unpaid', 'paid', 'pending'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const DEFAULT_SERVICES = [
  // Car
  { category: 'Car', name: 'Service Charge', price: 4500, description: 'Full Service' },
  { category: 'Car', name: 'Engine Wash', price: 450, description: 'Full Service' },
  { category: 'Car', name: 'Engine Chemical', price: 450, description: 'Full Service' },
  { category: 'Car', name: 'Body Wash', price: 1000, description: 'Body Wash' },

  // Three-Wheeler
  { category: 'Three-Wheeler', name: 'Service Charge', price: 2200, description: 'Full Service' },
  { category: 'Three-Wheeler', name: 'Grease Full', price: 1200, description: 'Full Service' },
  { category: 'Three-Wheeler', name: 'Body Wash', price: 900, description: 'Body Wash' },

  // Van/Cab
  { category: 'Van/Cab', name: 'Service Charge', price: 2800, description: 'Full Service' },
  { category: 'Van/Cab', name: 'Grease', price: 0, description: 'Full Service' },
  { category: 'Van/Cab', name: 'Penetrating Oil', price: 1250, description: 'Full Service' },
  { category: 'Van/Cab', name: 'Diesel', price: 450, description: 'Full Service' },
  { category: 'Van/Cab', name: 'Kerosene', price: 1000, description: 'Full Service' },
  { category: 'Van/Cab', name: 'High Pressure', price: 850, description: 'Full Service' },
  { category: 'Van/Cab', name: 'Chemical', price: 850, description: 'Full Service' },
  { category: 'Van/Cab', name: 'Body Wash', price: 1200, description: 'Body Wash' },

  // 10 1/2 Lorry
  { category: '10 1/2 Lorry', name: 'Service Charge', price: 2800, description: 'Full Service' },
  { category: '10 1/2 Lorry', name: 'Penetrating Oil', price: 1250, description: 'Full Service' },
  { category: '10 1/2 Lorry', name: 'Diesel', price: 450, description: 'Full Service' },
  { category: '10 1/2 Lorry', name: 'Kerosene', price: 1000, description: 'Full Service' },
  { category: '10 1/2 Lorry', name: 'High Pressure', price: 750, description: 'Full Service' },
  { category: '10 1/2 Lorry', name: 'Chemical', price: 850, description: 'Full Service' },

  // 14 1/2 Lorry/ 10 1/2,16 1/2/Boom
  { category: '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', name: 'Service Charge', price: 3500, description: 'Full Service' },
  { category: '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', name: 'Penetrating Oil', price: 1200, description: 'Full Service' },
  { category: '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', name: 'Diesel', price: 550, description: 'Full Service' },
  { category: '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', name: 'Kerosene', price: 1200, description: 'Full Service' },
  { category: '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', name: 'High Pressure', price: 1000, description: 'Full Service' },
  { category: '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', name: 'Chemical', price: 1400, description: 'Full Service' },

  // Ten-Wheel Lorry
  { category: 'Ten-Wheel Lorry', name: 'Service Charge', price: 4000, description: 'Full Service' },
  { category: 'Ten-Wheel Lorry', name: 'Grease', price: 8800, description: 'Full Service' },
  { category: 'Ten-Wheel Lorry', name: 'Penetrating Oil', price: 1750, description: 'Full Service' },
  { category: 'Ten-Wheel Lorry', name: 'Diesel', price: 600, description: 'Full Service' },
  { category: 'Ten-Wheel Lorry', name: 'Kerosene', price: 1500, description: 'Full Service' },
  { category: 'Ten-Wheel Lorry', name: 'High Pressure', price: 1200, description: 'Full Service' },
  { category: 'Ten-Wheel Lorry', name: 'Chemical', price: 1800, description: 'Full Service' },

  // Tank Lorry / Cube 3,4 5Pc wheel/Tipper
  { category: 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', name: 'Service Charge', price: 4500, description: 'Full Service' },
  { category: 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', name: 'Grease', price: 6800, description: 'Full Service' },
  { category: 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', name: 'Penetrating Oil', price: 1500, description: 'Full Service' },
  { category: 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', name: 'Diesel', price: 1000, description: 'Full Service' },
  { category: 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', name: 'Kerosene', price: 1400, description: 'Full Service' },
  { category: 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', name: 'High Pressure', price: 1400, description: 'Full Service' },
  { category: 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', name: 'Chemical', price: 1400, description: 'Full Service' },

  // Cube Lorry / Small Tipper
  { category: 'Cube Lorry / Small Tipper', name: 'Service Charge', price: 3500, description: 'Full Service' },
  { category: 'Cube Lorry / Small Tipper', name: 'Grease', price: 4800, description: 'Full Service' },
  { category: 'Cube Lorry / Small Tipper', name: 'Penetrating Oil', price: 1250, description: 'Full Service' },
  { category: 'Cube Lorry / Small Tipper', name: 'Diesel', price: 500, description: 'Full Service' },
  { category: 'Cube Lorry / Small Tipper', name: 'Kerosene', price: 1200, description: 'Full Service' },
  { category: 'Cube Lorry / Small Tipper', name: 'High Pressure', price: 1000, description: 'Full Service' },
  { category: 'Cube Lorry / Small Tipper', name: 'Chemical', price: 850, description: 'Full Service' },

  // Batto Lorry
  { category: 'Batto Lorry', name: 'Service Charge', price: 4500, description: 'Full Service' },
  { category: 'Batto Lorry', name: 'Grease', price: 2800, description: 'Full Service' },
  { category: 'Batto Lorry', name: 'Chemical', price: 450, description: 'Full Service' },

  // Bus
  { category: 'Bus', name: 'Service Charge', price: 6000, description: 'Full Service' },
  { category: 'Bus', name: 'Grease', price: 6500, description: 'Full Service' },
  { category: 'Bus', name: 'Penetrating Oil', price: 1500, description: 'Full Service' },
  { category: 'Bus', name: 'Diesel', price: 1200, description: 'Full Service' },
  { category: 'Bus', name: 'Kerosene', price: 1500, description: 'Full Service' },
  { category: 'Bus', name: 'High Pressure', price: 1400, description: 'Full Service' },
  { category: 'Bus', name: 'Chemical', price: 1400, description: 'Full Service' },
  { category: 'Bus', name: 'Body Wash', price: 2500, description: 'Body Wash' },

  // Bus (small)
  { category: 'Bus (small)', name: 'Service Charge', price: 5500, description: 'Full Service' },
  { category: 'Bus (small)', name: 'Grease', price: 5500, description: 'Full Service' },
  { category: 'Bus (small)', name: 'Penetrating Oil', price: 1250, description: 'Full Service' },
  { category: 'Bus (small)', name: 'Diesel', price: 550, description: 'Full Service' },
  { category: 'Bus (small)', name: 'Kerosene', price: 1200, description: 'Full Service' },
  { category: 'Bus (small)', name: 'High Pressure', price: 1000, description: 'Full Service' },
  { category: 'Bus (small)', name: 'Chemical', price: 1200, description: 'Full Service' },
  { category: 'Bus (small)', name: 'Body Wash', price: 2000, description: 'Body Wash' },

  // Bike
  { category: 'Bike', name: 'Body Wash', price: 500, description: 'Body Wash' },

  // Machine -30
  { category: 'Machine -30', name: 'Body Wash', price: 5500, description: 'Body Wash' },

  // Custom Items
  { category: 'Custom', name: 'Service Charge', price: 0, description: 'Custom Service' },
  { category: 'Custom', name: 'Engine Wash', price: 0, description: 'Custom Service' },
  { category: 'Custom', name: 'Grease', price: 0, description: 'Custom Service' },
  { category: 'Custom', name: 'Diesel Filter', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Air filter', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Cabin Filter', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Engine Oil', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Gear Oil', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Differencel Oil', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Transfer Box Oil', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Break Oil', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Hydralauic Oil', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Power Sterling Oil', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Battery Water', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Radiator Coolant', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Radiator Plask', price: 0, description: 'Custom Part' },
  { category: 'Custom', name: 'Penetrating Oil', price: 0, description: 'Custom Consumable' },
  { category: 'Custom', name: 'Diesel', price: 0, description: 'Custom Consumable' },
  { category: 'Custom', name: 'Kerosene', price: 0, description: 'Custom Consumable' },
  { category: 'Custom', name: 'High Pressure', price: 0, description: 'Custom Service' },
  { category: 'Custom', name: 'Wash', price: 0, description: 'Custom Service' },
  { category: 'Custom', name: 'Car Wash', price: 0, description: 'Custom Service' },
  { category: 'Custom', name: 'Wapper Blade', price: 0, description: 'Custom Part' },
] as const;

export const CURRENCY = {
  CODE: 'LKR',
  SYMBOL: 'Rs.',
  TIMEZONE: 'Asia/Colombo',
} as const;
