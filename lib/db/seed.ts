import { cwd } from 'process';
import { loadEnvConfig } from '@next/env';
import data from '../data';
import { connectToDatabase } from '.';
import Product from './models/product.model';
import User from './models/user.model';
loadEnvConfig(cwd());

const main = async () => {
  try {
    const { products, users } = data;
    await connectToDatabase(process.env.MONGODB_URI);
    await User.deleteMany();
    const createdUser = await User.insertMany(users);
    await Product.deleteMany({});
    const createProducts = await Product.insertMany(products);
    console.log({
      createdUser,
      createProducts,
      message: 'Seeded database successfully',
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed database');
  }
};

main();
