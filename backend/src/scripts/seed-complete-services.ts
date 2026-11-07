import { prisma } from '../config/prisma.js';

interface ServiceSeed {
  category: string;
  name: string;
  price: number;
  description?: string;
}

const ALL_VEHICLE_TYPES = [
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
];

const FULL_SERVICE_ITEMS: ServiceSeed[] = [
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
];

const CUSTOM_CATEGORY_ITEMS = [
  'Service Charge',
  'Engine Wash',
  'Grease',
  'Diesel Filter',
  'Air filter',
  'Cabin Filter',
  'Engine Oil',
  'Gear Oil',
  'Differencel Oil',
  'Transfer Box Oil',
  'Break Oil',
  'Hydralauic Oil',
  'Power Sterling Oil',
  'Battery Water',
  'Radiator Coolant',
  'Radiator Plask',
  'Penetrating Oil',
  'Diesel',
  'Kerosene',
  'High Pressure',
  'Wash',
  'Car Wash',
  'Wapper Blade',
];

async function seed() {
  console.log('--- Updating Vehicle Types in Settings ---');
  await prisma.setting.upsert({
    where: { key: 'vehicle_types' },
    update: { value: JSON.stringify(ALL_VEHICLE_TYPES) },
    create: { key: 'vehicle_types', value: JSON.stringify(ALL_VEHICLE_TYPES) },
  });
  console.log(`✔ Stored ${ALL_VEHICLE_TYPES.length} vehicle categories`);

  console.log('--- Seeding Full Service & Body Wash Catalog Items ---');
  for (const item of FULL_SERVICE_ITEMS) {
    await prisma.service.upsert({
      where: {
        category_name: {
          category: item.category,
          name: item.name,
        },
      },
      update: {
        price: item.price,
        description: item.description || '',
      },
      create: {
        category: item.category,
        name: item.name,
        price: item.price,
        description: item.description || '',
      },
    });
  }
  console.log(`✔ Seeded ${FULL_SERVICE_ITEMS.length} vehicle-specific rate items`);

  console.log('--- Seeding Custom Category Items ---');
  for (const customName of CUSTOM_CATEGORY_ITEMS) {
    await prisma.service.upsert({
      where: {
        category_name: {
          category: 'Custom',
          name: customName,
        },
      },
      update: {},
      create: {
        category: 'Custom',
        name: customName,
        price: 0,
        description: 'Custom Service / Consumable',
      },
    });
  }
  console.log(`✔ Seeded ${CUSTOM_CATEGORY_ITEMS.length} Custom category items`);

  // Clean up old obsolete generic names
  await prisma.service.deleteMany({
    where: {
      name: { in: ['FullService', 'Custom Item', 'SUV Full Polish'] },
    },
  });

  const total = await prisma.service.count();
  console.log(`\n🎉 Total Services in Catalog: ${total}`);
}

seed()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
