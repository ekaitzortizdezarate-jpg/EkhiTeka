-- ==============================================================================
-- EKALTEKA: POLÍTICAS RLS PARA EQUIPO MULTI-VENDEDOR / TIENDA ÚNICA
-- Ejecuta este script en el SQL Editor de tu Dashboard de Supabase.
-- ==============================================================================

-- 1. TABLA PROFILES
-- Permite que cualquier usuario autenticado lea perfiles (para ver nombres de compradores
-- en pedidos y compartir datos de tienda entre todos los vendedores).
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Public can view seller profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Profiles are viewable by authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Public can view seller profiles"
ON profiles FOR SELECT
TO anon
USING (role IN ('vendedor', 'admin'));

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);


-- 2. TABLA ORDERS
-- Compradores ven sus pedidos (auth.uid() = buyer_id).
-- TODOS los vendedores y admins ven y editan TODOS los pedidos de la tienda.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Sellers can view their orders" ON orders;
DROP POLICY IF EXISTS "Sellers can view all store orders" ON orders;
DROP POLICY IF EXISTS "Buyers can create orders" ON orders;
DROP POLICY IF EXISTS "Sellers can update all store orders" ON orders;
DROP POLICY IF EXISTS "Users can delete orders" ON orders;

CREATE POLICY "Buyers can view their own orders and sellers view all store orders"
ON orders FOR SELECT
TO authenticated
USING (
  auth.uid() = buyer_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);

CREATE POLICY "Buyers can create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update all store orders"
ON orders FOR UPDATE
TO authenticated
USING (
  auth.uid() = buyer_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);

CREATE POLICY "Sellers can delete store orders"
ON orders FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);


-- 3. TABLA ORDER_ITEMS
-- Compradores ven los items de sus compras; los vendedores ven los de toda la tienda.
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;

CREATE POLICY "Users and sellers can view order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (
      orders.buyer_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
    )
  )
);

CREATE POLICY "Users can insert order items"
ON order_items FOR INSERT
TO authenticated
WITH CHECK (true);


-- 4. TABLA CHAT_MESSAGES
-- Compradores ven sus mensajes con la tienda; TODOS los vendedores ven TODOS los mensajes.
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Sellers can view all store chats" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update chat messages" ON chat_messages;

CREATE POLICY "Users and sellers can view chat messages"
ON chat_messages FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid() OR
  receiver_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);

CREATE POLICY "Users can insert chat messages"
ON chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
);

CREATE POLICY "Users and sellers can update chat messages"
ON chat_messages FOR UPDATE
TO authenticated
USING (
  receiver_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);

DROP POLICY IF EXISTS "Sellers can delete chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete their chat messages" ON chat_messages;

CREATE POLICY "Sellers can delete chat messages"
ON chat_messages FOR DELETE
TO authenticated
USING (
  sender_id = auth.uid() OR
  receiver_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);


-- 5. TABLA PRODUCTS
-- Lectura pública para el catálogo y gestión completa para cualquier vendedor.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Sellers can insert products" ON products;
DROP POLICY IF EXISTS "Sellers can update products" ON products;
DROP POLICY IF EXISTS "Sellers can delete products" ON products;

CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
USING (true);

CREATE POLICY "Sellers can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);

CREATE POLICY "Sellers can update products"
ON products FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);

CREATE POLICY "Sellers can delete products"
ON products FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('vendedor', 'admin'))
);
