const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2), 'utf8');
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Helpers for Products database
const readProducts = () => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products database:', error);
    return [];
  }
};

const writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to products database:', error);
    return false;
  }
};

// Helpers for Orders database
const readOrders = () => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders database:', error);
    return [];
  }
};

const writeOrders = (orders) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to orders database:', error);
    return false;
  }
};

// 1. Health Check
app.get('/api/v1/market/health', (req, res) => {
  res.json({ status: 'healthy', service: 'marketplace-service', timestamp: new Date() });
});

// 2. Get All Products
app.get('/api/v1/market/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// 3. Add Product
app.post('/api/v1/market/products', (req, res) => {
  const { name, description, priceIdr, category, image, stock, vendor } = req.body;

  if (!name || !priceIdr || !category) {
    return res.status(400).json({ error: 'Name, priceIdr, and category are required.' });
  }

  const products = readProducts();
  const newProduct = {
    id: uuidv4(),
    name,
    description: description || '',
    priceIdr: parseFloat(priceIdr),
    category,
    image: image || '',
    stock: stock ? parseInt(stock) : 10,
    vendor: vendor || 'admin_yayasan',
    isProduct: true,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);

  if (writeProducts(products)) {
    res.status(201).json(newProduct);
  } else {
    res.status(500).json({ error: 'Failed to save product.' });
  }
});

// 4. Update Product
app.put('/api/v1/market/products/:id', (req, res) => {
  const { id } = req.params;
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const updatedProduct = {
    ...products[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  products[index] = updatedProduct;

  if (writeProducts(products)) {
    res.json(updatedProduct);
  } else {
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// 5. Delete Product
app.delete('/api/v1/market/products/:id', (req, res) => {
  const { id } = req.params;
  const products = readProducts();
  const filtered = products.filter(p => p.id !== id);

  if (products.length === filtered.length) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  if (writeProducts(filtered)) {
    res.json({ success: true, message: 'Product deleted successfully.' });
  } else {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

// 6. Get All Orders
app.get('/api/v1/market/orders', (req, res) => {
  const orders = readOrders();
  res.json(orders);
});

// 7. Create Order
app.post('/api/v1/market/orders', (req, res) => {
  const { items, totalIdr, shippingAddress, paymentMethod, userId, userName } = req.body;

  if (!items || !totalIdr) {
    return res.status(400).json({ error: 'Items and totalIdr are required.' });
  }

  const orders = readOrders();
  const newOrder = {
    id: `BC-${Math.floor(Math.random() * 90000) + 10000}`,
    items,
    totalIdr: parseFloat(totalIdr),
    shippingAddress: shippingAddress || {},
    paymentMethod: paymentMethod || 'bmc',
    userId: userId || 'guest',
    userName: userName || 'Guest',
    status: 'pending',
    date: new Date().toLocaleDateString('id-ID'),
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  if (writeOrders(orders)) {
    res.status(201).json(newOrder);
  } else {
    res.status(500).json({ error: 'Failed to save order.' });
  }
});

// 8. Update Order Status
app.put('/api/v1/market/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  const orders = readOrders();
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();

  if (writeOrders(orders)) {
    res.json(orders[index]);
  } else {
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Marketplace Service] Running on port ${PORT}`);
  console.log(`[Marketplace Service] Persistence path: ${DATA_DIR}`);
});
