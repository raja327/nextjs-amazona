import { cwd } from "process";
import {loadEnvConfig} from '@next/env'
import data from "../data";
import { connectToDatabase } from ".";
import Product from "./models/product.model";
loadEnvConfig(cwd())

const main=async()=>{
try{
    const {products}=data;
    await connectToDatabase(process.env.MONGODB_URI);
    await Product.deleteMany({});
    const createProduct=await Product.insertMany(products);
    console.log({createProduct,message:"Seeded database successfully"});
    process.exit(0);
}catch(error){
    console.error(error);
    throw new Error('Failed to seed database');
    
}
}

main();