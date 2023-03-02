const users = require('../users/users');
const projects = require('../projects/projects');

module.exports = [
  {
    user: users[1]._id,
    project: projects[1]._id,
    billingCycle: 'OneTime',
    status: 'Draft',
    taxes: [
      {
        title: 'taxe title',
        amount: 10,
      },
    ],
    discount: 2,
    isFixed: true,
    amounts: {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    propasalText: 'lorem ipsum dor sit amet',
    customerNote: 'lorem ipsum dor sit amet',
    items: [
      {
        name: 'qwerty',
        price: 300,
        quantity: 30,
        total: 10,
      },
    ],
    expiryDate: '2022-07-06',
    idNumber: 2,
  },
  {
    user: users[1]._id,
    project: projects[2]._id,
    billingCycle: 'yearly',
    status: 'Accepted',
    taxes: [
      {
        title: 'taxe title',
        amount: 10,
      },
    ],
    discount: 2,
    isFixed: true,
    amounts: {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    propasalText: 'lorem ipsum dor sit amet',
    customerNote: 'lorem ipsum dor sit amet',
    items: [
      {
        name: 'qwerty',
        price: 300,
        quantity: 30,
        total: 10,
      },
    ],
    expiryDate: '2022-07-06',
    idNumber: 2,
  },
  {
    user: users[1]._id,
    project: projects[3]._id,
    billingCycle: 'OneTime',
    status: 'Declined',
    taxes: [
      {
        title: 'title',
        amount: 10,
      },
    ],
    discount: 2,
    isFixed: true,
    amounts: {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    propasalText: 'lorem ipsum dor sit amet',
    customerNote: 'lorem ipsum dor sit amet',
    items: [
      {
        name: 'qwerty',
        price: 300,
        quantity: 30,
        total: 10,
      },
    ],
    expiryDate: '2022-07-06',
    idNumber: 2,
  },
  {
    user: users[1]._id,
    project: projects[4]._id,
    billingCycle: 'OneTime',
    status: 'Expired',
    taxes: [
      {
        title: 'taxe title',
        amount: 10,
      },
    ],
    discount: 2,
    isFixed: true,
    amounts: {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    propasalText: 'lorem ipsum dor sit amet',
    customerNote: 'lorem ipsum dor sit amet',
    items: [
      {
        name: 'qwerty',
        price: 300,
        quantity: 30,
        total: 10,
      },
    ],
    expiryDate: '2022-07-06',
    idNumber: 2,
  },
  {
    user: users[1]._id,
    project: projects[5]._id,
    billingCycle: 'OneTime',
    status: 'Accepted',
    taxes: [
      {
        title: 'title',
        amount: 10,
      },
    ],
    discount: 2,
    isFixed: true,
    amounts: {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    propasalText: 'lorem ipsum dor sit amet',
    customerNote: 'lorem ipsum dor sit amet',
    items: [
      {
        name: 'asdfg',
        price: 300,
        quantity: 30,
        total: 10,
      },
    ],
    expiryDate: '2022-07-06',
    idNumber: 2,
  },
  {
    user: users[1]._id,
    project: projects[6]._id,
    billingCycle: 'OneTime',
    status: 'Accepted',
    taxes: [
      {
        title: 'title',
        amount: 10,
      },
    ],
    discount: 2,
    isFixed: true,
    amounts: {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    propasalText: 'lorem ipsum dor sit amet',
    customerNote: 'lorem ipsum dor sit amet',
    items: [
      {
        name: 'asdfg',
        price: 300,
        quantity: 30,
        total: 10,
      },
    ],
    expiryDate: '2022-07-06',
    idNumber: 2,
  },
  {
    user: users[3],
    project: projects[7]._id,
    billingCycle: 'OneTime',
    status: 'Accepted',
    taxes: [
      {
        title: 'title',
        amount: 10,
      },
    ],
    discount: 2,
    isFixed: true,
    amounts: {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    propasalText: 'lorem ipsum dor sit amet',
    customerNote: 'lorem ipsum dor sit amet',
    items: [
      {
        name: 'asdfg',
        price: 300,
        quantity: 30,
        total: 10,
      },
    ],
    expiryDate: '2022-07-06',
    idNumber: 2,
  },
  {
    user: users[3],
    project: projects[0]._id,
    billingCycle: 'OneTime',
    status: 'Delivered',
    taxes: [
      {
        title: 'title',
        amount: 10,
      },
    ],
    discount: 2,
    isFixed: true,
    amounts: {
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    },
    propasalText: 'lorem ipsum dor sit amet',
    customerNote: 'lorem ipsum dor sit amet',
    items: [
      {
        name: 'asdfg',
        price: 300,
        quantity: 30,
        total: 10,
      },
    ],
    expiryDate: '2022-07-06',
    idNumber: 2,
  },
];
