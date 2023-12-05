require('dotenv').config()
const mongoose = require('mongoose');
const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');
const revenueModel = require("../app/models/revenue.js");
const invoiceModel = require("../app/models/invoice.js");
const customerModel = require('../app/models/customer.js');
const userModel = require('../app/models/user.js');


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();

    mongoose.connection.close()
}





// TODO add feature to clear each collection before seeding in each seed function





async function seedUsers() {
  try {
    // clear collection before seeding
    const clearCollection = await userModel.deleteMany({})
    console.log(`removed ${clearCollection.deletedCount} users`)

    // prepare user object with hashed password
    const insertUsers = await Promise.all(users.map(async user => ({
      name: user.name,
      email: user.email,
      password: await bcrypt.hash(user.password, 10)
    })))
    
    const insertedUsers = await userModel.insertMany(insertUsers)

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices() {
  try {
    // clear collection before seeding
    const clearCollection = await invoiceModel.deleteMany({})
    console.log(`removed ${clearCollection.deletedCount} invoices`)
    
    // Insert data into the "invoices" collection
    const insertedInvoices = await invoiceModel.insertMany(invoices)

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers() {
  try {
    // clear collection before seeding
    const clearCollection = await customerModel.deleteMany({})
    console.log(`removed ${clearCollection.deletedCount} customers`)

    // Insert data into the "customers" collection
    const insertedCustomers = await customerModel.insertMany(customers)

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue() {   
  try {
    // clear collection before seeding
    const clearCollection = await revenueModel.deleteMany({})
    console.log(`removed ${clearCollection.deletedCount} revenues`)

    // Insert data into the "revenue" collection
    const insertedRevenue = await revenueModel.insertMany(revenue)
    console.log(`Seeded ${insertedRevenue.length} revenues`);

    return {
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}