const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'amazon_clone',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const generateItems = (category, baseName, count, startId, priceRange) => {
    let items = [];
    for(let i=1; i<=count; i++) {
        items.push(`('${baseName} Model ${Math.floor(Math.random() * 1000)}', 'Premium quality ${category} item with amazing features. Highly rated by customers.', ${Math.floor(Math.random() * priceRange) + 100}.00, 100, '${category}', 'https://source.unsplash.com/random/400x400/?${category.toLowerCase()},${i}')`);
    }
    return items;
};

const run = async () => {
    console.log('Connecting to database...');
    
    // Clear out data
    await pool.query('TRUNCATE order_items, orders, wishlist_items, cart_items, products, users RESTART IDENTITY CASCADE;');

    // Dummy user
    const passwordHash = await bcrypt.hash('password', 10);
    await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)', ['John Doe', 'john@example.com', passwordHash]);

    // Categories and specific 4 items for the Home page grid to ensure home looks perfect
    const initialProducts = [
        // Tech
        {name: 'Apple AirPods Max', description: 'Wireless over-ear headphones with Active Noise Cancellation.', price: 49999.00, stock: 50, category: 'Electronics', image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=800'},
        {name: 'Security Camera Indoor', description: '1080p HD smart home security camera.', price: 2499.00, stock: 100, category: 'Electronics', image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=800'},
        {name: 'Fitness Tracker Smartwatch', description: 'Activity tracker with heart rate monitor.', price: 3999.00, stock: 200, category: 'Electronics', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800'},
        {name: 'Ergonomic Wireless Mouse', description: 'Bluetooth wireless mouse for computers.', price: 1299.00, stock: 300, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800'},

        // Home
        {name: 'Round Wall Mirror', description: 'Decorative wall mirror with wooden frame.', price: 3499.00, stock: 40, category: 'Home', image: 'https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=800'},
        {name: 'Throw Pillow Navy Blue', description: 'Soft textured throw bedding pillow.', price: 899.00, stock: 150, category: 'Home', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'},
        {name: 'Ceramic Dutch Oven', description: 'Blue enamel cast iron dutch oven.', price: 4999.00, stock: 60, category: 'Home', image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=800'},
        {name: 'Table Lamp Minimalist', description: 'Modern desk or nightstand lamp.', price: 1599.00, stock: 90, category: 'Home', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'},

        // Kitchen
        {name: 'Multi-Cooker Pressure', description: 'Instant electric pressure cooker.', price: 6999.00, stock: 50, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=800'},
        {name: 'Espresso Coffee Machine', description: 'Automatic coffee maker with frother.', price: 12999.00, stock: 30, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800'},
        {name: 'Stainless Steel Pots', description: 'Set of 3 cooking pots and pans.', price: 3999.00, stock: 90, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1584990347449-a6efa1a53afb?auto=format&fit=crop&q=80&w=800'},
        {name: 'Electric Kettle Gooseneck', description: 'Fast boiling water kettle.', price: 2199.00, stock: 110, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1586208556562-b9187efebd35?auto=format&fit=crop&q=80&w=800'},

        // Fashion
        {name: 'Womens High Waist Jeans', description: 'Comfortable stretch denim jeans.', price: 1999.00, stock: 150, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'},
        {name: 'Casual Graphic Tee', description: 'Cotton blend casual top.', price: 799.00, stock: 300, category: 'Fashion', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'},
        {name: 'Summer Slip Dress', description: 'Elegant sleeveless summer dress.', price: 1499.00, stock: 100, category: 'Fashion', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800'},
        {name: 'Ankle Boots Suede', description: 'Classic ankle boots for women.', price: 2999.00, stock: 80, category: 'Fashion', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'},

        // Books
        {name: 'The Great Gatsby', description: 'Classic novel by F. Scott Fitzgerald.', price: 499.00, stock: 200, category: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'},
        {name: 'Sapiens: A Brief History', description: 'Exploration of human history by Yuval Noah Harari.', price: 899.00, stock: 120, category: 'Books', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'},
        {name: 'To Kill a Mockingbird', description: 'Harper Lees Pulitzer Prize-winning masterwork.', price: 599.00, stock: 150, category: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'},
        {name: 'Atomic Habits', description: 'An Easy & Proven Way to Build Good Habits.', price: 699.00, stock: 300, category: 'Books', image: 'https://images.unsplash.com/photo-1589998059171-989d887dda1e?auto=format&fit=crop&q=80&w=800'},

        // Toys
        {name: 'Lego Classic Bricks', description: 'Creative building completely unlocked.', price: 2499.00, stock: 100, category: 'Toys', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800'},
        {name: 'Plush Teddy Bear', description: 'Soft and cuddly brown teddy bear.', price: 999.00, stock: 200, category: 'Toys', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80&w=800'},
        {name: 'Wooden Trains Set', description: 'Classic wooden train track building set.', price: 1899.00, stock: 80, category: 'Toys', image: 'https://images.unsplash.com/photo-1584844007817-48f8a2ad39ec?auto=format&fit=crop&q=80&w=800'},
        {name: 'Puzzle 1000 Pieces', description: 'High quality jigsaw puzzle.', price: 799.00, stock: 150, category: 'Toys', image: 'https://images.unsplash.com/photo-1566405545228-a40c9c22d7ba?auto=format&fit=crop&q=80&w=800'},

        // Sports
        {name: 'Yoga Mat', description: 'Non-slip exercise yoga mat with strap.', price: 1299.00, stock: 250, category: 'Sports', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800'},
        {name: 'Dumbbell Set', description: 'Pair of 5kg adjustable dumbbells.', price: 2999.00, stock: 80, category: 'Sports', image: 'https://images.unsplash.com/photo-1638029202288-451a89e0d55f?auto=format&fit=crop&q=80&w=800'},
        {name: 'Tennis Racket', description: 'Professional grade graphic tennis racket.', price: 8999.00, stock: 40, category: 'Sports', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?auto=format&fit=crop&q=80&w=800'},
        {name: 'Basketball', description: 'Official size indoor/outdoor composite basketball.', price: 1499.00, stock: 150, category: 'Sports', image: 'https://images.unsplash.com/photo-1519861531473-920026076135?auto=format&fit=crop&q=80&w=800'},

        // Beauty
        {name: 'Hydrating Face Cream', description: 'Daily moisturizing cream with hyaluronic acid.', price: 899.00, stock: 200, category: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'},
        {name: 'Matte Lipstick Red', description: 'Long-lasting vivid liquid lipstick.', price: 599.00, stock: 300, category: 'Beauty', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800'},
        {name: 'Rose Water Toner', description: 'Natural spray toner for all skin types.', price: 399.00, stock: 250, category: 'Beauty', image: 'https://images.unsplash.com/photo-1608248593842-80ba4ab6bf12?auto=format&fit=crop&q=80&w=800'},
        {name: 'Makeup Brush Set', description: '10-piece professional cosmetic brushes.', price: 1299.00, stock: 100, category: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800'},

        // Automotive
        {name: 'Portable Car Vacuum', description: 'High power car cleaner with HEPA filter.', price: 1599.00, stock: 120, category: 'Automotive', image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?auto=format&fit=crop&q=80&w=800'},
        {name: 'Digital Tire Pressure Gauge', description: 'Accurate metal tire pressure reader.', price: 499.00, stock: 300, category: 'Automotive', image: 'https://images.unsplash.com/photo-1597328290883-50c5787b7c7e?auto=format&fit=crop&q=80&w=800'},
        {name: 'Ceramic Car Wax Kit', description: 'Superior shine and paint protection.', price: 2999.00, stock: 50, category: 'Automotive', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=800'},
        {name: 'Jump Starter Power Bank', description: 'Emergency car battery booster.', price: 4599.00, stock: 80, category: 'Automotive', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'},

        // Grocery
        {name: 'Organic Almond Milk', description: 'Unsweetened plant-based milk alternative.', price: 299.00, stock: 500, category: 'Grocery', image: 'https://images.unsplash.com/photo-1550583724-b26db28af5ce?auto=format&fit=crop&q=80&w=800'},
        {name: 'Roasted Coffee Beans', description: 'Freshly roasted Arabica coffee beans.', price: 799.00, stock: 200, category: 'Grocery', image: 'https://images.unsplash.com/photo-1559056191-754972f3e80f?auto=format&fit=crop&q=80&w=800'},
        {name: 'Extra Virgin Olive Oil', description: 'Cold-pressed premium olive oil.', price: 1299.00, stock: 150, category: 'Grocery', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800'},
        {name: 'Dark Chocolate Bars', description: '70% Cocoa organic dark chocolate.', price: 349.00, stock: 400, category: 'Grocery', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800'},

        // Baby Products
        {name: 'Soft Cotton Baby Onesie', description: 'Breathable cotton jumpsuit for infants.', price: 599.00, stock: 200, category: 'Baby', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'},
        {name: 'Digital Baby Monitor', description: 'Video baby monitor with night vision.', price: 8999.00, stock: 60, category: 'Baby', image: 'https://images.unsplash.com/photo-1555252333-978fead027f9?auto=format&fit=crop&q=80&w=800'},
        {name: 'Silicone Baby Teether', description: 'Safe BPA-free teething toy for babies.', price: 399.00, stock: 500, category: 'Baby', image: 'https://images.unsplash.com/photo-1515488414361-9f2d57577881?auto=format&fit=crop&q=80&w=800'},
        {name: 'Baby Diaper Bag Backpack', description: 'Large capacity waterproof travel bag.', price: 2499.00, stock: 100, category: 'Baby', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'},

        // Tools & Improvement
        {name: 'Cordless Power Drill', description: '20V Max lithium-ion heavy duty drill.', price: 5999.00, stock: 80, category: 'Tools', image: 'https://images.unsplash.com/photo-1504148455328-436277703965?auto=format&fit=crop&q=80&w=800'},
        {name: 'Professional Tool Box', description: 'Durable metal tool organizer and storage.', price: 3499.00, stock: 150, category: 'Tools', image: 'https://images.unsplash.com/photo-1530124560677-bdaeaeb2fdef?auto=format&fit=crop&q=80&w=800'},
        {name: 'Laser Distance Measure', description: 'Precision digital measuring tool.', price: 2199.00, stock: 200, category: 'Tools', image: 'https://images.unsplash.com/photo-1572981779307-38b8cbad2407?auto=format&fit=crop&q=80&w=800'},
        {name: 'LED Work Light', description: 'Portable rechargeable floodlight for jobs.', price: 1299.00, stock: 250, category: 'Tools', image: 'https://images.unsplash.com/photo-1558230582-18120efc5f5b?auto=format&fit=crop&q=80&w=800'}
    ];

    let queryVals = initialProducts.map(p => `('${p.name.replace(/'/g, "''")}', '${p.description.replace(/'/g, "''")}', ${p.price}, ${p.stock}, '${p.category}', '${p.image}')`);

    // Generate 15 extra items per category to heavily populate search views
    const mainCategories = [
        ['Electronics', 'Gadget'], ['Home', 'Decor'], ['Kitchen', 'Tool'], 
        ['Fashion', 'Style'], ['Books', 'Novel'], ['Toys', 'Fun Item'], 
        ['Sports', 'Pro Gear'], ['Beauty', 'Care Item'], ['Automotive', 'Car Part'], 
        ['Grocery', 'Fresh Food'], ['Baby', 'Infant Care'], ['Tools', 'Hard Gear']
    ];

    mainCategories.forEach(([cat, base]) => {
        queryVals = queryVals.concat(generateItems(cat, base, 15, 0, 5000));
    });

    const insertQuery = `INSERT INTO products (name, description, price, stock, category, image_url) VALUES ${queryVals.join(',\n')}`;
    
    await pool.query(insertQuery);
    
    console.log(`Successfully generated and seeded ${queryVals.length} products total across ${mainCategories.length} categories!`);
    await pool.end();
    process.exit(0);
};

run().catch(err => {
    console.error(err);
    process.exit(1);
});
