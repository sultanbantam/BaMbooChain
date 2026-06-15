import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, Tag, Filter, Search, PlusCircle, Star, 
  Image as ImageIcon, ArrowRightLeft, BarChart3, Info, 
  TrendingUp, TrendingDown, X, CheckCircle, Upload, Shield, ShieldCheck, ShoppingBag,
  Eye, EyeOff, Video, Zap, Heart, MessageCircle, Truck, 
  CreditCard, Sparkles, Play, ChevronLeft, ChevronRight, Landmark, Wallet
} from 'lucide-react';
import AdSpace from '../../components/AdSpace';
import BackButton from '../../components/BackButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';

const MarketplacePage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { chats, sendMessage, products: fbProducts, addProduct: fbAddProduct, updateProduct: fbUpdateProduct, orders, createOrder, updateOrderStatus } = useMarketplace();
  
  const categories = [
    t('market_cat_all'), 
    t('market_cat_material'), 
    t('market_cat_furniture'), 
    t('market_cat_craft'), 
    t('market_cat_nft'), 
    t('market_cat_other')
  ];
  
  const units = [
    t('market_unit_stem'),
    t('market_unit_sheet'),
    t('market_unit_unit'),
    t('market_unit_pcs'),
    t('market_unit_set'),
    t('market_unit_kg'),
    t('market_unit_liter'),
    t('market_unit_other')
  ];

  const getCategoryTranslation = (cat) => {
    switch (cat) {
      case 'Material konstruksi':
      case 'Construction Material':
      case 'market_cat_material':
        return t('market_cat_material');
      case 'Furniture':
      case 'market_cat_furniture':
        return t('market_cat_furniture');
      case 'Kerajinan':
      case 'Craft':
      case 'market_cat_craft':
        return t('market_cat_craft');
      case 'NFT Bamboo':
      case 'market_cat_nft':
        return t('market_cat_nft');
      case 'Lainnya':
      case 'Other':
      case 'market_cat_other':
        return t('market_cat_other');
      default:
        return cat;
    }
  };

  const getUnitTranslation = (unit) => {
    switch (unit) {
      case 'Batang':
      case 'Stem':
      case 'market_unit_stem':
        return t('market_unit_stem');
      case 'Lembar':
      case 'Sheet':
      case 'market_unit_sheet':
        return t('market_unit_sheet');
      case 'Unit':
      case 'market_unit_unit':
        return t('market_unit_unit');
      case 'Pieces':
      case 'market_unit_pcs':
        return t('market_unit_pcs');
      case 'Set':
      case 'market_unit_set':
        return t('market_unit_set');
      case 'Kg':
      case 'market_unit_kg':
        return t('market_unit_kg');
      case 'Liter':
      case 'market_unit_liter':
        return t('market_unit_liter');
      case 'Lainnya':
      case 'Other':
      case 'market_unit_other':
        return t('market_unit_other');
      default:
        return unit;
    }
  };

  const getProductField = (product, field) => {
    if (!product) return '';
    switch (field) {
      case 'name':
        return product.nameKey ? t(product.nameKey) : product.name;
      case 'category':
        return product.categoryKey ? t(product.categoryKey) : getCategoryTranslation(product.category);
      case 'unit':
        return product.unitKey ? t(product.unitKey) : getUnitTranslation(product.unit);
      case 'description':
        return product.descKey ? t(product.descKey) : product.description;
      case 'storyTelling':
        return product.storyKey ? t(product.storyKey) : product.storyTelling;
      case 'specs':
        return product.specKeys ? product.specKeys.map(key => t(key)) : product.specs || [];
      default:
        return '';
    }
  };
  
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const activeCategory = categories[activeCategoryIndex];
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [bursaData, setBursaData] = useState([
    { typeKey: "market_bursa_betung", price: 12500, trend: "+2.4%", up: true },
    { typeKey: "market_bursa_wulung", price: 9800, trend: "-1.1%", up: false },
    { typeKey: "market_bursa_tali", price: 7200, trend: "+0.5%", up: true },
    { typeKey: "market_bursa_plywood", price: 85000, trend: "+4.2%", up: true },
    { typeKey: "market_bursa_vinegar", price: 45000, trend: "+1.2%", up: true },
    { typeKey: "market_bursa_charcoal", price: 125000, trend: "+0.8%", up: true },
    { typeKey: "market_bursa_briquette", price: 150000, trend: "+2.1%", up: true },
    { typeKey: "market_bursa_other", price: 0, trend: "-", up: true },
  ]);
  
  // eslint-disable-next-line no-unused-vars
  const [lastSync, setLastSync] = useState(new Date());
  const [usdtPrice, setUsdtPrice] = useState(17352); // Fallback if API fails

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr');
        if (res.ok) {
          const data = await res.json();
          if (data.tether && data.tether.idr) {
            setUsdtPrice(data.tether.idr);
          }
        } else {
          // Fallback to fiat USD if CoinGecko is rate limited
          const fallbackRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            if (fallbackData.rates && fallbackData.rates.IDR) {
              setUsdtPrice(Math.round(fallbackData.rates.IDR));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch real-time USDT price", err);
      }
    };
    fetchPrice();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  const [cart, setCart] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatTarget] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartStatus, setCartStatus] = useState(''); // '', 'shipping', 'payment', 'success'
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [orderTracking, setOrderTracking] = useState(null);
  const [viewMode, setViewMode] = useState('buyer'); 
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLive, setSelectedLive] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', category: t('market_cat_material'), customCategory: '', price: '', images: [], description: '', storyTelling: '', unit: t('market_unit_stem'), customUnit: '', specs: '' 
  });
  const [newComment, setNewComment] = useState('');
  const [liveComments, setLiveComments] = useState([
    { user: 'Budi', text: 'Stok masih ada?', time: '11:55' },
    { user: 'Siti', text: 'Bisa kirim ke Medan?', time: '11:56' },
    { user: 'Agus', text: 'Kualitas mantap gan!', time: '11:57' }
  ]);
  const [likes, setLikes] = useState(1240);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    if (selectedProduct) {
      setCurrentImgIndex(0);
      if (imageContainerRef.current) {
        imageContainerRef.current.scrollLeft = 0;
      }
    }
  }, [selectedProduct]);

  const handleImageScroll = (e) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const idx = Math.round(scrollLeft / width);
      if (idx !== currentImgIndex) {
        setCurrentImgIndex(idx);
      }
    }
  };

  const scrollToImage = (idx) => {
    setCurrentImgIndex(idx);
    if (imageContainerRef.current) {
      const container = imageContainerRef.current;
      container.scrollTo({ left: container.clientWidth * idx, behavior: 'smooth' });
    }
  };

  const handlePrevImg = () => {
    const total = selectedProduct?.images?.length || 0;
    if (total <= 1) return;
    const newIdx = (currentImgIndex - 1 + total) % total;
    scrollToImage(newIdx);
  };

  const handleNextImg = () => {
    const total = selectedProduct?.images?.length || 0;
    if (total <= 1) return;
    const newIdx = (currentImgIndex + 1) % total;
    scrollToImage(newIdx);
  };

  const [activeChat, setActiveChat] = useState(null); // replaces old mock chat state

  const [showStartLiveModal, setShowStartLiveModal] = useState(false);
  const [newLiveStream, setNewLiveStream] = useState({ title: '', productId: '' });
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);

  // Auto-start webcam when viewing a live stream
  useEffect(() => {
    let stream = null;
    const startWebcam = async () => {
      if (selectedLive) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsWebcamActive(true);
          }
        } catch (err) {
          console.log("Webcam access denied or unavailable", err);
          setIsWebcamActive(false);
        }
      }
    };
    
    startWebcam();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsWebcamActive(false);
    };
  }, [selectedLive]);



  const [mockProducts, setMockProducts] = useState([
    { 
      id: 1, 
      nameKey: "market_prod_1_name", 
      categoryKey: "market_cat_craft", 
      priceIdr: 5000, 
      vendor: "admin", 
      rating: 5, 
      reviews: 10, 
      verified: true,
      img: "gambar/produk/sdt.jpeg", 
      images: ["gambar/produk/sdt.jpeg", "gambar/produk/sdt2.jpeg", "gambar/produk/sdt3.jpeg"],
      status: 'Approved',
      unitKey: "market_unit_pcs", 
      descKey: "market_prod_1_desc",
      storyKey: "market_prod_1_story",
      specKeys: ["market_prod_1_spec_1", "market_prod_1_spec_2", "market_prod_1_spec_3"]
    },
    { 
      id: 2, 
      nameKey: "market_prod_2_name", 
      categoryKey: "market_cat_craft", 
      priceIdr: 500000, 
      vendor: "Virageawie Bandung", 
      rating: 4.9, 
      reviews: 92, 
      verified: true,
      img: "./gambar/produk/jam.jpg", 
      status: 'Approved',
      unitKey: "market_unit_pcs", 
      descKey: "market_prod_2_desc",
      storyKey: "market_prod_2_story",
      specKeys: ["market_prod_2_spec_1", "market_prod_2_spec_2", "market_prod_2_spec_3"]
    },
    { 
      id: 3, 
      nameKey: "market_prod_3_name", 
      categoryKey: "market_cat_craft", 
      priceIdr: 1950000, 
      vendor: "Bamboo Art BDG", 
      rating: 4.7, 
      reviews: 215, 
      verified: false,
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      status: 'Approved',
      unitKey: "market_unit_unit", 
      descKey: "market_prod_3_desc",
      specKeys: ["market_prod_3_spec_1", "market_prod_3_spec_2", "market_prod_3_spec_3"]
    },
    { 
      id: 4, 
      nameKey: "market_prod_4_name", 
      categoryKey: "market_cat_nft", 
      priceIdr: 16250000, 
      vendor: "BaMbooChain Official", 
      rating: 5.0, 
      reviews: 12, 
      verified: true,
      img: "https://images.unsplash.com/photo-1618331835717-801e976710b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      status: 'Approved',
      unitKey: "market_unit_pcs", 
      descKey: "market_prod_4_desc",
      specKeys: ["market_prod_4_spec_1", "market_prod_4_spec_2", "market_prod_4_spec_3"]
    },
    { 
      id: 5, 
      nameKey: "market_prod_5_name", 
      categoryKey: "market_cat_material", 
      priceIdr: 4500000, 
      vendor: "IndoBamboo", 
      rating: 4.6, 
      reviews: 45, 
      verified: true,
      img: "https://images.unsplash.com/photo-1598928376916-2fd125c192bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      status: 'Approved',
      unitKey: "market_unit_sheet", 
      descKey: "market_prod_5_desc",
      specKeys: ["market_prod_5_spec_1", "market_prod_5_spec_2", "market_prod_5_spec_3"]
    },
    { 
      id: 6, 
      nameKey: "market_prod_6_name", 
      categoryKey: "market_cat_other", 
      priceIdr: 4000000000, 
      vendor: "Yayasan Sabumi", 
      rating: 5.0, 
      reviews: 1, 
      verified: true,
      img: "gambar/produk/r5.jpeg", 
      images: [
        "gambar/produk/r5.jpeg",
        "gambar/produk/r6.jpeg",
        "gambar/produk/r7.jpeg",
        "gambar/produk/r8.jpeg",
        "gambar/produk/r9.jpeg"
      ],
      status: 'Approved',
      unitKey: "market_unit_unit", 
      descKey: "market_prod_6_desc",
      storyKey: "market_prod_6_story",
      specKeys: ["market_prod_6_spec_1", "market_prod_6_spec_2", "market_prod_6_spec_3", "market_prod_6_spec_4", "market_prod_6_spec_5"]
    },
    { 
      id: 7, 
      name: "Bambu Tali Super", 
      category: "Material konstruksi", 
      priceIdr: 15000, 
      vendor: "Rose Bambu Marzuni", 
      rating: 5.0, 
      reviews: 0, 
      verified: false,
      img: "https://images.unsplash.com/photo-1598928376916-2fd125c192bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      images: ["https://images.unsplash.com/photo-1598928376916-2fd125c192bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      status: 'Pending Curation',
      unit: "Batang", 
      description: "Bambu tali kualitas super untuk berbagai keperluan.",
      specs: ["Kuat", "Tahan lama"]
    },
    { 
      id: 8, 
      name: "Keranjang Bambu Anyam", 
      category: "Kerajinan", 
      priceIdr: 75000, 
      vendor: "Rose Bambu Marzuni", 
      rating: 5.0, 
      reviews: 0, 
      verified: false,
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
      images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      status: 'Pending Curation',
      unit: "Unit", 
      description: "Keranjang bambu anyaman tangan yang indah.",
      specs: ["Handmade", "Estetik"]
    }
  ]);

  const products = [...fbProducts, ...mockProducts];

  // Simulation: Global Market & Forex Sync
  useEffect(() => {
    const interval = setInterval(() => {
      setBursaData(prev => prev.map(item => {
        if (item.typeKey === "market_bursa_other") return item;
        const change = (Math.random() * 200 - 100); 
        const up = change >= 0;
        return { ...item, price: Math.max(1000, Math.round(item.price + change)), up, trend: `${up ? '+' : ''}${(Math.random() * 5).toFixed(1)}%` };
      }));
      setLastSync(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(t('market_toast_cart_added').replace('{name}', getProductField(product, 'name')));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const formatIdr = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const formatBmc = (idr) => {
    const bmcVal = idr / (usdtPrice || 17000);
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bmcVal) + ' BMC';
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartStatus === '') setCartStatus('shipping');
  };

  const shippingOptions = [
    { id: 'express', name: t('market_ship_express_name'), desc: t('market_ship_express_desc'), price: 55000 },
    { id: 'regular', name: t('market_ship_regular_name'), desc: t('market_ship_regular_desc'), price: 25000 },
    { id: 'pickup', name: t('market_ship_pickup_name'), desc: t('market_ship_pickup_desc'), price: 0 },
  ];

  const cartTotalIdr = cart.reduce((sum, item) => sum + (item.priceIdr * item.qty), 0);
  const selectedShipping = shippingOptions.find(o => o.id === shippingMethod);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const finalTotalIdr = cartTotalIdr + shippingCost;

  const confirmOrder = async () => {
    setIsCheckingOut(true);
    setCartStatus('processing');
    
    // Simulate Smart Contract Escrow Lock Delay for visual effect
    await new Promise(r => setTimeout(r, 2000));

    const orderData = {
      items: cart,
      totalIdr: finalTotalIdr,
      shippingAddress: { city: 'Alamat Pengiriman' },
      paymentMethod: paymentMethod,
      shippingMethod: shippingMethod
    };

    const newOrder = await createOrder(orderData);
    
    setIsCheckingOut(false);
    
    if (newOrder) {
      setOrderTracking({
        id: newOrder.id,
        statusKey: 'market_checkout_awaiting_verification',
        date: new Date().toLocaleString()
      });
      setCartStatus('success');
      showToast(t('market_toast_order_success').replace('{id}', newOrder.id));
    } else {
      showToast("Checkout gagal, silakan coba lagi");
      setCartStatus('payment');
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const id = products.length + 1;
    const priceNum = parseInt(newProduct.price);
    
    const finalCategory = newProduct.category === t('market_cat_other') ? newProduct.customCategory : newProduct.category;
    const finalUnit = newProduct.unit === t('market_unit_other') ? newProduct.customUnit : newProduct.unit;

    const productToAdd = {
      ...newProduct,
      id,
      category: finalCategory,
      unit: finalUnit,
      priceIdr: priceNum,
      rating: 5.0,
      vendor: user?.username || "admin",
      img: newProduct.images.length > 0 ? newProduct.images[0] : "https://images.unsplash.com/photo-1590059345003-34537330756e?auto=format&fit=crop&w=400",
      images: newProduct.images.length > 0 ? newProduct.images : ["https://images.unsplash.com/photo-1590059345003-34537330756e?auto=format&fit=crop&w=400"],
      verified: false,
      specs: newProduct.specs.split(/[,;]\s+/).filter(s => s.trim() !== ''),
      storyTelling: newProduct.storyTelling,
      status: 'Pending Curation'
    };
    
    // Save to Firebase Database
    fbAddProduct(productToAdd);
    
    setMockProducts([productToAdd, ...mockProducts]);
    setShowSellModal(false);
    setNewProduct({ name: '', category: t('market_cat_material'), customCategory: '', price: '', images: [], description: '', storyTelling: '', unit: t('market_unit_stem'), customUnit: '', specs: '', whatsapp: '' });
    showToast(t('market_toast_product_registered').replace('{name}', newProduct.name));
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages([...chatMessages, { id: Date.now(), sender: 'Saya', text: chatInput, time, isMe: true }]);
    setChatInput('');
    
    // Simulating auto-reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now()+1, sender: chatTarget?.vendor || 'Vendor', text: t('market_chat_auto_reply'), time, isMe: false }]);
    }, 1500);
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLiveComments(prev => [...prev, { user: 'Saya', text: newComment, time }]);
    setNewComment('');
  };

  const handleApproveProduct = async (id) => {
    if (typeof id === 'string') {
      await fbUpdateProduct(id, { status: 'Approved', verified: true });
    } else {
      setMockProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved', verified: true } : p));
    }
    setSelectedProduct(null);
    showToast(t('market_toast_product_approved'));
  };

  const handleRejectProduct = async (id) => {
    if (typeof id === 'string') {
      await fbUpdateProduct(id, { status: 'Rejected' });
    } else {
      setMockProducts(prev => prev.filter(p => p.id !== id));
    }
    setSelectedProduct(null);
    showToast(t('market_toast_product_rejected'));
  };

  const visibleProducts = products.filter(p => p.status === 'Approved');
  const pendingProducts = products.filter(p => p.status === 'Pending Curation');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (newProduct.images.length + files.length > 5) {
      showToast(t('market_toast_max_photos'));
      return;
    }
    
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setNewProduct(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
    showToast(t('market_toast_photos_selected').replace('{count}', files.length));
  };

  const handleGift = (type) => showToast(t('market_toast_gift_sent').replace('{type}', type));

  const handleSwitchMode = (mode) => {
    if (mode === 'admin' && !isAdminAuthenticated) setShowAuthModal(true);
    else setViewMode(mode);
  };



  const filteredProducts = activeCategoryIndex === 0 ? visibleProducts : visibleProducts.filter(p => getProductField(p, 'category') === activeCategory);



  const [activeStreams, setActiveStreams] = useState([
    { id: 1, titleKey: "market_live_title_1", viewers: "1.2k", seller: "Koperasi Cibarani", img: "https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&w=400" },
    { id: 2, titleKey: "market_live_title_2", viewers: "850", seller: "EcoFurn Jabar", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400" },
  ]);

  const handleStartLiveStream = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id.toString() === newLiveStream.productId.toString());
    const stream = {
      id: Date.now(),
      title: newLiveStream.title,
      viewers: "0",
      seller: user?.username || "Penjual",
      img: product?.images?.[0] || product?.img || "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=400"
    };
    setActiveStreams([stream, ...activeStreams]);
    setShowStartLiveModal(false);
    setNewLiveStream({ title: '', productId: '' });
    showToast("Berhasil memulai Live Commerce!");
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* AUTH MODAL FOR ADMIN ACCESS */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 50000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass" style={{ background: 'white', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
            <Shield size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '10px' }}>{t('market_auth_title')}</h3>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>{t('market_auth_desc')}</p>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              if(authPassword === 'admin123') { 
                setIsAdminAuthenticated(true); 
                setViewMode('admin'); 
                setShowAuthModal(false); 
                setAuthPassword(''); // Clear password from state after login
              } else showToast(t('market_toast_wrong_password')); 
            }}>
              <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={t('market_auth_pass')} 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  autoComplete="off"
                  style={{ width: '100%', padding: '12px 45px 12px 12px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <button type="button" onClick={() => showToast(t('market_toast_contact_admin'))} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>{t('market_auth_forgot')}</button>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowAuthModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#eee', cursor: 'pointer' }}>{t('market_auth_btn_cancel')}</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{t('market_auth_btn_login')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE STREAM MODAL */}
      {selectedLive && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 60000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '900px', height: windowWidth < 768 ? '85vh' : '600px', background: '#111', borderRadius: '30px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: windowWidth < 768 ? 'column' : 'row' }}>
            <button onClick={() => setSelectedLive(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '10px', color: 'white', cursor: 'pointer', zIndex: 10 }}><X size={24} /></button>
            
            <div style={{ flex: 2, background: '#000', position: 'relative' }}>
               <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: isWebcamActive ? 'block' : 'none' }} />
               
               {!isWebcamActive && (
                 <>
                   <img src={selectedLive.img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="" />
                   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
                      <Play size={60} fill="white" style={{ marginBottom: '20px' }} />
                      <h2 style={{ fontSize: '1.5rem' }}>{t('market_live_streaming_status')}</h2>
                   </div>
                 </>
               )}
               <div style={{ position: 'absolute', bottom: '30px', left: '30px', display: 'flex', gap: '15px' }}>
                  <div style={{ background: '#fa5252', color: 'white', padding: '6px 12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.8rem' }}>LIVE</div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem' }}>{selectedLive.viewers} {t('market_live_viewers')}</div>
               </div>
            </div>

            <div style={{ flex: 1, background: '#1a1a1a', padding: '30px', color: 'white', display: 'flex', flexDirection: 'column' }}>
               <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{selectedLive.titleKey ? t(selectedLive.titleKey) : selectedLive.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#888' }}>{t('market_hosted_by')} <strong>{selectedLive.seller}</strong></p>
               </div>

               <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '1px', marginBottom: '15px' }}>{t('market_live_chat_label')}</h4>
                  {liveComments.map((c, i) => (
                    <div key={i} style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 'bold', color: c.user === 'Saya' ? 'var(--primary)' : '#888' }}>{c.user === 'Saya' ? t('market_user_me') : c.user}: </span>
                      <span style={{ opacity: 0.9 }}>{c.text}</span>
                    </div>
                  ))}
               </div>

               <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    placeholder={t('market_live_comment_placeholder')} 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ flex: 1, background: '#333', border: 'none', borderRadius: '10px', padding: '10px', color: 'white', fontSize: '0.85rem' }}
                  />
                  <button type="submit" style={{ background: 'var(--primary)', border: 'none', borderRadius: '10px', width: '40px', height: '40px', color: 'white', cursor: 'pointer' }}><MessageCircle size={18} /></button>
               </form>

               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                     <button onClick={() => setLikes(l => l + 1)} style={{ background: '#333', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: '#fa5252', cursor: 'pointer' }}><Heart size={20} fill="#fa5252" /></button>
                     <button onClick={() => showToast(t('market_toast_share_social'))} style={{ background: '#333', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white', cursor: 'pointer' }}><ArrowRightLeft size={20} /></button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{likes} Likes</div>
               </div>

               <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <button onClick={() => handleGift('Bamboo')} style={{ flex: 1, background: 'rgba(12,166,120,0.2)', color: 'var(--primary)', border: 'none', padding: '8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>{t('market_live_gift_bamboo')}</button>
                  <button onClick={() => handleGift('Diamond')} style={{ flex: 1, background: 'rgba(34,139,230,0.2)', color: '#228be6', border: 'none', padding: '8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}>{t('market_live_gift_diamond')}</button>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                  {['YT', 'TK', 'IG', 'FB', 'X', 'WA', 'TG', 'LI'].map(s => <div key={s} style={{ background: '#333', padding: '8px', borderRadius: '8px', textAlign: 'center', fontSize: '0.6rem', cursor: 'pointer' }}>{s}</div>)}
               </div>

               <button onClick={() => { setSelectedLive(null); showToast(t('market_toast_live_added')); }} style={{ width: '100%', padding: '16px', borderRadius: '15px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{t('market_live_buy_btn')}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div onClick={() => setShowCartModal(true)} style={{ position: 'fixed', top: '100px', right: '20px', background: 'rgba(12,166,120,0.95)', color: 'white', padding: '15px 25px', borderRadius: '15px', zIndex: 100000, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <CheckCircle size={18} />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{t('market_toast_cart_added_success')}</div>
            <div style={{ fontSize: '0.8rem' }}>{toast.message} <span style={{ textDecoration: 'underline' }}>{t('market_toast_cart_added_view')}</span></div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 90000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: windowWidth < 900 ? '10px' : '20px' }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '1000px', maxHeight: '90vh', borderRadius: windowWidth < 900 ? '20px' : '40px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: windowWidth < 900 ? '10px' : '25px', right: windowWidth < 900 ? '10px' : '25px', background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}><X size={24} color="#333" /></button>
            <div style={{ display: 'flex', flexDirection: windowWidth < 900 ? 'column' : 'row', flex: 1, minHeight: 0, overflowY: windowWidth < 900 ? 'auto' : 'hidden' }}>
              <div style={{ flex: windowWidth < 900 ? 'none' : '1.2', height: windowWidth < 900 ? '450px' : 'auto', position: 'relative', background: 'rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                 <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
                    <div 
                       ref={imageContainerRef}
                       onScroll={handleImageScroll}
                       style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          overflowX: 'auto', 
                          scrollSnapType: 'x mandatory', 
                          scrollBehavior: 'smooth',
                          WebkitOverflowScrolling: 'touch',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none'
                       }}
                    >
                       {selectedProduct.images && selectedProduct.images.length > 0 ? (
                          selectedProduct.images.map((img, idx) => (
                             <div key={idx} style={{ minWidth: '100%', height: '100%', scrollSnapAlign: 'start', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fdfdfd', position: 'relative' }}>
                                <img src={img} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="" />
                             </div>
                          ))
                       ) : (
                          <div style={{ minWidth: '100%', height: '100%', scrollSnapAlign: 'start', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fdfdfd' }}>
                             <img src={selectedProduct.img} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="" />
                          </div>
                       )}
                    </div>

                    {selectedProduct.images && selectedProduct.images.length > 1 && (
                       <>
                          <button 
                             onClick={handlePrevImg}
                             style={{ 
                                position: 'absolute', 
                                top: '50%', 
                                left: '15px', 
                                transform: 'translateY(-50%)', 
                                background: 'rgba(255,255,255,0.85)', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '40px', 
                                height: '40px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 5,
                                transition: 'background 0.2s'
                             }}
                             onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
                             onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
                          >
                             <ChevronLeft size={24} color="#333" />
                          </button>
                          <button 
                             onClick={handleNextImg}
                             style={{ 
                                position: 'absolute', 
                                top: '50%', 
                                right: '15px', 
                                transform: 'translateY(-50%)', 
                                background: 'rgba(255,255,255,0.85)', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '40px', 
                                height: '40px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 5,
                                transition: 'background 0.2s'
                             }}
                             onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
                             onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
                          >
                             <ChevronRight size={24} color="#333" />
                          </button>
                       </>
                    )}
                 </div>
                 {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div style={{ display: 'flex', gap: '10px', padding: '15px', background: 'white', borderTop: '1px solid #eee', overflowX: 'auto' }}>
                       {selectedProduct.images.map((img, idx) => (
                          <img 
                             key={idx} 
                             onClick={() => scrollToImage(idx)} 
                             src={img} 
                             style={{ 
                                width: '60px', 
                                height: '60px', 
                                objectFit: 'contain', 
                                background: '#f8f9fa',
                                borderRadius: '10px', 
                                border: currentImgIndex === idx ? '3px solid var(--primary)' : '1px solid #eee', 
                                cursor: 'pointer', 
                                flexShrink: 0 
                             }} 
                             alt="" 
                          />
                       ))}
                    </div>
                 )}
              </div>
              <div style={{ flex: windowWidth < 900 ? 'none' : '1', padding: windowWidth < 900 ? '20px' : '40px', display: 'flex', flexDirection: 'column', overflowY: windowWidth < 900 ? 'visible' : 'auto', minHeight: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                       <span style={{ padding: '5px 15px', background: 'var(--primary)', color: 'white', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>{getProductField(selectedProduct, 'category')}</span>
                       {selectedProduct.verified && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#228be6', fontSize: '0.8rem', fontWeight: 'bold' }}><ShieldCheck size={16} /> {t('market_status_verified')}</span>}
                    </div>
                   
                    <h2 style={{ fontSize: windowWidth < 900 ? '1.5rem' : '2.2rem', margin: '0 0 10px 0', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.2' }}>{getProductField(selectedProduct, 'name')}</h2>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f59f00', fontWeight: 'bold' }}><Star size={16} fill="#f59f00" /> {selectedProduct.rating}</span>
                       <span style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '15px' }}>{getProductField(selectedProduct, 'unit')}</span>
                    </div>

                    <div style={{ background: 'rgba(12, 166, 120, 0.05)', border: '1px solid rgba(12, 166, 120, 0.2)', padding: '20px', borderRadius: '20px', marginBottom: '25px' }}>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>{t('market_ecosystem_price')}</div>
                       <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>{formatIdr(selectedProduct.priceIdr)}</div>
                       <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '8px', fontWeight: 'bold' }}>≈ {formatBmc(selectedProduct.priceIdr)}</div>
                    </div>

                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '30px', fontSize: '0.95rem' }}>{getProductField(selectedProduct, 'description') || "Produk bambu berkualitas tinggi hasil kurasi tim Yayasan untuk standar ekosistem hijau."}</p>

                    {getProductField(selectedProduct, 'storyTelling') && (
                      <div style={{ marginBottom: '30px', background: 'rgba(12, 166, 120, 0.05)', padding: '20px', borderRadius: '20px', borderLeft: '4px solid var(--primary)' }}>
                         <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={18} /> {t('market_story_title')}
                         </h4>
                         <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)', fontStyle: 'italic' }}>"{getProductField(selectedProduct, 'storyTelling')}"</p>
                      </div>
                    )}

                    {getProductField(selectedProduct, 'specs') && getProductField(selectedProduct, 'specs').length > 0 && (
                      <div style={{ marginBottom: '40px' }}>
                         <h4 style={{ marginBottom: '15px' }}>{t('market_specs_title')}</h4>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                           {getProductField(selectedProduct, 'specs').map((s, i) => (
                              <span key={i} style={{ padding: '8px 15px', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>{s}</span>
                           ))}
                         </div>
                      </div>
                    )}

                   {viewMode === 'admin' && selectedProduct.status === 'Pending Curation' ? (
                      <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
                         <button onClick={() => handleApproveProduct(selectedProduct.id)} style={{ flex: 1, padding: windowWidth < 900 ? '14px' : '16px', borderRadius: '15px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><CheckCircle size={20} /> {t('market_btn_approve')}</button>
                         <button onClick={() => handleRejectProduct(selectedProduct.id)} style={{ padding: windowWidth < 900 ? '14px 20px' : '16px 25px', borderRadius: '15px', background: '#fa5252', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}><X size={20} /></button>
                      </div>
                   ) : (
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '15px' }}>
                         <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{ flex: 1, padding: windowWidth < 900 ? '14px' : '18px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '20px', fontSize: windowWidth < 900 ? '1rem' : '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(12, 166, 120, 0.2)' }}><ShoppingBag size={22} /> {t('market_btn_add_to_cart')}</button>
                         <button 
                            onClick={() => {
                               if (!user) {
                                  showToast(t('market_chat_login_req'));
                                  return;
                               }
                               const existingChat = chats.find(c => c.productId === selectedProduct.id && c.buyerId === user.id);
                               if (existingChat) setActiveChat(existingChat);
                               else setActiveChat({ isNew: true, product: selectedProduct });
                            }} 
                            style={{ width: windowWidth < 900 ? '50px' : '60px', height: windowWidth < 900 ? '50px' : '60px', background: '#228be6', color: 'white', border: 'none', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 20px rgba(34, 139, 230, 0.3)' }} 
                            title={t('market_btn_chat_title')}
                         >
                            <MessageCircle size={windowWidth < 900 ? 20 : 24} />
                         </button>
                      </div>
                   )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      {showCartModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 35000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-card)', color: 'var(--text-main)', borderRadius: '24px', padding: '30px', position: 'relative' }}>
            <button onClick={() => setShowCartModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#eee', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}><X size={20} /></button>
            
            {cartStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle size={80} color="var(--primary)" style={{ marginBottom: '20px' }} />
                <h2>{t('market_checkout_success')}</h2>
                <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '15px', margin: '20px 0', border: '1px solid var(--border-color)' }}>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('market_checkout_tx_id')}</div>
                   <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{orderTracking?.id}</div>
                </div>
                <div style={{ textAlign: 'left', background: 'var(--bg-secondary)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                   <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-main)' }}>{t('market_checkout_smart_tracking')}</h4>
                   <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>• {orderTracking?.statusKey ? t(orderTracking.statusKey) : orderTracking?.status}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                   <button onClick={() => { setShowCartModal(false); setCart([]); setCartStatus(''); }} className="btn btn-primary" style={{ flex: 1, padding: '16px' }}>{t('market_checkout_btn_finish')}</button>
                   <button onClick={() => {
                      setShowCartModal(false);
                      setCart([]);
                      setCartStatus('');
                      setActiveChat({
                         isNew: true,
                         product: { id: 'admin_yayasan', name: 'Customer Service Yayasan', vendor: 'Admin Yayasan' }
                      });
                   }} style={{ background: '#228be6', color: 'white', border: 'none', borderRadius: '15px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <MessageCircle size={24} />
                   </button>
                </div>
              </div>
            ) : cartStatus === 'payment' ? (
              <>
                <h2 style={{ marginBottom: '24px' }}>{t('market_checkout_payment')}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  <div className="glass" onClick={() => setPaymentMethod('bank')} style={{ padding: '20px', borderRadius: '20px', border: paymentMethod === 'bank' ? '2px solid var(--primary)' : '1px solid var(--border-color)', cursor: 'pointer', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <Landmark size={24} color="#00529C" />
                     <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Transfer Bank</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pembayaran instan VA / QRIS</div>
                     </div>
                  </div>
                  <div className="glass" onClick={() => setPaymentMethod('bmc')} style={{ padding: '20px', borderRadius: '20px', border: paymentMethod === 'bmc' ? '2px solid var(--primary)' : '1px solid var(--border-color)', cursor: 'pointer', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <Wallet size={24} color="#f59f00" />
                     <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>BMC Token (Web3)</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bayar dengan dompet MetaMask/TrustWallet</div>
                     </div>
                  </div>
                  <div className="glass" onClick={() => setPaymentMethod('credit')} style={{ padding: '20px', borderRadius: '20px', border: paymentMethod === 'credit' ? '2px solid var(--primary)' : '1px solid var(--border-color)', cursor: 'pointer', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <ShieldCheck size={24} color="var(--primary)" />
                     <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>bambuPAY Credit (Escrow)</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Potong saldo BaMbooChain Wallet Anda</div>
                     </div>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Subtotal</span>
                      <span>{formatIdr(cartTotalIdr)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Ongkos Kirim</span>
                      <span>{formatIdr(shippingCost)}</span>
                   </div>
                   <div style={{ height: '1px', background: 'var(--border-color)', margin: '10px 0' }} />
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>{t('market_checkout_total_idr')}</span>
                      <span style={{ fontWeight: 'bold' }}>{formatIdr(finalTotalIdr)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
                      <span>{t('market_checkout_est_bmc')}</span>
                      <span style={{ fontWeight: 'bold' }}>{formatBmc(finalTotalIdr)}</span>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                   <button onClick={() => setCartStatus('shipping')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ddd', background: 'none' }}>{t('market_checkout_btn_back')}</button>
                   <button onClick={confirmOrder} className="btn btn-primary" style={{ flex: 2, padding: '14px' }}>{t('market_checkout_btn_pay')}</button>
                </div>
              </>
            ) : cartStatus === 'processing' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                 <div className="spinner" style={{ margin: '0 auto 20px', width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                 <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                 <h3 style={{ marginBottom: '10px' }}>Mengamankan Dana...</h3>
                 <p style={{ color: '#888', fontSize: '0.9rem' }}>Mentransfer dana ke Smart Contract Escrow BaMbooChain</p>
              </div>
            ) : cartStatus === 'shipping' ? (
              <>
                <h2 style={{ marginBottom: '24px' }}>{t('market_checkout_shipping')}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  {shippingOptions.map(opt => (
                    <div key={opt.id} className="glass" onClick={() => setShippingMethod(opt.id)} style={{ padding: '20px', borderRadius: '20px', border: shippingMethod === opt.id ? '2px solid var(--primary)' : '1px solid var(--border-color)', cursor: 'pointer', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <Truck size={24} color={shippingMethod === opt.id ? "var(--primary)" : "var(--text-muted)"} />
                       <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{opt.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                       </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setCartStatus('payment')} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>{t('market_checkout_btn_next')}</button>
              </>
            ) : (
              <>
                <h2 style={{ marginBottom: '24px' }}>{t('market_cart_title')}</h2>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                   {cart.length === 0 ? <p style={{ textAlign: 'center', color: '#888' }}>{t('market_cart_empty')}</p> : cart.map(item => (
                     <div key={item.id} style={{ display: 'flex', gap: '15px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                        <img src={item.img} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} alt="" />
                        <div style={{ flex: 1 }}>
                           <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{getProductField(item, 'name')}</div>
                           <div style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{formatIdr(item.priceIdr)}</div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                              <button onClick={() => updateQty(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ddd' }}>-</button>
                              <span>{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ddd' }}>+</button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
                {cart.length > 0 && <button onClick={() => setCartStatus('shipping')} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>{t('market_cart_checkout')}</button>}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* FLOATING CART BUTTON */}
      {cart.length > 0 && !showCartModal && (
        <button onClick={() => setShowCartModal(true)} style={{ position: 'fixed', bottom: '30px', right: '30px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '65px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 25000, cursor: 'pointer', boxShadow: '0 8px 30px rgba(12,166,120,0.5)' }}>
          <ShoppingCart size={28} />
          <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#fa5252', color: 'white', minWidth: '24px', height: '24px', padding: '0 6px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', border: '2px solid white' }}>{cart.reduce((s, i) => s + i.qty, 0)}</div>
        </button>
      )}

      {viewMode === 'admin' ? (
        <div className="container" style={{ marginTop: '100px' }}>
          <div style={{ background: 'white', borderRadius: '30px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
               <div>
                  <h2 style={{ margin: 0 }}>{t('market_admin_title')}</h2>
                  <p style={{ color: '#888' }}>{t('market_admin_subtitle')}</p>
               </div>
               <button onClick={() => { setViewMode('buyer'); setIsAdminAuthenticated(false); setAuthPassword(''); }} className="btn" style={{ background: '#eee' }}>{t('market_admin_exit')}</button>
            </div>
            
            <h3 style={{ marginBottom: '20px' }}>Validasi Produk Baru</h3>
            <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ borderBottom: '2px solid #f1f3f5', textAlign: 'left' }}>
                        <th style={{ padding: '15px', color: '#888' }}>Penjual</th>
                        <th style={{ padding: '15px', color: '#888' }}>Produk</th>
                        <th style={{ padding: '15px', color: '#888' }}>Kategori</th>
                        <th style={{ padding: '15px', color: '#888' }}>Status</th>
                        <th style={{ padding: '15px', color: '#888' }}>Aksi</th>
                     </tr>
                  </thead>
                  <tbody>
                     {pendingProducts.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Tidak ada produk yang menunggu validasi</td></tr>
                     ) : pendingProducts.map(product => (
                       <tr key={product.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '20px', fontWeight: 'bold' }}>{product.vendor}</td>
                          <td style={{ padding: '20px' }}>{getProductField(product, 'name')}</td>
                          <td style={{ padding: '20px' }}>{getProductField(product, 'category')}</td>
                          <td style={{ padding: '20px' }}>
                             <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', background: '#fff4e6', color: '#e67700' }}>{product.status}</span>
                          </td>
                          <td style={{ padding: '20px' }}>
                             <button onClick={() => setSelectedProduct(product)} style={{ padding: '8px 15px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Review & Validasi</button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <h3 style={{ marginBottom: '20px' }}>Manajemen Pesanan</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ borderBottom: '2px solid #f1f3f5', textAlign: 'left' }}>
                        <th style={{ padding: '15px', color: '#888' }}>{t('market_admin_table_id')}</th>
                        <th style={{ padding: '15px', color: '#888' }}>{t('market_admin_table_buyer')}</th>
                        <th style={{ padding: '15px', color: '#888' }}>{t('market_admin_table_product')}</th>
                        <th style={{ padding: '15px', color: '#888' }}>{t('market_admin_table_status')}</th>
                        <th style={{ padding: '15px', color: '#888' }}>{t('market_admin_table_action')}</th>
                     </tr>
                  </thead>
                  <tbody>
                     {orders.map(order => (
                       <tr key={order.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                          <td style={{ padding: '20px', fontWeight: 'bold' }}>{order.id}</td>
                          <td style={{ padding: '20px' }}>{order.userName || order.userId || 'Guest'}</td>
                          <td style={{ padding: '20px' }}>{order.items?.map(i => getProductField(i, 'name')).join(', ') || 'Produk'}</td>
                          <td style={{ padding: '20px' }}>
                             <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', background: order.status === 'completed' ? '#e7f5ff' : '#fff4e6', color: order.status === 'completed' ? '#1971c2' : '#e67700' }}>{order.status}</span>
                          </td>
                          <td style={{ padding: '20px' }}>
                             {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'completed')} style={{ padding: '8px 15px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>{t('market_admin_btn_validate')}</button>}
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* HEADER SECTION */}
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '50px', marginTop: '60px' }}>
            <BackButton />
            <h1 style={{ fontSize: windowWidth < 768 ? '2rem' : '3.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px', lineHeight: '1.1' }}>{t('market_title')}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '32px' }}>{t('market_subtitle')}</p>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
               <button onClick={() => setShowSellModal(true)} className="btn btn-crypto" style={{ padding: '16px 40px', borderRadius: '30px' }}><PlusCircle size={20} /> {t('market_btn_sell')}</button>
               <button onClick={() => setShowStartLiveModal(true)} style={{ padding: '16px 40px', borderRadius: '30px', background: '#fa5252', color: 'white', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(250,82,82,0.4)' }}><Video size={20} /> Mulai Live Commerce</button>
            </div>
            
            <div style={{ display: 'inline-flex', background: 'white', padding: '5px', borderRadius: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: '1px solid var(--primary)' }}>
              <button onClick={() => setViewMode('buyer')} style={{ padding: '8px 24px', borderRadius: '25px', border: 'none', background: viewMode === 'buyer' ? 'var(--primary)' : 'transparent', color: viewMode === 'buyer' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}>{t('market_mode_buyer')}</button>
              <button onClick={() => setViewMode('history')} style={{ padding: '8px 24px', borderRadius: '25px', border: 'none', background: viewMode === 'history' ? 'var(--primary)' : 'transparent', color: viewMode === 'history' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}>Riwayat Pesanan Saya</button>
              <button onClick={() => setViewMode('inbox')} style={{ padding: '8px 24px', borderRadius: '25px', border: 'none', background: viewMode === 'inbox' ? 'var(--primary)' : 'transparent', color: viewMode === 'inbox' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', position: 'relative' }}>
                 {t('market_btn_inbox')}
                 {chats.filter(c => c.vendor === user?.username && c.messages?.some(m => !m.isMe)).length > 0 && (
                    <span style={{ position: 'absolute', top: '0', right: '0', background: 'red', color: 'white', width: '15px', height: '15px', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</span>
                 )}
              </button>
              <button onClick={() => handleSwitchMode('admin')} style={{ padding: '8px 24px', borderRadius: '25px', border: 'none', background: viewMode === 'admin' ? 'var(--primary)' : 'transparent', color: viewMode === 'admin' ? 'white' : 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer' }}>{t('market_mode_admin')}</button>
            </div>
          </div>

          {viewMode === 'inbox' && (
             <div className="container" style={{ marginBottom: '50px' }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: '30px', padding: '40px', border: '1px solid var(--border-color)', minHeight: '500px' }}>
                   <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}><MessageCircle size={32} color="var(--primary)" /> {t('market_inbox_title')}</h2>
                   {chats.filter(c => c.vendor === user?.username).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                         {t('market_inbox_empty')}
                      </div>
                   ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: windowWidth < 800 ? '1fr' : '300px 1fr', gap: '20px', height: '600px' }}>
                         <div style={{ borderRight: windowWidth < 800 ? 'none' : '1px solid var(--border-color)', paddingRight: windowWidth < 800 ? '0' : '20px', overflowY: 'auto' }}>
                            {chats.filter(c => c.vendor === user?.username).map(chat => (
                               <div key={chat.id} onClick={() => setActiveChat(chat)} style={{ padding: '15px', borderRadius: '15px', cursor: 'pointer', background: activeChat?.id === chat.id ? 'rgba(12, 166, 120, 0.1)' : 'transparent', border: activeChat?.id === chat.id ? '1px solid var(--primary)' : '1px solid transparent', marginBottom: '10px' }}>
                                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{chat.buyerName || chat.buyerId}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('market_chat_product_label').replace('{name}', chat.productName)}</div>
                               </div>
                            ))}
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', borderRadius: '20px', overflow: 'hidden' }}>
                            {activeChat ? (
                               <>
                                  <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                                     <h3 style={{ margin: 0 }}>{activeChat.buyerName || activeChat.buyerId}</h3>
                                     <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('market_chat_inquire_about')} {activeChat.productName}</p>
                                  </div>
                                  <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                     {(activeChat.messages || []).map((msg, i) => (
                                        <div key={i} style={{ alignSelf: msg.isMe ? 'flex-end' : 'flex-start', background: msg.isMe ? 'var(--primary)' : 'var(--bg-card)', color: msg.isMe ? 'white' : 'var(--text-main)', padding: '12px 18px', borderRadius: msg.isMe ? '20px 20px 0 20px' : '20px 20px 20px 0', maxWidth: '80%', border: msg.isMe ? 'none' : '1px solid var(--border-color)' }}>
                                           <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>
                                           <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '5px' }}>{msg.time}</div>
                                        </div>
                                     ))}
                                  </div>
                                  <div style={{ padding: '20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
                                     <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (() => { if(chatInput.trim()){ sendMessage(activeChat.id, activeChat.productId, activeChat.productName, activeChat.vendor, chatInput, true); setChatInput(''); } })()} placeholder={t('market_chat_reply_placeholder')} style={{ flex: 1, padding: '15px 20px', borderRadius: '30px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', outline: 'none' }} />
                                     <button onClick={() => { if(chatInput.trim()){ sendMessage(activeChat.id, activeChat.productId, activeChat.productName, activeChat.vendor, chatInput, true); setChatInput(''); } }} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Play size={20} fill="white" /></button>
                                  </div>
                               </>
                            ) : (
                               <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{t('market_chat_select_to_start')}</div>
                            )}
                         </div>
                      </div>
                   )}
                </div>
             </div>
          )}

           {viewMode === 'history' && (
              <div className="container" style={{ marginBottom: '50px' }}>
                 <div style={{ background: 'var(--bg-card)', borderRadius: '30px', padding: '40px', border: '1px solid var(--border-color)', minHeight: '500px' }}>
                    <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}><ShoppingCart size={32} color="var(--primary)" /> Riwayat Pesanan Saya</h2>
                    {orders.length === 0 ? (
                       <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
                          Belum ada riwayat pesanan.
                       </div>
                    ) : (
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {orders.map(order => (
                             <div key={order.id} style={{ padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                <div>
                                   <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>Pesanan #{order.id.slice(0, 8)}</div>
                                   <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                                   <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>{order.items?.map(i => getProductField(i, 'name')).join(', ')}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                   <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '8px' }}>{formatIdr(order.totalIdr)}</div>
                                   <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', background: order.status === 'completed' ? '#e7f5ff' : '#fff4e6', color: order.status === 'completed' ? '#1971c2' : '#e67700' }}>Status: {order.status}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              </div>
           )}

          {/* START LIVE COMMERCE MODAL */}
          {showStartLiveModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 45000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="glass" style={{ width: '100%', maxWidth: '500px', background: 'white', borderRadius: '30px', padding: '40px', position: 'relative' }}>
                <button onClick={() => setShowStartLiveModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#eee', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}><X size={20} /></button>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                   <Video size={40} color="#fa5252" style={{ marginBottom: '15px' }} />
                   <h2>Mulai Live Commerce</h2>
                   <p style={{ color: '#888', fontSize: '0.9rem' }}>Promosikan produk bambu Anda secara langsung kepada pembeli di seluruh dunia!</p>
                </div>
                
                <form onSubmit={handleStartLiveStream}>
                   <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Judul Live Stream</label>
                      <input required type="text" placeholder="Contoh: Lelang Kursi Wulung Spesial!" value={newLiveStream.title} onChange={e => setNewLiveStream({...newLiveStream, title: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '1rem' }} />
                   </div>
                   <div style={{ marginBottom: '30px' }}>
                      <label style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Pilih Produk untuk Dipromosikan (Opsional)</label>
                      <select value={newLiveStream.productId} onChange={e => setNewLiveStream({...newLiveStream, productId: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '1rem', background: '#f8f9fa' }}>
                         <option value="">-- Pilih Produk Anda --</option>
                         {products.filter(p => p.vendor === user?.username || p.vendor === 'admin').map(p => (
                            <option key={p.id} value={p.id}>{getProductField(p, 'name')}</option>
                         ))}
                      </select>
                   </div>
                   
                   <button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '15px', background: '#fa5252', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Play size={20} fill="white" /> Mulai Siaran Langsung!</button>
                </form>
              </div>
            </div>
          )}

          {/* SELL PRODUCT MODAL */}
          {showSellModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 45000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div className="glass" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', background: 'white', borderRadius: '30px', padding: '40px', position: 'relative', overflowY: 'auto' }}>
                <button onClick={() => setShowSellModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#eee', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}><X size={20} /></button>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>{t('market_sell_title')}</h2>
                <form onSubmit={handleAddProduct}>
                   <div style={{ display: 'grid', gridTemplateColumns: windowWidth < 600 ? '1fr' : '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>{t('market_sell_name')}</label>
                        <input required type="text" placeholder="Contoh: Kursi Bambu Wulung" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>{t('market_sell_cat')}</label>
                        <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: newProduct.category === t('market_cat_other') ? '10px' : '0' }}>
                           {categories.filter(c => c !== t('market_cat_all')).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {newProduct.category === t('market_cat_other') && (
                           <input 
                             required 
                             type="text" 
                             placeholder={t('market_cat_other') + "..."} 
                             value={newProduct.customCategory} 
                             onChange={e => setNewProduct({...newProduct, customCategory: e.target.value})} 
                             style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem' }} 
                           />
                         )}
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: windowWidth < 600 ? '1fr' : '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>{t('market_sell_price')}</label>
                        <input required type="number" placeholder="Contoh: 50000" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>{t('market_sell_unit')}</label>
                        <select value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: newProduct.unit === t('market_unit_other') ? '10px' : '0' }}>
                           {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        {newProduct.unit === t('market_unit_other') && (
                           <input 
                             required 
                             type="text" 
                             placeholder={t('market_unit_other') + "..."} 
                             value={newProduct.customUnit} 
                             onChange={e => setNewProduct({...newProduct, customUnit: e.target.value})} 
                             style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem' }} 
                           />
                         )}
                      </div>
                   </div>

                   <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>{t('market_sell_desc')}</label>
                      <textarea required placeholder={t('market_sell_desc_placeholder')} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '80px', fontFamily: 'inherit' }} />
                   </div>

                   <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>{t('market_sell_story_label')}</label>
                      <textarea placeholder={t('market_sell_story_placeholder')} value={newProduct.storyTelling} onChange={e => setNewProduct({...newProduct, storyTelling: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '100px', fontFamily: 'inherit' }} />
                   </div>

                   <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '5px' }}>{t('market_sell_specs')}</label>
                      <input type="text" placeholder={t('market_sell_specs_placeholder')} value={newProduct.specs} onChange={e => setNewProduct({...newProduct, specs: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
                   </div>

                   <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '10px' }}>{t('market_sell_photos')}</label>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                      />
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {newProduct.images.map((img, idx) => (
                          <div key={idx} style={{ width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', position: 'relative', border: '1px solid #eee' }}>
                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            <button type="button" onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', padding: '2px', cursor: 'pointer', borderRadius: '0 0 0 5px' }}><X size={10} /></button>
                          </div>
                        ))}
                        {newProduct.images.length < 5 && (
                          <button type="button" onClick={() => fileInputRef.current.click()} style={{ width: '60px', height: '60px', borderRadius: '10px', border: '1px dashed var(--primary)', background: 'rgba(12, 166, 120, 0.05)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                             <PlusCircle size={20} />
                          </button>
                        )}
                      </div>
                   </div>

                   <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '15px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold' }}>{t('market_sell_btn')}</button>
                </form>
              </div>
            </div>
          )}

          {/* LIVE COMMERCE SECTION */}
          <div className="container" style={{ marginBottom: '50px' }}>
             <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Video color="#fa5252" /> {t('market_live_commerce_title')}</h3>
             <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
                {activeStreams.map(live => (
                  <div key={live.id} onClick={() => setSelectedLive(live)} style={{ minWidth: '280px', height: '180px', borderRadius: '24px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                     <img src={live.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                     <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#fa5252', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>{t('market_live_badge')}</div>
                     <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white' }}>
                        <div style={{ fontWeight: 'bold' }}>{live.titleKey ? t(live.titleKey) : live.title}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{live.seller}</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* HYPER-PERSONALIZATION */}
          <div className="container" style={{ marginBottom: '50px' }}>
             <div style={{ background: 'linear-gradient(135deg, #0ca678 0%, #087f5b 100%)', borderRadius: '30px', padding: '40px', color: 'white' }}>
                <h3 style={{ marginBottom: '8px', fontWeight: '900' }}>{t('market_recom_title')} <Sparkles size={20} /></h3>
                <p style={{ opacity: 0.9, marginBottom: '30px' }}>{t('market_recom_subtitle')}</p>
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
                   {visibleProducts.slice(0, 4).map(p => (
                     <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ minWidth: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '15px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                        <img src={p.img} style={{ width: '100%', height: '120px', borderRadius: '12px', objectFit: 'cover', marginBottom: '10px' }} alt="" />
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{getProductField(p, 'name')}</div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* BURSA BAMBU */}
          <div className="container" style={{ marginBottom: '60px' }}>
             <div style={{ background: '#f8f9fa', borderRadius: '24px', padding: '30px', border: '1px solid #e9ecef' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><BarChart3 color="var(--primary)" /> {t('market_bursa_title')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                   {bursaData.slice(0, 4).map((item, idx) => (
                     <div key={idx} style={{ background: 'white', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between' }}>
                        <div><div style={{ fontSize: '0.7rem', color: '#888' }}>{item.typeKey ? t(item.typeKey) : item.type}</div><div style={{ fontWeight: 'bold' }}>Rp {item.price.toLocaleString()}</div></div>
                        <div style={{ color: item.up ? 'var(--primary)' : '#fa5252', fontSize: '0.8rem' }}>{item.trend}</div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* MAIN PRODUCT GRID */}
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: windowWidth < 1200 ? '1fr' : '1fr 350px', gap: '40px' }}>
              <div>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                    {filteredProducts.map(product => (
                      <div key={product.id} onClick={() => setSelectedProduct(product)} style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                         <div style={{ height: '220px', position: 'relative' }}>
                            <img src={product.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>{getProductField(product, 'category')}</div>
                         </div>
                         <div style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', minHeight: '2.8rem' }}>{getProductField(product, 'name')}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                               <div>
                                  <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>{formatIdr(product.priceIdr)}</div>
                                  <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: '500' }}>{formatBmc(product.priceIdr)}</div>
                               </div>
                               <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}><ShoppingCart size={18} /></button>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* SIDEBAR */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <AdSpace type="vertical" />
                 <AdSpace type="vertical" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* IN-APP CHAT OVERLAY */}
      {activeChat && viewMode !== 'inbox' && (() => {
         const isNew = activeChat.isNew;
         const chatDoc = chats.find(c => c.id === activeChat.id);
         const messages = isNew ? (activeChat.messages || []) : (chatDoc?.messages || []);
         const title = isNew ? activeChat.product.vendor : (chatDoc ? (user?.username === chatDoc.vendor ? chatDoc.buyerName || chatDoc.buyerId : chatDoc.vendor) : 'Chat');
         const subtitle = isNew ? activeChat.product.name : (chatDoc ? `Produk: ${chatDoc.productName}` : '');

         return (
         <div style={{ position: 'fixed', bottom: '90px', right: '20px', width: '350px', background: 'var(--bg-card)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', zIndex: 95000, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#228be6', padding: '15px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{title}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{subtitle}</div>
               </div>
               <button onClick={() => setActiveChat(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ height: '300px', overflowY: 'auto', padding: '20px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
               {isNew && messages.length === 0 && (
                  <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', color: 'var(--text-main)', padding: '12px 18px', borderRadius: '20px 20px 20px 0', maxWidth: '80%', border: '1px solid var(--border-color)' }}>
                     <div style={{ fontSize: '0.95rem' }}>{t('market_chat_vendor_greeting').replace('{product}', getProductField(activeChat.product, 'name'))}</div>
                     <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '5px' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
               )}
               {messages.map((msg, i) => (
                  <div key={i} style={{ alignSelf: msg.isMe ? 'flex-end' : 'flex-start', background: msg.isMe ? 'var(--primary)' : 'var(--bg-card)', color: msg.isMe ? 'white' : 'var(--text-main)', padding: '12px 18px', borderRadius: msg.isMe ? '20px 20px 0 20px' : '20px 20px 20px 0', maxWidth: '80%', border: msg.isMe ? 'none' : '1px solid var(--border-color)' }}>
                     <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>
                     <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '5px' }}>{msg.time}</div>
                  </div>
               ))}
            </div>

            <div style={{ padding: '15px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
               <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyPress={e => e.key === 'Enter' && (() => { 
                     if(chatInput.trim()){ 
                        if(isNew) {
                           const newChatId = `${user.id}_${activeChat.product.id}`;
                           sendMessage(newChatId, activeChat.product.id, activeChat.product.name, activeChat.product.vendor, chatInput, false);
                           setActiveChat(null); // Close active chat, it will appear in inbox
                           showToast(t('market_toast_msg_sent'));
                        } else {
                           sendMessage(activeChat.id, activeChat.productId, activeChat.productName, activeChat.vendor, chatInput, false); 
                        }
                        setChatInput(''); 
                     } 
                  })()} 
                  placeholder={t('market_chat_placeholder')} 
                  style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', outline: 'none' }} 
               />
               <button onClick={() => { 
                     if(chatInput.trim()){ 
                        if(isNew) {
                           const newChatId = `${user.id}_${activeChat.product.id}`;
                           sendMessage(newChatId, activeChat.product.id, activeChat.product.name, activeChat.product.vendor, chatInput, false);
                           setActiveChat(null);
                           showToast(t('market_toast_msg_sent'));
                        } else {
                           sendMessage(activeChat.id, activeChat.productId, activeChat.productName, activeChat.vendor, chatInput, false); 
                        }
                        setChatInput(''); 
                     } 
               }} style={{ background: '#228be6', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Play size={18} fill="white" /></button>
            </div>
         </div>
         );
      })()}
    </div>
  );
};

export default MarketplacePage;
