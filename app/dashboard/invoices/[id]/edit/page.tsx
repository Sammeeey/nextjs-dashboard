import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import EditInvoiceForm from '@/app/ui/invoices/edit-form';
import { notFound } from 'next/navigation';
 
export default async function Page({params}) {
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(params.id),
    fetchCustomers(),
  ])

  if(!invoice) {
    notFound();
  }

  const invoicePlain = JSON.parse(JSON.stringify(invoice))
  const customersArrPlain = customers.map(customer => JSON.parse(JSON.stringify(customer)))
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Update Invoice',
            href: `/dashboard/invoices/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <EditInvoiceForm invoice={invoicePlain} customers={customersArrPlain} />
    </main>
  );
}