-- ==============================================================================
-- ISURU SERVICE CENTER POS: PRODUCTION OFFLINE SEED DATA
-- Generated from Neon Production Database
-- ==============================================================================

-- 1. SETTINGS
INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('fc8954ea-343a-451a-ba0d-1c3dfb6bca87', 'admin_username', 'test_sec_admin', '2026-11-07T16:21:06.611Z')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = EXCLUDED."updatedAt";
INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('f76e63c2-c7b3-48d0-a2a2-81420b754937', 'business_address', '123 High Level Road, Maharagama', '2026-11-07T16:21:06.309Z')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = EXCLUDED."updatedAt";
INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('27943573-3107-440e-a284-851b17abf0b2', 'business_name', 'ISURU Auto Service Center', '2026-11-07T16:21:07.122Z')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = EXCLUDED."updatedAt";
INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('d199126e-3176-4f50-943e-c26f28d27cf8', 'business_phone', '+94 11 285 5555', '2026-11-07T16:21:06.509Z')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = EXCLUDED."updatedAt";
INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('268f118f-ee2e-4d90-83fb-a077b747a131', 'service_presets', '["Service Charge","Engine Wash","Engine Chemical","Grease","Penetrating Oil","Diesel","Kerosene","High Pressure","Chemical","Body Wash","Grease Full","FullService","Custom","Diesel Filter","Air filter","Cabin Filter","Engine Oil","Gear Oil","Differencel Oil","Transfer Box Oil","Break Oil","Hydralauic Oil","Power Sterling Oil","Battery Water","Radiator Coolant","Radiator Plask","Wash","Car Wash","Wapper Blade"]', '2026-11-07T16:21:06.854Z')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = EXCLUDED."updatedAt";
INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('3b8490e3-64f0-4ed0-872d-2d6c27fc5b49', 'service_tags', '["Full Service","Body Wash","Custom Part","Under Wash"]', '2026-11-07T16:21:06.934Z')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = EXCLUDED."updatedAt";
INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('91d7f125-41f6-41b0-a2b7-ad983fc8361b', 'user_username', 'test_sec_staff', '2026-11-07T16:21:06.714Z')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = EXCLUDED."updatedAt";
INSERT INTO "settings" ("id", "key", "value", "updatedAt")
VALUES ('7887a78a-1b75-4350-ba01-c79b3f2d88ec', 'vehicle_types', '["Car","Three-Wheeler","Van/Cab","10 1/2 Lorry","14 1/2 Lorry/ 10 1/2,16 1/2/Boom","Ten-Wheel Lorry","Tank Lorry / Cube 3,4 5Pc wheel/Tipper","Cube Lorry / Small Tipper","Batto Lorry","Bus","Bus (small)","Bike","Machine -30","Custom","Others"]', '2026-11-07T16:21:06.779Z')
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = EXCLUDED."updatedAt";

-- 2. USERS
INSERT INTO "users" ("id", "username", "passwordHash", "role", "fullName", "createdAt", "updatedAt")
VALUES ('f319b890-65ed-4115-8bfb-6743be9d0947', 'Isuru@6800', '$2b$12$fEPatXFMrgpIKmz2ks43VuOB9KS8B8U9sDhT5QUOvNrg6Q7ZaI1V6', 'Admin', 'System Administrator', '2026-11-07T16:19:14.946Z', '2026-11-07T16:19:14.946Z')
ON CONFLICT ("username") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "role" = EXCLUDED."role", "fullName" = EXCLUDED."fullName";
INSERT INTO "users" ("id", "username", "passwordHash", "role", "fullName", "createdAt", "updatedAt")
VALUES ('78dee109-4420-4fe1-a437-c85072cffe7c', 'User@123', '$2b$12$AC7BSoJo5gYTgkeEI9xHi.o3uoki1FcPKjIIfElDufGUZXLi7FT5O', 'User', 'Service Staff', '2026-11-07T16:19:15.504Z', '2026-11-07T16:19:15.504Z')
ON CONFLICT ("username") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "role" = EXCLUDED."role", "fullName" = EXCLUDED."fullName";
INSERT INTO "users" ("id", "username", "passwordHash", "role", "fullName", "createdAt", "updatedAt")
VALUES ('b77b1757-ac83-433a-91d9-69a494929092', 'admin', '$2b$12$z./WZuRuvJKA899lKXf.MegZ3jXDsMewQfTddKMeMj5sWSYTvG8Qy', 'Admin', 'Administrator', '2026-11-07T16:19:15.982Z', '2026-11-07T16:19:15.982Z')
ON CONFLICT ("username") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "role" = EXCLUDED."role", "fullName" = EXCLUDED."fullName";
INSERT INTO "users" ("id", "username", "passwordHash", "role", "fullName", "createdAt", "updatedAt")
VALUES ('0a55c510-c5cb-4e77-bf78-d9a0c96c6e2f', 'staff', '$2b$12$IHjztzDq6xyAcj8qaPolmujjLl2qh0lYnZJKdJ0vd69WG2M.clNUi', 'User', 'Service Staff', '2026-11-07T16:19:16.465Z', '2026-11-07T16:19:16.465Z')
ON CONFLICT ("username") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "role" = EXCLUDED."role", "fullName" = EXCLUDED."fullName";

-- 3. SUPPLIERS
INSERT INTO "suppliers" ("id", "legacyId", "supplierCode", "name", "contact", "cashTotal", "creditTotal", "chequeTotal", "invoice", "createdAt", "updatedAt")
VALUES ('444ecb9e-7c0a-4aa1-bfcb-768883f9506c', NULL, 'SUP-0001', 'Semini motors (pvt) Ltd', '011 293 692 28/071 766 843 7', 0, 0, 0, 'H001', '2026-11-08T02:12:06.129Z', '2026-11-08T02:12:06.129Z')
ON CONFLICT ("supplierCode") DO UPDATE SET "name" = EXCLUDED."name", "contact" = EXCLUDED."contact", "invoice" = EXCLUDED."invoice";

