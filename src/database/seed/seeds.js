/* eslint-disable no-console */
import mongoose from 'mongoose';
import users from './users/users';
import quotes from './quotes/quotes';
import user from '../model/user.model';
import Quote from '../model/quote.model';
import products from './products/products';
import projects from './projects/projects';
import Product from '../model/product.model';
import Project from '../model/project.schema';

require('dotenv').config();

const { MONGODB_URL } = process.env;

console.info('\x1b[1m', 'connecting to the database...');
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.info('\x1b[36m', 'Seeding users...');
    await user.deleteMany();
    await user.insertMany(users);

    console.info('\x1b[36m', 'Seeding quotes...');
    await Quote.deleteMany();
    await Quote.insertMany(quotes);

    console.info('\x1b[36m', 'Seeding projects...');
    await Project.deleteMany();
    await Project.insertMany(projects);

    console.info('\x1b[36m', 'Seeding products...');
    await Product.deleteMany();
    await Product.insertMany(products);
  })
  .catch((err) => console.error('\x1b[31m%s', err))
  .finally(() => {
    console.info('\x1b[34m');
    mongoose.disconnect();
  });
