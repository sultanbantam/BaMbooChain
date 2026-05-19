import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

const MarketplaceContext = createContext();

export const useMarketplace = () => useContext(MarketplaceContext);

export const MarketplaceProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('yayasan_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync Cart to LocalStorage (Cart usually remains local until checkout)
  useEffect(() => {
    localStorage.setItem('yayasan_cart', JSON.stringify(cart));
  }, [cart]);

  // Firestore Sync: Products
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "marketplace_products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
    }, (err) => console.error("Products Sync Error:", err));
    return () => unsubscribe();
  }, []);

  // Firestore Sync: Orders (User sees theirs, Admin sees all)
  useEffect(() => {
    if (!db || !user) {
      setOrders([]);
      return;
    }

    const q = user.username === 'admin_yayasan' 
      ? query(collection(db, "marketplace_orders"), orderBy("createdAt", "desc"))
      : query(collection(db, "marketplace_orders"), where("userId", "==", user.id), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ords);
    }, (err) => console.error("Orders Sync Error:", err));
    return () => unsubscribe();
  }, [user]);

  // Firestore Sync: Chats
  useEffect(() => {
    if (!db || !user) {
      setChats([]);
      return;
    }
    
    const q = query(collection(db, "marketplace_chats"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filter manually since OR queries require specific Firestore SDK versions
      const myChats = allChats.filter(c => c.buyerId === user.id || c.vendor === user.username);
      setChats(myChats);
    }, (err) => console.error("Chats Sync Error:", err));
    
    return () => unsubscribe();
  }, [user]);

  const addProduct = async (newProduct) => {
    const productData = {
      ...newProduct,
      vendor: user?.username || 'Unknown Vendor',
      createdAt: serverTimestamp()
    };
    try {
      // Validation
      if (!newProduct.name || !newProduct.priceIdr || !newProduct.category) {
        console.error("Missing required product fields");
        return null;
      }

      const docRef = await addDoc(collection(db, "marketplace_products"), {
        ...newProduct,
        isProduct: true, // Tag as legitimate product
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...newProduct };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const createOrder = async (orderData) => {
    const newOrder = {
      ...orderData,
      userId: user?.id || 'guest',
      userName: user?.username || 'Guest',
      status: 'pending',
      createdAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, "marketplace_orders"), newOrder);
      setCart([]); // Clear cart after success
      return { id: docRef.id, ...newOrder };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, "marketplace_orders", orderId), { status });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "marketplace_products", productId));
      return true;
    } catch (err) {
      console.error("Delete Product Error:", err);
      return false;
    }
  };

  const updateProduct = async (productId, data) => {
    try {
      await updateDoc(doc(db, "marketplace_products", productId), data);
      return true;
    } catch (err) {
      console.error("Update Product Error:", err);
      return false;
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const sendMessage = async (chatId, productId, productName, vendor, messageText, isVendor) => {
    try {
      const chatRef = doc(db, "marketplace_chats", chatId);
      // Construct message object
      const newMessage = {
        id: Date.now(),
        text: messageText,
        sender: isVendor ? 'vendor' : 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
      };

      const existingChat = chats.find(c => c.id === chatId);
      
      if (existingChat) {
        // Update existing chat
        await updateDoc(chatRef, {
          messages: [...existingChat.messages, newMessage],
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new chat
        const greetingMessage = {
          id: Date.now() - 1,
          text: `Halo! Ada yang bisa kami bantu terkait produk ${productName}?`,
          sender: 'vendor',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now() - 1000
        };
        const initialMessages = productId === 'admin_checkout' ? [newMessage] : [greetingMessage, newMessage];
        
        const docData = {
          productId: productId || 'unknown',
          productName: productName || 'Produk',
          vendor: vendor || 'admin_yayasan',
          buyerId: user.id,
          buyerName: user.username,
          messages: initialMessages,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        };
        // Need to use setDoc to specify exact chatId
        await setDoc(chatRef, docData);
      }
      return true;
    } catch (err) {
      console.error("Send Message Error:", err);
      return false;
    }
  };

  return (
    <MarketplaceContext.Provider value={{
      products, orders, cart, chats,
      addProduct, updateProduct, deleteProduct, createOrder, updateOrderStatus,
      addToCart, removeFromCart, updateCartQty, setCart, sendMessage
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};