-- 4. SERVICES
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('046d4946-a1aa-41fb-bbcf-f1b56fe143e6', NULL, '10 1/2 Lorry', 'Body Wash', 0, '', '2026-11-07T16:21:07.534Z', '2026-11-07T16:21:07.534Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('af47e720-01c8-4282-8936-719d2de83770', NULL, '10 1/2 Lorry', 'Chemical', 850, 'Full Service', '2026-11-07T16:19:18.478Z', '2026-11-07T16:21:16.539Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('b851168a-c5d7-473c-9bf0-fc7d37c0ad8b', NULL, '10 1/2 Lorry', 'Diesel', 450, 'Full Service', '2026-11-07T16:19:18.171Z', '2026-11-07T16:21:15.161Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('1a75e652-2fa2-44ce-be03-9b0bd6affc47', NULL, '10 1/2 Lorry', 'High Pressure', 750, 'Full Service', '2026-11-07T16:19:18.335Z', '2026-11-07T16:21:16.158Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('65f97e82-71e4-4341-8627-d8a81f4e374d', NULL, '10 1/2 Lorry', 'Kerosene', 1000, 'Full Service', '2026-11-07T16:19:18.273Z', '2026-11-07T16:21:15.750Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('d91c1664-f19a-422c-8667-19e0f04ffc95', NULL, '10 1/2 Lorry', 'Penetrating Oil', 1250, 'Full Service', '2026-11-07T16:19:18.027Z', '2026-11-07T16:21:14.554Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('0c0a3732-49d3-4a27-a0e3-51b6bc8d45a9', NULL, '10 1/2 Lorry', 'Service Charge', 2800, 'Full Service', '2026-11-07T16:19:17.965Z', '2026-11-07T16:21:13.937Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('2c7e97a3-90e7-421d-8fdc-20bdb1034403', NULL, '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', 'Body Wash', 0, '', '2026-11-07T16:21:07.591Z', '2026-11-07T16:21:07.591Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('e4c9d018-c053-4518-8478-dd377920fc27', NULL, '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', 'Chemical', 1400, 'Full Service', '2026-11-07T16:19:19.069Z', '2026-11-07T16:21:17.427Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('19bccb67-8216-4fec-a9c5-72ea49dc9400', NULL, '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', 'Diesel', 550, 'Full Service', '2026-11-07T16:19:18.784Z', '2026-11-07T16:21:17.102Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('c5e84222-3272-4b40-983b-18475d2eb348', NULL, '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', 'High Pressure', 1000, 'Full Service', '2026-11-07T16:19:18.979Z', '2026-11-07T16:21:17.362Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('b379ab13-db86-449c-8599-59888eb91a8d', NULL, '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', 'Kerosene', 1200, 'Full Service', '2026-11-07T16:19:18.887Z', '2026-11-07T16:21:17.174Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('fae145c2-59b3-4bc5-a212-36856dab26fb', NULL, '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', 'Penetrating Oil', 1200, 'Full Service', '2026-11-07T16:19:18.682Z', '2026-11-07T16:21:17.031Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('21a41d8e-0497-4ff0-b72b-083441fb04f6', NULL, '14 1/2 Lorry/ 10 1/2,16 1/2/Boom', 'Service Charge', 3500, 'Full Service', '2026-11-07T16:19:18.582Z', '2026-11-07T16:21:16.944Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('8b4c48fc-a8f0-4754-90a9-739c760bf742', NULL, 'Batto Lorry', 'Body Wash', 0, '', '2026-11-07T16:21:07.352Z', '2026-11-07T16:21:07.352Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('cb7be48b-dfe2-46b9-83f8-da9d24f1f442', NULL, 'Batto Lorry', 'Chemical', 450, 'Full Service', '2026-11-07T16:19:20.990Z', '2026-11-07T16:21:19.718Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('2924cae3-ac6d-4dd9-85d8-1164ea195877', NULL, 'Batto Lorry', 'Grease', 2800, 'Full Service', '2026-11-07T16:19:20.917Z', '2026-11-07T16:21:19.584Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('283f7320-be00-4213-b732-5d953e320e0a', NULL, 'Batto Lorry', 'Service Charge', 4500, 'Full Service', '2026-11-07T16:19:20.789Z', '2026-11-07T16:21:19.502Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('405a3878-bb25-47b2-a471-3b1dd119d64b', NULL, 'Bike', 'Body Wash', 500, 'Body Wash', '2026-11-07T16:19:22.608Z', '2026-11-07T16:21:08.351Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('002320d6-b781-4780-9589-9652ca3392d5', NULL, 'Bus', 'Body Wash', 2500, 'Body Wash', '2026-11-07T16:19:21.739Z', '2026-11-07T16:21:08.116Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('dc520677-0a13-4d77-9c66-02af59aed9d5', NULL, 'Bus', 'Chemical', 1400, 'Full Service', '2026-11-07T16:19:21.654Z', '2026-11-07T16:21:20.435Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('c9a9201d-1d4a-4505-92d3-8a342aa450f2', NULL, 'Bus', 'Diesel', 1200, 'Full Service', '2026-11-07T16:19:21.344Z', '2026-11-07T16:21:20.127Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('c1fa9566-7617-48f6-9ce2-6c1ad65250fb', NULL, 'Bus', 'Grease', 6500, 'Full Service', '2026-11-07T16:19:21.146Z', '2026-11-07T16:21:19.923Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('b917f46e-7041-4630-98a8-586afb8efb0d', NULL, 'Bus', 'High Pressure', 1400, 'Full Service', '2026-11-07T16:19:21.509Z', '2026-11-07T16:21:20.263Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('a55c213e-c7d7-4d8d-8314-64b56353305b', NULL, 'Bus', 'Kerosene', 1500, 'Full Service', '2026-11-07T16:19:21.447Z', '2026-11-07T16:21:20.192Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('2c45e20c-29b1-4da8-ad81-e117e498d2dc', NULL, 'Bus', 'Penetrating Oil', 1500, 'Full Service', '2026-11-07T16:19:21.211Z', '2026-11-07T16:21:20.014Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('a999b9c5-9cae-4c5a-9780-085a9551fc89', NULL, 'Bus', 'Service Charge', 6000, 'Full Service', '2026-11-07T16:19:21.057Z', '2026-11-07T16:21:19.779Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('c4e36c1f-3995-46f8-9c7c-1d796732aae5', NULL, 'Bus (small)', 'Body Wash', 2000, 'Body Wash', '2026-11-07T16:19:22.512Z', '2026-11-07T16:21:08.174Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('d614cf2d-34ec-4ed0-8291-d9d52847e28e', NULL, 'Bus (small)', 'Chemical', 1200, 'Full Service', '2026-11-07T16:19:22.451Z', '2026-11-07T16:21:21.151Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('ffd6a062-1d7e-472b-8938-d93046f7cfb7', NULL, 'Bus (small)', 'Diesel', 550, 'Full Service', '2026-11-07T16:19:22.164Z', '2026-11-07T16:21:20.911Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('7de9c8d9-5e13-4a83-8bf7-6f7e11e5c84b', NULL, 'Bus (small)', 'Grease', 5500, 'Full Service', '2026-11-07T16:19:21.896Z', '2026-11-07T16:21:20.741Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('53bb7887-1785-451b-b9b6-71751e3a4485', NULL, 'Bus (small)', 'High Pressure', 1000, 'Full Service', '2026-11-07T16:19:22.380Z', '2026-11-07T16:21:21.063Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('4f8a6067-5905-4bd1-b412-537ab914b571', NULL, 'Bus (small)', 'Kerosene', 1200, 'Full Service', '2026-11-07T16:19:22.285Z', '2026-11-07T16:21:20.981Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('5b911336-cbe0-40ff-9e52-8b397a52c9c8', NULL, 'Bus (small)', 'Penetrating Oil', 1250, 'Full Service', '2026-11-07T16:19:22.062Z', '2026-11-07T16:21:20.846Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('56f69a71-de85-45e1-a6f4-c89ee12f7858', NULL, 'Bus (small)', 'Service Charge', 5500, 'Full Service', '2026-11-07T16:19:21.824Z', '2026-11-07T16:21:20.639Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('892739c9-8fbd-4d35-ac65-5e9ee6b5610c', NULL, 'Car', 'Body Wash', 1000, 'Body Wash', '2026-11-07T16:19:16.832Z', '2026-11-07T16:21:07.415Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('2b292573-cc25-4e89-b293-f2e77c1f3838', NULL, 'Car', 'Engine Chemical', 450, 'Full Service', '2026-11-07T16:19:16.771Z', '2026-11-07T16:21:08.659Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('52afbf91-4c41-460d-959b-ee845debd827', NULL, 'Car', 'Engine Wash', 450, 'Full Service', '2026-11-07T16:19:16.715Z', '2026-11-07T16:21:08.454Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('eb401bf1-daea-4274-826d-c70d848a8641', NULL, 'Car', 'Service Charge', 4500, 'Full Service', '2026-11-07T16:19:16.548Z', '2026-11-07T16:21:07.902Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('7f9cd060-79a7-4dfb-89e2-0cdfe4ed2bcc', NULL, 'Cube Lorry / Small Tipper', 'Body Wash', 0, '', '2026-11-07T16:21:07.231Z', '2026-11-07T16:21:07.231Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('bd5a9049-f9b5-4da4-b2af-aa9daa3798d0', NULL, 'Cube Lorry / Small Tipper', 'Chemical', 850, 'Full Service', '2026-11-07T16:19:20.730Z', '2026-11-07T16:21:19.415Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('31f03eae-2897-44cc-b065-197e09e82d1b', NULL, 'Cube Lorry / Small Tipper', 'Diesel', 500, 'Full Service', '2026-11-07T16:19:20.457Z', '2026-11-07T16:21:19.206Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('d642b857-e9da-4174-8319-3e8bf0a5fc27', NULL, 'Cube Lorry / Small Tipper', 'Grease', 4800, 'Full Service', '2026-11-07T16:19:20.307Z', '2026-11-07T16:21:18.973Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('361d77fe-6daf-41ce-a5af-f4a6c5577280', NULL, 'Cube Lorry / Small Tipper', 'High Pressure', 1000, 'Full Service', '2026-11-07T16:19:20.621Z', '2026-11-07T16:21:19.344Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('3762a021-6306-44f3-909b-2c992f46f096', NULL, 'Cube Lorry / Small Tipper', 'Kerosene', 1200, 'Full Service', '2026-11-07T16:19:20.554Z', '2026-11-07T16:21:19.271Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('313ef46c-77e9-4e0f-87bf-62506e9b6cca', NULL, 'Cube Lorry / Small Tipper', 'Penetrating Oil', 1250, 'Full Service', '2026-11-07T16:19:20.392Z', '2026-11-07T16:21:19.056Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('fe7fc041-04dd-4e0d-88a0-3eadd50886b1', NULL, 'Cube Lorry / Small Tipper', 'Service Charge', 3500, 'Full Service', '2026-11-07T16:19:20.246Z', '2026-11-07T16:21:18.854Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('0ecd26cd-54a0-4839-92fb-e67311fe1ee8', NULL, 'Custom', 'Air filter', 0, 'Custom Service / Consumable', '2026-11-07T16:19:23.170Z', '2026-11-07T16:21:10.112Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('2efe6996-b843-4908-a1f4-0ea26d9560a5', NULL, 'Custom', 'Battery Water', 0, 'Custom Service / Consumable', '2026-11-07T16:19:26.384Z', '2026-11-07T16:21:10.942Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('04178ca9-7f8a-4d4f-bbef-d03ad52fd052', NULL, 'Custom', 'Break Oil', 0, 'Custom Service / Consumable', '2026-11-07T16:19:26.170Z', '2026-11-07T16:21:10.707Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('dee6deef-1362-4ac9-bae8-8c1260c1b9f6', NULL, 'Custom', 'Cabin Filter', 0, 'Custom Service / Consumable', '2026-11-07T16:19:24.028Z', '2026-11-07T16:21:10.179Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('5017817b-ad79-4cd6-a644-deaa519a200d', NULL, 'Custom', 'Car Wash', 0, 'Custom Service / Consumable', '2026-11-07T16:19:28.651Z', '2026-11-07T16:21:11.795Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('f9596ac3-f4b5-40e1-9389-075becf793c6', NULL, 'Custom', 'Diesel', 0, 'Custom Service / Consumable', '2026-11-07T16:19:27.544Z', '2026-11-07T16:21:11.321Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('b7a9056e-ccea-4bd5-9b9b-5246c0c56102', NULL, 'Custom', 'Diesel Filter', 0, 'Custom Service / Consumable', '2026-11-07T16:19:23.086Z', '2026-11-07T16:21:10.054Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('c257cd12-afe5-47c6-ad57-83f44d50a9b4', NULL, 'Custom', 'Differencel Oil', 0, 'Custom Service / Consumable', '2026-11-07T16:19:25.995Z', '2026-11-07T16:21:10.502Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('c2cbd20e-04d1-4f98-92a0-5750621a56ca', NULL, 'Custom', 'Engine Oil', 0, 'Custom Service / Consumable', '2026-11-07T16:19:24.725Z', '2026-11-07T16:21:10.273Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('274cf40b-9bec-4ff0-878e-3fa737cc0330', NULL, 'Custom', 'Engine Wash', 0, 'Custom Service / Consumable', '2026-11-07T16:19:22.860Z', '2026-11-07T16:21:09.888Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('63bd2af5-cbba-46ae-b4f0-2c7509eef49c', NULL, 'Custom', 'Gear Oil', 0, 'Custom Service / Consumable', '2026-11-07T16:19:25.510Z', '2026-11-07T16:21:10.335Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('6292ac2d-3fb1-4951-8d1b-ac0063724084', NULL, 'Custom', 'Grease', 0, 'Custom Service / Consumable', '2026-11-07T16:19:22.931Z', '2026-11-07T16:21:09.951Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('4780371c-a384-467b-9e28-056640fd2f08', NULL, 'Custom', 'High Pressure', 0, 'Custom Service / Consumable', '2026-11-07T16:19:28.511Z', '2026-11-07T16:21:11.574Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('be3ec564-394a-4a5d-bbb7-52ef894fb13e', NULL, 'Custom', 'Hydralauic Oil', 0, 'Custom Service / Consumable', '2026-11-07T16:19:26.251Z', '2026-11-07T16:21:10.809Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('0ec9baac-aa3a-4167-942b-fc0a3b98d6b1', NULL, 'Custom', 'Kerosene', 0, 'Custom Service / Consumable', '2026-11-07T16:19:28.228Z', '2026-11-07T16:21:11.499Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('12eb1bab-39ba-4651-ba67-98074fac7366', NULL, 'Custom', 'Penetrating Oil', 0, 'Custom Service / Consumable', '2026-11-07T16:19:26.673Z', '2026-11-07T16:21:11.180Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('5ef7977a-b796-47c0-8832-d056db5beda3', NULL, 'Custom', 'Power Sterling Oil', 0, 'Custom Service / Consumable', '2026-11-07T16:19:26.311Z', '2026-11-07T16:21:10.869Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('05f4a93e-90af-4232-94ba-36c5d9541e1d', NULL, 'Custom', 'Radiator Coolant', 0, 'Custom Service / Consumable', '2026-11-07T16:19:26.456Z', '2026-11-07T16:21:11.023Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('cab994ab-0b03-4bf6-ae7c-1d4b066b38d3', NULL, 'Custom', 'Radiator Plask', 0, 'Custom Service / Consumable', '2026-11-07T16:19:26.607Z', '2026-11-07T16:21:11.117Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('d688ebab-7a08-4644-844f-d38799972c88', NULL, 'Custom', 'Service Charge', 0, 'Custom Service / Consumable', '2026-11-07T16:19:22.772Z', '2026-11-07T16:21:09.785Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('cb796a0c-edb7-4077-b0c8-71a86f027150', NULL, 'Custom', 'Transfer Box Oil', 0, 'Custom Service / Consumable', '2026-11-07T16:19:26.100Z', '2026-11-07T16:21:10.604Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('01909b95-7f8c-4dde-88a7-60e015244235', NULL, 'Custom', 'Wapper Blade', 0, 'Custom Service / Consumable', '2026-11-07T16:19:28.714Z', '2026-11-07T16:21:12.513Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('a1574057-1b82-44b7-8cf9-de4aa698090a', NULL, 'Custom', 'Wash', 0, 'Custom Service / Consumable', '2026-11-07T16:19:28.584Z', '2026-11-07T16:21:11.731Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('6834be1d-4ca2-44af-af08-12563b527cd7', NULL, 'Machine -30', 'Body Wash', 5500, 'Body Wash', '2026-11-07T16:19:22.691Z', '2026-11-07T16:21:09.558Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('badf954a-b46a-4de3-8d66-c081070ed6f8', NULL, 'Others', 'Body Wash', 0, '', '2026-11-07T16:21:07.471Z', '2026-11-07T16:21:07.471Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('f21ba038-6a1e-4cb3-b2ed-745fce408c78', NULL, 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', 'Body Wash', 0, '', '2026-11-07T16:21:07.838Z', '2026-11-07T16:21:07.838Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('5d44e2c6-07d1-4189-9f41-56522ac55b1f', NULL, 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', 'Chemical', 1400, 'Full Service', '2026-11-07T16:19:20.170Z', '2026-11-07T16:21:18.796Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('eae8db96-8d85-421a-962b-dc4dea80ba6a', NULL, 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', 'Diesel', 1000, 'Full Service', '2026-11-07T16:19:19.909Z', '2026-11-07T16:21:18.472Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('771c16f3-903b-421c-97db-e5b7ec80f21f', NULL, 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', 'Grease', 6800, 'Full Service', '2026-11-07T16:19:19.739Z', '2026-11-07T16:21:18.345Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('35e707ed-5a48-4fef-88e4-e242cf163acb', NULL, 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', 'High Pressure', 1400, 'Full Service', '2026-11-07T16:19:20.092Z', '2026-11-07T16:21:18.694Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('4e6dbdc2-8056-45fb-9e94-64a6810de520', NULL, 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', 'Kerosene', 1400, 'Full Service', '2026-11-07T16:19:20.014Z', '2026-11-07T16:21:18.591Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('fc021522-33b1-4d14-85af-070c8ffa3b41', NULL, 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', 'Penetrating Oil', 1500, 'Full Service', '2026-11-07T16:19:19.845Z', '2026-11-07T16:21:18.414Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('46e9f7f7-c814-44cf-beb5-dfe161125ab3', NULL, 'Tank Lorry / Cube 3,4 5Pc wheel/Tipper', 'Service Charge', 4500, 'Full Service', '2026-11-07T16:19:19.664Z', '2026-11-07T16:21:18.285Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('c51e6f66-f9db-47ac-97f5-b8354714bc30', NULL, 'Ten-Wheel Lorry', 'Body Wash', 0, '', '2026-11-07T16:21:07.660Z', '2026-11-07T16:21:07.660Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('7bdd29af-bb1a-4676-8a3e-534a76a87ef2', NULL, 'Ten-Wheel Lorry', 'Chemical', 1800, 'Full Service', '2026-11-07T16:19:19.572Z', '2026-11-07T16:21:18.182Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('beb6b2be-a621-4445-bee9-70f0b48c84bb', NULL, 'Ten-Wheel Lorry', 'Diesel', 600, 'Full Service', '2026-11-07T16:19:19.336Z', '2026-11-07T16:21:17.875Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('5f65864d-47d5-47ac-9760-babd7c66d158', NULL, 'Ten-Wheel Lorry', 'Grease', 8800, 'Full Service', '2026-11-07T16:19:19.217Z', '2026-11-07T16:21:17.648Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('438d3b82-890a-4c01-9af6-c1e28691fa80', NULL, 'Ten-Wheel Lorry', 'High Pressure', 1200, 'Full Service', '2026-11-07T16:19:19.506Z', '2026-11-07T16:21:18.079Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('83e8cb96-7c87-46e0-afe1-f4b7f592a8e7', NULL, 'Ten-Wheel Lorry', 'Kerosene', 1500, 'Full Service', '2026-11-07T16:19:19.411Z', '2026-11-07T16:21:17.977Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('c1fdda14-e706-443c-859a-0d805fbd2569', NULL, 'Ten-Wheel Lorry', 'Penetrating Oil', 1750, 'Full Service', '2026-11-07T16:19:19.272Z', '2026-11-07T16:21:17.712Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('f1d144ff-25f7-4e3b-8607-4fd87e2dcad6', NULL, 'Ten-Wheel Lorry', 'Service Charge', 4000, 'Full Service', '2026-11-07T16:19:19.150Z', '2026-11-07T16:21:17.568Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('273c8062-dd53-40f0-a2e7-d411db643555', NULL, 'Three-Wheeler', 'Body Wash', 900, 'Body Wash', '2026-11-07T16:19:17.147Z', '2026-11-07T16:21:08.557Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('609351c4-95c2-45ca-a6b7-83a92efaaa22', NULL, 'Three-Wheeler', 'Grease Full', 1200, 'Full Service', '2026-11-07T16:19:16.976Z', '2026-11-07T16:21:08.863Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('415926a2-b759-4ece-89a3-d667beb430e1', NULL, 'Three-Wheeler', 'Service Charge', 2200, 'Full Service', '2026-11-07T16:19:16.899Z', '2026-11-07T16:21:08.761Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('8dceeeba-4367-421e-ba77-f94cd3f7edcb', NULL, 'Van/Cab', 'Body Wash', 1200, 'Body Wash', '2026-11-07T16:19:17.811Z', '2026-11-07T16:21:08.045Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('0d4a51a7-086b-43d5-868b-b19e2b9b6919', NULL, 'Van/Cab', 'Chemical', 850, 'Full Service', '2026-11-07T16:19:17.739Z', '2026-11-07T16:21:13.129Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('3866335c-a235-4416-a982-1a61f67f0e8f', NULL, 'Van/Cab', 'Diesel', 450, 'Full Service', '2026-11-07T16:19:17.420Z', '2026-11-07T16:21:09.376Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('55417da3-c62e-4bd4-bd8b-d8cb581ebb25', NULL, 'Van/Cab', 'Grease', 0, 'Full Service', '2026-11-07T16:19:17.271Z', '2026-11-07T16:21:09.171Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('0c9b5fe9-51e5-4555-ae17-5a661c3e2145', NULL, 'Van/Cab', 'High Pressure', 850, 'Full Service', '2026-11-07T16:19:17.659Z', '2026-11-07T16:21:09.494Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('63cdc471-f623-41cb-b27f-4464ad8e8517', NULL, 'Van/Cab', 'Kerosene', 1000, 'Full Service', '2026-11-07T16:19:17.491Z', '2026-11-07T16:21:09.431Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('9557ae00-8e58-4e66-85f5-7d711a622566', NULL, 'Van/Cab', 'Penetrating Oil', 1250, 'Full Service', '2026-11-07T16:19:17.339Z', '2026-11-07T16:21:09.274Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";
INSERT INTO "services" ("id", "legacyId", "category", "name", "price", "description", "createdAt", "updatedAt")
VALUES ('781142ec-8c8f-4565-a35c-b27862f98d69', NULL, 'Van/Cab', 'Service Charge', 2800, 'Full Service', '2026-11-07T16:19:17.211Z', '2026-11-07T16:21:08.966Z')
ON CONFLICT ("category", "name") DO UPDATE SET "price" = EXCLUDED."price", "description" = EXCLUDED."description";

-- 5. PRODUCTS (INVENTORY)
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('aaccc969-0b96-4fbd-8db4-b178203c99b4', NULL, 'A-1072 / PW-811941', 'Air Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:57:23.624Z', '2026-11-07T15:57:23.624Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('de502fe0-5097-44a5-bb3a-76614fdc3767', NULL, 'A-1122', 'Air Filter', 'SAKURA', 0, 1665, 0, '', 'Cash', '2026-11-07T15:57:23.366Z', '2026-11-07T15:57:23.366Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9edc2c7d-2170-4d4f-85e0-15f55c0f3ea5', NULL, 'A-12330', 'Air Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:57:23.357Z', '2026-11-07T15:57:23.357Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8bd8eb02-826c-49e8-8d71-28ebbc1944dd', NULL, 'A-12350', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.371Z', '2026-11-07T15:57:23.371Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6d7cbae6-7ee5-49ef-ac94-a256abf13f39', NULL, 'A-1325', 'Air Filter', 'SAKURA', 0, 15320, 0, '', 'Cash', '2026-11-07T15:57:23.571Z', '2026-11-07T15:57:23.571Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b9b7cca7-d72e-4acd-8bfa-d0c3b4e1d4ff', NULL, 'A-13570', 'Air Filter', 'SAKURA', 0, 9190, 0, '', 'Cash', '2026-11-07T15:57:23.570Z', '2026-11-07T15:57:23.570Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('10114819-8499-49e5-b744-d46d1a823442', NULL, 'A-1432', 'Air Filter', 'SAKURA', 0, 3340, 0, '', 'Cash', '2026-11-07T15:57:23.530Z', '2026-11-07T15:57:23.530Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a3c5764d-7037-4433-9d15-935e9cef1453', NULL, 'A-14400', 'Air Filter', 'SAKURA', 0, 2640, 0, '', 'Cash', '2026-11-07T15:57:23.531Z', '2026-11-07T15:57:23.531Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9c9f8a95-bce0-420c-9308-27b351e21400', NULL, 'A-14470', 'Air Filter', 'SAKURA', 0, 1845, 0, '', 'Cash', '2026-11-07T15:57:23.532Z', '2026-11-07T15:57:23.532Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7c92643b-9e83-420c-9b86-6ffad8d15574', NULL, 'A-14480', 'Air Filter', 'SAKURA', 0, 1845, 0, '', 'Cash', '2026-11-07T15:57:23.533Z', '2026-11-07T15:57:23.533Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ad227547-2ace-4e26-9902-4859bce70329', NULL, 'A-14490', 'Air Filter', 'SAKURA', 0, 1715, 0, '', 'Cash', '2026-11-07T15:57:23.534Z', '2026-11-07T15:57:23.534Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9170466c-343c-4ecd-95c6-730e5fc3cb77', NULL, 'A-14510', 'Air Filter', 'SAKURA', 0, 3690, 0, '', 'Cash', '2026-11-07T15:57:23.535Z', '2026-11-07T15:57:23.535Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('71db9e9a-c641-4adc-a771-12af28836359', NULL, 'A-14540', 'Air Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:57:23.537Z', '2026-11-07T15:57:23.537Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('af87abf1-580c-4c18-952b-30cac82e0fbd', NULL, 'A-14560', 'Air Filter', 'SAKURA', 0, 2350, 0, '', 'Cash', '2026-11-07T15:57:23.538Z', '2026-11-07T15:57:23.538Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('01f40dab-4d9c-448c-9ea3-eccb841886eb', NULL, 'A-14660', 'Air Filter', 'SAKURA', 0, 3330, 0, '', 'Cash', '2026-11-07T15:57:23.540Z', '2026-11-07T15:57:23.540Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3ae19c7a-ef8b-4625-ade4-df86b8dc7832', NULL, 'A-15241', 'Air Filter', 'SAKURA', 0, 6060, 0, '', 'Cash', '2026-11-07T15:57:23.474Z', '2026-11-07T15:57:23.474Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('91a4b619-9645-437a-821a-86d44c85b581', NULL, 'A-1667 / ESR4103', 'Air Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:57:23.618Z', '2026-11-07T15:57:23.618Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0f5c5894-6179-4b84-9d26-690530822a77', NULL, 'A-16990', 'Air Filter', 'SAKURA', 0, 2535, 0, '', 'Cash', '2026-11-07T15:57:23.458Z', '2026-11-07T15:57:23.458Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3c128813-129f-4c3e-a2ca-bcc93bdc732e', NULL, 'A-1753', 'Air Filter', 'SAKURA', 0, 4950, 0, '', 'Cash', '2026-11-07T15:57:23.576Z', '2026-11-07T15:57:23.576Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ed9e842e-57a7-491d-b8f6-cd109430c8b6', NULL, 'A-1855', 'Air Filter', 'SAKURA', 0, 4275, 0, '', 'Cash', '2026-11-07T15:57:23.424Z', '2026-11-07T15:57:23.424Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cce24b01-d3ff-4002-81f8-56d7f747d8b1', NULL, 'A-1948', 'Air Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:57:23.610Z', '2026-11-07T15:57:23.610Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('60036872-2de3-41c5-8e07-6df9d0bcce29', NULL, 'A-24220', 'Air Filter', 'SAKURA', 0, 2900, 0, '', 'Cash', '2026-11-07T15:57:23.627Z', '2026-11-07T15:57:23.627Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('92fa5f73-2c02-4a4b-91f5-3c625b75591a', NULL, 'A-25480', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.617Z', '2026-11-07T15:57:23.617Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('12d3e9f7-b20e-4c0e-b297-c5141589ece7', NULL, 'A-2813', 'Air Filter', 'SAKURA', 0, 6790, 0, '', 'Cash', '2026-11-07T15:57:23.577Z', '2026-11-07T15:57:23.577Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5e0142b7-0ff5-49ef-a2da-46bf5b09c1ce', NULL, 'A-2817 / 28113-17500', 'Air Filter', 'SAKURA', 0, 2520, 0, '', 'Cash', '2026-11-07T15:57:23.578Z', '2026-11-07T15:57:23.578Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a7828e79-c518-45f5-acce-c24a7b0d3f3b', NULL, 'A-2818', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.579Z', '2026-11-07T15:57:23.579Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('47d5a480-a7f1-42c9-b07d-fc7808fab74d', NULL, 'A-2823', 'Air Filter', 'SAKURA', 0, 1375, 0, '', 'Cash', '2026-11-07T15:57:23.580Z', '2026-11-07T15:57:23.580Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('482e3a74-aefa-4469-854e-0806124bf10e', NULL, 'A-2839 / 28113-08000', 'Air Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:57:23.581Z', '2026-11-07T15:57:23.581Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('56c4feec-1c7c-4f5a-aa7d-d11f9b56f7ad', NULL, 'A-2844 / YUMA-059', 'Air Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:57:23.582Z', '2026-11-07T15:57:23.582Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a0017a51-bd2f-4e93-bd02-191e28b0a2b4', NULL, 'A-28510 / 28113-0X000', 'Air Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:57:23.583Z', '2026-11-07T15:57:23.583Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2b6c31c7-043d-425e-8981-329daa843d45', NULL, 'A-28570 / 28113-2B000', 'Air Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:57:23.584Z', '2026-11-07T15:57:23.584Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('557e8ed9-c79f-468b-9f3e-907da5b77137', NULL, 'A-28640 / 28113-1R100', 'Air Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:57:23.589Z', '2026-11-07T15:57:23.589Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0e8a4385-c08a-4ac1-9515-db0c30ab5421', NULL, 'A-28690 / 28113-04000', 'Air Filter', 'SAKURA', 0, 1845, 0, '', 'Cash', '2026-11-07T15:57:23.585Z', '2026-11-07T15:57:23.585Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b65a0cbb-eb8c-4b75-b53e-41d22bd95667', NULL, 'A-28760 / 28113-2W300', 'Air Filter', 'SAKURA', 0, 3500, 0, '', 'Cash', '2026-11-07T15:57:23.587Z', '2026-11-07T15:57:23.587Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d4cfa375-646b-4eb5-90d9-2bc2f476b7d5', NULL, 'A-28790', 'Air Filter', 'SAKURA', 0, 1990, 0, '', 'Cash', '2026-11-07T15:57:23.588Z', '2026-11-07T15:57:23.588Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b56c95ce-6ba2-41e0-8a39-ec5e430ab88f', NULL, 'A-28840-S', 'Air Filter', 'SAKURA', 0, 20720, 0, '', 'Cash', '2026-11-07T15:57:23.616Z', '2026-11-07T15:57:23.616Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('404df2ab-bafe-4b87-bff6-3f5d6dc8716d', NULL, 'A-2922 / OK2A5-13-Z40', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.589Z', '2026-11-07T15:57:23.589Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f9e7a818-2ee2-4e20-bf95-3753fd2c54b9', NULL, 'A-2924 / OK30C-13-Z40A', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.590Z', '2026-11-07T15:57:23.590Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('76a0d241-2b53-4e34-a72c-8f606588d422', NULL, 'A-2930 / OK060A-23-603', 'Air Filter', 'SAKURA', 0, 5600, 0, '', 'Cash', '2026-11-07T15:57:23.591Z', '2026-11-07T15:57:23.591Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('70374a81-28aa-4324-b331-7a532202ebd9', NULL, 'A-2932 / YUSS-006', 'Air Filter', 'SAKURA', 0, 5795, 0, '', 'Cash', '2026-11-07T15:57:23.592Z', '2026-11-07T15:57:23.592Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3581866b-c20d-4947-8529-64cc0344b216', NULL, 'A-2933 / YUMI-055', 'Air Filter', 'SAKURA', 0, 1845, 0, '', 'Cash', '2026-11-07T15:57:23.593Z', '2026-11-07T15:57:23.593Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bb47320a-7439-4270-9a73-5f28e0a7721a', NULL, 'A-2935', 'Air Filter', 'SAKURA', 0, 5090, 0, '', 'Cash', '2026-11-07T15:57:23.594Z', '2026-11-07T15:57:23.594Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('21e86974-9b46-446f-9b6f-d353ea8bb874', NULL, 'A-2936', 'Air Filter', 'SAKURA', 0, 5795, 0, '', 'Cash', '2026-11-07T15:57:23.595Z', '2026-11-07T15:57:23.595Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('645d3ce8-b8bb-4d25-87cc-bb933cb9f610', NULL, 'A-29410', 'Air Filter', 'SAKURA', 0, 3850, 0, '', 'Cash', '2026-11-07T15:57:23.596Z', '2026-11-07T15:57:23.596Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ca2eec93-6c14-4f70-8046-27fa182cf261', NULL, 'A-29420', 'Air Filter', 'SAKURA', 0, 3085, 0, '', 'Cash', '2026-11-07T15:57:23.597Z', '2026-11-07T15:57:23.597Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cfedb741-097c-493c-bc34-810625856466', NULL, 'A-29440', 'Air Filter', 'SAKURA', 0, 3295, 0, '', 'Cash', '2026-11-07T15:57:23.598Z', '2026-11-07T15:57:23.598Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9efcfb8a-3aed-4fec-9ff8-eb2a3f2950b5', NULL, 'A-29550', 'Air Filter', 'SAKURA', 0, 3225, 0, '', 'Cash', '2026-11-07T15:57:23.599Z', '2026-11-07T15:57:23.599Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e5c5b784-3dd5-49de-961f-c2008fd42aaf', NULL, 'A-3312', 'Air Filter', 'SAKURA', 0, 4690, 0, '', 'Cash', '2026-11-07T15:57:23.257Z', '2026-11-07T15:57:23.257Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1da3bfda-7c2a-4b81-af57-785ff20514fe', NULL, 'A-3314', 'Air Filter', 'SAKURA', 0, 5615, 0, '', 'Cash', '2026-11-07T15:57:23.262Z', '2026-11-07T15:57:23.262Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('50c92742-a22e-42b3-9167-45e2d0482bff', NULL, 'A-3321', 'Air Filter', 'SAKURA', 0, 3240, 0, '', 'Cash', '2026-11-07T15:57:23.264Z', '2026-11-07T15:57:23.264Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('552a743d-95d0-45d0-8ae8-3bf11023c720', NULL, 'A-33720', 'Air Filter', 'SAKURA', 0, 1650, 0, '', 'Cash', '2026-11-07T15:57:23.266Z', '2026-11-07T15:57:23.266Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4ab5fe64-afe7-4369-9277-4eab0ad8e27a', NULL, 'A-33740', 'Air Filter', 'SAKURA', 0, 6245, 0, '', 'Cash', '2026-11-07T15:57:23.268Z', '2026-11-07T15:57:23.268Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0e7cc07a-9182-4764-b09e-5273e42df7a6', NULL, 'A-33810', 'Air Filter', 'SAKURA', 0, 7060, 0, '', 'Cash', '2026-11-07T15:57:23.271Z', '2026-11-07T15:57:23.271Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('15f79910-6a45-4bf9-bb78-754b040aea15', NULL, 'A-38010', 'Air Filter', 'SAKURA', 0, 2535, 0, '', 'Cash', '2026-11-07T15:57:23.606Z', '2026-11-07T15:57:23.606Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3b7386af-fc19-4f3e-95c9-e95f0cd11e15', NULL, 'A-42610', 'Air Filter', 'SAKURA', 0, 11750, 0, '', 'Cash', '2026-11-07T15:57:23.475Z', '2026-11-07T15:57:23.475Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f8ea9f65-1454-47b8-98d0-56fa241ac961', NULL, 'A-4901 / ESR1445', 'Air Filter', 'SAKURA', 0, 3230, 0, '', 'Cash', '2026-11-07T15:57:23.620Z', '2026-11-07T15:57:23.620Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5d11e515-b7b9-41db-9f5b-41e49881a88f', NULL, 'A-4903', 'Air Filter', 'SAKURA', 0, 3620, 0, '', 'Cash', '2026-11-07T15:57:23.614Z', '2026-11-07T15:57:23.614Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7888aa17-728a-4b12-b681-ae4aaccb54f9', NULL, 'A-4907 / ESR2623', 'Air Filter', 'SAKURA', 0, 4915, 0, '', 'Cash', '2026-11-07T15:57:23.619Z', '2026-11-07T15:57:23.619Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bee06c8e-77fb-4cbe-8585-bfef3c909ec9', NULL, 'A-50320', 'Air Filter', 'SAKURA', 0, 3840, 0, '', 'Cash', '2026-11-07T15:57:23.502Z', '2026-11-07T15:57:23.502Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ebf77ab3-fac6-4bac-a542-b6dccb68edff', NULL, 'A-57400-S', 'Air Filter', 'SAKURA', 0, 29770, 0, '', 'Cash', '2026-11-07T15:57:23.623Z', '2026-11-07T15:57:23.623Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cae8ba5f-0223-4f9d-a1ac-2f33f8613898', NULL, 'A-58290', 'Air Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:57:23.625Z', '2026-11-07T15:57:23.625Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('68f0506d-9133-4db1-b85b-c6987f0a8838', NULL, 'A-58400', 'Air Filter', 'SAKURA', 0, 3650, 0, '', 'Cash', '2026-11-07T15:57:23.373Z', '2026-11-07T15:57:23.373Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6df33712-65cc-4f9f-b8f6-acee9765bb69', NULL, 'A-58460', 'Air Filter', 'SAKURA', 0, 2360, 0, '', 'Cash', '2026-11-07T15:57:23.374Z', '2026-11-07T15:57:23.374Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('14ab4efb-7d9b-4f74-90e1-babc53b2baeb', NULL, 'A-6128', 'Air Filter', 'SAKURA', 0, 2535, 0, '', 'Cash', '2026-11-07T15:57:23.425Z', '2026-11-07T15:57:23.425Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6bef4789-22ae-4d5f-83eb-8577ca24587e', NULL, 'A-61360 / 16546-8850R', 'Air Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:57:23.426Z', '2026-11-07T15:57:23.426Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fe74a8b3-99fd-4bad-96de-e3aa9f5e3d9d', NULL, 'A-61530', 'Air Filter', 'SAKURA', 0, 5635, 0, '', 'Cash', '2026-11-07T15:57:23.427Z', '2026-11-07T15:57:23.427Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bb35b9d7-354c-48f3-bcc2-8ec3e9478a49', NULL, 'A-61980', 'Air Filter', 'SAKURA', 0, 8190, 0, '', 'Cash', '2026-11-07T15:57:23.428Z', '2026-11-07T15:57:23.428Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d81e676b-cff8-40db-a83f-b9866d1d5d5a', NULL, 'A-78150-S', 'Air Filter', 'SAKURA', 0, 15430, 0, '', 'Cash', '2026-11-07T15:57:23.615Z', '2026-11-07T15:57:23.615Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0a985098-0cde-418d-87c2-677c5ca23616', NULL, 'A-7978', 'Air Filter', 'SAKURA', 0, 4665, 0, '', 'Cash', '2026-11-07T15:57:23.611Z', '2026-11-07T15:57:23.611Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c9e33825-4bba-4fac-88a2-9988b180e0f7', NULL, 'A-79781', 'Air Filter', 'SAKURA', 0, 4515, 0, '', 'Cash', '2026-11-07T15:57:23.612Z', '2026-11-07T15:57:23.612Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('118d0313-aaad-4171-a0ee-729ac66219be', NULL, 'A-8688 / ESR4238', 'Air Filter', 'SAKURA', 0, 3480, 0, '', 'Cash', '2026-11-07T15:57:23.621Z', '2026-11-07T15:57:23.621Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1369cb94-7563-4a62-8d7a-db4c94980920', NULL, 'A-89080', 'Air Filter', 'SAKURA', 0, 2085, 0, '', 'Cash', '2026-11-07T15:57:23.607Z', '2026-11-07T15:57:23.607Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('db751ec3-6926-483f-b8fe-2fd624a35405', NULL, 'A-89210', 'Air Filter', 'SAKURA', 0, 2455, 0, '', 'Cash', '2026-11-07T15:57:23.609Z', '2026-11-07T15:57:23.609Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c5c0c631-5169-4d01-9bdf-9c42bd94ef17', NULL, 'A-90040', 'Air Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:57:23.459Z', '2026-11-07T15:57:23.459Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('322a3be4-5b82-4352-89f8-5bd8dfe92465', NULL, 'A-90260', 'Air Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:57:23.460Z', '2026-11-07T15:57:23.460Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('090917ff-f4ff-4253-b31a-9aa390c30061', NULL, 'C-1011XPL', 'Oil Filter', 'SAKURA', 0, 1270, 0, '', 'Cash', '2026-11-07T15:55:07.653Z', '2026-11-07T15:55:07.653Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4979db40-c20c-468e-9d26-5ddb43de0048', NULL, 'C-1025', 'Oil Filter', 'SAKURA', 0, 1890, 0, '', 'Cash', '2026-11-07T15:55:07.667Z', '2026-11-07T15:55:07.667Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f4ad735b-d4dc-4c59-ada8-2c581a0f6088', NULL, 'C-1109XPL', 'Oil Filter', 'SAKURA', 0, 1270, 0, '', 'Cash', '2026-11-07T15:55:07.650Z', '2026-11-07T15:55:07.650Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fd9135b6-e4e4-497b-8747-6d32a809084d', NULL, 'C-1125XPL', 'Oil Filter', 'SAKURA', 0, 1270, 0, '', 'Cash', '2026-11-07T15:55:07.655Z', '2026-11-07T15:55:07.655Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e3c31c12-8150-4d85-b4e9-fa7d73da2a1f', NULL, 'C-1140XPL', 'Oil Filter', 'SAKURA', 0, 1495, 0, '', 'Cash', '2026-11-07T15:55:07.652Z', '2026-11-07T15:55:07.652Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('41ac4229-e1a0-4b83-bc9d-4eba964068ca', NULL, 'C-1142XPL', 'Oil Filter', 'SAKURA', 0, 1495, 0, '', 'Cash', '2026-11-07T15:55:07.651Z', '2026-11-07T15:55:07.651Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('dfd6daa4-031c-4885-8bc6-a6564c54f044', NULL, 'C-12220', 'Oil Filter', 'SAKURA', 0, 1100, 0, '', 'Cash', '2026-11-07T15:55:07.507Z', '2026-11-07T15:55:07.507Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3296610f-6eb1-4195-8d73-d7749b6f1e4e', NULL, 'C-1404XPL', 'Oil Filter', 'SAKURA', 0, 1495, 0, '', 'Cash', '2026-11-07T15:55:07.656Z', '2026-11-07T15:55:07.656Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('73b1d249-4ee6-4835-a261-031643415784', NULL, 'C-1614XPL', 'Oil Filter', 'SAKURA', 0, 1270, 0, '', 'Cash', '2026-11-07T15:55:07.654Z', '2026-11-07T15:55:07.654Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3749c03d-96f7-43cc-82d3-b58f92a9740a', NULL, 'C-1823XPL', 'Oil Filter', 'SAKURA', 0, 1270, 0, '', 'Cash', '2026-11-07T15:55:07.657Z', '2026-11-07T15:55:07.657Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5d3a9091-0ad6-4489-922f-f353168c1eb7', NULL, 'C-1903 / C-1122', 'Oil Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:55:07.529Z', '2026-11-07T15:55:07.529Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6892c894-39cd-4d7a-9f90-f416e9ee79cd', NULL, 'C-1919 / AHU2880', 'Oil Filter', 'SAKURA', 0, 2010, 0, '', 'Cash', '2026-11-07T15:55:07.687Z', '2026-11-07T15:55:07.687Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d582e62b-8657-4caa-8237-922b25a9b50e', NULL, 'C-2103', 'Oil Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:55:07.668Z', '2026-11-07T15:55:07.668Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a725c94a-69c2-4d5f-af55-36e4e640e3f1', NULL, 'C-2107', 'Oil Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:55:07.669Z', '2026-11-07T15:55:07.669Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('da14c1bb-9019-46c5-ac5c-4a6e8a3bf2f2', NULL, 'C-22220', 'Oil Filter', 'SAKURA', 0, 1160, 0, '', 'Cash', '2026-11-07T15:55:07.666Z', '2026-11-07T15:55:07.666Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('84fe4acc-5347-44ec-9cdf-f01cba7c17d6', NULL, 'C-25210', 'Oil Filter', 'SAKURA', 0, 1150, 0, '', 'Cash', '2026-11-07T15:55:07.670Z', '2026-11-07T15:55:07.670Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6b4f6505-804c-4921-9c90-2b74694ded6d', NULL, 'C-2807 / 26310-27200', 'Oil Filter', 'SAKURA', 0, 2295, 0, '', 'Cash', '2026-11-07T15:55:07.658Z', '2026-11-07T15:55:07.658Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('379f1ead-9e09-46c3-b553-f406af9ea585', NULL, 'C-2808', 'Oil Filter', 'SAKURA', 0, 1565, 0, '', 'Cash', '2026-11-07T15:55:07.659Z', '2026-11-07T15:55:07.659Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6b7bfa92-9e97-46c8-944f-bb9415edfafd', NULL, 'C-2809', 'Oil Filter', 'SAKURA', 0, 3085, 0, '', 'Cash', '2026-11-07T15:55:07.660Z', '2026-11-07T15:55:07.660Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e157ea79-4e4a-4018-a6c8-7444a6d6e7a3', NULL, 'C-2908 / JX0811F', 'Oil Filter', 'SAKURA', 0, 3885, 0, '', 'Cash', '2026-11-07T15:55:07.691Z', '2026-11-07T15:55:07.691Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('aae65e1a-7e8c-4190-8b8d-898f86123de2', NULL, 'C-38010 / JX0810D2', 'Oil Filter', 'SAKURA', 0, 2970, 0, '', 'Cash', '2026-11-07T15:55:07.689Z', '2026-11-07T15:55:07.689Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1a1bf273-2507-4ea3-ba3f-6926d56b0146', NULL, 'C-38020 / JX1008L', 'Oil Filter', 'SAKURA', 0, 3915, 0, '', 'Cash', '2026-11-07T15:55:07.690Z', '2026-11-07T15:55:07.690Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4728e484-7d33-4dc7-813b-46235a88ef67', NULL, 'C-5005 / D8NN-6714DA', 'Oil Filter', 'SAKURA', 0, 6155, 0, '', 'Cash', '2026-11-07T15:55:07.693Z', '2026-11-07T15:55:07.693Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('81229d63-99e3-4929-9ef0-c078cf0080b3', NULL, 'C-5103', 'Oil Filter', 'SAKURA', 0, 1870, 0, '', 'Cash', '2026-11-07T15:55:07.671Z', '2026-11-07T15:55:07.671Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ad72340d-62f7-44de-a0f8-fd69709e3801', NULL, 'C-5205', 'Oil Filter', 'SAKURA', 0, 1040, 0, '', 'Cash', '2026-11-07T15:55:07.682Z', '2026-11-07T15:55:07.682Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('700e658a-483f-467f-94e0-10f387e0ba88', NULL, 'C-5302', 'Oil Filter', 'SAKURA', 0, 3600, 0, '', 'Cash', '2026-11-07T15:55:07.672Z', '2026-11-07T15:55:07.672Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2b8a0ef0-a8ff-41dc-99ad-ff78cefc78a9', NULL, 'C-5704', 'Oil Filter', 'SAKURA', 0, 2970, 0, '', 'Cash', '2026-11-07T15:55:07.673Z', '2026-11-07T15:55:07.673Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6f9f0abe-a869-437b-9f52-bac4bcf8c678', NULL, 'C-7910', 'Oil Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:55:07.674Z', '2026-11-07T15:55:07.674Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c103fb71-c682-4fc9-9ffa-70042285c915', NULL, 'C-7937', 'Oil Filter', 'SAKURA', 0, 5175, 0, '', 'Cash', '2026-11-07T15:55:07.675Z', '2026-11-07T15:55:07.675Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3b5f1220-11d5-491c-a793-04d21d7b67cc', NULL, 'C-7971', 'Oil Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:55:07.694Z', '2026-11-07T15:55:07.694Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('883b7d1d-c788-42b8-9746-2688b4c47eaf', NULL, 'C-7976', 'Oil Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:55:07.675Z', '2026-11-07T15:55:07.675Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('03ec339f-6454-45fc-8401-51a0a458f080', NULL, 'C-7982', 'Oil Filter', 'SAKURA', 0, 1860, 0, '', 'Cash', '2026-11-07T15:55:07.676Z', '2026-11-07T15:55:07.676Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d5affc75-b2b0-4d9c-8387-287022c932ce', NULL, 'C-7988 / JX85100C', 'Oil Filter', 'SAKURA', 0, 3230, 0, '', 'Cash', '2026-11-07T15:55:07.692Z', '2026-11-07T15:55:07.692Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fddb4d83-f888-43cc-b38e-21af1e77213b', NULL, 'C-8013 / 94797406', 'Oil Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:55:07.661Z', '2026-11-07T15:55:07.661Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b055fb88-11b3-44f6-ad4d-6d97de1016cb', NULL, 'C-8036XPL', 'Oil Filter', 'SAKURA', 0, 1495, 0, '', 'Cash', '2026-11-07T15:55:07.655Z', '2026-11-07T15:55:07.655Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('894448ba-baf5-4974-84c4-ee5c70e4cd71', NULL, 'C-8045 / ERR5542', 'Oil Filter', 'SAKURA', 0, 1980, 0, '', 'Cash', '2026-11-07T15:55:07.686Z', '2026-11-07T15:55:07.686Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d64f555f-e9ec-40db-ac3f-65dc67ad0471', NULL, 'C-85230', 'Oil Filter', 'SAKURA', 0, 1685, 0, '', 'Cash', '2026-11-07T15:55:07.677Z', '2026-11-07T15:55:07.677Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b6d71fd9-0b7d-4f87-b3ea-e6263e2e72fa', NULL, 'C-98050', 'Oil Filter', 'SAKURA', 0, 1065, 0, '', 'Cash', '2026-11-07T15:55:07.683Z', '2026-11-07T15:55:07.683Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5a5cd49f-cfd9-4bdf-a5be-4af93cbcb58f', NULL, 'CA-10130 / AC-304', 'Cabin Filter', 'SAKURA', 0, 1630, 0, '', 'Cash', '2026-11-07T15:58:46.318Z', '2026-11-07T15:58:46.318Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b2c25959-659f-4c83-a8af-ee2621d35a02', NULL, 'CA-1101 / AC-102E', 'Cabin Filter', 'SAKURA', 0, 2010, 0, '', 'Cash', '2026-11-07T15:58:46.290Z', '2026-11-07T15:58:46.290Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f3f3c755-7e69-4fae-b478-22bdc1293955', NULL, 'CA-1102 / AC-103E', 'Cabin Filter', 'SAKURA', 0, 2465, 0, '', 'Cash', '2026-11-07T15:58:46.300Z', '2026-11-07T15:58:46.300Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('45c56db8-115f-49e9-bcb1-c83011a60bba', NULL, 'CA-1103 / AC-102E', 'Cabin Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:58:46.292Z', '2026-11-07T15:58:46.292Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('655307b3-05c6-48be-a217-1a34c58db167', NULL, 'CA-1106', 'Cabin Filter', 'SAKURA', 0, 2900, 0, '', 'Cash', '2026-11-07T15:58:46.310Z', '2026-11-07T15:58:46.310Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('19c4a7cd-085d-4c8e-b703-6bc693d6a431', NULL, 'CA-1112 / AC-108E', 'Cabin Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:58:46.301Z', '2026-11-07T15:58:46.301Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fdb45ccf-0d5c-451b-a87b-de41184cee2c', NULL, 'CA-1114 / AC-108E', 'Cabin Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:58:46.302Z', '2026-11-07T15:58:46.302Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8d6a4434-6d7c-45a3-8acc-2a9b57711464', NULL, 'CA-11300', 'Cabin Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:58:46.311Z', '2026-11-07T15:58:46.311Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3ff86bd6-51e7-4d79-b230-6ffc15913350', NULL, 'CA-11330 / AC-938E', 'Cabin Filter', 'SAKURA', 0, 1295, 0, '', 'Cash', '2026-11-07T15:58:46.365Z', '2026-11-07T15:58:46.365Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bb6c732a-1839-4d14-a6f3-ebf351e41d7e', NULL, 'CA-11380 / AC-111E', 'Cabin Filter', 'SAKURA', 0, 1750, 0, '', 'Cash', '2026-11-07T15:58:46.305Z', '2026-11-07T15:58:46.305Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('739f8e9e-0a0c-435f-bcdb-424214f61646', NULL, 'CA-1401', 'Cabin Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:58:46.369Z', '2026-11-07T15:58:46.369Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b19e61ad-f72d-4146-a402-9ef3cb5f109e', NULL, 'CA-1402 / AC-933E', 'Cabin Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:58:46.362Z', '2026-11-07T15:58:46.362Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('13480679-5657-42d5-8117-5d8a6a335bae', NULL, 'CA-14120 / AC-939', 'Cabin Filter', 'SAKURA', 0, 1050, 0, '', 'Cash', '2026-11-07T15:58:46.366Z', '2026-11-07T15:58:46.366Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4d0f888a-2b88-4752-9c03-fc1205b8e977', NULL, 'CA-14970 / AC-940EX', 'Cabin Filter', 'SAKURA', 0, 1630, 0, '', 'Cash', '2026-11-07T15:58:46.367Z', '2026-11-07T15:58:46.367Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f6bbbc8b-5aad-44f0-b961-80cfc9198e51', NULL, 'CA-14980 / AC-931E', 'Cabin Filter', 'SAKURA', 0, 990, 0, '', 'Cash', '2026-11-07T15:58:46.359Z', '2026-11-07T15:58:46.359Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ed6083e6-8449-427c-9b46-4e505fcc200e', NULL, 'CA-1606 / AC-806E', 'Cabin Filter', 'SAKURA', 0, 890, 0, '', 'Cash', '2026-11-07T15:58:46.356Z', '2026-11-07T15:58:46.356Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('485d8bb1-f082-401e-b7d1-bdbcc0653966', NULL, 'CA-16130 / AC-808EX', 'Cabin Filter', 'SAKURA', 0, 1350, 0, '', 'Cash', '2026-11-07T15:58:46.358Z', '2026-11-07T15:58:46.358Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5b39ec49-34d0-4b56-b049-b05bc1466e0c', NULL, 'CA-16140 / AC-806', 'Cabin Filter', 'SAKURA', 0, 2585, 0, '', 'Cash', '2026-11-07T15:58:46.355Z', '2026-11-07T15:58:46.355Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ea99e190-75ec-41f1-b827-df95b82375c3', NULL, 'CA-1705 / AC-401E', 'Cabin Filter', 'SAKURA', 0, 750, 0, '', 'Cash', '2026-11-07T15:58:46.350Z', '2026-11-07T15:58:46.350Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8a1af986-6b5c-49ee-a256-dfd734b734b2', NULL, 'CA-17110-S / AC-404E', 'Cabin Filter', 'SAKURA', 0, 650, 0, '', 'Cash', '2026-11-07T15:58:46.351Z', '2026-11-07T15:58:46.351Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ca6d4824-9593-4f46-bbd0-18232ad4b54d', NULL, 'CA-17140', 'Cabin Filter', 'SAKURA', 0, 2900, 0, '', 'Cash', '2026-11-07T15:58:46.348Z', '2026-11-07T15:58:46.348Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('69cc35d9-27f3-4c0a-b72a-73dd387894af', NULL, 'CA-17160 / AC-407E', 'Cabin Filter', 'SAKURA', 0, 575, 0, '', 'Cash', '2026-11-07T15:58:46.353Z', '2026-11-07T15:58:46.353Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4c927bf0-2305-4510-8a3c-ed833f7a9a29', NULL, 'CA-17180 / AC-408E', 'Cabin Filter', 'SAKURA', 0, 795, 0, '', 'Cash', '2026-11-07T15:58:46.354Z', '2026-11-07T15:58:46.354Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5cd99664-885f-4c64-87f3-72a031b259f9', NULL, 'CA-1801 / AC-201E', 'Cabin Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:58:46.319Z', '2026-11-07T15:58:46.319Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('acb66850-288a-4c50-996a-8b6c10191ee8', NULL, 'CA-1804', 'Cabin Filter', 'SAKURA', 0, 2295, 0, '', 'Cash', '2026-11-07T15:58:46.335Z', '2026-11-07T15:58:46.335Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2b925c46-69f3-4785-8173-68e2f6add3b3', NULL, 'CA-1807 / AC-902E', 'Cabin Filter', 'SAKURA', 0, 1650, 0, '', 'Cash', '2026-11-07T15:58:46.343Z', '2026-11-07T15:58:46.343Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b7345187-3e82-40ba-a54c-daf8212ee290', NULL, 'CA-1809-S', 'Cabin Filter', 'SAKURA', 0, 2585, 0, '', 'Cash', '2026-11-07T15:58:46.336Z', '2026-11-07T15:58:46.336Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3deac5c7-c1fd-46de-b304-d9bdfe161894', NULL, 'CA-1810 / AC-207E', 'Cabin Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:58:46.325Z', '2026-11-07T15:58:46.325Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9a52d48d-b77e-4691-9770-9c39cf61bc8e', NULL, 'CA-18120 / AC-201E', 'Cabin Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:58:46.320Z', '2026-11-07T15:58:46.320Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ec0fdf02-8455-4b3a-99ee-c30ed7b5d7e2', NULL, 'CA-18170', 'Cabin Filter', 'SAKURA', 0, 975, 0, '', 'Cash', '2026-11-07T15:58:46.368Z', '2026-11-07T15:58:46.368Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('aa2475f2-075c-4652-ab49-c86f98a8afcd', NULL, 'CA-18200 / AC-216', 'Cabin Filter', 'SAKURA', 0, 1585, 0, '', 'Cash', '2026-11-07T15:58:46.333Z', '2026-11-07T15:58:46.333Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('475ddbb2-4e28-44eb-94aa-323b65b43e98', NULL, 'CA-18270 / AC-210E', 'Cabin Filter', 'SAKURA', 0, 1860, 0, '', 'Cash', '2026-11-07T15:58:46.329Z', '2026-11-07T15:58:46.329Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3e3fd0bb-b23e-462d-b254-fc82444acaf5', NULL, 'CA-18280 / AC-903E', 'Cabin Filter', 'SAKURA', 0, 1860, 0, '', 'Cash', '2026-11-07T15:58:46.344Z', '2026-11-07T15:58:46.344Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('56f6d6f2-38cd-4588-b3a0-db4bfa6f0af5', NULL, 'CA-18310 / AC-208E', 'Cabin Filter', 'SAKURA', 0, 1860, 0, '', 'Cash', '2026-11-07T15:58:46.327Z', '2026-11-07T15:58:46.327Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('db2a08c3-01b9-4472-86b2-ca9abf89a1ff', NULL, 'CA-18361 / AC-215E', 'Cabin Filter', 'SAKURA', 0, 745, 0, '', 'Cash', '2026-11-07T15:58:46.332Z', '2026-11-07T15:58:46.332Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cb02b441-985f-410d-b047-d010cbefb8de', NULL, 'CA-18400 / AC-934E', 'Cabin Filter', 'SAKURA', 0, 1215, 0, '', 'Cash', '2026-11-07T15:58:46.363Z', '2026-11-07T15:58:46.363Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ac827e31-365a-4637-a02b-55a0ade9fc3b', NULL, 'CA-18410 / AC-936', 'Cabin Filter', 'SAKURA', 0, 1390, 0, '', 'Cash', '2026-11-07T15:58:46.364Z', '2026-11-07T15:58:46.364Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ff3a037a-4d10-4c9f-b1af-74b1833134f1', NULL, 'CA-18470 / AC-206E', 'Cabin Filter', 'SAKURA', 0, 1850, 0, '', 'Cash', '2026-11-07T15:58:46.323Z', '2026-11-07T15:58:46.323Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6f704b1e-510d-4b94-93c8-0fc92a440910', NULL, 'CA-1914', 'Cabin Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:58:46.347Z', '2026-11-07T15:58:46.347Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c47e9ac2-a68a-4bb8-9afa-ed8177db37b5', NULL, 'CA-2807', 'Cabin Filter', 'SAKURA', 0, 1860, 0, '', 'Cash', '2026-11-07T15:58:46.341Z', '2026-11-07T15:58:46.341Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('33ada044-1310-4c61-9870-9738e3ec3183', NULL, 'CA-28390', 'Cabin Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:58:46.342Z', '2026-11-07T15:58:46.342Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c147ae70-4caa-48d9-a699-30380a4b5620', NULL, 'CA-3300 / AC-101E', 'Cabin Filter', 'SAKURA', 0, 2970, 0, '', 'Cash', '2026-11-07T15:58:46.275Z', '2026-11-07T15:58:46.275Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('535a119b-137f-4e5d-a8bb-c514e0400ba1', NULL, 'CA-3301 / AC-101E', 'Cabin Filter', 'SAKURA', 0, 2500, 0, '', 'Cash', '2026-11-07T15:58:46.283Z', '2026-11-07T15:58:46.283Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7378d02f-6ea0-4b23-8d57-e664d439bcb9', NULL, 'CA-6511', 'Cabin Filter', 'SAKURA', 0, 2295, 0, '', 'Cash', '2026-11-07T15:58:46.371Z', '2026-11-07T15:58:46.371Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2be38e62-cfb8-4a86-9561-27162ee34ef1', NULL, 'CA-65300 / AC-211E', 'Cabin Filter', 'SAKURA', 0, 795, 0, '', 'Cash', '2026-11-07T15:58:46.331Z', '2026-11-07T15:58:46.331Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9cd1e6c7-dcb6-43ff-ba90-ec5f894db7b2', NULL, 'CA-89060', 'Cabin Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:58:46.340Z', '2026-11-07T15:58:46.340Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8fe3e421-7c4e-4a84-932a-64c7c8c64325', NULL, 'CA-89080', 'Cabin Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:58:46.339Z', '2026-11-07T15:58:46.339Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0baffb11-c093-472f-bb17-18f4b9c56777', NULL, 'CA-89180', 'Cabin Filter', 'SAKURA', 0, 1390, 0, '', 'Cash', '2026-11-07T15:58:46.373Z', '2026-11-07T15:58:46.373Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b36c9ab6-d394-4d51-8aad-6ac8624a3540', NULL, 'CAC-1006', 'Cabin Filter', 'SAKURA', 0, 2900, 0, '', 'Cash', '2026-11-07T15:58:46.315Z', '2026-11-07T15:58:46.315Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('69162234-27ab-44d9-b8d6-22e6e4287fb8', NULL, 'CAC-10100', 'Cabin Filter', 'SAKURA', 0, 3665, 0, '', 'Cash', '2026-11-07T15:58:46.316Z', '2026-11-07T15:58:46.316Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5bb9d412-0bea-4d3d-99f3-f9a47d816478', NULL, 'CAC-1103 / AC-102EX', 'Cabin Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:58:46.294Z', '2026-11-07T15:58:46.294Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1e810cf1-66cf-4a00-8ef3-c33c5f5349ae', NULL, 'CAC-11180', 'Cabin Filter', 'SAKURA', 0, 2970, 0, '', 'Cash', '2026-11-07T15:58:46.312Z', '2026-11-07T15:58:46.312Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('13a3d618-8187-4a06-a980-9491fa42043c', NULL, 'CAC-11380 / AC-111EX', 'Cabin Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:58:46.306Z', '2026-11-07T15:58:46.306Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('dde3e35c-0477-4e64-aa5b-be2b0f3e9119', NULL, 'CAC-14060 / AC-932E', 'Cabin Filter', 'SAKURA', 0, 2970, 0, '', 'Cash', '2026-11-07T15:58:46.361Z', '2026-11-07T15:58:46.361Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('159a00ea-e49b-4320-8ffa-f0803d999a7f', NULL, 'CAC-18120 / AC-201E', 'Cabin Filter', 'SAKURA', 0, 2295, 0, '', 'Cash', '2026-11-07T15:58:46.321Z', '2026-11-07T15:58:46.321Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0a740199-e8af-43fa-a1cf-42f9a9adcf96', NULL, 'CAV-1101 / AC-102EX', 'Cabin Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:58:46.296Z', '2026-11-07T15:58:46.296Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3eb1b307-d9fe-43c1-9fe8-844f5479dace', NULL, 'CAV-1103 / AC-102EX', 'Cabin Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:58:46.298Z', '2026-11-07T15:58:46.298Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('209c7ed0-15e3-4ca6-8c36-a5e49ae47148', NULL, 'CAV-1106 / AC-101EX', 'Cabin Filter', 'SAKURA', 0, 4055, 0, '', 'Cash', '2026-11-07T15:58:46.289Z', '2026-11-07T15:58:46.289Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('dcbf7a1e-5b7c-431f-9660-36de07399e22', NULL, 'CAV-1114 / AC-108EX', 'Cabin Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:58:46.303Z', '2026-11-07T15:58:46.303Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1eb8b016-1fb2-4f81-a9d8-aee0886ed1a5', NULL, 'CAV-11300', 'Cabin Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:58:46.314Z', '2026-11-07T15:58:46.314Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9d69a305-3ec4-42c4-a470-973eb0b371c6', NULL, 'CAV-11330 / AC-938EX', 'Cabin Filter', 'SAKURA', 0, 3700, 0, '', 'Cash', '2026-11-07T15:58:46.308Z', '2026-11-07T15:58:46.308Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f792e251-05ee-4bfa-9f8c-58ef9f0c06c5', NULL, 'CAV-11380 / AC-111EX', 'Cabin Filter', 'SAKURA', 0, 3830, 0, '', 'Cash', '2026-11-07T15:58:46.307Z', '2026-11-07T15:58:46.307Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2951cf7a-6465-43cc-9765-3935981c28fa', NULL, 'CAV-16130 / AC-808EX', 'Cabin Filter', 'SAKURA', 0, 4665, 0, '', 'Cash', '2026-11-07T15:58:46.357Z', '2026-11-07T15:58:46.357Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a0ce3ceb-6939-4668-9316-1df8371af440', NULL, 'CAV-17140', 'Cabin Filter', 'SAKURA', 0, 4515, 0, '', 'Cash', '2026-11-07T15:58:46.349Z', '2026-11-07T15:58:46.349Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('443cc957-8e78-409c-9482-f7dd3cff5c00', NULL, 'CAV-1809-S', 'Cabin Filter', 'SAKURA', 0, 5545, 0, '', 'Cash', '2026-11-07T15:58:46.337Z', '2026-11-07T15:58:46.337Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('125f2767-cb66-4b8f-8ad4-b1f5b67eb37c', NULL, 'CAV-1810 / AC-207EX', 'Cabin Filter', 'SAKURA', 0, 4025, 0, '', 'Cash', '2026-11-07T15:58:46.326Z', '2026-11-07T15:58:46.326Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bdaa5161-ce20-4441-ad0a-787b28fd000b', NULL, 'CAV-18120 / AC-201EX', 'Cabin Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:58:46.322Z', '2026-11-07T15:58:46.322Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a2872dd3-ee9f-4303-8ef6-4740e585632a', NULL, 'CAV-18280 / AC-903EX', 'Cabin Filter', 'SAKURA', 0, 2520, 0, '', 'Cash', '2026-11-07T15:58:46.346Z', '2026-11-07T15:58:46.346Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f10943da-e6ba-4b19-835a-d7857267c2e6', NULL, 'CAV-18310 / AC-208EX', 'Cabin Filter', 'SAKURA', 0, 2295, 0, '', 'Cash', '2026-11-07T15:58:46.328Z', '2026-11-07T15:58:46.328Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('226a7a38-2097-4209-ae42-6344a3e15fe0', NULL, 'CAV-6511-S', 'Cabin Filter', 'SAKURA', 0, 3630, 0, '', 'Cash', '2026-11-07T15:58:46.370Z', '2026-11-07T15:58:46.370Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('eed901b3-ab0e-4923-8695-c135a9dd874a', NULL, 'CAV-89080-S', 'Cabin Filter', 'SAKURA', 0, 2510, 0, '', 'Cash', '2026-11-07T15:58:46.338Z', '2026-11-07T15:58:46.338Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4ac045f8-a8e4-470b-9ed3-7c131b99da05', NULL, 'CAV-89180', 'Cabin Filter', 'SAKURA', 0, 2130, 0, '', 'Cash', '2026-11-07T15:58:46.374Z', '2026-11-07T15:58:46.374Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('065371ce-3a9f-411f-a821-ce69c3567538', NULL, 'EF-10050 / MK667920', 'Fuel Filter', 'SAKURA', 0, 4250, 0, '', 'Cash', '2026-11-07T15:55:48.893Z', '2026-11-07T15:55:48.893Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4507b831-9d19-45de-8cf3-187866513497', NULL, 'EF-10080', 'Fuel Filter', 'SAKURA', 0, 4185, 0, '', 'Cash', '2026-11-07T15:55:48.894Z', '2026-11-07T15:55:48.894Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c51f0533-ba24-4844-953f-99a1ab28018a', NULL, 'EF-13020', 'Fuel Filter', 'SAKURA', 0, 4285, 0, '', 'Cash', '2026-11-07T15:55:48.916Z', '2026-11-07T15:55:48.916Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('42ec62d0-a7b2-4fc6-ba75-45b8474345d4', NULL, 'EF-13070', 'Fuel Filter', 'SAKURA', 0, 3695, 0, '', 'Cash', '2026-11-07T15:55:48.917Z', '2026-11-07T15:55:48.917Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a76ed7f4-eee2-44a6-a6ad-ed1ab0bb6036', NULL, 'EF-15130', 'Fuel Filter', 'SAKURA', 0, 5545, 0, '', 'Cash', '2026-11-07T15:55:48.960Z', '2026-11-07T15:55:48.960Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9f7b8ab8-537e-4362-9ced-8ea49db430e6', NULL, 'EF-18040', 'Fuel Filter', 'SAKURA', 0, 4305, 0, '', 'Cash', '2026-11-07T15:55:48.948Z', '2026-11-07T15:55:48.948Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c97d9b7b-2d17-4cbb-9787-02e7b3fc0c2c', NULL, 'EF-18050', 'Fuel Filter', 'SAKURA', 0, 4935, 0, '', 'Cash', '2026-11-07T15:55:48.949Z', '2026-11-07T15:55:48.949Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8bda7c77-6111-49bc-aae0-2ea44d6b8d91', NULL, 'EF-19090', 'Fuel Filter', 'SAKURA', 0, 8950, 0, '', 'Cash', '2026-11-07T15:55:48.889Z', '2026-11-07T15:55:48.889Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('442ae001-3435-4036-a3f0-cd4ddc4435ce', NULL, 'EF-49010', 'Fuel Filter', 'SAKURA', 0, 2295, 0, '', 'Cash', '2026-11-07T15:55:48.988Z', '2026-11-07T15:55:48.988Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('45a4c56f-e2c5-49a3-9b97-05c33b35fa8e', NULL, 'EFG-1002', 'Fuel Filter', 'SAKURA', 0, 3445, 0, '', 'Cash', '2026-11-07T15:55:48.895Z', '2026-11-07T15:55:48.895Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('38ea2d94-92b0-43f2-9d78-9037cbd80738', NULL, 'EO-10050', 'Oil Filter', 'SAKURA', 0, 8140, 0, '', 'Cash', '2026-11-07T15:55:07.528Z', '2026-11-07T15:55:07.528Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f00692ab-81cb-47b4-bd46-aa4069308bc8', NULL, 'EO-13070', 'Oil Filter', 'SAKURA', 0, 2450, 0, '', 'Cash', '2026-11-07T15:55:07.508Z', '2026-11-07T15:55:07.508Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('36130774-2f93-4541-8a13-09f5eb3f3640', NULL, 'EO-1601', 'Oil Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:55:07.649Z', '2026-11-07T15:55:07.649Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('01457e9d-023b-483d-9eb8-32204e45f14c', NULL, 'EO-18210', 'Oil Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:55:07.530Z', '2026-11-07T15:55:07.530Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9013a080-caa0-4d6c-8f68-21f8cb366cca', NULL, 'EO-18220', 'Oil Filter', 'SAKURA', 0, 2130, 0, '', 'Cash', '2026-11-07T15:55:07.533Z', '2026-11-07T15:55:07.533Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a12a8277-3e3f-45be-ae9d-db9572203dd0', NULL, 'EO-24070 / LR004459', 'Oil Filter', 'SAKURA', 0, 2380, 0, '', 'Cash', '2026-11-07T15:55:07.688Z', '2026-11-07T15:55:07.688Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f7174b6b-89b5-43c6-a331-a5714c9a3a19', NULL, 'EO-2624 / 1041800108', 'Oil Filter', 'SAKURA', 0, 2520, 0, '', 'Cash', '2026-11-07T15:55:07.663Z', '2026-11-07T15:55:07.663Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('20fbd1b8-c236-4608-b159-d6ffba70c5cd', NULL, 'EO-28070 / 26320-2F000', 'Oil Filter', 'SAKURA', 0, 2380, 0, '', 'Cash', '2026-11-07T15:55:07.664Z', '2026-11-07T15:55:07.664Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f2b78b7f-7882-47d1-9880-2597fdc9ad22', NULL, 'EO-28100', 'Fuel Filter', 'SAKURA', 0, 5145, 0, '', 'Cash', '2026-11-07T15:55:48.973Z', '2026-11-07T15:55:48.973Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c901c55d-0f73-479f-8385-a4a7889448b6', NULL, 'EO-29050', 'Oil Filter', 'SAKURA', 0, 3665, 0, '', 'Cash', '2026-11-07T15:55:07.665Z', '2026-11-07T15:55:07.665Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1fbc9466-d2e3-4173-83fc-ecc98343c204', NULL, 'ETE-24010', 'Transmission Oil Filter', 'SAKURA', 0, 1250, 0, '', 'Cash', '2026-11-07T15:59:52.754Z', '2026-11-07T15:59:52.754Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bbaa959a-73b5-4035-ab97-d1f0b151a35f', NULL, 'F-1003-1', 'Fuel Filter', 'SAKURA', 0, 705, 0, '', 'Cash', '2026-11-07T15:55:48.983Z', '2026-11-07T15:55:48.983Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c28c665e-5609-4f47-9905-f0c570b5fe12', NULL, 'F-1508', 'Fuel Filter', 'SAKURA', 0, 2380, 0, '', 'Cash', '2026-11-07T15:55:48.951Z', '2026-11-07T15:55:48.951Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1cfd5999-4235-456a-8ecb-7842e38a8b3e', NULL, 'F-17011', 'Fuel Filter', 'SAKURA', 0, 3870, 0, '', 'Cash', '2026-11-07T15:55:48.856Z', '2026-11-07T15:55:48.856Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fc18262c-ce8e-4525-b4ea-85f5b9cb2c03', NULL, 'F-18160', 'Fuel Filter', 'SAKURA', 0, 4210, 0, '', 'Cash', '2026-11-07T15:55:48.947Z', '2026-11-07T15:55:48.947Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6e3a0194-a114-43ba-a8fd-fc6bb8b4591d', NULL, 'F-5210', 'Fuel Filter', 'SAKURA', 0, 1040, 0, '', 'Cash', '2026-11-07T15:55:48.982Z', '2026-11-07T15:55:48.982Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('56840fbf-d0f4-4bbb-bf49-5d0998bc7dd9', NULL, 'F-7909-2', 'Fuel Filter', 'SAKURA', 0, 835, 0, '', 'Cash', '2026-11-07T15:55:48.980Z', '2026-11-07T15:55:48.980Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c9d65549-807b-4a85-a299-bd2424c869a8', NULL, 'FC-10290', 'Fuel Filter', 'SAKURA', 0, 5145, 0, '', 'Cash', '2026-11-07T15:55:48.896Z', '2026-11-07T15:55:48.896Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e8173cd0-b3aa-4043-aea0-3a849c3fc22d', NULL, 'FC-1109', 'Fuel Filter', 'SAKURA', 0, 4250, 0, '', 'Cash', '2026-11-07T15:55:48.858Z', '2026-11-07T15:55:48.858Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cb08f9b8-81d8-40e4-ba6a-72ba1b5fa317', NULL, 'FC-13210', 'Fuel Filter', 'SAKURA', 0, 13690, 0, '', 'Cash', '2026-11-07T15:55:48.860Z', '2026-11-07T15:55:48.860Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4c8a56d9-f6d8-4b89-9aa8-69c6d037d57c', NULL, 'FC-1814', 'Fuel Filter', 'SAKURA', 0, 3405, 0, '', 'Cash', '2026-11-07T15:55:48.931Z', '2026-11-07T15:55:48.931Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1a8eddcb-5de8-43ee-b2cb-babf89793b48', NULL, 'FC-19070 / 31922-2B900', 'Fuel Filter', 'SAKURA', 0, 3665, 0, '', 'Cash', '2026-11-07T15:55:48.966Z', '2026-11-07T15:55:48.966Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8521f003-c43a-44c7-afe8-16c5079f710e', NULL, 'FC-2204', 'Fuel Filter', 'SAKURA', 0, 4470, 0, '', 'Cash', '2026-11-07T15:55:48.985Z', '2026-11-07T15:55:48.985Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c1cb7df8-6f33-4149-9089-3c2f52156a76', NULL, 'FC-2801', 'Fuel Filter', 'SAKURA', 0, 3100, 0, '', 'Cash', '2026-11-07T15:55:48.967Z', '2026-11-07T15:55:48.967Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0472d200-d8bf-43ba-b606-d0625f1e4499', NULL, 'FC-28070 / 31945-82000', 'Fuel Filter', 'SAKURA', 0, 7515, 0, '', 'Cash', '2026-11-07T15:55:48.972Z', '2026-11-07T15:55:48.972Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8df7f82f-09fa-41d3-b371-12d5f9cda5fb', NULL, 'FC-2905 / CX0712B', 'Fuel Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:55:48.968Z', '2026-11-07T15:55:48.968Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('dbf9952b-b4f9-4022-b4dd-e34b1cbc010b', NULL, 'FC-38020 / CX0708', 'Fuel Filter', 'SAKURA', 0, 2110, 0, '', 'Cash', '2026-11-07T15:55:48.996Z', '2026-11-07T15:55:48.996Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('dbb71ad2-474c-41a7-9fbb-1051db81dcff', NULL, 'FC-38030 / CX0710', 'Fuel Filter', 'SAKURA', 0, 1975, 0, '', 'Cash', '2026-11-07T15:55:48.997Z', '2026-11-07T15:55:48.997Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('25d2cb06-e634-4460-9e9e-8a30ed637c77', NULL, 'FC-45010', 'Fuel Filter', 'SAKURA', 0, 5080, 0, '', 'Cash', '2026-11-07T15:55:48.979Z', '2026-11-07T15:55:48.979Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6168aeac-cfe6-4ff5-ad39-ecc45477f01b', NULL, 'FC-55240 / D638-002-802A', 'Fuel Filter', 'SAKURA', 0, 7530, 0, '', 'Cash', '2026-11-07T15:55:48.995Z', '2026-11-07T15:55:48.995Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('95c53738-59c0-4334-b4aa-e7dfee242d65', NULL, 'FC-5716', 'Fuel Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:55:48.978Z', '2026-11-07T15:55:48.978Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('388485f8-4c4c-4327-aa58-45e5c5f43a5a', NULL, 'FC-7903', 'Fuel Filter', 'SAKURA', 0, 1675, 0, '', 'Cash', '2026-11-07T15:55:48.977Z', '2026-11-07T15:55:48.977Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('aa2a08d2-fcbd-4883-8d9d-f5397d3718be', NULL, 'FC-7949 / DX-150', 'Fuel Filter', 'SAKURA', 0, 3405, 0, '', 'Cash', '2026-11-07T15:55:48.994Z', '2026-11-07T15:55:48.994Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('47b72424-e051-49e9-a0f2-d1f516507de8', NULL, 'FS-1031 / MR526974', 'Fuel Filter', 'SAKURA', 0, 7170, 0, '', 'Cash', '2026-11-07T15:55:48.897Z', '2026-11-07T15:55:48.897Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b24d68a4-f48b-49b1-a712-888c0010265b', NULL, 'FS-1109', 'Fuel Filter', 'SAKURA', 0, 4130, 0, '', 'Cash', '2026-11-07T15:55:48.861Z', '2026-11-07T15:55:48.861Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6c902c2d-d6b2-4bac-868f-6077d3e996f1', NULL, 'FS-1149', 'Fuel Filter', 'SAKURA', 0, 4885, 0, '', 'Cash', '2026-11-07T15:55:48.863Z', '2026-11-07T15:55:48.863Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7d4fdaf2-ac13-4176-92c7-98314e854c5d', NULL, 'FS-1157', 'Fuel Filter', 'SAKURA', 0, 6060, 0, '', 'Cash', '2026-11-07T15:55:48.864Z', '2026-11-07T15:55:48.864Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9eed4dda-7096-467b-b575-bbe22eb2ff6b', NULL, 'FS-11650 / 23300-75140', 'Fuel Filter', 'SAKURA', 0, 2150, 0, '', 'Cash', '2026-11-07T15:55:48.865Z', '2026-11-07T15:55:48.865Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9f00273e-bf9b-49ba-b214-61eece566058', NULL, 'FS-11730 / 23300-21030', 'Fuel Filter', 'SAKURA', 0, 7950, 0, '', 'Cash', '2026-11-07T15:55:48.866Z', '2026-11-07T15:55:48.866Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a68d32db-12bb-465a-b157-250064f4a242', NULL, 'FS-1410', 'Fuel Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:55:48.965Z', '2026-11-07T15:55:48.965Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('31897e8b-f7a4-4fbc-a9d5-231ca97f842c', NULL, 'FS-1705', 'Fuel Filter', 'SAKURA', 0, 2990, 0, '', 'Cash', '2026-11-07T15:55:48.892Z', '2026-11-07T15:55:48.892Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8f691b80-dcb2-4194-9c7b-18b4023a117c', NULL, 'FS-1812', 'Fuel Filter', 'SAKURA', 0, 6210, 0, '', 'Cash', '2026-11-07T15:55:48.936Z', '2026-11-07T15:55:48.936Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8b710152-e282-423c-a78a-133d497d6f3f', NULL, 'FS-18270', 'Fuel Filter', 'SAKURA', 0, 13175, 0, '', 'Cash', '2026-11-07T15:55:48.923Z', '2026-11-07T15:55:48.923Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('39e0ccfc-e17e-409b-a142-4f32923c181c', NULL, 'FS-18290', 'Fuel Filter', 'SAKURA', 0, 13675, 0, '', 'Cash', '2026-11-07T15:55:48.924Z', '2026-11-07T15:55:48.924Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('59455a01-92b6-48de-8e3c-6b7d3c8a138c', NULL, 'FS-18291', 'Fuel Filter', 'SAKURA', 0, 9605, 0, '', 'Cash', '2026-11-07T15:55:48.925Z', '2026-11-07T15:55:48.925Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('94393805-a276-440e-b9a0-b59ee5e81f0f', NULL, 'FS-18300', 'Fuel Filter', 'SAKURA', 0, 8140, 0, '', 'Cash', '2026-11-07T15:55:48.927Z', '2026-11-07T15:55:48.927Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d8375044-b63f-46e6-8239-56f30fa08270', NULL, 'FS-18301', 'Fuel Filter', 'SAKURA', 0, 8455, 0, '', 'Cash', '2026-11-07T15:55:48.928Z', '2026-11-07T15:55:48.928Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b6b90648-da5c-45a1-bf61-eb0b8d7d6897', NULL, 'FS-18310', 'Fuel Filter', 'SAKURA', 0, 8715, 0, '', 'Cash', '2026-11-07T15:55:48.929Z', '2026-11-07T15:55:48.929Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b18c8529-ec86-45d1-a3ac-0f1fbef38de0', NULL, 'FS-18311', 'Fuel Filter', 'SAKURA', 0, 8965, 0, '', 'Cash', '2026-11-07T15:55:48.930Z', '2026-11-07T15:55:48.930Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('521a7211-5b54-45e4-bd09-fd739cbf14b2', NULL, 'FS-19130', 'Fuel Filter', 'SAKURA', 0, 4950, 0, '', 'Cash', '2026-11-07T15:55:48.969Z', '2026-11-07T15:55:48.969Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0ef1351e-18d4-418f-ae58-492df92b3daa', NULL, 'FS-2804 / 31911-25000', 'Fuel Filter', 'SAKURA', 0, 2150, 0, '', 'Cash', '2026-11-07T15:55:48.970Z', '2026-11-07T15:55:48.970Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c64049c2-5a70-4e45-b4ed-6c0a1609b5cd', NULL, 'FS-28290 / 31112-1R000', 'Fuel Filter', 'SAKURA', 0, 7835, 0, '', 'Cash', '2026-11-07T15:55:48.971Z', '2026-11-07T15:55:48.971Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('45331b45-ede0-4478-92f8-c79caa0cf082', NULL, 'FS-2907', 'Fuel Filter', 'SAKURA', 0, 2850, 0, '', 'Cash', '2026-11-07T15:55:48.974Z', '2026-11-07T15:55:48.974Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cbd01a7f-2a60-4be1-a6a8-bb4c023c2d1d', NULL, 'FS-3105', 'Fuel Filter', 'SAKURA', 0, 3720, 0, '', 'Cash', '2026-11-07T15:55:48.990Z', '2026-11-07T15:55:48.990Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d604611b-5c81-4a57-b7ab-7f962474eb5e', NULL, 'FS-4301', 'Fuel Filter', 'SAKURA', 0, 5080, 0, '', 'Cash', '2026-11-07T15:55:48.987Z', '2026-11-07T15:55:48.987Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4f5024da-66c3-45b9-9247-d901895edc43', NULL, 'FS-8903 / S11-1117110', 'Fuel Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:55:48.991Z', '2026-11-07T15:55:48.991Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('34ceb298-9d03-44c1-994c-0faf59889816', NULL, 'FS-89050', 'Fuel Filter', 'SAKURA', 0, 2850, 0, '', 'Cash', '2026-11-07T15:55:48.998Z', '2026-11-07T15:55:48.998Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f5f47e95-4c63-4202-828a-0d4a5f11b3c0', NULL, 'HC-1902', 'Oil Filter', 'SAKURA', 0, 5080, 0, '', 'Cash', '2026-11-07T15:55:07.678Z', '2026-11-07T15:55:07.678Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b5d8a15e-b890-4522-832f-0e7efb08b40f', NULL, 'NA-1001 / A-1194', 'Air Filter', 'SAKURA', 0, 1950, 0, '', 'Cash', '2026-11-07T15:57:23.273Z', '2026-11-07T15:57:23.273Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b1a72c6d-4b74-4986-aebd-0bf5768eeb8b', NULL, 'NA-1003 / A-1180', 'Air Filter', 'SAKURA', 0, 2085, 0, '', 'Cash', '2026-11-07T15:57:23.275Z', '2026-11-07T15:57:23.275Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8323076c-824b-48fc-8229-b43707a37d1e', NULL, 'NA-1004 / A-1177', 'Air Filter', 'SAKURA', 0, 8495, 0, '', 'Cash', '2026-11-07T15:57:23.278Z', '2026-11-07T15:57:23.278Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7e992380-1c34-4169-aaec-b6d955439b32', NULL, 'NA-1007 / A-1195', 'Air Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:57:23.280Z', '2026-11-07T15:57:23.280Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b593d2e7-7c69-44e0-b4cb-bf4fa88c8ebc', NULL, 'NA-1008 / A-1190', 'Air Filter', 'SAKURA', 0, 1850, 0, '', 'Cash', '2026-11-07T15:57:23.282Z', '2026-11-07T15:57:23.282Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d7727742-9773-4755-a79c-3413f6ff021b', NULL, 'NA-1009 / A-3370', 'Air Filter', 'SAKURA', 0, 5930, 0, '', 'Cash', '2026-11-07T15:57:23.284Z', '2026-11-07T15:57:23.284Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b8ecc934-a789-4aaa-90bf-4fe4164fd37d', NULL, 'NA-1010 / A-3313', 'Air Filter', 'SAKURA', 0, 2825, 0, '', 'Cash', '2026-11-07T15:57:23.285Z', '2026-11-07T15:57:23.285Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2c173f6e-ad73-4e93-b0ab-ec1370498148', NULL, 'NA-1011 / A-3304', 'Air Filter', 'SAKURA', 0, 3295, 0, '', 'Cash', '2026-11-07T15:57:23.287Z', '2026-11-07T15:57:23.287Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a7449ac3-3a85-4aa7-80ca-68eada1dceb3', NULL, 'NA-1013 / A-3301', 'Air Filter', 'SAKURA', 0, 2535, 0, '', 'Cash', '2026-11-07T15:57:23.288Z', '2026-11-07T15:57:23.288Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('67135dd9-8e50-46d1-98ec-f279e9a0ca95', NULL, 'NA-1016 / A-3308', 'Air Filter', 'SAKURA', 0, 3405, 0, '', 'Cash', '2026-11-07T15:57:23.290Z', '2026-11-07T15:57:23.290Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5e23f9b0-92d4-4308-8389-7b71c4c6e8c8', NULL, 'NA-1017 / A-5904', 'Air Filter', 'SAKURA', 0, 2750, 0, '', 'Cash', '2026-11-07T15:57:23.291Z', '2026-11-07T15:57:23.291Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('be1702e8-839c-4b30-9dbf-a647a313bb32', NULL, 'NA-1018 / A-1196', 'Air Filter', 'SAKURA', 0, 5895, 0, '', 'Cash', '2026-11-07T15:57:23.293Z', '2026-11-07T15:57:23.293Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3143895c-5922-4a3b-9919-a0f2dd7105bd', NULL, 'NA-1022 / A-33990', 'Air Filter', 'SAKURA', 0, 4450, 0, '', 'Cash', '2026-11-07T15:57:23.295Z', '2026-11-07T15:57:23.295Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('009cfeec-7734-4f07-bbe8-645ff670a0fc', NULL, 'NA-1023 / A-3311', 'Air Filter', 'SAKURA', 0, 3935, 0, '', 'Cash', '2026-11-07T15:57:23.296Z', '2026-11-07T15:57:23.296Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('77454034-42fa-4c75-9a9c-1eb6bb4ac97f', NULL, 'NA-1025 / A-1230', 'Air Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:57:23.298Z', '2026-11-07T15:57:23.298Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('daccdee7-2e18-47c3-a309-e52903524f36', NULL, 'NA-1027 / A-33880', 'Air Filter', 'SAKURA', 0, 3935, 0, '', 'Cash', '2026-11-07T15:57:23.300Z', '2026-11-07T15:57:23.300Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c4c2f5d1-cb6c-4265-bae7-f3fc96326cc0', NULL, 'NA-1028 / A-5903', 'Air Filter', 'SAKURA', 0, 5875, 0, '', 'Cash', '2026-11-07T15:57:23.301Z', '2026-11-07T15:57:23.301Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d77b83c5-a347-441b-8d0d-54d5e061308e', NULL, 'NA-1030 / A-33940', 'Air Filter', 'SAKURA', 0, 2750, 0, '', 'Cash', '2026-11-07T15:57:23.302Z', '2026-11-07T15:57:23.302Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5d3589de-112b-4cc7-9e05-cdd8ce04d64b', NULL, 'NA-1031 / A-33750', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.304Z', '2026-11-07T15:57:23.304Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('09d42a28-7453-4be1-b5c3-5b81a7c60a82', NULL, 'NA-1032 / A-33950', 'Air Filter', 'SAKURA', 0, 4080, 0, '', 'Cash', '2026-11-07T15:57:23.305Z', '2026-11-07T15:57:23.305Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f5fd547b-f01b-4d3d-9f86-63d397f5aa07', NULL, 'NA-1034 / A-58370', 'Air Filter', 'SAKURA', 0, 2900, 0, '', 'Cash', '2026-11-07T15:57:23.307Z', '2026-11-07T15:57:23.307Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('21355dc0-5287-4b70-a4fb-a91c501eb731', NULL, 'NA-1037 / A-33730', 'Air Filter', 'SAKURA', 0, 4450, 0, '', 'Cash', '2026-11-07T15:57:23.308Z', '2026-11-07T15:57:23.308Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2ef2f44c-b70b-49f6-afb9-e8c836f57fe0', NULL, 'NA-1038 / A-59080', 'Air Filter', 'SAKURA', 0, 4765, 0, '', 'Cash', '2026-11-07T15:57:23.309Z', '2026-11-07T15:57:23.309Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('549f48cb-831d-484e-8459-0c2d57ba6db2', NULL, 'NA-1039 / A-33430', 'Air Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:57:23.310Z', '2026-11-07T15:57:23.310Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b9195fa5-2207-430e-81aa-4be473eabd55', NULL, 'NA-1044 / A-33440', 'Air Filter', 'SAKURA', 0, 3545, 0, '', 'Cash', '2026-11-07T15:57:23.311Z', '2026-11-07T15:57:23.311Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e6a4fdcf-5cce-4417-843d-a31a3f4722b3', NULL, 'NA-1045 / A-33450', 'Air Filter', 'SAKURA', 0, 4950, 0, '', 'Cash', '2026-11-07T15:57:23.312Z', '2026-11-07T15:57:23.312Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6fc9f2de-334d-4362-a8f7-d226cfc9b32a', NULL, 'NA-1049 / A-59130', 'Air Filter', 'SAKURA', 0, 2250, 0, '', 'Cash', '2026-11-07T15:57:23.314Z', '2026-11-07T15:57:23.314Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('509f07e3-2096-48f4-bad9-2510ffe891ba', NULL, 'NA-109 / A-1101', 'Air Filter', 'SAKURA', 0, 2750, 0, '', 'Cash', '2026-11-07T15:57:23.315Z', '2026-11-07T15:57:23.315Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f17b4430-df20-4632-8f8c-812d6d9276e9', NULL, 'NA-1169 / A-1169', 'Air Filter', 'SAKURA', 0, 5125, 0, '', 'Cash', '2026-11-07T15:57:23.316Z', '2026-11-07T15:57:23.316Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('12a2060a-023a-48e4-a368-cbcaaa0255b6', NULL, 'NA-120 / A-1108', 'Air Filter', 'SAKURA', 0, 3700, 0, '', 'Cash', '2026-11-07T15:57:23.317Z', '2026-11-07T15:57:23.317Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1c84c7cf-2de9-4b5f-a092-ed63b8d56c2f', NULL, 'NA-123 / A-1103', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.318Z', '2026-11-07T15:57:23.318Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('099f4d1c-0d00-44ce-b803-8a1f8dc95264', NULL, 'NA-135 / A-1105', 'Air Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:57:23.319Z', '2026-11-07T15:57:23.319Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7f1d133c-b9c5-4740-a07a-bba9c9bc066d', NULL, 'NA-136 / A-1119', 'Air Filter', 'SAKURA', 0, 3925, 0, '', 'Cash', '2026-11-07T15:57:23.320Z', '2026-11-07T15:57:23.320Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0bfb03de-935c-4fb0-99b3-dff0a9248a02', NULL, 'NA-137 / A-1106', 'Air Filter', 'SAKURA', 0, 3700, 0, '', 'Cash', '2026-11-07T15:57:23.322Z', '2026-11-07T15:57:23.322Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('11334b0b-f104-4b5b-84ce-dad4409b8bbb', NULL, 'NA-138 / A-1111', 'Air Filter', 'SAKURA', 0, 3250, 0, '', 'Cash', '2026-11-07T15:57:23.323Z', '2026-11-07T15:57:23.323Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b6b25e3d-1dcb-4df1-b6ac-05d1739d2492', NULL, 'NA-139 / A-1113', 'Air Filter', 'SAKURA', 0, 3230, 0, '', 'Cash', '2026-11-07T15:57:23.324Z', '2026-11-07T15:57:23.324Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('efabbc40-1321-467a-b701-c46584b4cac7', NULL, 'NA-1428 / A-1428', 'Air Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:57:23.541Z', '2026-11-07T15:57:23.541Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a3ae212d-5975-4285-93d8-0a394d4a6398', NULL, 'NA-142S / AS-1133', 'Air Filter', 'SAKURA', 0, 3720, 0, '', 'Cash', '2026-11-07T15:57:23.376Z', '2026-11-07T15:57:23.376Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d485b551-20b6-4daa-b72b-37110d79258d', NULL, 'NA-143 / A-1117', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.325Z', '2026-11-07T15:57:23.325Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('792350fc-7eba-47c4-86dd-70c059667ee5', NULL, 'NA-1437 / A-1437', 'Air Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:57:23.542Z', '2026-11-07T15:57:23.542Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f553052e-d38d-4efc-8a90-355b97ce7f94', NULL, 'NA-14390 / A-14390', 'Air Filter', 'SAKURA', 0, 3630, 0, '', 'Cash', '2026-11-07T15:57:23.544Z', '2026-11-07T15:57:23.544Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3c22b3e5-9651-4260-ab0b-7673956f8375', NULL, 'NA-145 / A-1146', 'Air Filter', 'SAKURA', 0, 3110, 0, '', 'Cash', '2026-11-07T15:57:23.326Z', '2026-11-07T15:57:23.326Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('08f66a97-91ce-4038-b0c0-c285f4d4eeaf', NULL, 'NA-147 / A-1112', 'Air Filter', 'SAKURA', 0, 5375, 0, '', 'Cash', '2026-11-07T15:57:23.327Z', '2026-11-07T15:57:23.327Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('99e18d8d-40b0-421d-a7a5-8a9f8a7d49f8', NULL, 'NA-149 / A-1118', 'Air Filter', 'SAKURA', 0, 3935, 0, '', 'Cash', '2026-11-07T15:57:23.328Z', '2026-11-07T15:57:23.328Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('17b4000b-bdf9-4e2a-878d-c5e56dcdf4bd', NULL, 'NA-150 / A-3320', 'Air Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:57:23.329Z', '2026-11-07T15:57:23.329Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f2019cd0-0e0c-488f-b891-904986416cf0', NULL, 'NA-1517 / A-1517', 'Air Filter', 'SAKURA', 0, 3665, 0, '', 'Cash', '2026-11-07T15:57:23.377Z', '2026-11-07T15:57:23.377Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f1f93a21-898a-41b6-9e04-a82037189f7b', NULL, 'NA-157A / A-1129', 'Air Filter', 'SAKURA', 0, 2000, 0, '', 'Cash', '2026-11-07T15:57:23.330Z', '2026-11-07T15:57:23.330Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('14d896f0-c9cd-4aae-b00f-106b6f1b9c4e', NULL, 'NA-161 / A-1123', 'Air Filter', 'SAKURA', 0, 2130, 0, '', 'Cash', '2026-11-07T15:57:23.331Z', '2026-11-07T15:57:23.331Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c0164444-ff62-411b-849c-fc9cf35f5771', NULL, 'NA-162G / A-1125', 'Air Filter', 'SAKURA', 0, 1350, 0, '', 'Cash', '2026-11-07T15:57:23.332Z', '2026-11-07T15:57:23.332Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4a894e13-5258-495f-9bdf-f1fb5bcb677d', NULL, 'NA-163A / A-1130', 'Air Filter', 'SAKURA', 0, 2640, 0, '', 'Cash', '2026-11-07T15:57:23.333Z', '2026-11-07T15:57:23.333Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2c473530-0839-4c07-9080-42de467de180', NULL, 'NA-170 / A-1128', 'Air Filter', 'SAKURA', 0, 3445, 0, '', 'Cash', '2026-11-07T15:57:23.334Z', '2026-11-07T15:57:23.334Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b914cc8f-447e-48b3-a4d0-bc05ed619bb7', NULL, 'NA-171 / A-1139', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.335Z', '2026-11-07T15:57:23.335Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2b01a706-a6b1-4cf6-a318-dee23c68a1b6', NULL, 'NA-172 / A-1144', 'Air Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:57:23.336Z', '2026-11-07T15:57:23.336Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a9829ca9-fdf4-4029-b449-560e26e66044', NULL, 'NA-174 / A-1145', 'Air Filter', 'SAKURA', 0, 2350, 0, '', 'Cash', '2026-11-07T15:57:23.337Z', '2026-11-07T15:57:23.337Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6e890a43-0030-4909-a246-399f9119304b', NULL, 'NA-176 / A-1138', 'Air Filter', 'SAKURA', 0, 2585, 0, '', 'Cash', '2026-11-07T15:57:23.339Z', '2026-11-07T15:57:23.339Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ab5f2bf7-5df1-496d-b1f1-bef27dc65fc4', NULL, 'NA-177 / A-1148', 'Air Filter', 'SAKURA', 0, 2955, 0, '', 'Cash', '2026-11-07T15:57:23.340Z', '2026-11-07T15:57:23.340Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('aaed5a7e-b271-429d-9a05-5a8df51a2109', NULL, 'NA-179 / A-1165', 'Air Filter', 'SAKURA', 0, 2110, 0, '', 'Cash', '2026-11-07T15:57:23.341Z', '2026-11-07T15:57:23.341Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f42f67a0-d2b7-4e45-908e-76bdc5e6988f', NULL, 'NA-181 / A-1187', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.342Z', '2026-11-07T15:57:23.342Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a0a8cc12-1449-4465-bc33-de7050fdb626', NULL, 'NA-183 / A-1167', 'Air Filter', 'SAKURA', 0, 3175, 0, '', 'Cash', '2026-11-07T15:57:23.343Z', '2026-11-07T15:57:23.343Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('abd78b07-573d-40ae-a8e9-cc323e159fa3', NULL, 'NA-1831 / A-1831', 'Air Filter', 'SAKURA', 0, 4625, 0, '', 'Cash', '2026-11-07T15:57:23.429Z', '2026-11-07T15:57:23.429Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bbdbb4ab-4583-45e5-9077-e93719ab9fbb', NULL, 'NA-184 / A-1176', 'Air Filter', 'SAKURA', 0, 3405, 0, '', 'Cash', '2026-11-07T15:57:23.343Z', '2026-11-07T15:57:23.343Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cfab8b5f-644b-4e76-8d28-d5d5a46be8d5', NULL, 'NA-185 / A-1166', 'Air Filter', 'SAKURA', 0, 3220, 0, '', 'Cash', '2026-11-07T15:57:23.344Z', '2026-11-07T15:57:23.344Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2899c48a-f7e5-48b0-a9c6-426f907eb4b8', NULL, 'NA-188 / A-1158', 'Air Filter', 'SAKURA', 0, 7170, 0, '', 'Cash', '2026-11-07T15:57:23.345Z', '2026-11-07T15:57:23.345Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('84ac99e5-be3c-4256-bfcb-b9b0a8ff45a2', NULL, 'NA-1880 / A-1880', 'Air Filter', 'SAKURA', 0, 3565, 0, '', 'Cash', '2026-11-07T15:57:23.430Z', '2026-11-07T15:57:23.430Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6d7a716c-7ce3-4967-8291-f0d5c2f575cb', NULL, 'NA-190 / A-1143', 'Air Filter', 'SAKURA', 0, 4665, 0, '', 'Cash', '2026-11-07T15:57:23.347Z', '2026-11-07T15:57:23.347Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6d5200d1-9ff3-45d8-a02b-d3a68507c3a2', NULL, 'NA-191 / A-1157', 'Air Filter', 'SAKURA', 0, 4885, 0, '', 'Cash', '2026-11-07T15:57:23.348Z', '2026-11-07T15:57:23.348Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b5e7120d-bfa0-4c56-8658-0ee026a2584e', NULL, 'NA-194 / A-1174', 'Air Filter', 'SAKURA', 0, 3600, 0, '', 'Cash', '2026-11-07T15:57:23.349Z', '2026-11-07T15:57:23.349Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b9a01c27-7cba-47b8-a9cb-19986f2259e1', NULL, 'NA-1943 / A-1943', 'Air Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:57:23.503Z', '2026-11-07T15:57:23.503Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a62fe14c-4a74-4363-bef6-06ca0d2e7c98', NULL, 'NA-1952 / A-1952', 'Air Filter', 'SAKURA', 0, 4990, 0, '', 'Cash', '2026-11-07T15:57:23.431Z', '2026-11-07T15:57:23.431Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7b7f8027-93d0-48fa-9c7b-316a92978c74', NULL, 'NA-196 / A-1181', 'Air Filter', 'SAKURA', 0, 2110, 0, '', 'Cash', '2026-11-07T15:57:23.350Z', '2026-11-07T15:57:23.350Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a43081e5-291a-4022-a7c8-d2a667bad86e', NULL, 'NA-197 / A-1178', 'Air Filter', 'SAKURA', 0, 2110, 0, '', 'Cash', '2026-11-07T15:57:23.351Z', '2026-11-07T15:57:23.351Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d1aafe43-460a-47fd-aa7d-55a368c5c5cf', NULL, 'NA-199 / A-1189', 'Air Filter', 'SAKURA', 0, 1950, 0, '', 'Cash', '2026-11-07T15:57:23.352Z', '2026-11-07T15:57:23.352Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('84843936-e07c-443f-98d0-f2544a7f8c2a', NULL, 'NA-2002V / A-1834', 'Air Filter', 'SAKURA', 0, 4210, 0, '', 'Cash', '2026-11-07T15:57:23.432Z', '2026-11-07T15:57:23.432Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('65f14c3a-f0b6-48b6-87ed-6b8a8e57c8e7', NULL, 'NA-2003V / A-1833', 'Air Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:57:23.433Z', '2026-11-07T15:57:23.433Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1c8fc747-a9a0-4f09-b06c-3a5ad101db6a', NULL, 'NA-2004 / A-6127', 'Air Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:57:23.353Z', '2026-11-07T15:57:23.353Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('88f538f5-ad81-44d3-beb6-23845a7da623', NULL, 'NA-2005 / A-1857', 'Air Filter', 'SAKURA', 0, 1950, 0, '', 'Cash', '2026-11-07T15:57:23.435Z', '2026-11-07T15:57:23.435Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2e1ed254-5710-48e6-b492-86f97c8484e9', NULL, 'NA-2006V / A-8548', 'Air Filter', 'SAKURA', 0, 3240, 0, '', 'Cash', '2026-11-07T15:57:23.437Z', '2026-11-07T15:57:23.437Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c510f55e-3f2a-4623-a5df-d8280930554b', NULL, 'NA-2008V / A-1861', 'Air Filter', 'SAKURA', 0, 4460, 0, '', 'Cash', '2026-11-07T15:57:23.438Z', '2026-11-07T15:57:23.438Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e2dc0172-a85e-498c-844a-31d0a547834d', NULL, 'NA-2011 / A-1878', 'Air Filter', 'SAKURA', 0, 2520, 0, '', 'Cash', '2026-11-07T15:57:23.440Z', '2026-11-07T15:57:23.440Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9aaf10cd-d809-41b9-b149-282b3154eef4', NULL, 'NA-2018V / A-61370', 'Air Filter', 'SAKURA', 0, 2950, 0, '', 'Cash', '2026-11-07T15:57:23.441Z', '2026-11-07T15:57:23.441Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8bc94fe5-316c-4c78-99d1-769f4fcc70ec', NULL, 'NA-2020 / A-18960', 'Air Filter', 'SAKURA', 0, 5230, 0, '', 'Cash', '2026-11-07T15:57:23.442Z', '2026-11-07T15:57:23.442Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('674c797a-fe24-4e32-9889-225733ffc3ae', NULL, 'NA-2023 / A-61480', 'Air Filter', 'SAKURA', 0, 2150, 0, '', 'Cash', '2026-11-07T15:57:23.443Z', '2026-11-07T15:57:23.443Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('19dc957c-c4b7-4b0a-a724-0ee29b16f1c8', NULL, 'NA-206A / A-1501', 'Air Filter', 'SAKURA', 0, 2295, 0, '', 'Cash', '2026-11-07T15:57:23.444Z', '2026-11-07T15:57:23.444Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5977c857-94d1-48bc-a6ee-66ab31d025d4', NULL, 'NA-215V / A-1801', 'Air Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:57:23.445Z', '2026-11-07T15:57:23.445Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a654e082-fc45-4a9a-b0d0-446413ab9e12', NULL, 'NA-226V / A-1812', 'Air Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:57:23.446Z', '2026-11-07T15:57:23.446Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('15a3f187-ee7f-496a-8319-d568cc3f4e7c', NULL, 'NA-243V / A-1818', 'Air Filter', 'SAKURA', 0, 1860, 0, '', 'Cash', '2026-11-07T15:57:23.447Z', '2026-11-07T15:57:23.447Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d1bbb764-5658-4a7e-982d-5f37d99bbbff', NULL, 'NA-275V / A-1821', 'Air Filter', 'SAKURA', 0, 4460, 0, '', 'Cash', '2026-11-07T15:57:23.448Z', '2026-11-07T15:57:23.448Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cea3c04c-5f1d-4960-b0f1-9efb515ca460', NULL, 'NA-276V / A-5539', 'Air Filter', 'SAKURA', 0, 12860, 0, '', 'Cash', '2026-11-07T15:57:23.449Z', '2026-11-07T15:57:23.449Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('33e49665-1352-4ab9-88b8-9c62b37b8b84', NULL, 'NA-277V / A-6123', 'Air Filter', 'SAKURA', 0, 14775, 0, '', 'Cash', '2026-11-07T15:57:23.450Z', '2026-11-07T15:57:23.450Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('99375cbf-b43e-481d-aab9-c8a0388698e6', NULL, 'NA-278 / A-6114', 'Air Filter', 'SAKURA', 0, 8835, 0, '', 'Cash', '2026-11-07T15:57:23.451Z', '2026-11-07T15:57:23.451Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d4e8acf7-db01-452b-9753-1136f9b959fb', NULL, 'NA-2815 / A-2815', 'Air Filter', 'SAKURA', 0, 2150, 0, '', 'Cash', '2026-11-07T15:57:23.600Z', '2026-11-07T15:57:23.600Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3417e067-c598-4a8e-b379-2ca579411bc5', NULL, 'NA-2816 / A-2816', 'Air Filter', 'SAKURA', 0, 2470, 0, '', 'Cash', '2026-11-07T15:57:23.601Z', '2026-11-07T15:57:23.601Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('54f46603-eb34-4b1e-ad96-2cc6c2697dfb', NULL, 'NA-2820 / A-2820', 'Air Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:57:23.603Z', '2026-11-07T15:57:23.603Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bef9fb4f-43c8-4d5c-9839-51b9812c430d', NULL, 'NA-28590 / A-28590', 'Air Filter', 'SAKURA', 0, 3655, 0, '', 'Cash', '2026-11-07T15:57:23.604Z', '2026-11-07T15:57:23.604Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bbf204ac-67f9-420b-9b84-218d1390952a', NULL, 'NA-28610 / A-28610', 'Air Filter', 'SAKURA', 0, 3340, 0, '', 'Cash', '2026-11-07T15:57:23.604Z', '2026-11-07T15:57:23.604Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a1815e4a-44c5-4670-8be4-01919a240a08', NULL, 'NA-288N / A-1877M', 'Air Filter', 'SAKURA', 0, 9205, 0, '', 'Cash', '2026-11-07T15:57:23.452Z', '2026-11-07T15:57:23.452Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b32955f1-0e43-479e-9928-c334cfa52727', NULL, 'NA-2929 / A-2929', 'Air Filter', 'SAKURA', 0, 4460, 0, '', 'Cash', '2026-11-07T15:57:23.605Z', '2026-11-07T15:57:23.605Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('13d602a6-28db-4212-a7bb-784ddd7b9d65', NULL, 'NA-3002 / A-1039', 'Air Filter', 'SAKURA', 0, 5690, 0, '', 'Cash', '2026-11-07T15:57:23.378Z', '2026-11-07T15:57:23.378Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ae37964c-8d2a-456a-8d5b-7602bdb5c095', NULL, 'NA-3002A / A-1067', 'Air Filter', 'SAKURA', 0, 6655, 0, '', 'Cash', '2026-11-07T15:57:23.379Z', '2026-11-07T15:57:23.379Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('918cd4a0-3910-4555-b289-988065f33a0b', NULL, 'NA-3002V / A-1084', 'Air Filter', 'SAKURA', 0, 5015, 0, '', 'Cash', '2026-11-07T15:57:23.381Z', '2026-11-07T15:57:23.381Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('af80d224-9dc0-4a71-8d2f-d655e64f31ab', NULL, 'NA-3003 / A-1088', 'Air Filter', 'SAKURA', 0, 6930, 0, '', 'Cash', '2026-11-07T15:57:23.382Z', '2026-11-07T15:57:23.382Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('859b0d72-bf04-45d9-9233-ce4da9780585', NULL, 'NA-3003A / A-1093', 'Air Filter', 'SAKURA', 0, 12045, 0, '', 'Cash', '2026-11-07T15:57:23.383Z', '2026-11-07T15:57:23.383Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('529a7f79-db45-4e49-b51d-b96f90674f43', NULL, 'NA-3003B / A-1050', 'Air Filter', 'SAKURA', 0, 10290, 0, '', 'Cash', '2026-11-07T15:57:23.385Z', '2026-11-07T15:57:23.385Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('00b14e17-686c-4fb5-b58e-a766960dcebe', NULL, 'NA-3004 / A-38580', 'Air Filter', 'SAKURA', 0, 2950, 0, '', 'Cash', '2026-11-07T15:57:23.372Z', '2026-11-07T15:57:23.372Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4991f3aa-2537-4ee2-9737-fda45d98ffd0', NULL, 'NA-3006 / A-1061', 'Air Filter', 'SAKURA', 0, 4265, 0, '', 'Cash', '2026-11-07T15:57:23.386Z', '2026-11-07T15:57:23.386Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('beb2ba67-460c-476e-a9a3-c450967c3d3b', NULL, 'NA-3009 / A-1070', 'Air Filter', 'SAKURA', 0, 11890, 0, '', 'Cash', '2026-11-07T15:57:23.387Z', '2026-11-07T15:57:23.387Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('52c23760-2e7e-4f33-b527-39d0d07fcade', NULL, 'NA-3011 / A-1092', 'Air Filter', 'SAKURA', 0, 3315, 0, '', 'Cash', '2026-11-07T15:57:23.388Z', '2026-11-07T15:57:23.388Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('04a2f4d2-3894-42cf-a8b2-ca8a482fca3f', NULL, 'NA-3012 / A-1058', 'Air Filter', 'SAKURA', 0, 3565, 0, '', 'Cash', '2026-11-07T15:57:23.389Z', '2026-11-07T15:57:23.389Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a8f6fa36-fa5e-4002-b505-f30b7571ddd0', NULL, 'NA-3015S / AS-1034', 'Air Filter', 'SAKURA', 0, 3935, 0, '', 'Cash', '2026-11-07T15:57:23.390Z', '2026-11-07T15:57:23.390Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('eeafbce7-afe8-44ff-8741-352cd2f2a121', NULL, 'NA-3017 / A-1068', 'Air Filter', 'SAKURA', 0, 4525, 0, '', 'Cash', '2026-11-07T15:57:23.391Z', '2026-11-07T15:57:23.391Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2a6d921f-3895-4775-9c28-3866c627602b', NULL, 'NA-3020 / A-1077', 'Air Filter', 'SAKURA', 0, 7320, 0, '', 'Cash', '2026-11-07T15:57:23.392Z', '2026-11-07T15:57:23.392Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('20c0a01f-ac28-433a-848a-d2c551a72973', NULL, 'NA-3022 / A-1081', 'Air Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:57:23.393Z', '2026-11-07T15:57:23.393Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3f7759bf-2cfc-4237-982b-6defca27986c', NULL, 'NA-3025 / A-58300', 'Air Filter', 'SAKURA', 0, 2250, 0, '', 'Cash', '2026-11-07T15:57:23.394Z', '2026-11-07T15:57:23.394Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f6793925-386b-42b0-a604-40c884b08964', NULL, 'NA-3027 / A-58380', 'Air Filter', 'SAKURA', 0, 3665, 0, '', 'Cash', '2026-11-07T15:57:23.395Z', '2026-11-07T15:57:23.395Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4e2e3cb1-cf71-419e-bd21-b0f9ef59472a', NULL, 'NA-3028 / A-58480', 'Air Filter', 'SAKURA', 0, 3545, 0, '', 'Cash', '2026-11-07T15:57:23.397Z', '2026-11-07T15:57:23.397Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ab2aa02a-749b-458b-b3b7-b10f1d850519', NULL, 'NA-303 / A-1004', 'Air Filter', 'SAKURA', 0, 2775, 0, '', 'Cash', '2026-11-07T15:57:23.398Z', '2026-11-07T15:57:23.398Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5ca46c52-2575-49bb-85d7-b3b7f516eaf3', NULL, 'NA-310 / A-1064', 'Air Filter', 'SAKURA', 0, 4340, 0, '', 'Cash', '2026-11-07T15:57:23.399Z', '2026-11-07T15:57:23.399Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('58778ac8-d727-4cd5-b859-e3b6f4cb39ba', NULL, 'NA-320 / A-1007', 'Air Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:57:23.400Z', '2026-11-07T15:57:23.400Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('27fdf52c-3cb1-4536-8031-1350dee8f384', NULL, 'NA-327 / A-1003', 'Air Filter', 'SAKURA', 0, 2785, 0, '', 'Cash', '2026-11-07T15:57:23.401Z', '2026-11-07T15:57:23.401Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a5a2af0f-f794-46ed-9fa3-b23ce1b3b800', NULL, 'NA-328 / A-1032', 'Air Filter', 'SAKURA', 0, 4795, 0, '', 'Cash', '2026-11-07T15:57:23.403Z', '2026-11-07T15:57:23.403Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b3cf0e07-3e70-4e18-8a96-85b201b99907', NULL, 'NA-330 / A-1008', 'Air Filter', 'SAKURA', 0, 3695, 0, '', 'Cash', '2026-11-07T15:57:23.404Z', '2026-11-07T15:57:23.404Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('43e02cc8-bd4f-447d-a75b-db711890f3fa', NULL, 'NA-331 / A-1015', 'Air Filter', 'SAKURA', 0, 3100, 0, '', 'Cash', '2026-11-07T15:57:23.405Z', '2026-11-07T15:57:23.405Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7a200bb0-7c15-48e4-b612-30f0fbb7255a', NULL, 'NA-334S / AS-1014', 'Air Filter', 'SAKURA', 0, 4135, 0, '', 'Cash', '2026-11-07T15:57:23.407Z', '2026-11-07T15:57:23.407Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bbddc27b-a8d6-4e72-aadc-20f4012dda69', NULL, 'NA-343 / A-1022', 'Air Filter', 'SAKURA', 0, 3370, 0, '', 'Cash', '2026-11-07T15:57:23.408Z', '2026-11-07T15:57:23.408Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('31055ff6-93d4-47fe-a101-810b80543215', NULL, 'NA-344 / A-1016', 'Air Filter', 'SAKURA', 0, 3545, 0, '', 'Cash', '2026-11-07T15:57:23.409Z', '2026-11-07T15:57:23.409Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('db775af9-93d0-4b68-9465-59eabc8943ae', NULL, 'NA-347 / A-1043', 'Air Filter', 'SAKURA', 0, 2110, 0, '', 'Cash', '2026-11-07T15:57:23.410Z', '2026-11-07T15:57:23.410Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c6fa722f-2711-4f13-a769-a2619dc7b364', NULL, 'NA-348 / A-1079', 'Air Filter', 'SAKURA', 0, 2110, 0, '', 'Cash', '2026-11-07T15:57:23.411Z', '2026-11-07T15:57:23.411Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0e84c285-29b0-44ad-aecc-83f0c0a2651d', NULL, 'NA-349 / A-1045', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.412Z', '2026-11-07T15:57:23.412Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('492a61f9-c863-4b6c-9002-3ddfc13b75d8', NULL, 'NA-350 / A-1009', 'Air Filter', 'SAKURA', 0, 6600, 0, '', 'Cash', '2026-11-07T15:57:23.413Z', '2026-11-07T15:57:23.413Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ca17f4e7-ceb1-403a-8f3c-f6aba7358bdc', NULL, 'NA-352S / AS-1010', 'Air Filter', 'SAKURA', 0, 10185, 0, '', 'Cash', '2026-11-07T15:57:23.414Z', '2026-11-07T15:57:23.414Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2909be8f-0c9e-499f-995a-15bd66e7b3cd', NULL, 'NA-353S / AS-1024', 'Air Filter', 'SAKURA', 0, 13260, 0, '', 'Cash', '2026-11-07T15:57:23.415Z', '2026-11-07T15:57:23.415Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5b9ddaa0-1de9-4551-a840-84f97b208d03', NULL, 'NA-358S / AS-5707', 'Air Filter', 'SAKURA', 0, 15430, 0, '', 'Cash', '2026-11-07T15:57:23.416Z', '2026-11-07T15:57:23.416Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4aa8f883-67b1-44f9-a323-6155fe41cdd8', NULL, 'NA-361 / A-1013', 'Air Filter', 'SAKURA', 0, 17160, 0, '', 'Cash', '2026-11-07T15:57:23.417Z', '2026-11-07T15:57:23.417Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b418cc73-b168-4387-b5c2-0b4fdc351a4e', NULL, 'NA-363 / A-5639', 'Air Filter', 'SAKURA', 0, 15430, 0, '', 'Cash', '2026-11-07T15:57:23.418Z', '2026-11-07T15:57:23.418Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4646db62-a39b-49dc-9f63-df9cebebfe9c', NULL, 'NA-364 / A-1019', 'Air Filter', 'SAKURA', 0, 10500, 0, '', 'Cash', '2026-11-07T15:57:23.419Z', '2026-11-07T15:57:23.419Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fcc09e79-90e9-421e-86ab-c0b8d470172b', NULL, 'NA-370 / A-5801', 'Air Filter', 'SAKURA', 0, 14775, 0, '', 'Cash', '2026-11-07T15:57:23.420Z', '2026-11-07T15:57:23.420Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5aad51ac-c144-4b14-a5a0-c52ab56516b6', NULL, 'NA-371 / A-5803M', 'Air Filter', 'SAKURA', 0, 17985, 0, '', 'Cash', '2026-11-07T15:57:23.421Z', '2026-11-07T15:57:23.421Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('19c7ad36-3d65-47bb-bdd3-6b55231d92ec', NULL, 'NA-404 / A-1702', 'Air Filter', 'SAKURA', 0, 2750, 0, '', 'Cash', '2026-11-07T15:57:23.504Z', '2026-11-07T15:57:23.504Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0f2b6f2f-a3cc-47ba-a419-6e9e2c7b5e22', NULL, 'NA-413S / AS-5628', 'Air Filter', 'SAKURA', 0, 6245, 0, '', 'Cash', '2026-11-07T15:57:23.479Z', '2026-11-07T15:57:23.479Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ce657bbc-3c7d-4937-bbac-4114c1d3ef75', NULL, 'NA-422 / A-1714', 'Air Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:57:23.506Z', '2026-11-07T15:57:23.506Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6d0b9d9b-fe1b-45f9-ac8d-25d8c287b617', NULL, 'NA-423V / A-1703', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.508Z', '2026-11-07T15:57:23.508Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('18921408-bf6b-4ce5-b579-eaad4e89740c', NULL, 'NA-427S / AS-1031', 'Air Filter', 'SAKURA', 0, 7095, 0, '', 'Cash', '2026-11-07T15:57:23.422Z', '2026-11-07T15:57:23.422Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9754ab27-dc15-4ba7-ba8d-dd2bed610125', NULL, 'NA-428V / A-1728', 'Air Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:57:23.509Z', '2026-11-07T15:57:23.509Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('135d309a-ef99-4040-bd59-afbce6f235e6', NULL, 'NA-435S / AS-1708', 'Air Filter', 'SAKURA', 0, 3885, 0, '', 'Cash', '2026-11-07T15:57:23.511Z', '2026-11-07T15:57:23.511Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('229d722d-4430-4bd2-8fba-8c3153362218', NULL, 'NA-439V / A-1722', 'Air Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:57:23.512Z', '2026-11-07T15:57:23.512Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9b90fb46-18ed-470c-9b42-732d54863763', NULL, 'NA-444 / A-1711', 'Air Filter', 'SAKURA', 0, 8245, 0, '', 'Cash', '2026-11-07T15:57:23.515Z', '2026-11-07T15:57:23.515Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('949595db-9a92-4d8a-ab0c-080df567d44a', NULL, 'NA-451V / A-1709', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.516Z', '2026-11-07T15:57:23.516Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a974e1b3-1a2c-49c1-a21a-547c3bce9152', NULL, 'NA-453S / AS-1712', 'Air Filter', 'SAKURA', 0, 4265, 0, '', 'Cash', '2026-11-07T15:57:23.517Z', '2026-11-07T15:57:23.517Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f98abfb2-9b16-432c-adf3-c4a43e531496', NULL, 'NA-457V / A-1734', 'Air Filter', 'SAKURA', 0, 2905, 0, '', 'Cash', '2026-11-07T15:57:23.519Z', '2026-11-07T15:57:23.519Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2b94ac0d-27a6-40c6-b18f-9fdc14a12465', NULL, 'NA-457VB / A-1776', 'Air Filter', 'SAKURA', 0, 2280, 0, '', 'Cash', '2026-11-07T15:57:23.520Z', '2026-11-07T15:57:23.520Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('144d1769-9127-49f7-85f9-446cdbb10a00', NULL, 'NA-462V / A-1725', 'Air Filter', 'SAKURA', 0, 2905, 0, '', 'Cash', '2026-11-07T15:57:23.521Z', '2026-11-07T15:57:23.521Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f09ce113-e5ed-4fc9-a7aa-d545206ebb78', NULL, 'NA-464 / A-1875', 'Air Filter', 'SAKURA', 0, 4315, 0, '', 'Cash', '2026-11-07T15:57:23.522Z', '2026-11-07T15:57:23.522Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('63d014c7-8223-4719-be02-d545d6280519', NULL, 'NA-465S / AS-1761', 'Air Filter', 'SAKURA', 0, 5045, 0, '', 'Cash', '2026-11-07T15:57:23.523Z', '2026-11-07T15:57:23.523Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2ddfd0c3-7f66-4ad3-a7f6-467eb732b480', NULL, 'NA-471 / A-1724', 'Air Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:57:23.524Z', '2026-11-07T15:57:23.524Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('99960ec0-0c66-4a16-b29f-90b3fcd785f7', NULL, 'NA-472 / A-1762', 'Air Filter', 'SAKURA', 0, 2185, 0, '', 'Cash', '2026-11-07T15:57:23.525Z', '2026-11-07T15:57:23.525Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1bb6fcb5-8a72-489f-b50c-8e3b64780047', NULL, 'NA-475V / A-1742', 'Air Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:57:23.526Z', '2026-11-07T15:57:23.526Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7971575a-6eb2-4603-a78f-e7f584b87f88', NULL, 'NA-478 / A-17200', 'Air Filter', 'SAKURA', 0, 1650, 0, '', 'Cash', '2026-11-07T15:57:23.527Z', '2026-11-07T15:57:23.527Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('97746e70-facd-4a65-8596-4fdc11f1114a', NULL, 'NA-481 / A-17990', 'Air Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:57:23.528Z', '2026-11-07T15:57:23.528Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8882918a-cccf-424d-b216-b22c18f2cd61', NULL, 'NA-482 / A-17860', 'Air Filter', 'SAKURA', 0, 6245, 0, '', 'Cash', '2026-11-07T15:57:23.529Z', '2026-11-07T15:57:23.529Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('70c7f562-d13f-4843-884d-75b2d6088b18', NULL, 'NA-4923 / A-4923', 'Air Filter', 'SAKURA', 0, 2510, 0, '', 'Cash', '2026-11-07T15:57:23.622Z', '2026-11-07T15:57:23.622Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('32bb1ae0-473e-4d5e-8a75-fcb93644f673', NULL, 'NA-503 / A-1502', 'Air Filter', 'SAKURA', 0, 3720, 0, '', 'Cash', '2026-11-07T15:57:23.480Z', '2026-11-07T15:57:23.480Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5136045d-2bc8-462c-b7f8-79ca2a50b0e8', NULL, 'NA-504 / A-6013', 'Air Filter', 'SAKURA', 0, 6210, 0, '', 'Cash', '2026-11-07T15:57:23.481Z', '2026-11-07T15:57:23.481Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('23944737-74f7-4810-beaa-78113f09655f', NULL, 'NA-508 / A-6001', 'Air Filter', 'SAKURA', 0, 3600, 0, '', 'Cash', '2026-11-07T15:57:23.482Z', '2026-11-07T15:57:23.482Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8c2bf6cf-01b0-4813-ab6a-ecb1c2c6d32c', NULL, 'NA-509 / A-1505', 'Air Filter', 'SAKURA', 0, 4265, 0, '', 'Cash', '2026-11-07T15:57:23.484Z', '2026-11-07T15:57:23.484Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f57b52f0-5920-4d96-90f0-bf3b2cb002f0', NULL, 'NA-510V / A-1504', 'Air Filter', 'SAKURA', 0, 4860, 0, '', 'Cash', '2026-11-07T15:57:23.485Z', '2026-11-07T15:57:23.485Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5150e51a-cf52-4a2d-bee0-5882481a6245', NULL, 'NA-519 / A-1510', 'Air Filter', 'SAKURA', 0, 5490, 0, '', 'Cash', '2026-11-07T15:57:23.486Z', '2026-11-07T15:57:23.486Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4387937a-ddd3-432b-be67-b757db5f78cd', NULL, 'NA-520V / A-1508', 'Air Filter', 'SAKURA', 0, 3340, 0, '', 'Cash', '2026-11-07T15:57:23.487Z', '2026-11-07T15:57:23.487Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b1d8af4c-e7a8-4c4b-8854-dcfde354ff74', NULL, 'NA-521V / A-1514', 'Air Filter', 'SAKURA', 0, 3935, 0, '', 'Cash', '2026-11-07T15:57:23.488Z', '2026-11-07T15:57:23.488Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4d46939a-1128-4322-a72b-1d7f6b7b9674', NULL, 'NA-522V / A-1516', 'Air Filter', 'SAKURA', 0, 6710, 0, '', 'Cash', '2026-11-07T15:57:23.489Z', '2026-11-07T15:57:23.489Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('035bd7fd-e49b-45c3-9417-ec477a91a4e3', NULL, 'NA-524V / A-6017', 'Air Filter', 'SAKURA', 0, 3340, 0, '', 'Cash', '2026-11-07T15:57:23.490Z', '2026-11-07T15:57:23.490Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('783c0ae1-655b-4383-b56b-35459f674241', NULL, 'NA-525V / A-1515', 'Air Filter', 'SAKURA', 0, 2650, 0, '', 'Cash', '2026-11-07T15:57:23.491Z', '2026-11-07T15:57:23.491Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('00bba307-7a29-47fc-9fe7-5f4c3bfc0e5a', NULL, 'NA-527 / A-1521', 'Air Filter', 'SAKURA', 0, 3620, 0, '', 'Cash', '2026-11-07T15:57:23.493Z', '2026-11-07T15:57:23.493Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('32c3e363-bd20-4c27-84f7-0d808f7c225c', NULL, 'NA-563 / A-6006', 'Air Filter', 'SAKURA', 0, 12035, 0, '', 'Cash', '2026-11-07T15:57:23.494Z', '2026-11-07T15:57:23.494Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('909183be-a742-4ff7-81f2-abde8d58ebb5', NULL, 'NA-563B / A-6007', 'Air Filter', 'SAKURA', 0, 6190, 0, '', 'Cash', '2026-11-07T15:57:23.495Z', '2026-11-07T15:57:23.495Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6343da85-25bd-49ae-bafc-cdb20f9a47ef', NULL, 'NA-564 / A-2210', 'Air Filter', 'SAKURA', 0, 10955, 0, '', 'Cash', '2026-11-07T15:57:23.496Z', '2026-11-07T15:57:23.496Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7e737b27-2cf9-4f5f-9223-45d1705ef4c2', NULL, 'NA-566 / A-1828', 'Air Filter', 'SAKURA', 0, 20545, 0, '', 'Cash', '2026-11-07T15:57:23.497Z', '2026-11-07T15:57:23.497Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('39b8ad4c-72b8-4d90-b1a9-fb90588fcf28', NULL, 'NA-568 / A-1013', 'Air Filter', 'SAKURA', 0, 17160, 0, '', 'Cash', '2026-11-07T15:57:23.476Z', '2026-11-07T15:57:23.476Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0bf40e30-245f-47a6-b60e-08dcdc7ee3fd', NULL, 'NA-569 / A-5631', 'Air Filter', 'SAKURA', 0, 6115, 0, '', 'Cash', '2026-11-07T15:57:23.478Z', '2026-11-07T15:57:23.478Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('845a5177-0132-4765-b283-6a0fb28d1619', NULL, 'NA-576 / A-6012', 'Air Filter', 'SAKURA', 0, 5930, 0, '', 'Cash', '2026-11-07T15:57:23.498Z', '2026-11-07T15:57:23.498Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('befa651f-3fe9-4a5e-a5be-2ca8dc0e0ae1', NULL, 'NA-578-S / A-6014-S', 'Air Filter', 'SAKURA', 0, 25220, 0, '', 'Cash', '2026-11-07T15:57:23.499Z', '2026-11-07T15:57:23.499Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('83aa013b-3cdb-4915-88ca-310fea1a3acf', NULL, 'NA-578V / A-6014', 'Air Filter', 'SAKURA', 0, 19400, 0, '', 'Cash', '2026-11-07T15:57:23.500Z', '2026-11-07T15:57:23.500Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f4eda19b-56b5-4f86-90c3-64117ceb2b88', NULL, 'NA-579 / A-6020M', 'Air Filter', 'SAKURA', 0, 13260, 0, '', 'Cash', '2026-11-07T15:57:23.501Z', '2026-11-07T15:57:23.501Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5184b715-4660-44be-aea6-39c967270b04', NULL, 'NA-611 / A-1308', 'Air Filter', 'SAKURA', 0, 8575, 0, '', 'Cash', '2026-11-07T15:57:23.571Z', '2026-11-07T15:57:23.571Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bac6db1f-9fe7-43e1-804c-d37823617006', NULL, 'NA-621 / A-1327', 'Air Filter', 'SAKURA', 0, 10675, 0, '', 'Cash', '2026-11-07T15:57:23.572Z', '2026-11-07T15:57:23.572Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('20eb379d-5303-4c32-86fd-f6fa12316f94', NULL, 'NA-622 / A-1324', 'Air Filter', 'SAKURA', 0, 8825, 0, '', 'Cash', '2026-11-07T15:57:23.573Z', '2026-11-07T15:57:23.573Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('083497c1-af29-449a-9ab9-93b7b4a11ef0', NULL, 'NA-714 / A-1206', 'Air Filter', 'SAKURA', 0, 2915, 0, '', 'Cash', '2026-11-07T15:57:23.355Z', '2026-11-07T15:57:23.355Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8269016f-f9c9-4772-b571-ff5e84bcdd9e', NULL, 'NA-718 / A-1222', 'Air Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:57:23.356Z', '2026-11-07T15:57:23.356Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d89391df-4712-43b2-9e9a-e7b3c7deed15', NULL, 'NA-728 / A-1228', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.364Z', '2026-11-07T15:57:23.364Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e661c9f1-b8cd-43d1-b6f1-860b15296518', NULL, 'NA-737 / A-1191', 'Air Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:57:23.358Z', '2026-11-07T15:57:23.358Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c15fbee0-559b-40c8-aff5-e2e6a42c0b9f', NULL, 'NA-740 / A-1219', 'Air Filter', 'SAKURA', 0, 2055, 0, '', 'Cash', '2026-11-07T15:57:23.359Z', '2026-11-07T15:57:23.359Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2bdeeb14-396d-4b08-9adc-956f0e972b71', NULL, 'NA-741 / A-1223', 'Air Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:57:23.361Z', '2026-11-07T15:57:23.361Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b15b6769-9e63-4c6f-adfd-4a8f1b8c5c85', NULL, 'NA-744 / A-12252', 'Air Filter', 'SAKURA', 0, 2315, 0, '', 'Cash', '2026-11-07T15:57:23.363Z', '2026-11-07T15:57:23.363Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f6c4978a-c722-4ade-a9cf-54ff27cb2dd7', NULL, 'NA-758 / A-12340', 'Air Filter', 'SAKURA', 0, 2350, 0, '', 'Cash', '2026-11-07T15:57:23.354Z', '2026-11-07T15:57:23.354Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5f367812-019e-491e-a3d5-a57c278277d7', NULL, 'NA-8013V / A-90210', 'Air Filter', 'SAKURA', 0, 2960, 0, '', 'Cash', '2026-11-07T15:57:23.463Z', '2026-11-07T15:57:23.463Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('07082a3e-618d-416d-b56a-eb9929575928', NULL, 'NA-8015 / A-16040', 'Air Filter', 'SAKURA', 0, 2450, 0, '', 'Cash', '2026-11-07T15:57:23.465Z', '2026-11-07T15:57:23.465Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('131817d8-6dac-4760-b6a4-3d43b42f637a', NULL, 'NA-819V / A-1610', 'Air Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:57:23.461Z', '2026-11-07T15:57:23.461Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('759417dd-748a-4f93-9872-557a5cbf0492', NULL, 'NA-852 / A-1621', 'Air Filter', 'SAKURA', 0, 2600, 0, '', 'Cash', '2026-11-07T15:57:23.462Z', '2026-11-07T15:57:23.462Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f9908030-dd88-4748-b0fc-d0e8f8a48633', NULL, 'NA-870V / A-1641', 'Air Filter', 'SAKURA', 0, 2815, 0, '', 'Cash', '2026-11-07T15:57:23.466Z', '2026-11-07T15:57:23.466Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7bbf5649-b838-475f-ad2d-dcdcf49df4cf', NULL, 'NA-880V / A-1651', 'Air Filter', 'SAKURA', 0, 2085, 0, '', 'Cash', '2026-11-07T15:57:23.467Z', '2026-11-07T15:57:23.467Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9dfc3459-ad9f-4dc0-b24f-f35e6acc7c06', NULL, 'NA-884V / A-1661', 'Air Filter', 'SAKURA', 0, 2250, 0, '', 'Cash', '2026-11-07T15:57:23.468Z', '2026-11-07T15:57:23.468Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('80299fbb-09fe-4e80-b055-e9b1911df216', NULL, 'NA-886V / A-1665', 'Air Filter', 'SAKURA', 0, 2350, 0, '', 'Cash', '2026-11-07T15:57:23.469Z', '2026-11-07T15:57:23.469Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f3038628-1774-4a85-8098-11b38435910c', NULL, 'NA-889V / A-16800', 'Air Filter', 'SAKURA', 0, 4750, 0, '', 'Cash', '2026-11-07T15:57:23.470Z', '2026-11-07T15:57:23.470Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('57004801-2983-4acc-a7bd-00bc1f10337c', NULL, 'NA-892V / A-16930', 'Air Filter', 'SAKURA', 0, 2520, 0, '', 'Cash', '2026-11-07T15:57:23.471Z', '2026-11-07T15:57:23.471Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ded61350-fbb5-41e8-9514-5e143702cf0e', NULL, 'NA-895 / A-1671', 'Air Filter', 'SAKURA', 0, 1550, 0, '', 'Cash', '2026-11-07T15:57:23.472Z', '2026-11-07T15:57:23.472Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2ec6fb1c-3ca9-47c7-96c1-19bf45e55a39', NULL, 'NA-898V / A-90170', 'Air Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:57:23.473Z', '2026-11-07T15:57:23.473Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a6f9eec1-0a9f-44bd-a0ab-3c36cef5283b', NULL, 'NA-923 / A-1850', 'Air Filter', 'SAKURA', 0, 1950, 0, '', 'Cash', '2026-11-07T15:57:23.574Z', '2026-11-07T15:57:23.574Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f8580929-a96a-4bd5-b1b8-06c7a8306833', NULL, 'NA-926 / A-1876', 'Air Filter', 'SAKURA', 0, 1650, 0, '', 'Cash', '2026-11-07T15:57:23.575Z', '2026-11-07T15:57:23.575Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2283ce78-84d0-4a21-a2b3-26a470f2aaa0', NULL, 'NA-941 / A-1405', 'Air Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:57:23.545Z', '2026-11-07T15:57:23.545Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('625434f8-2774-44c0-a8d3-bb2e82de4018', NULL, 'NA-945A / A-14430', 'Air Filter', 'SAKURA', 0, 3610, 0, '', 'Cash', '2026-11-07T15:57:23.546Z', '2026-11-07T15:57:23.546Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e65b5e92-11e5-4ec7-8259-91ebd82902b9', NULL, 'NA-946 / A-1411', 'Air Filter', 'SAKURA', 0, 1565, 0, '', 'Cash', '2026-11-07T15:57:23.548Z', '2026-11-07T15:57:23.548Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d55aae4a-da49-4f33-8767-fd9d02b4eef0', NULL, 'NA-955 / A-1401', 'Air Filter', 'SAKURA', 0, 1685, 0, '', 'Cash', '2026-11-07T15:57:23.549Z', '2026-11-07T15:57:23.549Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4ec34090-7a30-46ff-bb1b-4736621977d6', NULL, 'NA-956 / A-1416', 'Air Filter', 'SAKURA', 0, 3950, 0, '', 'Cash', '2026-11-07T15:57:23.551Z', '2026-11-07T15:57:23.551Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ccf1a278-db94-49eb-9109-5ec4699b5593', NULL, 'NA-957 / A-1414', 'Air Filter', 'SAKURA', 0, 2730, 0, '', 'Cash', '2026-11-07T15:57:23.552Z', '2026-11-07T15:57:23.552Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('63263330-35ab-4873-9734-c29e43699ec4', NULL, 'NA-959 / A-1419', 'Air Filter', 'SAKURA', 0, 2730, 0, '', 'Cash', '2026-11-07T15:57:23.553Z', '2026-11-07T15:57:23.553Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f9b594cb-501d-4e3a-bbbb-15dd31c28e42', NULL, 'NA-961 / A-1422', 'Air Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:57:23.554Z', '2026-11-07T15:57:23.554Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('917bfb77-7566-4b77-93b2-34ff5013996e', NULL, 'NA-963 / A-1426', 'Air Filter', 'SAKURA', 0, 2490, 0, '', 'Cash', '2026-11-07T15:57:23.555Z', '2026-11-07T15:57:23.555Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ab76cbaa-eefd-4236-bdfd-a2f560b4762c', NULL, 'NA-964 / A-14440', 'Air Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:57:23.556Z', '2026-11-07T15:57:23.556Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('10342261-0001-4549-8ab2-79f3aba0ebe3', NULL, 'NA-965 / A-1420', 'Air Filter', 'SAKURA', 0, 2425, 0, '', 'Cash', '2026-11-07T15:57:23.557Z', '2026-11-07T15:57:23.557Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4b31526c-8b2b-4b4b-b137-ee9341a71d19', NULL, 'NA-967 / A-1425', 'Air Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:57:23.558Z', '2026-11-07T15:57:23.558Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('91a9a57f-2e2f-414c-ae94-1226b5183c32', NULL, 'NA-969 / A-1421', 'Air Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:57:23.559Z', '2026-11-07T15:57:23.559Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('10ae3669-d120-4dcd-b01e-04ebf21f91db', NULL, 'NA-971 / A-1431', 'Air Filter', 'SAKURA', 0, 1975, 0, '', 'Cash', '2026-11-07T15:57:23.560Z', '2026-11-07T15:57:23.560Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('465637e7-38ad-4cd3-837e-ad24bb67928b', NULL, 'NA-974 / A-1433', 'Air Filter', 'SAKURA', 0, 2760, 0, '', 'Cash', '2026-11-07T15:57:23.561Z', '2026-11-07T15:57:23.561Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('289b10fb-1946-41f5-925f-86e4238b261b', NULL, 'NA-976 / A-14550', 'Air Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:57:23.562Z', '2026-11-07T15:57:23.562Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('93bf6f4a-03cb-4935-b7ad-d51037b0e412', NULL, 'NA-978 / A-14460', 'Air Filter', 'SAKURA', 0, 925, 0, '', 'Cash', '2026-11-07T15:57:23.564Z', '2026-11-07T15:57:23.564Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f5b6b30a-dd95-48e5-9152-50e1e2073075', NULL, 'NA-981 / A-14520', 'Air Filter', 'SAKURA', 0, 2950, 0, '', 'Cash', '2026-11-07T15:57:23.565Z', '2026-11-07T15:57:23.565Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5e6a77c2-377e-48c3-a54c-e12552b8c3a7', NULL, 'NA-984 / A-14590', 'Air Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:57:23.566Z', '2026-11-07T15:57:23.566Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('79bea2e6-571f-4736-a493-6aa72a7657a2', NULL, 'NA-985 / A-14620', 'Air Filter', 'SAKURA', 0, 2110, 0, '', 'Cash', '2026-11-07T15:57:23.568Z', '2026-11-07T15:57:23.568Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('82261007-edc3-43f4-af16-d647c42ef444', NULL, 'NA-986 / A-14610', 'Air Filter', 'SAKURA', 0, 3295, 0, '', 'Cash', '2026-11-07T15:57:23.569Z', '2026-11-07T15:57:23.569Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1fef496b-995a-4d24-a434-a9b60a71b159', NULL, 'NAN-210V / A-1858', 'Air Filter', 'SAKURA', 0, 3665, 0, '', 'Cash', '2026-11-07T15:57:23.453Z', '2026-11-07T15:57:23.453Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9c8a1175-e4cd-4032-8fb1-519855a0eb2f', NULL, 'NAN-212SV / AS-1825', 'Air Filter', 'SAKURA', 0, 3700, 0, '', 'Cash', '2026-11-07T15:57:23.454Z', '2026-11-07T15:57:23.454Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f362d5fb-ff7e-4ff5-975c-743539b3b0ed', NULL, 'NAN-216V / A-1836', 'Air Filter', 'SAKURA', 0, 2785, 0, '', 'Cash', '2026-11-07T15:57:23.455Z', '2026-11-07T15:57:23.455Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b6b5ff71-ea04-4fbb-bc2e-bbd53f9e2420', NULL, 'NAN-221 / A-1832', 'Air Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:57:23.456Z', '2026-11-07T15:57:23.456Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cc85d306-9e67-4ac0-9838-cdb1c6de2714', NULL, 'NAN-222V / A-1863', 'Air Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:57:23.457Z', '2026-11-07T15:57:23.457Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4fcbebdc-3304-49e9-8d0d-47e072c46711', NULL, 'NC-010 / C-1915', 'Oil Filter', 'SAKURA', 0, 2280, 0, '', 'Cash', '2026-11-07T15:55:07.587Z', '2026-11-07T15:55:07.587Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9a639e8c-c5cf-453a-8868-1de9b23ca079', NULL, 'NC-101 / C-1121', 'Oil Filter', 'SAKURA', 0, 1620, 0, '', 'Cash', '2026-11-07T15:55:07.464Z', '2026-11-07T15:55:07.464Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f1e9c9ca-a912-410b-85d3-fa1b81701202', NULL, 'NC-102 / C-1101', 'Oil Filter', 'SAKURA', 0, 2000, 0, '', 'Cash', '2026-11-07T15:55:07.471Z', '2026-11-07T15:55:07.471Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('104357cd-dfef-4576-985f-fe5f4a34588f', NULL, 'NC-103 / C-1102', 'Oil Filter', 'SAKURA', 0, 2000, 0, '', 'Cash', '2026-11-07T15:55:07.473Z', '2026-11-07T15:55:07.473Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d590127b-36c7-4f07-9a03-d71fbf10dc8f', NULL, 'NC-106 / C-1105', 'Oil Filter', 'SAKURA', 0, 1890, 0, '', 'Cash', '2026-11-07T15:55:07.475Z', '2026-11-07T15:55:07.475Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('49df80f2-3eed-4816-b62b-f70d11310380', NULL, 'NC-107 / C-1108', 'Oil Filter', 'SAKURA', 0, 5690, 0, '', 'Cash', '2026-11-07T15:55:07.477Z', '2026-11-07T15:55:07.477Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7dc5e8a5-755a-4366-b418-00a4336fee78', NULL, 'NC-109 / C-1302', 'Oil Filter', 'SAKURA', 0, 2970, 0, '', 'Cash', '2026-11-07T15:55:07.478Z', '2026-11-07T15:55:07.478Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f91236d6-0dd4-418e-ae3f-883806eed5d5', NULL, 'NC-110 / C-1139', 'Oil Filter', 'SAKURA', 0, 1240, 0, '', 'Cash', '2026-11-07T15:55:07.480Z', '2026-11-07T15:55:07.480Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b855cf78-4204-40ab-8f4b-7e78d46d5cd7', NULL, 'NC-110 NEW / C-1132', 'Oil Filter', 'SAKURA', 0, 1240, 0, '', 'Cash', '2026-11-07T15:55:07.481Z', '2026-11-07T15:55:07.481Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e77955f7-fc5a-42c9-a9da-f43c328a5881', NULL, 'NC-111 / C-1110', 'Oil Filter', 'SAKURA', 0, 1520, 0, '', 'Cash', '2026-11-07T15:55:07.482Z', '2026-11-07T15:55:07.482Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('27e58a72-8347-4da9-8c60-f0a07174a168', NULL, 'NC-111A / C-1160', 'Oil Filter', 'SAKURA', 0, 1500, 0, '', 'Cash', '2026-11-07T15:55:07.483Z', '2026-11-07T15:55:07.483Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0af405d7-cbc2-4667-bbf3-4bef20fec39a', NULL, 'NC-111V / C-1142', 'Oil Filter', 'SAKURA', 0, 1500, 0, '', 'Cash', '2026-11-07T15:55:07.484Z', '2026-11-07T15:55:07.484Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cd1d862d-37c1-4f23-af43-e45c90b527e5', NULL, 'NC-112 / C-1111', 'Oil Filter', 'SAKURA', 0, 2500, 0, '', 'Cash', '2026-11-07T15:55:07.485Z', '2026-11-07T15:55:07.485Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('41308b5e-2095-4caf-94ff-b8cbbd8a8bdb', NULL, 'NC-113 / C-1113', 'Oil Filter', 'SAKURA', 0, 1295, 0, '', 'Cash', '2026-11-07T15:55:07.487Z', '2026-11-07T15:55:07.487Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9534f6d2-5901-4f09-8e6b-574ba7a5709a', NULL, 'NC-114 / C-1141', 'Oil Filter', 'SAKURA', 0, 1450, 0, '', 'Cash', '2026-11-07T15:55:07.488Z', '2026-11-07T15:55:07.488Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('feed9a0e-f674-42e8-a08b-8341589780de', NULL, 'NC-115 / C-1112', 'Oil Filter', 'SAKURA', 0, 2640, 0, '', 'Cash', '2026-11-07T15:55:07.489Z', '2026-11-07T15:55:07.489Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cd11f26c-cde3-49a7-9dfd-fda692cdb0fa', NULL, 'NC-116 / C-1118', 'Oil Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:55:07.490Z', '2026-11-07T15:55:07.490Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('487a9788-45f1-4177-8bd8-0b76ecefb9f9', NULL, 'NC-118 / C-47030', 'Oil Filter', 'SAKURA', 0, 1400, 0, '', 'Cash', '2026-11-07T15:55:07.492Z', '2026-11-07T15:55:07.492Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c2a7f83f-5241-43fc-8099-090e7435982b', NULL, 'NC-119 / C-1140', 'Oil Filter', 'SAKURA', 0, 1450, 0, '', 'Cash', '2026-11-07T15:55:07.493Z', '2026-11-07T15:55:07.493Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6660a553-0357-48d1-b0ac-f5d817807a92', NULL, 'NC-204 / C-1807', 'Oil Filter', 'SAKURA', 0, 2900, 0, '', 'Cash', '2026-11-07T15:55:07.535Z', '2026-11-07T15:55:07.535Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('569d71e1-ccc5-4773-84d0-d9526b609ae0', NULL, 'NC-205 / C-1806', 'Oil Filter', 'SAKURA', 0, 1860, 0, '', 'Cash', '2026-11-07T15:55:07.538Z', '2026-11-07T15:55:07.538Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('36869066-0e5b-409b-8dce-d14ed25018c2', NULL, 'NC-206 / C-1804', 'Oil Filter', 'SAKURA', 0, 2000, 0, '', 'Cash', '2026-11-07T15:55:07.541Z', '2026-11-07T15:55:07.541Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('11b57ad4-180e-4458-baf7-f92927d8027c', NULL, 'NC-207 / C-1805', 'Oil Filter', 'SAKURA', 0, 1390, 0, '', 'Cash', '2026-11-07T15:55:07.546Z', '2026-11-07T15:55:07.546Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e6e9a748-e740-42a1-80de-88abc57ec738', NULL, 'NC-209 / C-1803', 'Oil Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:55:07.552Z', '2026-11-07T15:55:07.552Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bb0e57a0-a6ef-4f27-84b7-1235f8c98c7c', NULL, 'NC-212 / C-6102', 'Oil Filter', 'SAKURA', 0, 6025, 0, '', 'Cash', '2026-11-07T15:55:07.554Z', '2026-11-07T15:55:07.554Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('53768b38-cc41-4ebb-8a37-e60b17eea676', NULL, 'NC-216 / C-6103', 'Oil Filter', 'SAKURA', 0, 5275, 0, '', 'Cash', '2026-11-07T15:55:07.555Z', '2026-11-07T15:55:07.555Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c7c26d6b-65ba-4039-9c0d-117662a56779', NULL, 'NC-217 / C-6104', 'Oil Filter', 'SAKURA', 0, 5275, 0, '', 'Cash', '2026-11-07T15:55:07.556Z', '2026-11-07T15:55:07.556Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d07459fb-99c2-44b3-a22c-e206265c66b1', NULL, 'NC-218 / C-1814', 'Oil Filter', 'SAKURA', 0, 1475, 0, '', 'Cash', '2026-11-07T15:55:07.557Z', '2026-11-07T15:55:07.557Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e6c3562b-ad6d-45b4-8ae5-ecef97cb47d8', NULL, 'NC-219 / C-6101', 'Oil Filter', 'SAKURA', 0, 3210, 0, '', 'Cash', '2026-11-07T15:55:07.559Z', '2026-11-07T15:55:07.559Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('88958340-8fd4-4ff6-b626-50c5f3c0f8ad', NULL, 'NC-223 / C-6105', 'Oil Filter', 'SAKURA', 0, 7170, 0, '', 'Cash', '2026-11-07T15:55:07.512Z', '2026-11-07T15:55:07.512Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c2601c5a-cd22-406b-855d-ad10174e2cf0', NULL, 'NC-224 / C-1823', 'Oil Filter', 'SAKURA', 0, 1240, 0, '', 'Cash', '2026-11-07T15:55:07.560Z', '2026-11-07T15:55:07.560Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('54dbacae-e61c-4f28-bbeb-e7e1f7e7e3f8', NULL, 'NC-225 / C-1821', 'Oil Filter', 'SAKURA', 0, 1240, 0, '', 'Cash', '2026-11-07T15:55:07.561Z', '2026-11-07T15:55:07.561Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2f3d9d07-a891-475b-b0af-df3ef911dd9d', NULL, 'NC-226 / C-1812', 'Oil Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:55:07.562Z', '2026-11-07T15:55:07.562Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c1aba8ab-5fe8-4690-8c0d-ca544fdcb17c', NULL, 'NC-232 / C-25180', 'Oil Filter', 'SAKURA', 0, 1450, 0, '', 'Cash', '2026-11-07T15:55:07.563Z', '2026-11-07T15:55:07.563Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e468e7d2-e802-4efd-8fd5-a7b2687f12bb', NULL, 'NC-2906 / C-2906', 'Oil Filter', 'SAKURA', 0, 2295, 0, '', 'Cash', '2026-11-07T15:55:07.662Z', '2026-11-07T15:55:07.662Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('20489d9f-6c4f-432c-b4ae-ddeff32f4d45', NULL, 'NC-302 / C-1005', 'Oil Filter', 'SAKURA', 0, 1890, 0, '', 'Cash', '2026-11-07T15:55:07.510Z', '2026-11-07T15:55:07.510Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0893a64f-ba90-4375-9bbc-81e51f75b3d0', NULL, 'NC-303 / C-1003', 'Oil Filter', 'SAKURA', 0, 1890, 0, '', 'Cash', '2026-11-07T15:55:07.511Z', '2026-11-07T15:55:07.511Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ea43e05b-515f-4ce1-989a-7e1d1a347781', NULL, 'NC-304 / C-1002', 'Oil Filter', 'SAKURA', 0, 1280, 0, '', 'Cash', '2026-11-07T15:55:07.509Z', '2026-11-07T15:55:07.509Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3cf41085-43d0-4d92-bb47-989a409cfc28', NULL, 'NC-305 / C-1006', 'Oil Filter', 'SAKURA', 0, 2100, 0, '', 'Cash', '2026-11-07T15:55:07.513Z', '2026-11-07T15:55:07.513Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a468b8ef-84cb-4262-8265-166bb7dba8e8', NULL, 'NC-307 / C-1605', 'Oil Filter', 'SAKURA', 0, 1660, 0, '', 'Cash', '2026-11-07T15:55:07.582Z', '2026-11-07T15:55:07.582Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d15e3ccd-d337-42fe-ad13-dcfcccecb345', NULL, 'NC-310 / C-1012', 'Oil Filter', 'SAKURA', 0, 5080, 0, '', 'Cash', '2026-11-07T15:55:07.514Z', '2026-11-07T15:55:07.514Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5c7b64e0-347f-40d3-a882-18697f8381fd', NULL, 'NC-311 / C-5808', 'Oil Filter', 'SAKURA', 0, 6115, 0, '', 'Cash', '2026-11-07T15:55:07.516Z', '2026-11-07T15:55:07.516Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('224f4028-919d-4426-80b1-1ae87f2e3d38', NULL, 'NC-313 / C-5816', 'Oil Filter', 'SAKURA', 0, 4665, 0, '', 'Cash', '2026-11-07T15:55:07.517Z', '2026-11-07T15:55:07.517Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('49ea8915-6be3-419f-a20d-e97bf454b356', NULL, 'NC-315 / C-5818', 'Oil Filter', 'SAKURA', 0, 6625, 0, '', 'Cash', '2026-11-07T15:55:07.518Z', '2026-11-07T15:55:07.518Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('61514e44-9e68-45e1-ac1c-9e03d1ef2b0c', NULL, 'NC-317 / C-1041', 'Oil Filter', 'SAKURA', 0, 1390, 0, '', 'Cash', '2026-11-07T15:55:07.564Z', '2026-11-07T15:55:07.564Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('55e28146-1ebf-4bed-a40b-2906f34ac294', NULL, 'NC-406 / C-1701', 'Oil Filter', 'SAKURA', 0, 1750, 0, '', 'Cash', '2026-11-07T15:55:07.587Z', '2026-11-07T15:55:07.587Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f6e38600-667d-4f56-a3fb-353aa2b4f8f0', NULL, 'NC-407 / C-1001', 'Oil Filter', 'SAKURA', 0, 2550, 0, '', 'Cash', '2026-11-07T15:55:07.583Z', '2026-11-07T15:55:07.583Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('dc3f9a21-382d-4eb5-942c-92601b191d60', NULL, 'NC-409A / C-1717', 'Oil Filter', 'SAKURA', 0, 2990, 0, '', 'Cash', '2026-11-07T15:55:07.588Z', '2026-11-07T15:55:07.588Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ca31930e-a1bd-4e36-8788-17c910be0b53', NULL, 'NC-411 / C-1704', 'Oil Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:55:07.589Z', '2026-11-07T15:55:07.589Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('55e17640-c27d-4ae9-b601-a8c83fbd129e', NULL, 'NC-412 / C-1712', 'Oil Filter', 'SAKURA', 0, 2490, 0, '', 'Cash', '2026-11-07T15:55:07.591Z', '2026-11-07T15:55:07.591Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bea425e1-cf83-4147-a056-d7348949d3f2', NULL, 'NC-415 / C-1011', 'Oil Filter', 'SAKURA', 0, 1240, 0, '', 'Cash', '2026-11-07T15:55:07.519Z', '2026-11-07T15:55:07.519Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b16578d3-e0e5-4c0b-b512-252c3705779a', NULL, 'NC-502 / C-1503', 'Oil Filter', 'SAKURA', 0, 2215, 0, '', 'Cash', '2026-11-07T15:55:07.594Z', '2026-11-07T15:55:07.594Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('095df56e-56cc-4f5a-ad6f-1f560b4e542d', NULL, 'NC-503 / C-1502', 'Oil Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:55:07.520Z', '2026-11-07T15:55:07.520Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fa579e6b-4925-44f1-b2d4-3acc169a0b96', NULL, 'NC-504 / C-1507', 'Oil Filter', 'SAKURA', 0, 3210, 0, '', 'Cash', '2026-11-07T15:55:07.595Z', '2026-11-07T15:55:07.595Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b44dbd7f-cde4-4301-9f04-54eb373129fe', NULL, 'NC-506 / C-1504', 'Oil Filter', 'SAKURA', 0, 2520, 0, '', 'Cash', '2026-11-07T15:55:07.596Z', '2026-11-07T15:55:07.596Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('734775ef-0a12-4509-a998-1f53f6ebf5a2', NULL, 'NC-508A / C-1512-S', 'Oil Filter', 'SAKURA', 0, 4135, 0, '', 'Cash', '2026-11-07T15:55:07.597Z', '2026-11-07T15:55:07.597Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ebb8f68e-23f5-4386-83d2-a72c2a09d04f', NULL, 'NC-509A / C-1550', 'Oil Filter', 'SAKURA', 0, 4775, 0, '', 'Cash', '2026-11-07T15:55:07.598Z', '2026-11-07T15:55:07.598Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0b8a3e45-2457-4b9f-91c1-bb9b6a5ade8c', NULL, 'NC-510A / C-1506', 'Oil Filter', 'SAKURA', 0, 5310, 0, '', 'Cash', '2026-11-07T15:55:07.599Z', '2026-11-07T15:55:07.599Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bed78653-3e78-46e8-85c8-41e534f1241c', NULL, 'NC-512 / C-1511', 'Oil Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:55:07.600Z', '2026-11-07T15:55:07.600Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d07baada-d68d-4fd2-999b-e85c40fbe47a', NULL, 'NC-516 / C-1513', 'Oil Filter', 'SAKURA', 0, 6710, 0, '', 'Cash', '2026-11-07T15:55:07.601Z', '2026-11-07T15:55:07.601Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b8c2c21d-209f-410e-9751-eb1072173d02', NULL, 'NC-517 / C-1525', 'Oil Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:55:07.603Z', '2026-11-07T15:55:07.603Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ae8938ca-14e7-4ec0-927c-c3ddf7c9d5ad', NULL, 'NC-518 / C-1515', 'Oil Filter', 'SAKURA', 0, 4265, 0, '', 'Cash', '2026-11-07T15:55:07.604Z', '2026-11-07T15:55:07.604Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9805fd18-0246-49d1-b5c6-c0bdefffe89b', NULL, 'NC-518A / C-1562', 'Oil Filter', 'SAKURA', 0, 5690, 0, '', 'Cash', '2026-11-07T15:55:07.605Z', '2026-11-07T15:55:07.605Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3ba250e7-d72a-42b5-971c-12f9fb2c6b52', NULL, 'NC-519 / C-1523', 'Oil Filter', 'SAKURA', 0, 5275, 0, '', 'Cash', '2026-11-07T15:55:07.606Z', '2026-11-07T15:55:07.606Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('128daf52-aad9-4549-98bc-f453de1316eb', NULL, 'NC-522 / C-1541', 'Oil Filter', 'SAKURA', 0, 6210, 0, '', 'Cash', '2026-11-07T15:55:07.607Z', '2026-11-07T15:55:07.607Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a6315b85-9d75-4464-a495-3a07159c9b02', NULL, 'NC-523 / C-1524', 'Oil Filter', 'SAKURA', 0, 5550, 0, '', 'Cash', '2026-11-07T15:55:07.609Z', '2026-11-07T15:55:07.609Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c6cd29b9-afb9-48a3-a24a-dbe13af8f7a9', NULL, 'NC-524 / C-15271', 'Oil Filter', 'SAKURA', 0, 2640, 0, '', 'Cash', '2026-11-07T15:55:07.610Z', '2026-11-07T15:55:07.610Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8ff5d5e1-7a9e-4e3a-ae4f-40a458f64eba', NULL, 'NC-525 / C-1533', 'Oil Filter', 'SAKURA', 0, 5240, 0, '', 'Cash', '2026-11-07T15:55:07.610Z', '2026-11-07T15:55:07.610Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8f4fb7c5-401a-44a2-8534-c287581311ee', NULL, 'NC-526 / C-1534', 'Oil Filter', 'SAKURA', 0, 4460, 0, '', 'Cash', '2026-11-07T15:55:07.611Z', '2026-11-07T15:55:07.611Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('57fc34fb-71d9-4b9c-9b8d-c85010cff05a', NULL, 'NC-528 / C-1546', 'Oil Filter', 'SAKURA', 0, 3750, 0, '', 'Cash', '2026-11-07T15:55:07.612Z', '2026-11-07T15:55:07.612Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('876c3b04-2600-4f3b-9d34-db0f19b81af3', NULL, 'NC-601A / C-1309', 'Oil Filter', 'SAKURA', 0, 4905, 0, '', 'Cash', '2026-11-07T15:55:07.638Z', '2026-11-07T15:55:07.638Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6055bb99-bcec-4c6a-b509-dbdb81661c40', NULL, 'NC-602A / C-1303', 'Oil Filter', 'SAKURA', 0, 7530, 0, '', 'Cash', '2026-11-07T15:55:07.639Z', '2026-11-07T15:55:07.639Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('497271f3-62cb-4098-838f-082f6b51dd3d', NULL, 'NC-604 / C-1321', 'Oil Filter', 'SAKURA', 0, 6535, 0, '', 'Cash', '2026-11-07T15:55:07.640Z', '2026-11-07T15:55:07.640Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('175b9c66-7a43-45e0-983c-c4d0f3154472', NULL, 'NC-605 / C-1316', 'Oil Filter', 'SAKURA', 0, 6670, 0, '', 'Cash', '2026-11-07T15:55:07.641Z', '2026-11-07T15:55:07.641Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fa7ca1a4-40d0-441f-a568-81a0385cbb0e', NULL, 'NC-606 / C-1319', 'Oil Filter', 'SAKURA', 0, 8140, 0, '', 'Cash', '2026-11-07T15:55:07.642Z', '2026-11-07T15:55:07.642Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('63d6509d-8873-4a1b-bfe2-cc9de2add78f', NULL, 'NC-607 / C-1317', 'Oil Filter', 'SAKURA', 0, 4990, 0, '', 'Cash', '2026-11-07T15:55:07.494Z', '2026-11-07T15:55:07.494Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ad72c24c-fd76-49d3-8f71-742c2e22ea33', NULL, 'NC-608 / C-1318', 'Oil Filter', 'SAKURA', 0, 4990, 0, '', 'Cash', '2026-11-07T15:55:07.495Z', '2026-11-07T15:55:07.495Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a247521c-5612-429c-876c-229e4ccd597e', NULL, 'NC-608A / C-1328', 'Oil Filter', 'SAKURA', 0, 5045, 0, '', 'Cash', '2026-11-07T15:55:07.496Z', '2026-11-07T15:55:07.496Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c72d6f51-474c-4c8c-a1ea-ebc33512e354', NULL, 'NC-703A / C-1202', 'Oil Filter', 'SAKURA', 0, 1425, 0, '', 'Cash', '2026-11-07T15:55:07.633Z', '2026-11-07T15:55:07.633Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('64c4e308-5bcf-4356-af75-43ca5f32607f', NULL, 'NC-707 / C-1138', 'Oil Filter', 'SAKURA', 0, 950, 0, '', 'Cash', '2026-11-07T15:55:07.497Z', '2026-11-07T15:55:07.497Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('eb8bb996-14dd-4404-9503-f31d1cecc4a7', NULL, 'NC-806 / C-9001', 'Oil Filter', 'SAKURA', 0, 850, 0, '', 'Cash', '2026-11-07T15:55:07.584Z', '2026-11-07T15:55:07.584Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('66c0dee0-4877-4924-b2fb-e409b71b69a6', NULL, 'NC-808 / C-9002', 'Oil Filter', 'SAKURA', 0, 865, 0, '', 'Cash', '2026-11-07T15:55:07.585Z', '2026-11-07T15:55:07.585Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('144a5e8d-746c-4b2b-a759-8f55677b35fc', NULL, 'NC-809 / C-1614', 'Oil Filter', 'SAKURA', 0, 1240, 0, '', 'Cash', '2026-11-07T15:55:07.586Z', '2026-11-07T15:55:07.586Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('219d81c6-0875-4b16-b9f5-a8bbe1fdb1fb', NULL, 'NC-901 / C-1809', 'Oil Filter', 'SAKURA', 0, 1295, 0, '', 'Cash', '2026-11-07T15:55:07.592Z', '2026-11-07T15:55:07.592Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a12b681f-159d-4382-8f3b-ab377fc71b52', NULL, 'NC-902 / C-1816', 'Oil Filter', 'SAKURA', 0, 1565, 0, '', 'Cash', '2026-11-07T15:55:07.648Z', '2026-11-07T15:55:07.648Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ef0d0921-eba9-4bf8-852d-4593038b8ea9', NULL, 'NC-931 / C-1403', 'Oil Filter', 'SAKURA', 0, 1950, 0, '', 'Cash', '2026-11-07T15:55:07.634Z', '2026-11-07T15:55:07.634Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('42da99e8-84c7-466d-affd-298cd6e4bfe3', NULL, 'NC-932 / C-1204', 'Oil Filter', 'SAKURA', 0, 1225, 0, '', 'Cash', '2026-11-07T15:55:07.632Z', '2026-11-07T15:55:07.632Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ad064a4f-a41b-474b-b351-aac9446b1044', NULL, 'NC-933 / C-1404', 'Oil Filter', 'SAKURA', 0, 1225, 0, '', 'Cash', '2026-11-07T15:55:07.635Z', '2026-11-07T15:55:07.635Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d97cdaa9-f9c6-47a8-95c8-feb9b3245c89', NULL, 'NC-934 / C-14090', 'Oil Filter', 'SAKURA', 0, 1175, 0, '', 'Cash', '2026-11-07T15:55:07.635Z', '2026-11-07T15:55:07.635Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8befac99-d93d-434f-a5f4-705364f261c3', NULL, 'NCAV-296 / FC-1702', 'Fuel Filter', 'SAKURA', 0, 1620, 0, '', 'Cash', '2026-11-07T15:55:48.984Z', '2026-11-07T15:55:48.984Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('850daaea-9a37-45f1-b998-baddf1631d4e', NULL, 'NCAV-796 / FC-5101', 'Fuel Filter', 'SAKURA', 0, 2215, 0, '', 'Cash', '2026-11-07T15:55:48.986Z', '2026-11-07T15:55:48.986Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e9ec9dad-58a4-4beb-8ce1-9464fc56d6a8', NULL, 'NEF-1112 / EF-1112', 'Fuel Filter', 'SAKURA', 0, 2750, 0, '', 'Cash', '2026-11-07T15:55:48.867Z', '2026-11-07T15:55:48.867Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d2000fc4-c410-49cd-b37c-5ecb4cc9be58', NULL, 'NF-1001 / EF-13180', 'Fuel Filter', 'SAKURA', 0, 1350, 0, '', 'Cash', '2026-11-07T15:55:48.870Z', '2026-11-07T15:55:48.870Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('18099255-db9e-4e36-a124-457fe3ea7146', NULL, 'NF-1110 / F-1110', 'Fuel Filter', 'SAKURA', 0, 3025, 0, '', 'Cash', '2026-11-07T15:55:48.871Z', '2026-11-07T15:55:48.871Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('fbb6ab8f-14c6-4ca4-a77f-0ac9cf9d9a7f', NULL, 'NF-1507 / F-1507', 'Fuel Filter', 'SAKURA', 0, 1620, 0, '', 'Cash', '2026-11-07T15:55:48.952Z', '2026-11-07T15:55:48.952Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a0d24e43-acb5-44f6-87ae-1856d86f2a33', NULL, 'NF-153 / F-1106', 'Fuel Filter', 'SAKURA', 0, 1040, 0, '', 'Cash', '2026-11-07T15:55:48.873Z', '2026-11-07T15:55:48.873Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('dbaae5ba-be8c-4b57-aac3-8f5a426d3da3', NULL, 'NF-1804 / F-1804', 'Fuel Filter', 'SAKURA', 0, 1390, 0, '', 'Cash', '2026-11-07T15:55:48.946Z', '2026-11-07T15:55:48.946Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0050cfcb-12b9-41e8-9617-efddaef032e0', NULL, 'NF-193 / F-1111', 'Fuel Filter', 'SAKURA', 0, 2150, 0, '', 'Cash', '2026-11-07T15:55:48.874Z', '2026-11-07T15:55:48.874Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('65fd04e0-20d4-4f12-a082-a1b102d74349', NULL, 'NF-193A / F-11112', 'Fuel Filter', 'SAKURA', 0, 3295, 0, '', 'Cash', '2026-11-07T15:55:48.875Z', '2026-11-07T15:55:48.875Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7e0f30df-288d-47dd-88bf-5be125760b05', NULL, 'NF-194 / F-11131', 'Fuel Filter', 'SAKURA', 0, 2850, 0, '', 'Cash', '2026-11-07T15:55:48.877Z', '2026-11-07T15:55:48.877Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('eed0043d-b5db-489b-b8d7-fccd968937c3', NULL, 'NF-195 / EF-11110', 'Fuel Filter', 'SAKURA', 0, 2350, 0, '', 'Cash', '2026-11-07T15:55:48.879Z', '2026-11-07T15:55:48.879Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('52f6c1dc-4d98-4f1a-b78e-cd89fa06a5c1', NULL, 'NF-196 / F-10200', 'Fuel Filter', 'SAKURA', 0, 2450, 0, '', 'Cash', '2026-11-07T15:55:48.880Z', '2026-11-07T15:55:48.880Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2a571fdf-b1b5-4c23-8a1f-120596718ec4', NULL, 'NF-197 / F-11140', 'Fuel Filter', 'SAKURA', 0, 5175, 0, '', 'Cash', '2026-11-07T15:55:48.881Z', '2026-11-07T15:55:48.881Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1c3eda7b-8527-4189-81e3-693714e21c91', NULL, 'NF-203 / F-1501', 'Fuel Filter', 'SAKURA', 0, 1040, 0, '', 'Cash', '2026-11-07T15:55:48.943Z', '2026-11-07T15:55:48.943Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d0db0bc7-e373-44af-9b98-bd9d30c8ab9d', NULL, 'NF-206A / F-1803', 'Fuel Filter', 'SAKURA', 0, 1685, 0, '', 'Cash', '2026-11-07T15:55:48.943Z', '2026-11-07T15:55:48.943Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e659843d-16eb-4b94-835b-8f9375a0a5f1', NULL, 'NF-207 / F-1802', 'Fuel Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:55:48.945Z', '2026-11-07T15:55:48.945Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5192a31f-233e-4647-893b-366719682085', NULL, 'NF-308 / F-1001', 'Fuel Filter', 'SAKURA', 0, 1040, 0, '', 'Cash', '2026-11-07T15:55:48.898Z', '2026-11-07T15:55:48.898Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0fa16331-dfe2-4d91-a7fc-7a35f61e6c25', NULL, 'NF-309 / F-1004', 'Fuel Filter', 'SAKURA', 0, 1040, 0, '', 'Cash', '2026-11-07T15:55:48.899Z', '2026-11-07T15:55:48.899Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('93e8e342-2211-4d2e-91dd-3c3058055bf1', NULL, 'NF-314 / F-1006', 'Fuel Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:55:48.900Z', '2026-11-07T15:55:48.900Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8da71e63-7fc4-4d44-9d8c-85feaea76173', NULL, 'NF-333 / EF-1001', 'Fuel Filter', 'SAKURA', 0, 3435, 0, '', 'Cash', '2026-11-07T15:55:48.901Z', '2026-11-07T15:55:48.901Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7b18a322-788c-45a6-bc24-149c944e2b01', NULL, 'NF-336 / EF-1801', 'Fuel Filter', 'SAKURA', 0, 2550, 0, '', 'Cash', '2026-11-07T15:55:48.902Z', '2026-11-07T15:55:48.902Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bd827bed-6ded-415e-96d5-bf8383cfa83f', NULL, 'NF-337 / EF-1003', 'Fuel Filter', 'SAKURA', 0, 4535, 0, '', 'Cash', '2026-11-07T15:55:48.903Z', '2026-11-07T15:55:48.903Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b69b4a5f-64a2-4ddd-9f5a-d1bc1c50a972', NULL, 'NF-503 / F-1506', 'Fuel Filter', 'SAKURA', 0, 955, 0, '', 'Cash', '2026-11-07T15:55:48.953Z', '2026-11-07T15:55:48.953Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1c9320d6-a742-4993-a89a-cab2c2b65e0e', NULL, 'NF-505 / F-1303', 'Fuel Filter', 'SAKURA', 0, 1040, 0, '', 'Cash', '2026-11-07T15:55:48.954Z', '2026-11-07T15:55:48.954Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7cba321e-567c-48cf-8c08-c0821db9bd80', NULL, 'NF-507 / F-1503', 'Fuel Filter', 'SAKURA', 0, 3055, 0, '', 'Cash', '2026-11-07T15:55:48.955Z', '2026-11-07T15:55:48.955Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b1e9040f-59c2-4dff-8f3d-abfda1b1f857', NULL, 'NF-513 / EF-1509', 'Fuel Filter', 'SAKURA', 0, 4525, 0, '', 'Cash', '2026-11-07T15:55:48.950Z', '2026-11-07T15:55:48.950Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e0e8f4de-d62d-4cb0-a76c-78de19477f11', NULL, 'NF-514 / EF-15010', 'Fuel Filter', 'SAKURA', 0, 4025, 0, '', 'Cash', '2026-11-07T15:55:48.956Z', '2026-11-07T15:55:48.956Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a72459e4-b92f-40a2-836c-8c0ea81d4d29', NULL, 'NF-516 / EF-15020', 'Fuel Filter', 'SAKURA', 0, 5490, 0, '', 'Cash', '2026-11-07T15:55:48.958Z', '2026-11-07T15:55:48.958Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2eece492-2969-4293-bfc2-5b2f27d7101d', NULL, 'NF-520 / EF-15080', 'Fuel Filter', 'SAKURA', 0, 5450, 0, '', 'Cash', '2026-11-07T15:55:48.959Z', '2026-11-07T15:55:48.959Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a6b41918-06b7-48d7-8eea-79a3fb32a3c3', NULL, 'NF-603 / F-1301', 'Fuel Filter', 'SAKURA', 0, 1050, 0, '', 'Cash', '2026-11-07T15:55:48.918Z', '2026-11-07T15:55:48.918Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('85508214-e1e1-4bd5-84f3-e916e9aa545f', NULL, 'NF-605 / F-1304', 'Fuel Filter', 'SAKURA', 0, 1990, 0, '', 'Cash', '2026-11-07T15:55:48.919Z', '2026-11-07T15:55:48.919Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('741668dc-0fa4-438b-baf8-2048ca2c3bb7', NULL, 'NF-612 / EF-13090', 'Fuel Filter', 'SAKURA', 0, 4130, 0, '', 'Cash', '2026-11-07T15:55:48.920Z', '2026-11-07T15:55:48.920Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e688d1ce-517b-4cfc-9a3b-22d239c2497f', NULL, 'NFC-1018 / FC-1018', 'Fuel Filter', 'SAKURA', 0, 2915, 0, '', 'Cash', '2026-11-07T15:55:48.905Z', '2026-11-07T15:55:48.905Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6d3c0cba-502e-4695-9d09-162173febdb2', NULL, 'NFC-147 / FC-1101', 'Fuel Filter', 'SAKURA', 0, 1860, 0, '', 'Cash', '2026-11-07T15:55:48.882Z', '2026-11-07T15:55:48.882Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('133758cf-d398-45e9-9bc9-2d008f09704f', NULL, 'NFC-158 / FC-1104', 'Fuel Filter', 'SAKURA', 0, 2110, 0, '', 'Cash', '2026-11-07T15:55:48.883Z', '2026-11-07T15:55:48.883Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ec74f823-f664-4ee8-9e3e-ebe1352cd931', NULL, 'NFC-158A / FC-1707', 'Fuel Filter', 'SAKURA', 0, 2900, 0, '', 'Cash', '2026-11-07T15:55:48.884Z', '2026-11-07T15:55:48.884Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a851210a-50ff-43b8-9373-7e83520d6c29', NULL, 'NFC-174 / FC-1705', 'Fuel Filter', 'SAKURA', 0, 2215, 0, '', 'Cash', '2026-11-07T15:55:48.885Z', '2026-11-07T15:55:48.885Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('aee8c3e5-4b1f-4fdb-ae03-490614af2e63', NULL, 'NFC-183 / FS-1112', 'Fuel Filter', 'SAKURA', 0, 4460, 0, '', 'Cash', '2026-11-07T15:55:48.886Z', '2026-11-07T15:55:48.886Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7f183ce0-c6a6-43b1-9710-ec53b0e2a0a4', NULL, 'NFC-184 / FC-1108', 'Fuel Filter', 'SAKURA', 0, 2900, 0, '', 'Cash', '2026-11-07T15:55:48.887Z', '2026-11-07T15:55:48.887Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('14459286-3d26-4354-ad8c-1ae02d935c9f', NULL, 'NFC-208A / FC-1821', 'Fuel Filter', 'SAKURA', 0, 1410, 0, '', 'Cash', '2026-11-07T15:55:48.961Z', '2026-11-07T15:55:48.961Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ab1a67e1-d62b-42b6-8ff1-892fc8dfac61', NULL, 'NFC-210 / FS-1802', 'Fuel Filter', 'SAKURA', 0, 1390, 0, '', 'Cash', '2026-11-07T15:55:48.932Z', '2026-11-07T15:55:48.932Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('dd5f774c-4cf8-475d-bd45-8b7023bdac7d', NULL, 'NFC-225 / FS-8006', 'Fuel Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:55:48.935Z', '2026-11-07T15:55:48.935Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b9ddf100-90bf-409b-bdaf-16cb961049c5', NULL, 'NFC-226 / FC-1803', 'Fuel Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:55:48.940Z', '2026-11-07T15:55:48.940Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('346f1b39-606d-4899-8878-bc167fd2a4dc', NULL, 'NFC-232 / FC-1805', 'Fuel Filter', 'SAKURA', 0, 4045, 0, '', 'Cash', '2026-11-07T15:55:48.941Z', '2026-11-07T15:55:48.941Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5ae842bd-5df0-4a93-a974-e8b50440aa2e', NULL, 'NFC-234 / FC-1806', 'Fuel Filter', 'SAKURA', 0, 3545, 0, '', 'Cash', '2026-11-07T15:55:48.937Z', '2026-11-07T15:55:48.937Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1ce2e1e3-dac0-44a5-960d-e096e70c0429', NULL, 'NFC-235 / FC-1807', 'Fuel Filter', 'SAKURA', 0, 3885, 0, '', 'Cash', '2026-11-07T15:55:48.938Z', '2026-11-07T15:55:48.938Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5d83fb63-1287-48dc-858b-3784e9454e61', NULL, 'NFC-236 / FS-8001', 'Fuel Filter', 'SAKURA', 0, 3600, 0, '', 'Cash', '2026-11-07T15:55:48.934Z', '2026-11-07T15:55:48.934Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('69de6ba3-f3e2-423f-921f-9555f4dffed3', NULL, 'NFC-237 / FS-1804', 'Fuel Filter', 'SAKURA', 0, 3600, 0, '', 'Cash', '2026-11-07T15:55:48.939Z', '2026-11-07T15:55:48.939Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5a71763f-fd16-4826-b8c7-2d337cf95941', NULL, 'NFC-312 / FS-1025', 'Fuel Filter', 'SAKURA', 0, 3860, 0, '', 'Cash', '2026-11-07T15:55:48.906Z', '2026-11-07T15:55:48.906Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1a1d8dba-8a1d-4587-8402-844d76100d69', NULL, 'NFC-317 / FC-1004', 'Fuel Filter', 'SAKURA', 0, 1750, 0, '', 'Cash', '2026-11-07T15:55:48.907Z', '2026-11-07T15:55:48.907Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8a37dbd8-1dea-43d6-b85f-5f0c36bf7550', NULL, 'NFC-317A / FC-1016', 'Fuel Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:55:48.908Z', '2026-11-07T15:55:48.908Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0c1965fc-3fc5-4088-a41e-abdd8e819f24', NULL, 'NFC-318 / FC-1002', 'Fuel Filter', 'SAKURA', 0, 2000, 0, '', 'Cash', '2026-11-07T15:55:48.909Z', '2026-11-07T15:55:48.909Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3c8bd798-a8e1-43c4-ab57-096b9e87a99c', NULL, 'NFC-319 / FC-1003', 'Fuel Filter', 'SAKURA', 0, 2640, 0, '', 'Cash', '2026-11-07T15:55:48.910Z', '2026-11-07T15:55:48.910Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('916d59f5-ae61-492b-ba5b-764e3d71e227', NULL, 'NFC-321 / FC-1001', 'Fuel Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:55:48.911Z', '2026-11-07T15:55:48.911Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('95749ed8-18cc-46f3-8834-b3c1978b359e', NULL, 'NFC-322 / FC-1005', 'Fuel Filter', 'SAKURA', 0, 3480, 0, '', 'Cash', '2026-11-07T15:55:48.912Z', '2026-11-07T15:55:48.912Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('296a658b-cb11-42fb-bc53-f45e26fff617', NULL, 'NFC-326 / FC-1006', 'Fuel Filter', 'SAKURA', 0, 1890, 0, '', 'Cash', '2026-11-07T15:55:48.913Z', '2026-11-07T15:55:48.913Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3becd86f-e13b-4720-9eda-2dc29bc5fa2b', NULL, 'NFC-331 / FC-1008', 'Fuel Filter', 'SAKURA', 0, 5080, 0, '', 'Cash', '2026-11-07T15:55:48.914Z', '2026-11-07T15:55:48.914Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('560b8709-7933-4def-a8c6-420cd855988c', NULL, 'NFC-332 / FC-1009', 'Fuel Filter', 'SAKURA', 0, 3720, 0, '', 'Cash', '2026-11-07T15:55:48.915Z', '2026-11-07T15:55:48.915Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ca1cef94-ea78-4c78-9e3c-922db3697a3a', NULL, 'NFC-510 / FC-1503', 'Fuel Filter', 'SAKURA', 0, 3340, 0, '', 'Cash', '2026-11-07T15:55:48.962Z', '2026-11-07T15:55:48.962Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('781e2f7b-f102-4256-bd87-0ba7d3e9680f', NULL, 'NFC-511 / FC-1505', 'Fuel Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:55:48.963Z', '2026-11-07T15:55:48.963Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('905b17d2-a76e-4b48-9315-314d1ad55d49', NULL, 'NFC-607 / FC-1301', 'Fuel Filter', 'SAKURA', 0, 2280, 0, '', 'Cash', '2026-11-07T15:55:48.921Z', '2026-11-07T15:55:48.921Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('67d0c65b-e608-422a-a105-7f6dde7c2c93', NULL, 'NFC-707A / FC-1302', 'Fuel Filter', 'SAKURA', 0, 1975, 0, '', 'Cash', '2026-11-07T15:55:48.891Z', '2026-11-07T15:55:48.891Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('720da1b2-4140-45fd-bdc0-379a75852d14', NULL, 'NFC-819 / FS-1607', 'Fuel Filter', 'SAKURA', 0, 3600, 0, '', 'Cash', '2026-11-07T15:55:48.888Z', '2026-11-07T15:55:48.888Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('85be79d9-ca60-40c3-a2dd-27c8d1671a26', NULL, 'NO-108 / O-1103', 'Oil Filter', 'SAKURA', 0, 1345, 0, '', 'Cash', '2026-11-07T15:55:07.498Z', '2026-11-07T15:55:07.498Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('eaac7afe-c70a-48a2-9069-c4a249315a3f', NULL, 'NO-116 / EO-1102', 'Oil Filter', 'SAKURA', 0, 1870, 0, '', 'Cash', '2026-11-07T15:55:07.499Z', '2026-11-07T15:55:07.499Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b2de22e7-0bed-4859-9b5f-6af50fb21812', NULL, 'NO-117 / EO-1103', 'Oil Filter', 'SAKURA', 0, 1980, 0, '', 'Cash', '2026-11-07T15:55:07.501Z', '2026-11-07T15:55:07.501Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('44fa8152-1d06-4f37-a6c0-eb290e07d961', NULL, 'NO-118 / EO-1101', 'Oil Filter', 'SAKURA', 0, 850, 0, '', 'Cash', '2026-11-07T15:55:07.502Z', '2026-11-07T15:55:07.502Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bd7d9f4d-9f32-4c41-8b85-d1d66ae127d9', NULL, 'NO-119 / EO-11050', 'Oil Filter', 'SAKURA', 0, 1980, 0, '', 'Cash', '2026-11-07T15:55:07.503Z', '2026-11-07T15:55:07.503Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8f7305a0-d3a2-4fe7-842c-eb0750a10d59', NULL, 'NO-120 / EO-11080', 'Oil Filter', 'SAKURA', 0, 1895, 0, '', 'Cash', '2026-11-07T15:55:07.504Z', '2026-11-07T15:55:07.504Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3f7b52c0-6858-4e27-8210-563c4f7a7de6', NULL, 'NO-121 / EO-11060', 'Oil Filter', 'SAKURA', 0, 1250, 0, '', 'Cash', '2026-11-07T15:55:07.505Z', '2026-11-07T15:55:07.505Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1e676feb-c616-438a-b715-445edef8ffbe', NULL, 'NO-203 / O-1801', 'Oil Filter', 'SAKURA', 0, 1490, 0, '', 'Cash', '2026-11-07T15:55:07.566Z', '2026-11-07T15:55:07.566Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2d7514e0-ed16-4070-b190-39ccd4640140', NULL, 'NO-205 / EO-1802', 'Oil Filter', 'SAKURA', 0, 1550, 0, '', 'Cash', '2026-11-07T15:55:07.567Z', '2026-11-07T15:55:07.567Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3c4b89bc-6ca3-4780-ac58-b210eb7280be', NULL, 'NO-206 / EO-1801', 'Oil Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:55:07.568Z', '2026-11-07T15:55:07.568Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f63c26c7-6780-43b6-af20-2a2999656c07', NULL, 'NO-255 / O-1809', 'Oil Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:55:07.569Z', '2026-11-07T15:55:07.569Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('de0e0495-7970-47f1-9b15-b822f16708ed', NULL, 'NO-256 / O-1806', 'Oil Filter', 'SAKURA', 0, 2630, 0, '', 'Cash', '2026-11-07T15:55:07.570Z', '2026-11-07T15:55:07.570Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e3cdac28-456b-413a-a3ed-0512513935be', NULL, 'NO-257A / O-1807', 'Oil Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:55:07.571Z', '2026-11-07T15:55:07.571Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a289b398-17e2-4ae5-9f94-1ffdf2affc5c', NULL, 'NO-258 / O-1805-1', 'Oil Filter', 'SAKURA', 0, 3230, 0, '', 'Cash', '2026-11-07T15:55:07.572Z', '2026-11-07T15:55:07.572Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('7e10cc05-28c1-4aee-863c-19e3ba8269b6', NULL, 'NO-259A / O-1808', 'Oil Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:55:07.573Z', '2026-11-07T15:55:07.573Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f33da4db-f272-45c8-981a-a5ba101f251e', NULL, 'NO-264 / O-1816', 'Oil Filter', 'SAKURA', 0, 4990, 0, '', 'Cash', '2026-11-07T15:55:07.575Z', '2026-11-07T15:55:07.575Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('57697ff0-c170-41c8-86b5-1d603234a46b', NULL, 'NO-265 / O-1817', 'Oil Filter', 'SAKURA', 0, 5930, 0, '', 'Cash', '2026-11-07T15:55:07.576Z', '2026-11-07T15:55:07.576Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ec5588d6-7a83-4949-97f9-e88a19f473a5', NULL, 'NO-267 / O-6103', 'Oil Filter', 'SAKURA', 0, 4025, 0, '', 'Cash', '2026-11-07T15:55:07.565Z', '2026-11-07T15:55:07.565Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('df50d715-a00d-4fdf-a979-c053ae307624', NULL, 'NO-268 / EO-1818', 'Oil Filter', 'SAKURA', 0, 8510, 0, '', 'Cash', '2026-11-07T15:55:07.578Z', '2026-11-07T15:55:07.578Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4654b8f8-696e-4a12-b046-5d7d9da85f4c', NULL, 'NO-269 / EO-1819', 'Oil Filter', 'SAKURA', 0, 9245, 0, '', 'Cash', '2026-11-07T15:55:07.580Z', '2026-11-07T15:55:07.580Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('07a5bd4b-48f6-4dd6-8ff4-6451136f7335', NULL, 'NO-306 / O-1001', 'Oil Filter', 'SAKURA', 0, 1345, 0, '', 'Cash', '2026-11-07T15:55:07.521Z', '2026-11-07T15:55:07.521Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('28012847-56bc-4762-8da4-7f72b8d00b67', NULL, 'NO-308 / O-1002', 'Oil Filter', 'SAKURA', 0, 1345, 0, '', 'Cash', '2026-11-07T15:55:07.522Z', '2026-11-07T15:55:07.522Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('54296ccc-edc9-49db-b2fb-fd52b0648749', NULL, 'NO-354 / O-1016', 'Oil Filter', 'SAKURA', 0, 1750, 0, '', 'Cash', '2026-11-07T15:55:07.523Z', '2026-11-07T15:55:07.523Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0e6b37e6-6820-494f-8c83-84af3ac77f7e', NULL, 'NO-355 / O-1005', 'Oil Filter', 'SAKURA', 0, 2270, 0, '', 'Cash', '2026-11-07T15:55:07.524Z', '2026-11-07T15:55:07.524Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('447e8c56-c384-46da-a3cc-2f6a2db3c3d8', NULL, 'NO-358 / O-1006', 'Oil Filter', 'SAKURA', 0, 3720, 0, '', 'Cash', '2026-11-07T15:55:07.525Z', '2026-11-07T15:55:07.525Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cbd30744-5728-4724-a4d2-a396215226ea', NULL, 'NO-359/360 / O-1019-1', 'Oil Filter', 'SAKURA', 0, 5490, 0, '', 'Cash', '2026-11-07T15:55:07.526Z', '2026-11-07T15:55:07.526Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('6ca01a36-634e-41cb-ad72-cb7d0745c5e0', NULL, 'NO-362 / EO-10060', 'Oil Filter', 'SAKURA', 0, 4460, 0, '', 'Cash', '2026-11-07T15:55:07.527Z', '2026-11-07T15:55:07.527Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('34fa428e-2944-4e25-97c0-153e322e5b9d', NULL, 'NO-406 / EO-1701', 'Oil Filter', 'SAKURA', 0, 1150, 0, '', 'Cash', '2026-11-07T15:55:07.593Z', '2026-11-07T15:55:07.593Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('be322a1e-1834-4682-84c0-1d5c2d4eee07', NULL, 'NO-407 / EO-17030', 'Oil Filter', 'SAKURA', 0, 1565, 0, '', 'Cash', '2026-11-07T15:55:07.594Z', '2026-11-07T15:55:07.594Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('282d84bb-f270-41b9-b340-8f9ee553229c', NULL, 'NO-501 / O-1515', 'Oil Filter', 'SAKURA', 0, 1390, 0, '', 'Cash', '2026-11-07T15:55:07.613Z', '2026-11-07T15:55:07.613Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c3b3e460-fe27-4baa-81e7-188e5c151422', NULL, 'NO-502A / O-1501', 'Oil Filter', 'SAKURA', 0, 1085, 0, '', 'Cash', '2026-11-07T15:55:07.614Z', '2026-11-07T15:55:07.614Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('95376ba5-224c-463c-83e5-8fd84ad7d908', NULL, 'NO-503 / O-1502', 'Oil Filter', 'SAKURA', 0, 1565, 0, '', 'Cash', '2026-11-07T15:55:07.616Z', '2026-11-07T15:55:07.616Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9fe29e2d-7520-4aa0-a109-b5103d313e90', NULL, 'NO-504 / O-1503', 'Oil Filter', 'SAKURA', 0, 1390, 0, '', 'Cash', '2026-11-07T15:55:07.617Z', '2026-11-07T15:55:07.617Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('e706cdad-4530-4c01-88bf-fb8dab05d8b5', NULL, 'NO-553 / O-1508', 'Oil Filter', 'SAKURA', 0, 1630, 0, '', 'Cash', '2026-11-07T15:55:07.618Z', '2026-11-07T15:55:07.618Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0dc07675-22c7-43a5-b372-6bdf9789e4d4', NULL, 'NO-554 / O-1505', 'Oil Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:55:07.619Z', '2026-11-07T15:55:07.619Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('cabe9744-5f41-4be4-9bd9-8b24d9b1c53d', NULL, 'NO-561 / O-1511', 'Oil Filter', 'SAKURA', 0, 4055, 0, '', 'Cash', '2026-11-07T15:55:07.620Z', '2026-11-07T15:55:07.620Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('c3efa226-d52c-4506-80a7-20cb14a55bb4', NULL, 'NO-564 / O-1514', 'Oil Filter', 'SAKURA', 0, 3665, 0, '', 'Cash', '2026-11-07T15:55:07.620Z', '2026-11-07T15:55:07.620Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('12a400d5-528a-4af6-9b0a-efe084357fea', NULL, 'NO-566A / O-1512', 'Oil Filter', 'SAKURA', 0, 8965, 0, '', 'Cash', '2026-11-07T15:55:07.621Z', '2026-11-07T15:55:07.621Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d4fb394c-07e7-4641-902b-519ea550fac8', NULL, 'NO-568 / O-1308', 'Oil Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:55:07.622Z', '2026-11-07T15:55:07.622Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bb901b6a-4e28-4af4-bd79-c50ca8042452', NULL, 'NO-577 / O-1516', 'Oil Filter', 'SAKURA', 0, 5490, 0, '', 'Cash', '2026-11-07T15:55:07.623Z', '2026-11-07T15:55:07.623Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('24f94b87-6018-440a-8fce-2ff8b29d0da4', NULL, 'NO-579 / O-1532', 'Oil Filter', 'SAKURA', 0, 3150, 0, '', 'Cash', '2026-11-07T15:55:07.624Z', '2026-11-07T15:55:07.624Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9a811d87-0da3-41d1-8adb-7fcb1a8aa9be', NULL, 'NO-580 / O-1521', 'Oil Filter', 'SAKURA', 0, 7375, 0, '', 'Cash', '2026-11-07T15:55:07.625Z', '2026-11-07T15:55:07.625Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ec299b38-802e-42b5-83c9-ab39292994b9', NULL, 'NO-581 / O-1522', 'Oil Filter', 'SAKURA', 0, 6930, 0, '', 'Cash', '2026-11-07T15:55:07.626Z', '2026-11-07T15:55:07.626Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('d8eaa3da-4b1d-4721-affd-55cf4ee3e7a0', NULL, 'NO-582 / O-1524', 'Oil Filter', 'SAKURA', 0, 3405, 0, '', 'Cash', '2026-11-07T15:55:07.627Z', '2026-11-07T15:55:07.627Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('099ad7df-1fb3-4b5a-a6a4-869be0dddb1e', NULL, 'NO-584 / EO-1501', 'Oil Filter', 'SAKURA', 0, 3110, 0, '', 'Cash', '2026-11-07T15:55:07.628Z', '2026-11-07T15:55:07.628Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('0899d659-ddd7-46db-8fa1-202ae3d2a1be', NULL, 'NO-587 / EO-15030', 'Oil Filter', 'SAKURA', 0, 2350, 0, '', 'Cash', '2026-11-07T15:55:07.629Z', '2026-11-07T15:55:07.629Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a30a2ee4-3d3e-44d9-9a0c-5d8536adcf1a', NULL, 'NO-605 / O-1301', 'Oil Filter', 'SAKURA', 0, 2000, 0, '', 'Cash', '2026-11-07T15:55:07.630Z', '2026-11-07T15:55:07.630Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('46c4b06b-425f-4bac-b0ef-d7241fd8bcbf', NULL, 'NO-608 / O-1305', 'Oil Filter', 'SAKURA', 0, 2835, 0, '', 'Cash', '2026-11-07T15:55:07.643Z', '2026-11-07T15:55:07.643Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f5ab1a8e-0568-4b3a-b014-cfcb45390ea4', NULL, 'NO-609 / O-1308', 'Oil Filter', 'SAKURA', 0, 2195, 0, '', 'Cash', '2026-11-07T15:55:07.644Z', '2026-11-07T15:55:07.644Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f9c09370-ad34-4991-bfb5-0df2dd042e7b', NULL, 'NO-617 / O-1519', 'Oil Filter', 'SAKURA', 0, 2185, 0, '', 'Cash', '2026-11-07T15:55:07.631Z', '2026-11-07T15:55:07.631Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('1d6a5407-7221-47f4-b565-252c0a3a2961', NULL, 'NO-620 / O-1311', 'Oil Filter', 'SAKURA', 0, 4550, 0, '', 'Cash', '2026-11-07T15:55:07.645Z', '2026-11-07T15:55:07.645Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('effdf121-83b5-4188-9ba4-ba7b79fe8dbb', NULL, 'NO-621 / O-1310', 'Oil Filter', 'SAKURA', 0, 4460, 0, '', 'Cash', '2026-11-07T15:55:07.646Z', '2026-11-07T15:55:07.646Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ab475368-85b7-4835-b73c-3887531b348f', NULL, 'NO-635 / EO-13010-S', 'Oil Filter', 'SAKURA', 0, 11650, 0, '', 'Cash', '2026-11-07T15:55:07.647Z', '2026-11-07T15:55:07.647Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('f335583e-3cce-42fc-9ffd-f83a367e14ee', NULL, 'O-13280', 'Oil Filter', 'SAKURA', 0, 2150, 0, '', 'Cash', '2026-11-07T15:55:07.684Z', '2026-11-07T15:55:07.684Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5e3e21de-bc34-4264-b94e-9a40ce6cbda5', NULL, 'O-1401', 'Oil Filter', 'SAKURA', 0, 445, 0, '', 'Cash', '2026-11-07T15:55:07.681Z', '2026-11-07T15:55:07.681Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('ae648549-dfe3-4919-8d88-0b1277db5d02', NULL, 'O-1811', 'Oil Filter', 'SAKURA', 0, 2345, 0, '', 'Cash', '2026-11-07T15:55:07.581Z', '2026-11-07T15:55:07.581Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('035644ed-44be-4772-97fa-d69a65457ede', NULL, 'O-7802', 'Oil Filter', 'SAKURA', 0, 1805, 0, '', 'Cash', '2026-11-07T15:55:07.679Z', '2026-11-07T15:55:07.679Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('90a9050f-7ed1-4067-b1aa-0748d22bc67d', NULL, 'O-7926', 'Oil Filter', 'SAKURA', 0, 3350, 0, '', 'Cash', '2026-11-07T15:55:07.680Z', '2026-11-07T15:55:07.680Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('833f35b1-1d14-4572-95bf-edc4ef6053ed', NULL, 'O-79660', 'Oil Filter', 'SAKURA', 0, 1565, 0, '', 'Cash', '2026-11-07T15:55:07.685Z', '2026-11-07T15:55:07.685Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9c28860f-91d8-4a64-b535-418090b278da', NULL, 'O-90020', 'Oil Filter', 'SAKURA', 0, 880, 0, '', 'Cash', '2026-11-07T15:55:07.636Z', '2026-11-07T15:55:07.636Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('74bedd72-a76b-4a52-807d-68dd3c6673b0', NULL, 'O-9302', 'Oil Filter', 'SAKURA', 0, 790, 0, '', 'Cash', '2026-11-07T15:55:07.637Z', '2026-11-07T15:55:07.637Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('b3187541-0939-46c3-9f9a-9ee21240f2ea', NULL, 'SFC-1306-30 / 23401-1440', 'Fuel Filter', 'SAKURA', 0, 5545, 0, '', 'Cash', '2026-11-07T15:55:48.922Z', '2026-11-07T15:55:48.922Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('8c8ba8bd-ed04-4409-86dd-15f4cba416a9', NULL, 'SFC-2901 / CX1011A', 'Fuel Filter', 'SAKURA', 0, 8050, 0, '', 'Cash', '2026-11-07T15:55:48.993Z', '2026-11-07T15:55:48.993Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('27c2934c-3b8a-4f7b-86ee-a7c36ef6d9fc', NULL, 'SFC-5706', 'Fuel Filter', 'SAKURA', 0, 4285, 0, '', 'Cash', '2026-11-07T15:55:48.976Z', '2026-11-07T15:55:48.976Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('a8f377c5-809c-4837-b9a8-370b20eb8f23', NULL, 'SFC-78010', 'Fuel Filter', 'SAKURA', 0, 4525, 0, '', 'Cash', '2026-11-07T15:55:48.975Z', '2026-11-07T15:55:48.975Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('9b670ea6-6df6-4c35-81cb-4ff0a8cdd3d1', NULL, 'SFC-7912-30', 'Fuel Filter', 'SAKURA', 0, 7125, 0, '', 'Cash', '2026-11-07T15:55:48.964Z', '2026-11-07T15:55:48.964Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5a33a884-5bde-4396-bed9-4e1bcc2743aa', NULL, 'SFC-7919 / CX0710B', 'Fuel Filter', 'SAKURA', 0, 3700, 0, '', 'Cash', '2026-11-07T15:55:48.992Z', '2026-11-07T15:55:48.992Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('bb63ca5d-3567-4344-998e-2a99a85e008e', NULL, 'TC-1018', 'Transmission Oil Filter', 'SAKURA', 0, 2415, 0, '', 'Cash', '2026-11-07T15:59:52.746Z', '2026-11-07T15:59:52.746Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('954e86d1-7a74-404a-9741-c3b37062a16b', NULL, 'TE-10360', 'Transmission Oil Filter', 'SAKURA', 0, 4950, 0, '', 'Cash', '2026-11-07T15:59:52.743Z', '2026-11-07T15:59:52.743Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('2ee3625c-fc29-4178-905f-9546983b78e0', NULL, 'TE-11050', 'Transmission Oil Filter', 'SAKURA', 0, 3950, 0, '', 'Cash', '2026-11-07T15:59:52.717Z', '2026-11-07T15:59:52.717Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('91afc12a-07b5-4c10-b879-ed819370f2da', NULL, 'TE-11630', 'Transmission Oil Filter', 'SAKURA', 0, 3850, 0, '', 'Cash', '2026-11-07T15:59:52.726Z', '2026-11-07T15:59:52.726Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('5ab14638-e3b2-451d-8e52-409ab6b0a70a', NULL, 'TE-11640', 'Transmission Oil Filter', 'SAKURA', 0, 4500, 0, '', 'Cash', '2026-11-07T15:59:52.730Z', '2026-11-07T15:59:52.730Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('4385e168-3aa3-412a-b9a7-c967dbd79d40', NULL, 'TE-11990', 'Transmission Oil Filter', 'SAKURA', 0, 4950, 0, '', 'Cash', '2026-11-07T15:59:52.732Z', '2026-11-07T15:59:52.732Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('407a159f-3893-4c0d-81a7-b28cae4b23dd', NULL, 'TE-18680', 'Transmission Oil Filter', 'SAKURA', 0, 1250, 0, '', 'Cash', '2026-11-07T15:59:52.751Z', '2026-11-07T15:59:52.751Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('03c16af1-20b5-47d5-baeb-32f06838eba8', NULL, 'TE-28500', 'Transmission Oil Filter', 'SAKURA', 0, 2250, 0, '', 'Cash', '2026-11-07T15:59:52.753Z', '2026-11-07T15:59:52.753Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('3df3c6e4-aced-4f8e-9dcb-633589ccc9db', NULL, 'TE-33010', 'Transmission Oil Filter', 'SAKURA', 0, 4950, 0, '', 'Cash', '2026-11-07T15:59:52.734Z', '2026-11-07T15:59:52.734Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('03a685ca-9bd8-44a6-833f-c3f854792a4c', NULL, 'TE-33060', 'Transmission Oil Filter', 'SAKURA', 0, 5250, 0, '', 'Cash', '2026-11-07T15:59:52.736Z', '2026-11-07T15:59:52.736Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('36c2eacd-3d3e-4719-9600-8d1e7711c22a', NULL, 'TE-33080', 'Transmission Oil Filter', 'SAKURA', 0, 5950, 0, '', 'Cash', '2026-11-07T15:59:52.737Z', '2026-11-07T15:59:52.737Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
INSERT INTO "products" ("id", "legacyId", "itemId", "itemName", "brand", "quantity", "unitPrice", "buyingPrice", "supplierCode", "paymentMethod", "createdAt", "updatedAt")
VALUES ('670c8145-e073-4fea-a959-f2f88e04975e', NULL, 'TE-33160', 'Transmission Oil Filter', 'SAKURA', 0, 4650, 0, '', 'Cash', '2026-11-07T15:59:52.738Z', '2026-11-07T15:59:52.738Z')
ON CONFLICT ("itemId") DO UPDATE SET "itemName" = EXCLUDED."itemName", "brand" = EXCLUDED."brand", "unitPrice" = EXCLUDED."unitPrice", "buyingPrice" = EXCLUDED."buyingPrice", "supplierCode" = EXCLUDED."supplierCode", "paymentMethod" = EXCLUDED."paymentMethod";
