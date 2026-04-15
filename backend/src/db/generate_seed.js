import pg from 'pg';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'amazon_clone',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

/* ─────────────────── Product Catalog ─────────────────── */
const products = [

  /* ══════════ LAPTOPS ══════════ */
  { name: 'ASUS Vivobook S14 Intel Core Ultra 7 255H 16GB RAM 512GB SSD FHD+ 14" Windows 11 Cool Silver', description: 'Intel Core Ultra 7 255H | 16GB DDR5 RAM | 512GB NVMe SSD | 14" FHD+ 60Hz | Windows 11 Home | Office 2024 Lifetime', price: 88990, stock: 50, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/71gcREwFhxL._AC_PT0_BL0_SX216_SY110_.jpg' },
  { name: 'Lenovo IdeaPad Slim 3 Intel Core i3 12th Gen 15.6" FHD Thin & Light Laptop 8GB 512GB Arctic Grey', description: 'Intel Core i3-1215U | 8GB DDR4 | 512GB SSD | 15.6" FHD TN | Windows 11 | Office 2021', price: 34990, stock: 100, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/81Be1f26lVL._SX425_.jpg' },
  { name: 'ASUS Vivobook 16 Intel Core i3-1215U 12th Gen 16" WUXGA Thin & Light Laptop 8GB 512GB Transparent Silver', description: 'Intel Core i3-1215U | 8GB DDR4 | 512GB NVMe | 16" WUXGA 16:10 | Windows 11 | Office 2021', price: 33990, stock: 100, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/71c0GSxtEEL._SX679_.jpg' },
  { name: 'ASUS Vivobook 15 Intel Core i3-1220P 12th Gen 15.6" FHD Thin & Light Laptop 8GB 512GB Quiet Blue', description: 'Intel Core i3-1220P | 8GB DDR4 | 512GB NVMe | 15.6" FHD | Windows 11 | Office 2021', price: 35990, stock: 100, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/41qinwoM48L._SY300_SX300_QL70_FMwebp_.jpg' },
  { name: 'Sony HT-S20R Real 5.1ch Dolby Digital Soundbar for TV with subwoofer and Compact Rear Speakers, 5.1ch Home Theatre System (400W,Bluetooth & USB Connectivity, HDMI & Optical connectivity)', description: 'Dolby Audio : Enjoy dramatic, high-quality surround sound from 5.1 separate audio channels with Dolby Digital', price: 15989 , stock: 15, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/71h7fLNEQPL._SX355_.jpg' },
  { name: 'Lenovo 15.6" (39.62cm) Slim Everyday Backpack, Made in India, Compact, Water-resistant, Organized storage:Laptop sleeve,tablet pocket,front workstation,2-side pockets,Padded adjustable shoulder straps', description: 'Slim, compact & sturdy: Minimal and compact design for professionals: Joint material design, durable, water-resistant polyester material. The padded shoulder straps, handle, and back panel provides protection and all-day comfort', price: 759 , stock: 35, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/61v0-iGlR1L._SY606_.jpg' },
  { name: 'Dyazo 6 Angles Adjustable Aluminum Ergonomic Foldable Portable Tabletop Laptop/Desktop Riser Stand Holder Compatible for MacBook, HP, Dell, Lenovo & All Other Notebook (Silver)', description: 'Dyazo Height Adjusting Laptop Stand Or Laptop Ergonomic Stand Or Laptop Stands For Office Desk Improves Your Posture Scientifically Designed To Help You Balance You’re Sitting Posture Keeping Your Back Straight, Neck Relaxed And Wrists Natural Even After Long Work Hours', price: 369, stock: 20, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/61kBmC8NfGL._SX522_.jpg' },
  { name: 'Ambrane Unbreakable 3A Fast Charging 1.5m Braided Type C Cable for Smartphones, Tablets & other Type C devices, 480Mbps Data Sync, Quick Charge 3.0 (RCT15A, Black)', description: '3A Fast Charging - Delivers 3A fast charging and 480 Mbps data transfer speed.', price: 153 , stock: 60, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/61W8xeZTwxL._SX679_.jpg' },
  { name: 'Dell Inspiron 14 Intel Core i5-1334U 12th Gen 14" FHD+ 16GB RAM 512GB SSD', description: 'Intel Core i5-1334U | 16GB DDR4 | 512GB PCIe SSD | 14" FHD+ | Windows 11 | Platinum Silver', price: 62990, stock: 40, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/71n7iI3T7+L._SX679_.jpg' },
  { name: 'MacBook Air M2 13" 8GB RAM 256GB SSD Starlight', description: 'Apple M2 chip | 8-core CPU | 8-core GPU | 8GB Unified Memory | 256GB SSD | 13.6" Liquid Retina', price: 99900, stock: 25, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg' },
  { name: 'Acer Swift Go 14 Intel Core Ultra 5 125H AI PC 16GB LPDDR5X 512GB SSD OLED 2.8K', description: 'Intel Core Ultra 5 125H | 16GB LPDDR5X | 512GB SSD | 14" OLED 2.8K 90Hz | Windows 11', price: 79990, stock: 30, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/71bTtJlInSL._SX679_.jpg' },
  { name: 'HP Envy x360 AMD Ryzen 7 7730U 2-in-1 Touchscreen 16GB RAM 1TB SSD OLED 13.3"', description: 'AMD Ryzen 7 7730U | 16GB DDR4 | 1TB SSD | 13.3" OLED Touch | 360° | Windows 11 | Pen included', price: 89990, stock: 20, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/81dkX0cjHhL._SX679_.jpg' },
  { name: 'Acer Aspire Lite AMD Ryzen 5 5500U 15.6" FHD IPS Slim & Light Laptop 8GB 512GB', description: 'AMD Ryzen 5 5500U | 8GB DDR4 | 512GB SSD | 15.6" FHD IPS | Windows 11 | Pure Silver', price: 36990, stock: 80, category: 'Laptops', image_url: 'https://m.media-amazon.com/images/I/71zCiCCgJML._SX679_.jpg' },

  /* ══════════ HEADPHONES ══════════ */
  { name: 'Sony WH-1000XM5 Industry Leading Wireless Noise Cancelling Headphones 30HR Battery', description: '30hr battery | Multipoint connection | Speak-to-chat | Auto NC optimizer | LDAC | Touch controls | Black', price: 24990, stock: 80, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/61+Eq-Qv5bL._SX522_.jpg' },
  { name: 'boAt Rockerz 450 Bluetooth On Ear Headphone with Mic 15HR Battery Luscious Black', description: '40mm drivers | 15H playback | 40ms low latency | Foldable design | Immersive audio | Mic', price: 1299, stock: 300, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/61isBQ4IKLL._SX679_.jpg' },
  { name: 'JBL Tune 770NC Wireless Over Ear Noise Cancelling Headphones Upto 70Hrs Playtime Black', description: 'Adaptive ANC | 70H battery | JBL Pure Bass | Multipoint | Fast charging | Foldable | Black', price: 5999, stock: 150, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/61-J89N6gLL._SX679_.jpg' },
  { name: 'boAt Airdopes 141 TWS Earbuds with ENx Noise Cancellation 42H Playback IPX4', description: '42H total playback | ENx noise cancellation | IPX4 | 10mm drivers | Instant voice assistant', price: 999, stock: 500, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/51ItJx1JeGL._SX679_.jpg' },
  { name: 'Sony WF-1000XM5 Industry Leading Noise Cancellation Truly Wireless Earbuds', description: 'Industry best noise cancellation | 8+16H battery | LDAC | Call quality | Multipoint | Black', price: 19990, stock: 60, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/618QrOl1GfL._SX679_.jpg' },
  { name: 'Apple AirPods Pro 2nd Gen with MagSafe Charging Case USB-C', description: 'Active Noise Cancellation | Transparency mode | Adaptive Audio | H2 chip | IPX4 | Personalised Spatial Audio', price: 24900, stock: 40, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SX679_.jpg' },
  { name: 'Noise Buds VS104 TWS Earbuds 45dB ANC 36H Playtime IPX5 Water Resistant', description: '45dB ANC | 36H total playback | 13mm drivers | IPX5 | Dual microphone | Touch controls', price: 1299, stock: 200, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/71LIiRO3eAL._SX679_.jpg' },
  { name: 'Sennheiser HD 450BT Wireless Headphone with Active Noise Cancellation 30H Battery', description: 'Hybrid ANC | 30H battery | foldarble | Voice assistant | USB-C | Black', price: 7990, stock: 70, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/41+MV3wNQLL._SX522_.jpg' },
  { name: 'OnePlus Bullets Z2 Bluetooth Wireless in Ear Earphones with Mic AI-Powered Calls 40H Battery', description: '40H battery | AI-call noise cancellation | 12.4mm dynamic driver | IP55 | Dolby Atmos | Fast charge 10mins=20H', price: 1799, stock: 300, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/61JBWiAPfJS._SX679_.jpg' },
  { name: 'Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones 24H Battery White Smoke', description: 'High-fidelity audio | 24H battery | Quiet and Aware modes | Comfortable fit | Multipoint | White Smoke', price: 29900, stock: 30, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/51BPANgQFcL._SX679_.jpg' },
  { name: 'realme Buds Air 5 Pro TWS Earbuds 50dB ANC 38H Battery 11mm Dynamic Driver', description: '50dB ANC | 38H battery | 11mm titanised driver | LDAC | IP55 | Dual device connection', price: 2499, stock: 250, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/61Bz9fYXoUL._SX679_.jpg' },
  { name: 'boAt Rockerz 551ANC Hybrid Active Noise Cancellation Wireless Headphone 70H Playtime', description: 'Hybrid ANC | 70H playtime | 40mm drivers | Type-C charging | Soft padded earcups | Black', price: 2199, stock: 180, category: 'Headphones', image_url: 'https://m.media-amazon.com/images/I/618DKBAGD4L._SX679_.jpg' },

  /* ══════════ MOBILES ══════════ */
  { name: 'Samsung Galaxy S24 5G 8GB RAM 256GB Onyx Black', description: 'Snapdragon 8 Gen 3 | 6.2" Dynamic AMOLED 2X 120Hz | 50MP Camera | 4000mAh | Android 14 | Galaxy AI', price: 72999, stock: 60, category: 'Mobiles', image_url: 'https://m.media-amazon.com/images/I/71q3ql1BGSL._SX679_.jpg' },
  { name: 'Apple iPhone 15 128GB Black', description: 'A16 Bionic | 6.1" Super Retina XDR | 48MP main camera | Dynamic Island | USB-C | iOS 17', price: 69900, stock: 50, category: 'Mobiles', image_url: 'https://m.media-amazon.com/images/I/61cwywLZR-L._SX679_.jpg' },
  { name: 'OnePlus 12R 5G 8GB RAM 128GB Iron Gray', description: 'Snapdragon 8 Gen 2 | 6.78" ProXDR 120Hz | 50MP Sony Camera | 5500mAh | 100W SUPERVOOC | OxygenOS 14', price: 39999, stock: 80, category: 'Mobiles', image_url: 'https://m.media-amazon.com/images/I/71oHi1Oacgl._SX679_.jpg' },
  { name: 'realme 13 Pro+ 5G 12GB RAM 512GB Monet Purple Submarine', description: 'Snapdragon 7s Gen 3 | 6.7" AMOLED 120Hz | 50MP Sony IMX890 | 5200mAh | 80W charge', price: 32999, stock: 100, category: 'Mobiles', image_url: 'https://m.media-amazon.com/images/I/71v8X9cFtyL._SX679_.jpg' },
  { name: 'Redmi Note 13 Pro+ 5G 12GB RAM 256GB Midnight Black', description: 'MediaTek Dimensity 7200 Ultra | 6.67" AMOLED 120Hz | 200MP | 5000mAh | 120W HyperCharge | MIUI 14', price: 31999, stock: 120, category: 'Mobiles', image_url: 'https://m.media-amazon.com/images/I/71lRhEa7G7L._SX679_.jpg' },
  { name: 'Samsung Galaxy A35 5G 8GB RAM 256GB Awesome Iceblue', description: 'Exynos 1380 | 6.6" Super AMOLED 120Hz | 50MP Triple Camera | 5000mAh | 25W | Android 14', price: 26999, stock: 90, category: 'Mobiles', image_url: 'https://m.media-amazon.com/images/I/71WCKq6LNML._SX679_.jpg' },
  { name: 'iQOO Neo 9 Pro 5G 12GB RAM 256GB Speed Orange', description: 'Snapdragon 8 Gen 3 | 6.78" AMOLED 144Hz | 50MP OIS | 4600mAh | 144W FlashCharge | Origin OS 4', price: 34999, stock: 70, category: 'Mobiles', image_url: 'https://m.media-amazon.com/images/I/61TH7X6ExXL._SX679_.jpg' },
  { name: 'Nothing Phone (2a) 5G 8GB RAM 128GB White/Black', description: 'MediaTek Dimensity 7200 Pro | 6.7" AMOLED 120Hz | 50MP dual camera | 5000mAh | 45W | Glyph Interface', price: 19999, stock: 110, category: 'Mobiles', image_url: 'https://m.media-amazon.com/images/I/61-nRRQMVBL._SX679_.jpg' },

  /* ══════════ MONITORS ══════════ */
  { name: 'LG 27" IPS Full HD Monitor 27MP60G-B 75Hz FreeSync HDMI', description: '27" IPS FHD | 75Hz | 5ms GtG | FreeSync | HDMI x2 | DP | Black Stabilizer | Anti-Glare', price: 13999, stock: 60, category: 'Monitors', image_url: 'https://m.media-amazon.com/images/I/71SL+a7EHNL._SX679_.jpg' },
  { name: 'Samsung 24" FHD IPS Monitor LS24C330GAWXXL 165Hz 1ms AMD FreeSync', description: '24" FHD IPS | 165Hz | 1ms GTG | AMD FreeSync Premium | HDMI | DP | Eye Saver Mode', price: 14999, stock: 80, category: 'Monitors', image_url: 'https://m.media-amazon.com/images/I/71wJJsQ0KML._SX679_.jpg' },
  { name: 'ASUS VA27DQF 27" Eye Care Monitor 1080P 100Hz Frameless IPS HDMI DP', description: '27" FHD IPS | 100Hz | 1ms MPRT | HDMI | DP | VGA | Eye Care Plus | Flicker free | Low Blue Light', price: 12999, stock: 70, category: 'Monitors', image_url: 'https://m.media-amazon.com/images/I/71J3LRLZ03L._SX679_.jpg' },
  { name: 'MSI 27" QHD 170hz 2560x1440 Rapid IPS Gaming Monitor G27Q7 1ms', description: '27" QHD 2560x1440 | 170Hz | 1ms | Rapid IPS | Gaming | HDMI 2.0 | DP 1.2 | USB Hub', price: 24990, stock: 40, category: 'Monitors', image_url: 'https://m.media-amazon.com/images/I/81Fj1YZtWvL._SX679_.jpg' },
  { name: 'Dell 27" 4K UHD IPS Monitor S2722QC USB-C 65W Charging HDMI DP', description: '27" 4K UHD IPS | 60Hz | HDR400 | USB-C 65W | HDMI | DP | Built-in speakers | Pivot', price: 34990, stock: 35, category: 'Monitors', image_url: 'https://m.media-amazon.com/images/I/61+qPkJMIrL._SX679_.jpg' },

  /* ══════════ CAMERAS ══════════ */
  { name: 'Canon EOS 1500D 24.1MP Digital SLR Camera with 18-55mm Lens Wi-Fi', description: '24.1MP APS-C CMOS | DIGIC 4+ | 9-point AF | 3fps | Full HD video | Wi-Fi | 18-55mm kit lens', price: 34990, stock: 30, category: 'Cameras', image_url: 'https://m.media-amazon.com/images/I/81MHI2DpFxL._SX679_.jpg' },
  { name: 'Sony Alpha ZV-E10 APS-C Interchangeable Lens Mirrorless Vlog Camera 16-50mm Kit', description: '24.2MP APS-C | Real-time Eye AF | S-Cinetone | 4K 30p | Vari-angle touchscreen | White', price: 59990, stock: 20, category: 'Cameras', image_url: 'https://m.media-amazon.com/images/I/71sM8v8JHFL._SX679_.jpg' },
  { name: 'GoPro HERO12 Black 5.3K 60fps Action Camera with HyperSmooth 6.0', description: '5.3K60 | 27MP Photos | HyperSmooth 6.0 | Enduro Battery | 10m Waterproof | Webcam | Live Stream', price: 34999, stock: 45, category: 'Cameras', image_url: 'https://m.media-amazon.com/images/I/61D24gqerGL._SX679_.jpg' },
  { name: 'Nikon Z30 20.9MP Mirrorless Camera with 16-50mm Lens Vlogging Kit', description: '20.9MP APS-C CMOS | 4K 30p | 1.5x crop 4K | No IBIS | 209-point AF | Flip touchscreen', price: 69990, stock: 15, category: 'Cameras', image_url: 'https://m.media-amazon.com/images/I/717GNqxKKSL._SX679_.jpg' },

  /* ══════════ FURNITURE ══════════ */
  { name: 'Wakefit Orthopaedic Memory Foam Mattress Queen Size 6 Inch 78x60 with 2 Pillows', description: '6 inch memory foam | Orthopaedic | Medium Firm | Cool Gel layer | 100 night trial | 10 year warranty', price: 9999, stock: 40, category: 'Furniture', image_url: 'https://m.media-amazon.com/images/I/71H+rFVVBNL._SX679_.jpg' },
  { name: 'Green Soul Jupiter Pro 2.0 High Back Ergonomic Chair Recline 135° Lumbar Support', description: 'Mesh back | 135° recline | lumbar support | armrests 4D | headrest | Black/Grey | 130kg', price: 14999, stock: 25, category: 'Furniture', image_url: 'https://m.media-amazon.com/images/I/51MOSmYHLsL._SX679_.jpg' },
  { name: 'Duroflex Strength 6 Inch King Size Bonnell Spring Mattress with Eurotop 78x72 ', description: 'Bonnell spring | 6 inch eurotop | King 78x72 | Medium firm | 5 year warranty | Cotton quilting', price: 13999, stock: 20, category: 'Furniture', image_url: 'https://m.media-amazon.com/images/I/71eaZFidFVL._SX679_.jpg' },
  { name: 'IKEA KALLAX Shelving Unit White 77x77cm 4 Cubes Versatile Storage', description: '77x77 cm | 4 compartments | 13kg per shelf | Particle board | White | No assembly tools needed', price: 6990, stock: 50, category: 'Furniture', image_url: 'https://m.media-amazon.com/images/I/71s1A313W0L._SX679_.jpg' },
  { name: 'Amazon Brand - Solimo Engineered Wood Study Table Computer Desk Walnut Brown', description: 'Engineered wood | 120x60x75cm | Cable management | Steel frame | Adjustable foot pads | Easy assembly', price: 4999, stock: 60, category: 'Furniture', image_url: 'https://m.media-amazon.com/images/I/71cR5H1GJ3L._SX679_.jpg' },
  { name: 'Sleepycat Plus Orthopaedic Gel Memory Foam Mattress Queen 5 Inch 78x60', description: 'Gel foam | 5 inch | Pressure point relief | CertiPUR-US | 30 night trial | Anti-skid bottom', price: 7499, stock: 30, category: 'Furniture', image_url: 'https://m.media-amazon.com/images/I/71bTvOgz-QL._SX679_.jpg' },
  { name: 'Urban Ladder Hugo Study Chair Ergonomic Mid Back Mesh Office Chair Black', description: 'Mesh back | Adjustable lumbar | armrests | Synchro tilt | 120kg | 5 year warranty | Black', price: 8999, stock: 35, category: 'Furniture', image_url: 'https://m.media-amazon.com/images/I/61s2kJxW4SL._SX679_.jpg' },
  { name: 'Custom Decor 3-Seater Fabric Sofa Set Brown with Cushions Living Room', description: '3-seater fabric sofa | Foam cushion | Solid wood frame | 5 year warranty | Easy assembly | Brown', price: 19999, stock: 15, category: 'Furniture', image_url: 'https://m.media-amazon.com/images/I/81bMzatEOyL._SX679_.jpg' },

  /* ══════════ KITCHEN ══════════ */
  { name: 'Prestige Iris 750 W Mixer Grinder 3 Stainless Steel Jars', description: '750W motor | 3 jars 1500ml+800ml+350ml | Stainless steel blades | 2 year warranty | White/Blue', price: 2299, stock: 200, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/51f8gFN5inL._SX679_.jpg' },
  { name: 'Crompton Greaves Instacrush 500 W Juicer Mixer Grinder 3 Jars White Blue', description: '500W | 3 jars | Cold press technology | Prime series | 2 year warranty | White-Blue', price: 1799, stock: 150, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61sGdlmk2PL._SX679_.jpg' },
  { name: 'Philips HD9252 Air Fryer 1400W 4.1L Rapid Air Technology Black/Starfish White', description: '1400W | 4.1 litre | Rapid Air | Up to 13 cooking functions | NutriU app | Black', price: 6999, stock: 100, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61HNVUaL0aL._SX679_.jpg' },
  { name: 'Pigeon by Stovekraft Amaze Plus Electric Kettle 1.5 Litre 1500W', description: '1.5L | 1500W | 304 stainless steel | BPA free | Auto cut-off | Keep warm | Dry boil protection', price: 699, stock: 500, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61SIfF2ueSL._SX679_.jpg' },
  { name: 'LG 28 L Convection Microwave Oven MC2846BG Grill Diet Fry Black', description: '28L | Convection+Grill | Diet Fry | 300 auto cook + 101 Indian menus | 10 year magnetron warranty', price: 13990, stock: 50, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/81mgbivJFhL._SX679_.jpg' },
  { name: 'Wonderchef Nutri-Blend Compact Food Processor 400W 22000RPM 3 Jars White', description: '400W | 22000 RPM | 3 jars 600ml+300ml+300ml | SS blades | 5-year warranty | White', price: 2099, stock: 200, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61c0b4VBXRL._SX679_.jpg' },
  { name: 'Samsung 236 L, 3 Star, Digital Inverter, Frost Free Double Door Refrigerator (RT28C3052S8/HL, Silver Inox)', description: 'Digital Inverter Compressor | Frost Free | 236L | 3 Star | 2023 Model', price: 25990, stock: 40, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61kRBePd7UL._SX679_.jpg' },
  { name: 'LG 242 L 3 Star Smart Inverter Frost-Free Double Door Refrigerator (GL-I292RPZX, Shiny Steel)', description: 'Smart Inverter Compressor | Door Cooling+ | 242L | 3 Star | Shiny Steel', price: 26990, stock: 35, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61Mv1MebUFL._SX679_.jpg' },
  { name: 'Haier 325 L 3 Star Frost Free Double Door Refrigerator (HEB-333GS-P, Glass Finish)', description: 'Bottom Mounted | 325L | 3 Star | Twin Inverter | Glass Finish', price: 34990, stock: 25, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61bV2-pToKL._SX679_.jpg' },
  { name: 'Whirlpool 265 L 3 Star Inverter Frost-Free Double Door Refrigerator (INTELLIFRESH INV CNV 278 3S, German Steel)', description: 'Convertible 5-in-1 | Zeolite Technology | 265L | 3 Star | German Steel', price: 28990, stock: 30, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61-9qS9U2UL._SX679_.jpg' },
  { name: 'Samsung 322 L 3 Star Double Door Refrigerator (RT37C4523S8/HL, Silver Inox)', description: 'Convertible 5-in-1 | Twin Cooling Plus | 322L | 3 Star | Silver Inox', price: 37990, stock: 20, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/61bW3D1O87L._SX679_.jpg' },
  { name: 'LG 185 L 5 Star Inverter Direct-Cool Single Door Refrigerator (GL-D201ABPU, Blue Plumeria)', description: 'Smart Inverter | 185L | 5 Star | Base Stand with Drawer | Blue Plumeria', price: 17990, stock: 50, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/71YyH7V4DML._SX679_.jpg' },
  { name: 'Godrej 223 L 3 Star Inverter Nano Shield Technology Refrigerator (RT EONVALOR 244B RI ST GL, Steel Glow)', description: 'Nano Shield Technology | 223L | 3 Star | Steel Glow', price: 22490, stock: 45, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/51wXpYZ4ZLL._SX522_.jpg' },
  { name: 'Borosil Canteen Stainless Steel Lunch Box 750ml 2 Container Insulated', description: '750ml+750ml | Double wall SS | Insulated | Leak proof | School/Office | Multicolor', price: 999, stock: 300, category: 'Kitchen', image_url: 'https://m.media-amazon.com/images/I/71YDO8TNULL._SX679_.jpg' },

  /* ══════════ BEAUTY ══════════ */
  { name: 'Lakme Absolute Argan Oil Serum Foundation SPF 45 Natural Light Pack of 1', description: 'SPF45 | Argan oil | 24hr hydration | Medium coverage | Matte finish | 30ml | Natural Light', price: 799, stock: 200, category: 'Beauty', image_url: 'https://m.media-amazon.com/images/I/41hIJpVAPrL._SX679_.jpg' },
  { name: "L'Oreal Paris Hyaluron Expert Replumping Serum Ampoules 1.3ml x7", description: '1.5% hyaluronic acid | 7-day cure | Plumps in 1 week | Moisturises 24H | For all skin types', price: 799, stock: 150, category: 'Beauty', image_url: 'https://m.media-amazon.com/images/I/71aSNMHbFBL._SX679_.jpg' },
  { name: 'Mamaearth Vitamin C Face Wash with Turmeric For Skin Illumination 100ml', description: 'Vitamin C + Turmeric | Made Safe certified | No toxins | For normal to oily skin | 100ml', price: 299, stock: 500, category: 'Beauty', image_url: 'https://m.media-amazon.com/images/I/51ZfMQXa7HL._SX679_.jpg' },
  { name: 'Minimalist 10% Niacinamide Face Serum for Reducing Blemishes 30ml', description: '10% Niacinamide + Zinc | Reduces blemishes | Controls sebum | Vegan | 30ml | All skin types', price: 599, stock: 400, category: 'Beauty', image_url: 'https://m.media-amazon.com/images/I/51LlIFNsmVL._SX679_.jpg' },
  { name: 'Biotique Bio Morning Nector SPF30 PA+++ Lightening Moisturiser 40ml', description: 'SPF30 PA+++ | Lightening | Moisturising | 100% organic | No parabens | 40ml', price: 249, stock: 600, category: 'Beauty', image_url: 'https://m.media-amazon.com/images/I/61hRbJf-yWL._SX679_.jpg' },
  { name: 'The Derma Co. 1% Salicylic Acid Face Serum for Acne 30ml', description: '1% Salicylic Acid | For acne & blemishes | Unclogs pores | Non-comedogenic | 30ml | All skin types', price: 449, stock: 350, category: 'Beauty', image_url: 'https://m.media-amazon.com/images/I/51zTMQGhW2L._SX679_.jpg' },
  { name: "Himalaya Herbal Purifying Neem Face Wash 150ml", description: 'Neem + Turmeric | Deep cleansing | Controls oil | SLS-free | No parabens | 150ml', price: 180, stock: 700, category: 'Beauty', image_url: 'https://m.media-amazon.com/images/I/61DP+kR8MaL._SX679_.jpg' },

  /* ══════════ CLOTHING ══════════ */
  { name: 'Amazon Brand - Symbol Men Regular Fit Casual Shirt Blue Checks M', description: '100% Cotton | Regular fit | Button placket | Cuffs | Machine washable | Blue checks | M', price: 699, stock: 400, category: 'Clothing', image_url: 'https://m.media-amazon.com/images/I/81RX+XHOCSL._UY741_.jpg' },
  { name: 'Jockey Men 24X7 Waistband Trunk Pack of 3 S/M/L/XL/2XL/3XL', description: 'Supima cotton | Signature 24x7 waistband | Anti-chafe seams | Breathable | Pack of 3', price: 699, stock: 800, category: 'Clothing', image_url: 'https://m.media-amazon.com/images/I/81y9AQiAmUL._UY741_.jpg' },
  { name: 'Levi\'s Men Slim Fit Chinos Khaki 32W x 30L', description: 'Cotton blend | Slim fit | 5 pocket | Zip fly | Khaki | Machine wash | Regular fit', price: 2499, stock: 200, category: 'Clothing', image_url: 'https://m.media-amazon.com/images/I/91KPNhBIb0L._UY741_.jpg' },
  { name: 'ONLY Women Regular Fit Long Sleeve Shirt White M', description: 'Viscose blend | Regular fit | Button-down collar | Long sleeve | Formal | White | M', price: 1299, stock: 200, category: 'Clothing', image_url: 'https://m.media-amazon.com/images/I/71yHflLi0DL._UY741_.jpg' },

  /* ══════════ GROCERY ══════════ */
  { name: 'Tata Consumer Products Tetley Long Leaf Green Tea 100 Bags', description: 'Pure long leaf green tea | 100 round bags | No artificial flavors | Rich in antioxidants', price: 299, stock: 1000, category: 'Grocery', image_url: 'https://m.media-amazon.com/images/I/71u0fFQ-eWL._SX679_.jpg' },
  { name: 'Kissan Mixed Fruit Jam 500g', description: 'Real fruit bits | No preservatives | Vegetarian | Perfect for bread/toast/sandwiches | 500g', price: 169, stock: 500, category: 'Grocery', image_url: 'https://m.media-amazon.com/images/I/61gHhY2L2ZL._SX679_.jpg' },
  { name: 'Happilo Premium International Exotic Jumbo Dried Cranberries 200g', description: '200g | No added color | Premium quality | Healthy snack | Salad topping | Rich in fiber', price: 299, stock: 400, category: 'Grocery', image_url: 'https://m.media-amazon.com/images/I/71vu6xvbEJL._SX679_.jpg' },
  { name: 'Nestle MUNCH Chocolate Bar 23g Pack of 30', description: 'Crunchy wafer | Choco caramel | Classic taste | Pack of 30 | 23g each | Pantry pack', price: 340, stock: 800, category: 'Grocery', image_url: 'https://m.media-amazon.com/images/I/81T1VLXkyLL._SX679_.jpg' },

  /* ══════════ MIXED (browsing history mix) ══════════ */
  { name: 'Samsung 253L 3 Star Double Door Frost Free Refrigerator RT28C3122S8/HL Silver', description: '253L | 3 Star | Frost free | Digital inverter | Twin cooling+ | RT28C3122S8 | Silver', price: 24999, stock: 40, category: 'Mixed', image_url: 'https://m.media-amazon.com/images/I/616XlmzI0zL._SY741_.jpg' },
  { name: 'Boat Rockerz 421, 60H Battery, Low Latency(40Ms), 40Mm Drivers, ENx Tech, Stream Ad Free Music via App Support, Bluetooth Headphones, Wireless Over Ear Headphone with Mic (Black Sabre)', description: '40 hours of Playback: Groove more without frequent charging. boAt Rockerz 421 Bluetooth Headphones feature a huge playtime of up to 40 hours for uninterrupted audio fun.', price: 1199 , stock: 300, category: 'Mixed', image_url: 'https://m.media-amazon.com/images/I/71bUXVCt5EL._SL1500_.jpg' },
  { name: 'Samsung 350 L, 3 Star, Convertible 5-in-1, Digital Inverter, Frost Free Double Door, WiFi Bespoke AI Refrigerator (RT38HG5A23BXHL, Luxe Black, 2026 Model)', description: 'BFrost Free Refrigerator with Bespoke AI: Premium Auto Defrost with powerful cooling and long lasting freshness. Powered with AI, get additional 10% Energy Savings with AI Energy Mode. Manage your flexible storage needs with Convertible 5in1 technology : |Normal Mode|Extra Fridge Mode|Seasonal Mode|Vacation Mode|Home Alone Mode', price: 43990 , stock: 300, category: 'Mixed', image_url: 'https://m.media-amazon.com/images/I/61FbYHYB1DL._SX679_.jpg' },
  { name: 'Whirlpool 192 L 3 Star Vitamagic PRO Frost Free Direct-Cool Single Door Refrigerator (215 VMPRO PRM 3S RADIANT STEEL-Y, Silver, Auto Defrost Technology, 2026 Model)', description: 'Indias only Automatic Defrost Single door refrigerator* powered by 6th sense Intellifrost technology', price: 15490 , stock: 80, category: 'Mixed', image_url: 'https://m.media-amazon.com/images/I/51L2Npe3BPL._SX679_.jpg' },
  { name: 'TP-Link Archer C6 AC1200 Wireless MU-MIMO Gigabit Router Dual Band', description: 'AC1200 | Dual band 2.4G+5G | 4 antennas | MU-MIMO | Gigabit ports | Smart connect | App control', price: 1999, stock: 150, category: 'Mixed', image_url: 'https://m.media-amazon.com/images/I/71hJam+MCGL._SX679_.jpg' },
];

/* ─── quote helper ─── */
const q = (s) => String(s).replace(/'/g, "''");

const run = async () => {
  console.log('🔄  Connecting to database...');

  await pool.query(
    'TRUNCATE order_items, orders, wishlist_items, cart_items, products, users RESTART IDENTITY CASCADE;'
  );

  const passwordHash = await bcrypt.hash('password', 10);
  await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
    ['John Doe', 'john@example.com', passwordHash]
  );

  const rows = products.map(
    (p) =>
      `('${q(p.name)}', '${q(p.description)}', ${p.price}, ${p.stock}, '${q(p.category)}', '${q(p.image_url)}')`
  );

  const sql = `INSERT INTO products (name, description, price, stock, category, image_url) VALUES\n${rows.join(',\n')}`;
  await pool.query(sql);

  console.log(`✅  Seeded ${rows.length} products across all categories!`);
  await pool.end();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
