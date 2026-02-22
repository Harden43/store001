// src/lib/orderEmail.ts
// Helper to send order confirmation emails after checkout.
// Call this after a successful order creation.

import { supabase } from './supabase';

export async function sendOrderEmails(orderId: string): Promise<{ success: boolean }> {
  const { data, error } = await supabase.functions.invoke('send-order-email', {
    body: { orderId },
  });

  if (error) {
    console.error('Failed to send order emails:', error);
    return { success: false };
  }

  return { success: data?.success ?? false };
}
