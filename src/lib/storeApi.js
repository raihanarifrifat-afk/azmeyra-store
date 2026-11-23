import { isSupabaseConfigured, supabase } from './supabase.js';

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
  }
  return supabase;
}

export async function getActiveCategories() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('categories')
    .select('id,name,slug,description,image_url,sort_order')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data;
}

export async function getActiveProducts({ categoryId, search } = {}) {
  const client = requireSupabase();
  let query = client
    .from('products')
    .select('id,name,slug,description,price,compare_at_price,images,sizes,colors,stock,tag,category:categories(id,name,slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (categoryId) query = query.eq('category_id', categoryId);
  if (search?.trim()) query = query.ilike('name', `%${search.trim()}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function signUpCustomer({ email, password, fullName, phone }) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } }
  });
  if (error) throw error;
  return data;
}

export async function signInCustomer({ email, password }) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutCustomer() {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getCurrentCustomer() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getMyOrders() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .select('id,order_number,status,payment_method,subtotal,delivery_fee,total,created_at,order_items(id,product_name,unit_price,quantity,size,color,image_url)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Guest checkout is performed by a database function. The function re-reads
 * product prices and stock on the server; the browser never supplies totals.
 * Online payments remain disabled until a verified payment gateway is added.
 */
export async function placeCashOnDeliveryOrder({ customerName, phone, email, address, deliveryArea, items }) {
  const client = requireSupabase();
  const { data, error } = await client.rpc('create_guest_order', {
    p_customer_name: customerName,
    p_phone: phone,
    p_email: email || null,
    p_shipping_address: address,
    p_payment_method: 'cod',
    p_items: items.map(item => ({
      product_id: item.id,
      quantity: item.qty,
      size: item.size || null,
      color: item.color || null
    })),
    p_delivery_area: deliveryArea
  });
  if (error) throw error;
  return data;
}

export async function submitContactMessage({ name, contact, subject, message }) {
  const client = requireSupabase();
  const { error } = await client.from('contact_messages').insert({
    name, contact, subject, message
  });
  if (error) throw error;
}
