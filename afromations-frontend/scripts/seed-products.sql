-- Seed DUAL Merchandise Products into Supabase
-- Pricing: Cost + 60% markup for sustainability

-- Phone Cases
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('The Knock Phone Case - iPhone 15/15 Pro', 'Dual-layer protection with O.W.P.I.L artwork. Raised lip protects camera and screen. Compatible with MagSafe wireless charging.', 'phone-cases', 2799, 1050, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_17_17%20PM-Y4Xr01H5gLIAO33vPsywO9hTOWX1T0.png'], 'printify', 'knock-case-iphone-15'),
('The Knock Phone Case - iPhone 14/14 Pro', 'Dual-layer protection with O.W.P.I.L artwork. Precise cutouts for all ports and buttons. Scratch-resistant glossy finish.', 'phone-cases', 2799, 1050, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_17_17%20PM-Y4Xr01H5gLIAO33vPsywO9hTOWX1T0.png'], 'printify', 'knock-case-iphone-14'),
('The Knock Phone Case - Samsung S24', 'Full coverage protection. Compatible with wireless charging. Premium shock absorption.', 'phone-cases', 2499, 950, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_17_17%20PM-Y4Xr01H5gLIAO33vPsywO9hTOWX1T0.png'], 'printify', 'knock-case-samsung-s24');

-- Hoodies
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('DUAL Hero Hoodie - Premium', '100% cotton, heavyweight (450gsm), oversized fit. Premium embroidery front and back. Original O.W.P.I.L manga artwork on back with Japanese text.', 'hoodies', 6999, 2400, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_26_58%20AM-gAwvuW4DafVaGF7DZ2UGeWFJjgSA8Y.png'], 'printful', 'dual-hero-hoodie');

-- T-Shirts
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('DUAL Oversized Tee - Seattle 2056', '100% heavyweight cotton (270gsm), oversized fit. High-quality print front/back. Limited print stays true over time with fade-resistant inks.', 'tees', 3499, 1200, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_27_34%20AM-kuxCdBmp2V5BP8rtMa8QIEkpk1q7uR.png'], 'printful', 'dual-tee-seattle'),
('DUAL Oversized Tee - Washed', '100% heavyweight cotton, vintage washed color options (black, washed black, vintage bone, navy). Double needle stitch reinforced hems.', 'tees', 3499, 1200, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2012_27_31%20PM-61f2pwjjgVYLaonHkDLM4xsFymsvd5.png'], 'printful', 'dual-tee-washed');

-- Posters
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('Seattle 2056 Poster - 18x24', 'Premium museum-quality paper. Giclée print with vivid colors and archival inks. Ready to frame. Limited collector edition.', 'posters', 2499, 600, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_28_30%20AM-8H8mCUB0Xdu0SiaGSEOd1ek64hHZOd.png'], 'printify', 'poster-seattle-18x24'),
('Seattle 2056 Poster - 24x36', 'Premium museum-quality paper. Giclée print with archival inks that last decades. Ships securely in rigid tube.', 'posters', 3999, 900, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_28_30%20AM-8H8mCUB0Xdu0SiaGSEOd1ek64hHZOd.png'], 'printify', 'poster-seattle-24x36'),
('Seattle 2056 Poster - 27x40', 'Museum-quality print, double the size for impact. Theater-size poster. Archival paper resists fading.', 'posters', 4999, 1200, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_28_30%20AM-8H8mCUB0Xdu0SiaGSEOd1ek64hHZOd.png'], 'printify', 'poster-seattle-27x40');

-- Hats
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('O.W.P.I.L Embroidered Hat', '100% cotton, adjustable fit. Premium embroidery front and inner details. Built to endure daily wear. Available in black, charcoal, stone, and navy.', 'hats', 2499, 750, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_40_41%20AM-KHdKe67KMIMvaoCjN0FDGxCUdQTlGB.png'], 'printful', 'owpil-hat');

-- Canvas Prints
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('DUAL Collector Canvas - 24x36 (3 Panel)', 'Gallery-wrapped premium canvas. Solid wood frame, ready to hang. Archival inks printed with vivid colors. Limited edition numbered print.', 'canvas', 19999, 5500, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_22_33%20PM-ol0MDJjT2j6Dui2ozob6YDfHLeDUsO.png'], 'printful', 'dual-canvas-24x36'),
('DUAL Collector Canvas - 36x54 (3 Panel)', 'Premium gallery-wrapped canvas with solid wood frame. Museum-quality print. Pre-installed hanging hardware. Certificate of authenticity included.', 'canvas', 29999, 8000, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_22_33%20PM-ol0MDJjT2j6Dui2ozob6YDfHLeDUsO.png'], 'printful', 'dual-canvas-36x54'),
('DUAL Collector Canvas - 48x72 (3 Panel)', 'Luxury gallery canvas. Bold 3-panel arrangement. Archival inks with 50+ year longevity. Statement piece for serious collectors.', 'canvas', 49999, 12000, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_22_33%20PM-ol0MDJjT2j6Dui2ozob6YDfHLeDUsO.png'], 'printful', 'dual-canvas-48x72');

-- Sticker Pack
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('DUAL Eye Sticker Pack - 10 Premium Vinyl', '10 high-resolution weatherproof stickers. Premium vinyl, fade-resistant, scratch-proof. Perfect for laptops, phones, water bottles, notebooks. Easy peel, no residue.', 'stickers', 1299, 300, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_32_17%20AM-qQVDKzLnlAEl2wkn2Eqn7ILT0bEZL0.png'], 'printify', 'dual-sticker-10pack');

-- Digital Wallpaper Pack
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('DUAL Digital Wallpaper Pack - 10 Designs', 'Digital product - instant download. 10 unique high-resolution wallpapers (4K, mobile, tablet, ultrawide). Optimized for all devices. Personal use only.', 'digital', 999, 0, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2012_25_02%20PM-OBtYNaQujMdi037K0hPCd938Y0ewLO.png'], 'digital', 'dual-wallpaper-pack');

-- Bundle (Collector's Set)
INSERT INTO products (name, description, category, price, cost, images, print_provider, print_provider_sku) VALUES
('DUAL Collector Bundle', 'Complete set: hoodie, oversized tee, hat, poster (24x36), sticker pack, wallpaper pack. Save 20% vs buying separately. Everything O.W.P.I.L. Limited quantity.', 'bundles', 17999, 5450, ARRAY['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_26_58%20AM-gAwvuW4DafVaGF7DZ2UGeWFJjgSA8Y.png', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_27_34%20AM-kuxCdBmp2V5BP8rtMa8QIEkpk1q7uR.png', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2030%2C%202026%2C%2011_40_41%20AM-KHdKe67KMIMvaoCjN0FDGxCUdQTlGB.png'], 'bundle', 'dual-collector-bundle');

-- Create product variants table
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id),
  size VARCHAR(10),
  color VARCHAR(50),
  sku VARCHAR(100),
  printify_variant_id VARCHAR(100),
  printful_variant_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add variants for hoodies
INSERT INTO product_variants (product_id, size, color, sku, printful_variant_id) VALUES
((SELECT id FROM products WHERE name = 'DUAL Hero Hoodie - Premium'), 'XS', 'Black', 'dual-hoodie-xs', 'hoodie-black-xs'),
((SELECT id FROM products WHERE name = 'DUAL Hero Hoodie - Premium'), 'S', 'Black', 'dual-hoodie-s', 'hoodie-black-s'),
((SELECT id FROM products WHERE name = 'DUAL Hero Hoodie - Premium'), 'M', 'Black', 'dual-hoodie-m', 'hoodie-black-m'),
((SELECT id FROM products WHERE name = 'DUAL Hero Hoodie - Premium'), 'L', 'Black', 'dual-hoodie-l', 'hoodie-black-l'),
((SELECT id FROM products WHERE name = 'DUAL Hero Hoodie - Premium'), 'XL', 'Black', 'dual-hoodie-xl', 'hoodie-black-xl'),
((SELECT id FROM products WHERE name = 'DUAL Hero Hoodie - Premium'), '2XL', 'Black', 'dual-hoodie-2xl', 'hoodie-black-2xl');

-- Add variants for tees
INSERT INTO product_variants (product_id, size, color, sku, printful_variant_id) VALUES
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Seattle 2056'), 'S', 'Black', 'dual-tee-s', 'tee-black-s'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Seattle 2056'), 'M', 'Black', 'dual-tee-m', 'tee-black-m'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Seattle 2056'), 'L', 'Black', 'dual-tee-l', 'tee-black-l'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Seattle 2056'), 'XL', 'Black', 'dual-tee-xl', 'tee-black-xl'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Seattle 2056'), '2XL', 'Black', 'dual-tee-2xl', 'tee-black-2xl');

-- Add color variants for washed tees
INSERT INTO product_variants (product_id, size, color, sku, printful_variant_id) VALUES
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Washed'), 'M', 'Black', 'dual-tee-washed-m-black', 'tee-washed-m-black'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Washed'), 'M', 'Washed Black', 'dual-tee-washed-m-wb', 'tee-washed-m-wb'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Washed'), 'M', 'Vintage Bone', 'dual-tee-washed-m-vb', 'tee-washed-m-vb'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Washed'), 'M', 'Navy', 'dual-tee-washed-m-navy', 'tee-washed-m-navy'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Washed'), 'L', 'Black', 'dual-tee-washed-l-black', 'tee-washed-l-black'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Washed'), 'L', 'Washed Black', 'dual-tee-washed-l-wb', 'tee-washed-l-wb'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Washed'), 'L', 'Vintage Bone', 'dual-tee-washed-l-vb', 'tee-washed-l-vb'),
((SELECT id FROM products WHERE name = 'DUAL Oversized Tee - Washed'), 'L', 'Navy', 'dual-tee-washed-l-navy', 'tee-washed-l-navy');

-- Add color variants for hats
INSERT INTO product_variants (product_id, size, color, sku, printful_variant_id) VALUES
((SELECT id FROM products WHERE name = 'O.W.P.I.L Embroidered Hat'), 'One Size', 'Black', 'owpil-hat-black', 'hat-black'),
((SELECT id FROM products WHERE name = 'O.W.P.I.L Embroidered Hat'), 'One Size', 'Charcoal', 'owpil-hat-charcoal', 'hat-charcoal'),
((SELECT id FROM products WHERE name = 'O.W.P.I.L Embroidered Hat'), 'One Size', 'Stone', 'owpil-hat-stone', 'hat-stone'),
((SELECT id FROM products WHERE name = 'O.W.P.I.L Embroidered Hat'), 'One Size', 'Navy', 'owpil-hat-navy', 'hat-navy');

-- Create index for faster lookups
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_print_provider ON products(print_provider);
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_color ON product_variants(color);
CREATE INDEX idx_variants_size ON product_variants(size);
