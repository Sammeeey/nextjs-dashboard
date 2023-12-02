import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import connect from "@/app/lib/db";
import revenue from "@/app/models/revenue";
import invoice from "@/app/models/invoice";
import customer from "@/app/models/customer";
import { unstable_noStore as noStore } from 'next/cache';

await connect();

export async function fetchRevenue() {
  noStore()
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    const data = await revenue.find({})

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore()
  try {
        // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching latest invoices data...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const unpopulatedInvoices = await invoice.find().limit(5).sort('descending')
    // console.log('unpopulatedInvoices', unpopulatedInvoices)
    const invoiceCustomers = await Promise.all(unpopulatedInvoices.map(async invoice => await customer.findOne({ id: invoice.customer})))
    // console.log('invoiceCustomers', invoiceCustomers)

    const latestInvoices = unpopulatedInvoices.map((invoice, i) => ({
        amount: invoice.amount,
        name: invoiceCustomers[i].name,
        image_url: invoiceCustomers[i].image_url,
        email: invoiceCustomers[i].email,
        id: invoice.id,
    }))

    console.log('Data fetch completed after 5 seconds.');

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore()
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching card data...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const numberOfCustomers = await customer.find().countDocuments() ?? '0'
    const numberOfInvoices = await invoice.find().countDocuments() ?? '0'

    // Calculate the sum of paid invoices
    const invoiceSum = await invoice.aggregate([
      {
        $match: { status: 'paid' }
      },
      {
        $group: {
          _id: null,
          totalPaidInvoices: { $sum: '$amount' }
        }
      }
    ])
    // console.log('invoiceSum', invoiceSum)
    const totalPaidInvoices = invoiceSum[0].totalPaidInvoices
    // console.log('totalPaidInvoices', totalPaidInvoices)

    const pendingInvoices = await invoice.find({status: 'pending'})
    const totalPendingInvoices = pendingInvoices.reduce((accumulator, currentInvoice) => accumulator + currentInvoice.amount, 0)
    // console.log('totalPendingInvoices', totalPendingInvoices)

    console.log('Data fetch completed after 2 seconds.');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query, currentPage) {
  noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  try {
    // TODO get all invoices where customer name, email or invoice amount, invoice date or invoice status match query - search results limited to ITEMS_PER_PAGE - order descending invoice date
    const invoices = await invoice.find({$text: {$search: query}}).skip(offset).limit(ITEMS_PER_PAGE)

    return invoices
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore()
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore()
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore()
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore()
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  noStore()
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
