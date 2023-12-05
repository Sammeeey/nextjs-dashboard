'use server';

import { revalidatePath } from "next/cache";
import invoice from "../models/invoice";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function createInvoice(prevState, formData){
    try {
        // console.log('createInvoice action')

        const rawFormData = {
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
        };
        // console.log('rawFormData', rawFormData);

        const amountInCents = rawFormData.amount === '' ? -1 : rawFormData.amount * 100
        // console.log('amountInCents', amountInCents)

        const date = new Date().toISOString().split('T')[0];
        // console.log('date', date)

        try {
            await invoice.create({
                customer_id: rawFormData.customerId,
                amount: amountInCents,
                status: rawFormData.status,
                date
            }).then(invoice => console.log(invoice))
        } catch (error) {
            const errorMessages = {}
            for (let [key, val] of Object.entries(error.errors)){
                errorMessages[val.properties.path] = val.properties.message
            }
            const newState = {message: 'Missing fields. Failed to create invoice.', errors: errorMessages}
            return newState
        }
    } catch (error) {
        console.log(error)
        return {message: 'Database Error: failed to create invoice'}
    }

    revalidatePath(`/dashboard/invoices`)
    redirect(`/dashboard/invoices`)
}


export async function updateInvoice(id, formData) {
    try {
        console.log('updateInvoice action')
        // console.log('formData', formData)
    
        const customerId = formData.get('customerId')
        const amount = formData.get('amount')
        const status = formData.get('status')
    
        const amountInCents = amount * 100
        // console.log('amountInCents', amountInCents)
    
        const date = new Date().toISOString().split('T')[0];
        // console.log('date', date)
    
        await invoice.findByIdAndUpdate(id, {
            customer_id: customerId,
            amount: amountInCents,
            status: status,
            date
        }).then(invoice => console.log(invoice))
    } catch (error) {
        console.log(error)
        return {message: 'error: failed to update invoice'}
    }

    revalidatePath(`/dashboard/invoices`)
    redirect(`/dashboard/invoices`)
}


export async function deleteInvoice(id) {
    try {
        console.log(`deleteInvoice action for id ${id}`)
    
        await invoice.findByIdAndDelete(id)

        revalidatePath(`/dashboard/invoices`)
        return {message: 'invoice deleted'}
    } catch (error) {
        console.log(error)
        return {message: 'error: failed to delete invoice'}
    }

}


export async function authenticate(prevState, formData) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid Credentials.';        
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}