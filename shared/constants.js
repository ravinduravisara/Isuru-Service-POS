"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENCY = exports.DEFAULT_SERVICES = exports.PAYMENT_STATUSES = exports.PAYMENT_METHODS = exports.VEHICLE_TYPES = exports.USER_ROLES = void 0;
exports.USER_ROLES = ['Admin', 'User'];
exports.VEHICLE_TYPES = ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'];
exports.PAYMENT_METHODS = ['Cash', 'Credit', 'Cheque', 'Card'];
exports.PAYMENT_STATUSES = ['Paid', 'Pending', 'unpaid', 'paid', 'pending'];
exports.DEFAULT_SERVICES = [
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
];
exports.CURRENCY = {
    CODE: 'LKR',
    SYMBOL: 'Rs.',
    TIMEZONE: 'Asia/Colombo',
};
