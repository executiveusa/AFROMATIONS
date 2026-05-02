-- DUAL Merch Store Tables

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  printify_product_id VARCHAR(255),
  printful_product_id VARCHAR(255),
  inventory_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product variants (sizes, colors)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(50),
  color VARCHAR(100),
  sku VARCHAR(255) UNIQUE,
  printify_variant_id VARCHAR(255),
  printful_variant_id VARCHAR(255),
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  inventory_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shopping cart
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id VARCHAR(255) NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_order_id VARCHAR(255) UNIQUE,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  printify_order_id VARCHAR(255),
  printful_order_id VARCHAR(255),
  fulfillment_status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price_paid DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_orders_customer ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Insert DUAL Merch Products
INSERT INTO products (name, description, category, price, cost, image_url) VALUES
-- Phone Cases
('THE KNOCK Phone Case - iPhone', 'Dual layer protection with DUAL artwork. Shock-absorbing inner layer, glossy finish.', 'phone-cases', 34.99, 12.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_17_17%20PM-Y4Xr01H5gLIAO33vPsywO9hTOWX1T0.png'),
('THE KNOCK Phone Case - Samsung', 'Premium protection for Samsung devices. Same quality as iPhone case.', 'phone-cases', 34.99, 12.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_17_17%20PM-Y4Xr01H5gLIAO33vPsywO9hTOWX1T0.png'),

-- Hoodies
('DUAL Hero Hoodie', 'Premium heavyweight hoodie, 100% cotton, oversized fit. Premium embroidery on chest and back.', 'hoodies', 64.99, 22.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_26_58%20AM-fI5zDKn6t5wYFHcXR9EHmoAO0Bw7hY.png'),

-- Tees
('DUAL Oversized Tee', 'Premium heavyweight cotton tee. High-quality print that resists fading. Oversized fit for all-day comfort.', 'tees', 29.99, 8.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_27_34%20AM-kuxCdBmp2V5BP8rtMa8QIEkpk1q7uR.png'),
('DUAL Washed Tee', 'Vintage wash effect with distressed printing. Limited release, once it&apos;s gone, it&apos;s gone.', 'tees', 32.99, 9.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_27_31%20PM-61f2pwjjgVYLaonHkDLM4xsFymsvd5.png'),

-- Posters
('Seattle 2056 Poster', 'Premium museum-quality print. Multiple sizes available. Made to order for maximum quality.', 'posters', 44.99, 10.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_28_30%20AM-8H8mCUYBudu0SiaGSEOd1ek64hHZOd.png'),

-- Canvas
('DUAL Collector Canvas - 3 Panel', 'Premium gallery-wrapped canvas with solid wood frame. Archival inks. Limited edition with certificate.', 'canvas', 149.99, 45.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_22_33%20PM-ol0MDJjT2j6Dui2ozob6YDfHLeDUsO.png'),

-- Hats
('O.W.P.I.L Embroidered Cap', 'Premium embroidery on 100% cotton cap. Adjustable strap back. Built to endure.', 'hats', 24.99, 6.50, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_40_41%20AM-KHdKe67KMIMvaoCjN0FDGxCUdQTlGB.png'),

-- Stickers
('DUAL Sticker Pack', '10 premium vinyl stickers. Waterproof, fade resistant, easy peel. Perfect for laptops, phones, water bottles.', 'stickers', 12.99, 2.50, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_32_17%20AM-qQVDKzLnlAEl2wkn2Eqn7ILT0bEZL0.png'),

-- Digital
('DUAL Digital Wallpaper Pack', '10 high-resolution wallpapers in multiple formats (desktop, mobile, tablet, ultrawide). Instant download.', 'digital', 9.99, 0.50, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_25_02%20PM-OBvuW4DafVaGF7DZ2UGeWFJjgSA8Y.png');

-- Product variants for hoodies
INSERT INTO product_variants (product_id, size, color, sku, price_adjustment) 
SELECT id, size, 'Black', CONCAT('HERO-HOODIE-', size), 0 FROM (
  SELECT * FROM products WHERE name = 'DUAL Hero Hoodie'
) p, 
(VALUES ('XS'), ('S'), ('M'), ('L'), ('XL'), ('2XL')) AS sizes(size);

-- Product variants for tees
INSERT INTO product_variants (product_id, size, color, sku, price_adjustment)
SELECT id, size, color, CONCAT('DUAL-TEE-', size, '-', color), 
  CASE WHEN color != 'Black' THEN 2.00 ELSE 0 END
FROM (
  SELECT * FROM products WHERE category = 'tees'
) p,
(VALUES ('S'), ('M'), ('L'), ('XL'), ('2XL')) AS sizes(size),
(VALUES ('Black'), ('Washed Black'), ('Navy')) AS colors(color);

-- Product variants for posters
INSERT INTO product_variants (product_id, size, sku, price_adjustment)
SELECT id, size, CONCAT('POSTER-', size), price_adjust
FROM (
  SELECT * FROM products WHERE name = 'Seattle 2056 Poster'
) p,
(VALUES 
  ('18" x 24"', 0),
  ('24" x 36"', 10.00),
  ('27" x 40"', 15.00)
) AS sizes(size, price_adjust);

-- Product variants for canvas
INSERT INTO product_variants (product_id, size, sku, price_adjustment)
SELECT id, size, CONCAT('CANVAS-', size), price_adjust
FROM (
  SELECT * FROM products WHERE category = 'canvas'
) p,
(VALUES 
  ('24"x36" (3 Panels)', 0),
  ('36"x54" (3 Panels)', 50.00),
  ('48"x72" (3 Panels)', 100.00)
) AS sizes(size, price_adjust);
