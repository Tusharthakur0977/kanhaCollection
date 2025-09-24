/*
  # Insert Sample Products

  1. Sample Data
    - Insert sample products with proper category references
    - Products from the original data with updated structure
*/

-- Insert sample products
INSERT INTO products (id, name, description, price, image, category_id, quantity, featured) 
SELECT 
  gen_random_uuid(),
  products_data.name,
  products_data.description,
  products_data.price,
  products_data.image,
  categories.id,
  products_data.quantity,
  products_data.featured
FROM (
  VALUES
    ('Krishna Brass Idol', 'Beautiful handcrafted brass idol of Lord Krishna playing flute', 2999, 'https://images.pexels.com/photos/33565462/pexels-photo-33565462.jpeg', 'krishna-idols', 15, true),
    ('Pooja Thali Set', 'Complete brass pooja thali with diya, incense holder and bell', 1599, 'https://images.pexels.com/photos/8818732/pexels-photo-8818732.jpeg?auto=compress&cs=tinysrgb&w=400', 'pooja-items', 25, true),
    ('Bhagavad Gita', 'Sacred Bhagavad Gita with Sanskrit shlokas and Hindi translation', 599, 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400', 'books', 50, false),
    ('Rudraksha Mala', 'Authentic 108 beads Rudraksha mala for meditation and prayers', 899, 'https://images.pexels.com/photos/6634244/pexels-photo-6634244.jpeg?auto=compress&cs=tinysrgb&w=400', 'pooja-items', 30, true),
    ('Krishna Wall Hanging', 'Decorative Krishna wall art with intricate designs', 1299, 'https://www.saajawat.com/cdn/shop/products/LordKrishna_480x.jpg?v=1618819625', 'decorative', 20, false),
    ('Incense Sticks Set', 'Premium collection of 12 different aromatic incense sticks', 399, 'https://namasteindia.co/cdn/shop/files/Rose_1200x.jpg?v=1718882027', 'pooja-items', 100, false),
    ('Radha Krishna Marble Idol', 'Exquisite marble statue of Radha Krishna in eternal love pose', 4999, 'https://cdn.exoticindia.com/images/products/original/sculptures-2019/zep728.jpg', 'krishna-idols', 8, true),
    ('Copper Kalash', 'Sacred copper kalash for holy water and religious ceremonies', 1899, 'https://ambihome.in/cdn/shop/files/16_f7332175-fa20-41eb-832b-ba239a3858e9.png?v=1722846583&width=2048', 'pooja-items', 20, false),
    ('Hanuman Chalisa Book', 'Beautiful illustrated Hanuman Chalisa with meaning and benefits', 299, 'https://m.media-amazon.com/images/I/71j9kEJ1Y7L.jpg', 'books', 75, false),
    ('Tulsi Mala', 'Sacred Tulsi beads mala for Krishna devotion and chanting', 599, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK9wwfdCxBeuzxPyzuT7VaysIQn1QSFSw6rA&s', 'pooja-items', 40, false),
    ('Ganesha Brass Idol', 'Handcrafted brass Ganesha idol for removing obstacles', 2199, 'https://urbancart.in/cdn/shop/products/1_901aa95e-dd0d-4f37-b956-cb2025adc0ba.jpg?v=1665053218', 'krishna-idols', 12, false),
    ('Camphor Tablets', 'Pure camphor tablets for aarti and spiritual purification', 199, 'https://www.jiomart.com/images/product/original/494249424/shakti-camphor-tablets-kapur-100-gms-product-images-o494249424-p605499471-4-202310181219.jpg?im=Resize=(420,420)', 'pooja-items', 150, false),
    ('Shiva Lingam Stone', 'Natural Narmada river Shiva Lingam for worship and meditation', 799, 'https://maliyas.com/photol/Black-Stone-Shivalinga-with-carving-work-MSLG152.JPG', 'krishna-idols', 18, false),
    ('Saffron Tilak Powder', 'Premium saffron tilak powder for forehead marking', 399, 'https://www.satvikstore.in/cdn/shop/files/yellow_chandan_720x.jpg?v=1745393804', 'pooja-items', 60, false),
    ('Peacock Feather', 'Natural peacock feathers associated with Lord Krishna', 149, 'https://m.media-amazon.com/images/I/81cz+BqHImL._UF894,1000_QL80_.jpg', 'decorative', 80, false),
    ('Brass Diya Set', 'Set of 5 traditional brass diyas for festivals and daily worship', 699, 'https://www.mypoojabox.in/cdn/shop/files/DSC09381copy.jpg?v=1704316250', 'pooja-items', 35, false),
    ('Ramayana Epic Book', 'Complete Ramayana with beautiful illustrations and commentary', 899, 'https://5.imimg.com/data5/SELLER/Default/2023/12/370257804/WA/RT/OR/3726307/the-great-indian-epic-ramayana-hardbound-english-front.jpg', 'books', 25, false),
    ('Crystal Shree Yantra', 'Sacred crystal Shree Yantra for prosperity and positive energy', 1599, 'https://m.media-amazon.com/images/I/51hTKmQs9ZL._UF894,1000_QL80_.jpg', 'decorative', 15, true),
    ('Sandalwood Paste', 'Pure sandalwood paste for tilak and spiritual ceremonies', 499, 'https://5.imimg.com/data5/ECOM/Default/2023/6/314231052/RY/JD/IA/37886595/1680772140739-chandan8-500x500.jpeg', 'pooja-items', 45, false),
    ('Lotus Candle Holders', 'Beautiful lotus-shaped candle holders for meditation', 899, 'https://m.media-amazon.com/images/I/51gVlAKhvUL._UF894,1000_QL80_.jpg', 'decorative', 22, false)
) AS products_data(name, description, price, image, category_slug, quantity, featured)
JOIN categories ON categories.slug = products_data.category_slug;