'use server';

import { revalidatePath } from "next/cache";
import invoice from "../models/invoice";
import { redirect } from "next/navigation";

export async function createInvoice(formData){
    // console.log('createInvoice action')

    const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    };
    // console.log('rawFormData', rawFormData);

    const amountInCents = rawFormData.amount * 100
    // console.log('amountInCents', amountInCents)

    const date = new Date().toISOString().split('T')[0];
    // console.log('date', date)

    await invoice.create({
        customer_id: rawFormData.customerId,
        amount: amountInCents,
        status: rawFormData.status,
        date
    }).then(invoice => console.log(invoice))

    revalidatePath(`/dashboard/invoices`)
    redirect(`/dashboard/invoices`)
}


export async function updateInvoice(formData) {
    console.log('updateInvoice action')
}