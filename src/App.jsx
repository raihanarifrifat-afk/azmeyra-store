import React, { useEffect, useMemo, useRef, useState } from 'react';
import brandLogo from './assets/azmeyra-logo.svg';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://qnfwciocoykmnvyrjasq.supabase.co', 'sb_publishable_oX02yAqCy5mgjUoFHCFMpg_1N0plQ-2');
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight,
  Clock3, CreditCard, Grid2X2, Heart, House, Mail, MapPin, Menu, MessageCircle, Minus,
  PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, UsersRound,
  Star, Trash2, Truck, UserRound, X
} from 'lucide-react';

const CATEGORIES = [
  { name:'Abaya & Burka', count:'01', image:'https://eastessence.com/cdn/shop/products/new-islamic-butterfly-cut-embroidered-kaftan-style-abaya-742798.jpg?v=1756725160' },
  { name:'Kaftan', count:'02', image:'https://jamila-eg.com/cdn/shop/files/Arabic-Calligraphy-Kaftan-001-Black00002.webp?v=1747655404' },
  { name:'Karchupi', count:'03', image:'https://down-my.img.susercontent.com/file/sg-11134201-8261q-ml7gv0ery6fhff' },
  { name:'Embroidery', count:'04', image:'https://i.etsystatic.com/53109869/r/il/616e1e/7088418778/il_1080xN.7088418778_qn3w.jpg' },
  { name:'Kurti', count:'05', image:'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=900' },
  { name:'Salwar Kameez', count:'06', image:'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=900' },
  { name:'Cover Up', count:'07', image:'https://i.ebayimg.com/images/g/GksAAOSwG~ta8joy/s-l960.jpg' },
  { name:'Western', count:'08', image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900' },
  { name:'Gown', count:'09', image:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900' },
  { name:'Accessories', count:'10', image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900' }
];

const SEED = [
  { id:2, name:'Classic Black Embroidered Abaya', category:'Abaya & Burka', price:3490, tag:'Bestseller', image:'https://eastessence.com/cdn/shop/products/new-islamic-butterfly-cut-embroidered-kaftan-style-abaya-742798.jpg?v=1756725160', images:['https://eastessence.com/cdn/shop/products/new-islamic-butterfly-cut-embroidered-kaftan-style-abaya-742798.jpg?v=1756725160'], sizes:['S','M','L','XL'], colors:['Black'], stock:8, description:'A flowing black abaya with refined embroidered detailing for everyday elegance.', featured:true },
  { id:3, name:'Everyday Linen Kurti', category:'Kurti', price:1450, tag:'Just in', image:'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=1000', images:['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=1200'], sizes:['S','M','L','XL'], colors:['Sage','Sand'], stock:18, description:'An easy, breathable silhouette made for long days and relaxed plans.', featured:true },
  { id:4, name:'Modern Co-ord Set', category:'Western', price:2350, tag:'New arrival', image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000', images:['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200'], sizes:['S','M','L'], colors:['Black','Stone'], stock:10, description:'A polished two-piece look for days when getting dressed should feel effortless.', featured:true },
  { id:5, name:'Midnight Occasion Gown', category:'Gown', price:4600, tag:'Limited edit', image:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000', images:['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200'], sizes:['S','M','L','XL'], colors:['Midnight','Wine'], stock:5, description:'A refined occasion silhouette with a little drama and a beautiful finish.', featured:true },
  { id:6, name:'Classic Black Abaya', category:'Abaya & Burka', price:2750, tag:'Bestseller', image:'https://i.etsystatic.com/53109869/r/il/616e1e/7088418778/il_1080xN.7088418778_qn3w.jpg', images:['https://i.etsystatic.com/53109869/r/il/616e1e/7088418778/il_1080xN.7088418778_qn3w.jpg'], sizes:['S','M','L','XL'], colors:['Black','Mocha'], stock:9, description:'A clean, versatile abaya designed around a timeless and comfortable fit.', featured:true },
  { id:7, name:'Soft Lounge Set', category:'Cover Up', price:1690, tag:'Everyday favourite', image:'https://i.ebayimg.com/images/g/GksAAOSwG~ta8joy/s-l960.jpg', images:['https://i.ebayimg.com/images/g/GksAAOSwG~ta8joy/s-l960.jpg'], sizes:['S','M','L','XL'], colors:['Taupe','Black'], stock:14, description:'A relaxed, modest layer for comfortable everyday styling.', featured:false },
  { id:8, name:'Pearl Detail Earrings', category:'Accessories', price:650, tag:'Small treasure', image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000', images:['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200'], sizes:['One size'], colors:['Gold'], stock:22, description:'A delicate finishing touch that brings a soft glow to any look.', featured:false },
  { id:9, name:'Signature Black Kaftan', category:'Kaftan', price:3990, tag:'New arrival', image:'https://jamila-eg.com/cdn/shop/files/Arabic-Calligraphy-Kaftan-001-Black00002.webp?v=1747655404', images:['https://jamila-eg.com/cdn/shop/files/Arabic-Calligraphy-Kaftan-001-Black00002.webp?v=1747655404'], sizes:['M','L','XL'], colors:['Black'], stock:7, description:'A graceful kaftan with statement sleeve detailing and a fluid silhouette.', featured:true },
  { id:10, name:'Pastel Karchupi Abaya', category:'Karchupi', price:4990, tag:'Hand-finished', image:'https://down-my.img.susercontent.com/file/sg-11134201-8261q-ml7gv0ery6fhff', images:['https://down-my.img.susercontent.com/file/sg-11134201-8261q-ml7gv0ery6fhff'], sizes:['S','M','L','XL'], colors:['Mauve','Ivory'], stock:6, description:'A detailed occasion abaya with delicate hand-finished embellishment.', featured:true },
  { id:11, name:'Embroidered Neutral Abaya', category:'Embroidery', price:4290, tag:'Bestseller', image:'https://i.etsystatic.com/53109869/r/il/616e1e/7088418778/il_1080xN.7088418778_qn3w.jpg', images:['https://i.etsystatic.com/53109869/r/il/616e1e/7088418778/il_1080xN.7088418778_qn3w.jpg'], sizes:['S','M','L','XL'], colors:['Taupe','Stone'], stock:5, description:'Soft neutral tones with carefully placed embroidery.', featured:true },
  { id:12, name:'Ivory Embroidered Three Piece', category:'Salwar Kameez', price:3200, tag:'New arrival', image:'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=1000', images:['https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=1200'], sizes:['S','M','L','XL'], colors:['Ivory','Sage'], stock:8, description:'An understated three-piece set with delicate detailing and everyday comfort.', featured:true },
  { id:13, name:'Pastel Kaftan Cover Up', category:'Cover Up', price:1990, tag:'Easy layer', image:'https://i.ebayimg.com/images/g/GksAAOSwG~ta8joy/s-l960.jpg', images:['https://i.ebayimg.com/images/g/GksAAOSwG~ta8joy/s-l960.jpg'], sizes:['S','M','L'], colors:['Taupe','Black'], stock:11, description:'A lightweight open layer designed to style over everyday outfits.', featured:false }
];

const money = value => '৳' + Number(value || 0).toLocaleString('en-BD');
const readStore = (key, fallback) => { try { const value=localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
const writeStore = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const fadeUp = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:.65,ease:[.22,.61,.36,1]}} };
const reveal = { initial:'hidden', whileInView:'visible', viewport:{once:true,amount:.12}, variants:fadeUp };

function App(){
  const location = useLocation();
  const navigate = useNavigate();
  const [products,setProducts] = useState(()=>{ const saved=readStore('az-products',[]); const merged=new Map(SEED.map(item=>[item.id,item])); saved.filter(item=>item.category!=='Saree'&&!/saree/i.test(item.name)).forEach(item=>merged.set(item.id,{...merged.get(item.id),...item,image:item.image||merged.get(item.id)?.image})); return [...merged.values()]; });
  const [cart,setCart] = useState(()=>readStore('az-cart',[]));
  const [wishlist,setWishlist] = useState(()=>readStore('az-wish',[]));
  const [orders,setOrders] = useState(()=>readStore('az-orders',[]));
  const [search,setSearch] = useState('');
  const [searchOpen,setSearchOpen] = useState(false);
  const [mobileMenu,setMobileMenu] = useState(false);
  const [cartOpen,setCartOpen] = useState(false);
  const [toast,setToast] = useState('');
  const [welcomeOpen,setWelcomeOpen] = useState(false);
  const [authSession,setAuthSession] = useState(null);
  const [adminRole,setAdminRole] = useState(false);
  const [authLoading,setAuthLoading] = useState(true);

  useEffect(()=>writeStore('az-products',products),[products]);
  useEffect(()=>writeStore('az-cart',cart),[cart]);
  useEffect(()=>writeStore('az-wish',wishlist),[wishlist]);
  useEffect(()=>writeStore('az-orders',orders),[orders]);
  useEffect(()=>{
    let active=true;
    const syncSession=async(session)=>{
      if(!active)return;
      setAuthSession(session||null);
      if(!session?.user){setAdminRole(false);setAuthLoading(false);return;}
      setAuthLoading(true);
      const {data,error}=await supabase.from('profiles').select('role').eq('id',session.user.id).maybeSingle();
      if(!active)return;
      setAdminRole(!error&&data?.role==='admin');
      setAuthLoading(false);
    };
    supabase.auth.getSession().then(({data})=>syncSession(data.session));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{syncSession(session);});
    return()=>{active=false;subscription.unsubscribe();};
  },[]);
  useEffect(()=>{
    if(!supabase) return;
    let alive=true;
    (async()=>{
      const {data,error}=await supabase.from('products').select('id,name,description,price,images,sizes,colors,stock,tag,categories(name)').eq('is_active',true).order('created_at',{ascending:false});
      if(error){console.error('AZMEYRA product sync:',error.message);return;}
      if(!alive||!data?.length)return;
      setProducts(data.map(p=>({id:p.id,name:p.name,category:p.categories?.name||'Collection',price:Number(p.price),tag:p.tag||'',image:p.images?.[0]||'',images:p.images||[],sizes:p.sizes||[],colors:p.colors||[],stock:p.stock,description:p.description||'',featured:Boolean(p.tag)})));
    })();
    return()=>{alive=false;};
  },[]);
  useEffect(()=>{ window.scrollTo({top:0,behavior:'smooth'}); setMobileMenu(false); setSearchOpen(false); },[location.pathname]);
  useEffect(()=>{ if(sessionStorage.getItem('az-welcome-seen')) return; const timer=setTimeout(()=>setWelcomeOpen(true),650); return ()=>clearTimeout(timer); },[]);
  const closeWelcome = () => { sessionStorage.setItem('az-welcome-seen','1'); setWelcomeOpen(false); };
  useEffect(()=>{ if(!toast) return undefined; const timer=setTimeout(()=>setToast(''),2600); return ()=>clearTimeout(timer); },[toast]);

  const cartCount = cart.reduce((sum,item)=>sum+item.qty,0);
  const cartTotal = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  const addToCart = (product,options={}) => {
    const size=options.size || (product.sizes?.[0] || 'M');
    const color=options.color || (product.colors?.[0] || 'Default');
    setCart(current=>{
      const existing=current.find(item=>item.id===product.id && item.size===size && item.color===color);
      return existing ? current.map(item=>item===existing ? {...item,qty:item.qty+1} : item) : [...current,{...product,size,color,qty:1}];
    });
    setToast('Added to your bag');
    setCartOpen(true);
  };
  const setQuantity = (id,size,color,qty) => setCart(current=>current.map(item=>item.id===id && item.size===size && item.color===color ? {...item,qty:Math.max(1,qty)} : item));
  const removeFromCart = (id,size,color) => setCart(current=>current.filter(item=>!(item.id===id && item.size===size && item.color===color)));
  const toggleWishlist = id => setWishlist(current=>current.includes(id) ? current.filter(item=>item!==id) : [...current,id]);
  const submitSearch = event => { event.preventDefault(); navigate('/shop?search='+encodeURIComponent(search.trim())); setSearchOpen(false); };

  return <div className="site-shell">
    <header className="site-header">
      <div className="header-inner">
        <button className="mobile-menu-button icon-button" aria-label="Open menu" onClick={()=>setMobileMenu(value=>!value)}>{mobileMenu?<X/>:<Menu/>}</button>
        <Link to="/" className="brand-lockup" aria-label="AZMEYRA home"><img src={brandLogo} alt="AZMEYRA — Elegance in Every Look"/></Link>
        <nav className={mobileMenu?'primary-nav is-open':'primary-nav'} aria-label="Main navigation">
          {[['Home','/'],['Shop','/shop'],['Our story','/about'],['Journal','/blog'],['Contact','/contact']].map(([label,path])=><NavLink key={path} to={path} onClick={()=>setMobileMenu(false)}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <button className="icon-button search-toggle" aria-label="Search" onClick={()=>setSearchOpen(value=>!value)}><Search/></button>
          <Link className="icon-button account-link" to="/account" aria-label="My account"><UserRound/></Link>
          <Link className="icon-button wishlist-link" to="/wishlist" aria-label="Wishlist"><Heart/><span className="action-count">{wishlist.length}</span></Link>
          <button className="icon-button bag-link" aria-label="Open shopping bag" onClick={()=>setCartOpen(true)}><ShoppingBag/><span className="action-count">{cartCount}</span></button>
        </div>
      </div>
      <AnimatePresence>
        {searchOpen && <motion.div className="search-panel" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
          <form className="search-form" onSubmit={submitSearch}><Search/><input autoFocus value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search suits, kurtis, occasionwear..."/><button className="search-submit" type="submit">Search <ArrowUpRight/></button><button className="search-close icon-button" type="button" onClick={()=>setSearchOpen(false)} aria-label="Close search"><X/></button></form>
          <div className="search-suggestions"><span>POPULAR SEARCHES</span>{['Salwar Kameez','Kurti','Abaya & Burka','Occasionwear'].map(term=><button key={term} onClick={()=>{setSearch(term);navigate('/shop?search='+encodeURIComponent(term));setSearchOpen(false);}}>{term}</button>)}</div>
        </motion.div>}
      </AnimatePresence>
    </header>

    <AnimatePresence>
      {mobileMenu && <MobileMenu onClose={()=>setMobileMenu(false)}/>}
    </AnimatePresence>

    <AnimatePresence mode="wait" initial={false}>
      <motion.main key={location.pathname} className="route-main" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.22}}>
        <Routes>
          <Route path="/" element={<Home products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} onAdd={addToCart}/>}/>
          <Route path="/shop" element={<Shop products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} onAdd={addToCart}/>}/>
          <Route path="/product/:id" element={<ProductDetail products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} onAdd={addToCart}/>}/>
          <Route path="/cart" element={<CartPage cart={cart} total={cartTotal} onQuantity={setQuantity} onRemove={removeFromCart}/>}/>
          <Route path="/checkout" element={<Checkout cart={cart} total={cartTotal} setCart={setCart} orders={orders} setOrders={setOrders}/>}/>
          <Route path="/account" element={<Account orders={orders}/>}/>
          <Route path="/track" element={<TrackOrder orders={orders}/>}/>
          <Route path="/wishlist" element={<WishlistPage products={products} wishlist={wishlist} onToggleWishlist={toggleWishlist} onAdd={addToCart}/>}/>
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/contact" element={<ContactPage/>}/>
          <Route path="/blog" element={<JournalPage/>}/>
          <Route path="/admin" element={<AdminPage products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} session={authSession} isAdmin={adminRole} loading={authLoading}/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </motion.main>
    </AnimatePresence>
    <AnimatePresence>
      {welcomeOpen && <motion.div className="welcome-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={event=>{if(event.target===event.currentTarget)closeWelcome();}}>
        <motion.section className="welcome-modal" initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:18,scale:.98}} transition={{duration:.3}}>
          <button className="welcome-close" onClick={closeWelcome} aria-label="Close welcome popup"><X/></button>
          <div className="welcome-image"><img src="https://eastessence.com/cdn/shop/products/new-islamic-butterfly-cut-embroidered-kaftan-style-abaya-742798.jpg?v=1756725160" alt="AZMEYRA modest fashion collection"/></div>
          <div className="welcome-copy"><img className="welcome-brand-logo" src={brandLogo} alt="AZMEYRA logo"/><span className="eyebrow">WELCOME TO AZMEYRA</span><h2 id="welcome-title">The art of<br/><em>everyday elegance.</em></h2><p>Thoughtfully selected fashion for every version of you. Discover a collection made to feel personal, effortless and beautifully yours.</p><button className="button button-dark" onClick={()=>{closeWelcome();navigate('/shop');}}>Explore the collection <ArrowRight/></button><button className="welcome-dismiss" onClick={closeWelcome}>Maybe later</button></div>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
    <SiteFooter/>
    <a className="floating-chat" href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp chat"><MessageCircle/></a>
    <MobileDock cartCount={cartCount} onMenu={()=>setMobileMenu(value=>!value)}/>
    <CartDrawer open={cartOpen} cart={cart} total={cartTotal} onClose={()=>setCartOpen(false)} onQuantity={setQuantity} onRemove={removeFromCart}/>
    <AnimatePresence>{toast && <motion.div className="toast-message" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:14}}><Check size={16}/>{toast}</motion.div>}</AnimatePresence>
  </div>;
}

function MobileMenu({onClose}){
  const collections=['Abaya & Burka','Salwar Kameez','Kurti & Tops','Gowns','Nightwear','Accessories'];
  const info=[['Our story','/about'],['Journal','/blog'],['Contact & support','/contact'],['My account','/account']];
  return <motion.div className="az-menu-scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
    <motion.aside className="az-menu-panel" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:29,stiffness:250}} onClick={event=>event.stopPropagation()} aria-label="AZMEYRA menu">
      <div className="az-menu-head">
        <Link to="/" onClick={onClose}><img src={brandLogo} alt="AZMEYRA"/></Link>
        <button className="az-menu-close" onClick={onClose} aria-label="Close menu"><X/></button>
      </div>
      <div className="az-menu-scroll">
        <Link className="az-menu-community" to="/blog" onClick={onClose}>
          <span className="az-menu-community-icon"><UsersRound/></span>
          <span><strong>THE STYLE JOURNAL</strong><small>Stories, styling notes & new arrivals</small></span>
          <ArrowRight/>
        </Link>
        <div className="az-menu-section-title"><span>EXPLORE COLLECTIONS</span><i>✦</i></div>
        <div className="az-menu-collections">
          {collections.map((name,index)=><Link key={name} to={'/shop?category='+encodeURIComponent(name)} onClick={onClose} className={index===0?'featured':''}>{name}<ArrowRight size={15}/></Link>)}
        </div>
        <div className="az-menu-edit">
          <div className="az-menu-edit-top"><span>THE AZMEYRA EDIT</span><span>01 — 06</span></div>
          <p>Considered pieces.<br/><em>Made for your moments.</em></p>
          <Link to="/shop" onClick={onClose}>DISCOVER ALL PIECES <ArrowRight size={16}/></Link>
        </div>
        <div className="az-menu-section-title"><span>INFORMATION</span><i>✦</i></div>
        <div className="az-menu-info">{info.map(([label,path])=><Link key={path} to={path} onClick={onClose}>{label}<ArrowRight size={14}/></Link>)}</div>
        <a className="az-menu-help" href="https://wa.me/" target="_blank" rel="noreferrer">
          <span className="az-menu-help-icon"><MessageCircle/></span><span><strong>Need a little help?</strong><small>Chat with our customer care</small></span><ArrowRight/>
        </a>
      </div>
      <div className="az-menu-foot">AZMEYRA <span>—</span> ELEGANCE IN EVERY LOOK</div>
    </motion.aside>
  </motion.div>;
}

function MobileDock({cartCount,onMenu}){return <nav className="mobile-dock" aria-label="Quick navigation">
  <NavLink to="/shop"><Grid2X2/><span>Discover</span></NavLink>
  <NavLink to="/blog"><BookOpen/><span>Journal</span></NavLink>
  <NavLink to="/" className="dock-home"><House/></NavLink>
  <a href="https://wa.me/" target="_blank" rel="noreferrer"><MessageCircle/><span>Concierge</span></a>
  <button type="button" onClick={onMenu}><Menu/><span>Menu</span></button>
</nav>}
function Home({products,wishlist,onToggleWishlist,onAdd}){
  const arrivals=[...products.filter(item=>item.tag==='New arrival'||item.tag==='Just in'),...products.filter(item=>item.tag!=='New arrival'&&item.tag!=='Just in')].slice(0,4);
  const bestsellers=products.filter(item=>item.tag==='Bestseller').slice(0,4);
  const homeCategories=CATEGORIES.filter(item=>['Salwar Kameez','Kurti','Western','Abaya & Burka'].includes(item.name));
  const heroSlides=[
    {category:'THE ABAYA EDIT',title:'Abaya An-Nuha',image:'https://images.pexels.com/photos/13791549/pexels-photo-13791549.jpeg?auto=compress&cs=tinysrgb&w=1200',alt:'Model wearing a refined modest abaya',link:'/shop?category=Abaya%20%26%20Burka',cta:'Explore collection'},
    {category:'THE MODEST SET',title:'Everyday elegance',image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=85',alt:'Contemporary modest fashion styling',link:'/shop?category=Salwar%20Kameez',cta:'Discover the edit'},
    {category:'THE KURTI STORY',title:'Grace in every detail',image:'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=1200&auto=format&fit=crop&q=85',alt:'Elegant traditional outfit collection',link:'/shop?category=Kurti',cta:'Shop kurtis'},
    {category:'THE WESTERN EDIT',title:'A little more you',image:'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200&auto=format&fit=crop&q=85',alt:'Modern womenswear collection',link:'/shop?category=Western',cta:'Explore styles'},
    {category:'OCCASION WEAR',title:'Made for the moment',image:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&auto=format&fit=crop&q=85',alt:'Elegant occasion wear fashion',link:'/shop?category=Gown',cta:'Find your look'},
    {category:'THE FINISHING TOUCH',title:'Details that define you',image:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&auto=format&fit=crop&q=85',alt:'Fashion accessories and jewellery styling',link:'/shop?category=Accessories',cta:'View accessories'}
  ];
  const [heroSlide,setHeroSlide]=useState(0);
  useEffect(()=>{const timer=setInterval(()=>setHeroSlide(current=>(current+1)%heroSlides.length),6000);return()=>clearInterval(timer)},[]);
  const activeHero=heroSlides[heroSlide];
  const changeHero=direction=>setHeroSlide(current=>(current+direction+heroSlides.length)%heroSlides.length);
  return <>
    <section className="az-home-hero" aria-label="Featured AZMEYRA collection">
      <div className="az-hero-intro">
        <span className="az-hero-kicker">THE ART OF EVERYDAY ELEGANCE</span>
        <h1>Experience the <em>AZMEYRA</em> edit.</h1>
        <p>Thoughtfully selected fashion for every version of you.</p>
        <div className="az-hero-dots" aria-label="Choose featured collection">
          {heroSlides.map((slide,index)=><button key={slide.title} className={index===heroSlide?'active':''} onClick={()=>setHeroSlide(index)} aria-label={'Show '+slide.title}/>)}
        </div>
      </div>
      <div className="az-hero-stage">
        <button className="az-hero-peek az-hero-peek-left" onClick={()=>changeHero(-1)} aria-label="Previous collection" style={{backgroundImage:`url(${heroSlides[(heroSlide+heroSlides.length-1)%heroSlides.length].image})`}}><span>0{((heroSlide+heroSlides.length-1)%heroSlides.length)+1}</span></button>
        <button className="az-hero-peek az-hero-peek-right" onClick={()=>changeHero(1)} aria-label="Next collection" style={{backgroundImage:`url(${heroSlides[(heroSlide+1)%heroSlides.length].image})`}}><span>0{((heroSlide+1)%heroSlides.length)+1}</span></button>
        <AnimatePresence mode="wait">
          <motion.div className="az-hero-backdrop" key={'back-'+activeHero.image} style={{backgroundImage:'url('+activeHero.image+')'}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.5}}/>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.article className="az-hero-card" key={activeHero.title} initial={{opacity:0,y:22,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-14,scale:.985}} transition={{duration:.45,ease:[.2,.7,.2,1]}}>
            <img src={activeHero.image} alt={activeHero.alt} fetchPriority="high"/>
            <div className="az-hero-card-shade"/>
            <div className="az-hero-card-copy">
              <span>{activeHero.category}</span>
              <h2>{activeHero.title}</h2>
              <Link to={activeHero.link}>{activeHero.cta} <ArrowRight size={18}/></Link>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
      <div className="az-hero-controls">
        <button onClick={()=>changeHero(-1)} aria-label="Previous collection"><ChevronLeft/></button>
        <span><b>{String(heroSlide+1).padStart(2,'0')}</b> / {String(heroSlides.length).padStart(2,'0')}</span>
        <button onClick={()=>changeHero(1)} aria-label="Next collection"><ChevronRight/></button>
      </div>
    </section>
    <section className="az-collections" aria-label="Shop collections">
      <div className="az-collections-intro">
        <span className="eyebrow">THE AZMEYRA EDIT</span>
        <h2>Find your <em>favourite</em> collection.</h2>
        <p>Thoughtfully selected styles for everyday wear and special moments.</p>
      </div>
      {[
        {name:'Abaya & Burka',title:'Abaya Collection',eyebrow:'GRACE IN EVERY DETAIL'},
        {name:'Kaftan',title:'Kaftan Collection',eyebrow:'FLOWING EVERYDAY ELEGANCE'},
        {name:'Karchupi',title:'Karchupi Collection',eyebrow:'DETAILS MADE TO STAND OUT'},
        {name:'Embroidery',title:'Embroidery Collection',eyebrow:'CRAFTED WITH CARE'},
        {name:'Kurti',title:'Kurti Collection',eyebrow:'EASY EVERYDAY STYLE'},
        {name:'Salwar Kameez',title:'Three Piece Collection',eyebrow:'THE THREE PIECE EDIT'},
        {name:'Cover Up',title:'Cover Up Collection',eyebrow:'EASY LAYERING'},
        {name:'Western',title:'Contemporary Collection',eyebrow:'A MODERN EDIT'},
        {name:'Gown',title:'Occasion Collection',eyebrow:'MADE FOR YOUR MOMENTS'},
        {name:'Accessories',title:'Finishing Touches',eyebrow:'THE LITTLE DETAILS'}
      ].map(collection=>{
        const items=products.filter(item=>item.category===collection.name&&!/saree/i.test(item.name));
        return items.length>0?<CollectionRail key={collection.name} collection={collection} products={items} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onAdd={onAdd}/>:null;
      })}
    </section>

    <section className="benefit-band homepage-benefit-band" aria-label="Shopping benefits">
      <div className="benefit-item"><span className="benefit-icon"><Truck/></span><div><b>Delivery across Bangladesh</b><small>Carefully packed, right to your door</small></div></div>
      <div className="benefit-item"><span className="benefit-icon"><ShieldCheck/></span><div><b>Thoughtful quality</b><small>Pieces selected with care</small></div></div>
      <div className="benefit-item"><span className="benefit-icon"><PackageCheck/></span><div><b>Easy exchange</b><small>Friendly support when you need it</small></div></div>
    </section>

    <section className="story-split">
      <div className="story-image"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400" alt="A carefully styled fashion edit" loading="lazy"/><span className="image-stamp">THE AZMEYRA<br/>POINT OF VIEW</span></div>
      <motion.div className="story-copy" {...reveal}>
        <span className="eyebrow">A MORE CONSIDERED WARDROBE</span>
        <h2>Find the pieces<br/>that feel like <em>you.</em></h2>
        <p>Personal style is not about having more. It is about discovering the pieces that make you feel entirely yourself — with comfort, confidence and a little everyday magic.</p>
        <Link className="button button-dark" to="/about">A little about us <ArrowUpRight/></Link>
      </motion.div>
    </section>

    <motion.section className="section-block bestseller-section" {...reveal}>
      <SectionHeading eyebrow="THE ONES YOU LOVE" title="Considered favourites." link="/shop" linkText="Explore bestsellers"/>
      <ProductGrid products={bestsellers.length?bestsellers:products.slice(2,6)} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onAdd={onAdd}/>
    </motion.section>

    <section className="campaign-banner">
      <div className="campaign-bg"/>
      <div className="campaign-content"><span className="eyebrow">A LITTLE SOMETHING FOR YOU</span><h2>Make room for<br/><em>lovely things.</em></h2><p>Explore the pieces that make everyday dressing feel special.</p><Link className="button button-cream" to="/shop">Shop the edit <ArrowUpRight/></Link></div>
      <span className="campaign-side-note">THE AZMEYRA EDIT / 2026</span>
    </section>
    <Newsletter/>
  </>;
}


function CollectionRail({collection,products,wishlist,onToggleWishlist,onAdd}){
  const rail=useRef(null);
  const move=direction=>rail.current?.scrollBy({left:direction*rail.current.clientWidth*.78,behavior:'smooth'});
  return <section className="az-collection-row">
    <div className="az-collection-heading">
      <div><span className="eyebrow">{collection.eyebrow}</span><h2>{collection.title}</h2><small>{collection.name}</small></div>
      <Link to={'/shop?category='+encodeURIComponent(collection.name)} className="az-view-all">View all <ArrowUpRight size={15}/></Link>
    </div>
    <div className="az-collection-track-wrap">
      <button className="az-rail-arrow az-rail-prev" onClick={()=>move(-1)} aria-label={'Previous '+collection.title}><ChevronLeft/></button>
      <div className="az-collection-track" ref={rail}>
        {products.map(product=><div className="az-collection-product" key={product.id}>
          <ProductCard product={product} wished={wishlist.includes(product.id)} onToggle={()=>onToggleWishlist(product.id)} onAdd={()=>onAdd(product)}/>
        </div>)}
      </div>
      <button className="az-rail-arrow az-rail-next" onClick={()=>move(1)} aria-label={'Next '+collection.title}><ChevronRight/></button>
    </div>
    <div className="az-collection-footer"><Link to={'/shop?category='+encodeURIComponent(collection.name)}>Explore collection <ArrowRight size={14}/></Link></div>
  </section>;
}

function SectionHeading({eyebrow,title,link,linkText='Explore all'}){return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{link&&<Link className="text-link" to={link}>{linkText}<ArrowUpRight/></Link>}</div>}

function ProductGrid({products,wishlist,onToggleWishlist,onAdd}){return <div className="product-grid">{products.map(product=><ProductCard key={product.id} product={product} wished={wishlist.includes(product.id)} onToggle={()=>onToggleWishlist(product.id)} onAdd={()=>onAdd(product)}/>)}</div>}

function ProductCard({product,wished,onToggle,onAdd}){return <motion.article className="product-card" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.14}} whileHover={{y:-5}} transition={{duration:.35}}>
  <div className="product-image-wrap"><Link className="product-image" to={'/product/'+product.id}><img src={product.image} alt={product.name} loading="lazy"/><span className="product-image-glow"/></Link>
    {product.tag&&<span className="product-badge">{product.tag}</span>}
    <button className={wished?'wishlist-chip is-active':'wishlist-chip'} onClick={onToggle} aria-label={wished?'Remove from wishlist':'Add to wishlist'}><Heart fill={wished?'currentColor':'none'}/></button>
    <button className="quick-add-button" onClick={onAdd}><Plus/> Quick add</button>
  </div>
  <div className="product-meta"><span>{product.category}</span><span className="product-rating"><Star fill="currentColor"/> 4.9</span></div>
  <Link className="product-name" to={'/product/'+product.id}>{product.name}</Link>
  <div className="product-price">{money(product.price)} {product.compareAt&&<del>{money(product.compareAt)}</del>}</div>
</motion.article>}

function Shop({products,wishlist,onToggleWishlist,onAdd}){
  const [params,setParams]=useState(()=>new URLSearchParams(window.location.search));
  const [category,setCategory]=useState(params.get('category')||'All');
  const [sort,setSort]=useState('featured');
  const [query,setQuery]=useState(params.get('search')||'');
  const [maxPrice,setMaxPrice]=useState(10000);
  const [size,setSize]=useState('All');
  const [filtersOpen,setFiltersOpen]=useState(false);
  const categories=['All',...CATEGORIES.map(item=>item.name)];
  const filtered=useMemo(()=>products.filter(item=>(category==='All'||item.category===category)&&item.price<=maxPrice&&(size==='All'||item.sizes?.includes(size))&&item.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:sort==='new'?b.id-a.id:0),[products,category,maxPrice,size,query,sort]);
  return <div className="page-wrap">
    <div className="shop-intro"><span className="eyebrow">THE AZMEYRA COLLECTION</span><h1>Find your <em>favourite.</em></h1><p>Thoughtful pieces for all the moments that make you, you.</p><div className="breadcrumb"><Link to="/">Home</Link><ChevronRight/> <span>Shop all</span></div></div>
    <div className="shop-toolbar"><span>{filtered.length} thoughtfully selected pieces</span><div className="shop-toolbar-actions"><button className="filter-trigger" onClick={()=>setFiltersOpen(value=>!value)}><SlidersHorizontal/> Filters</button><label className="sort-control"><span>Sort by</span><select value={sort} onChange={event=>setSort(event.target.value)}><option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown/></label></div></div>
    <div className={filtersOpen?'shop-layout filters-visible':'shop-layout'}>
      <aside className="filter-sidebar"><div className="filter-heading"><b>Refine your edit</b><button onClick={()=>{setCategory('All');setSize('All');setMaxPrice(10000);setQuery('');}}>Clear all</button></div>
        <label className="filter-search"><Search/><input placeholder="Search pieces..." value={query} onChange={event=>setQuery(event.target.value)}/></label>
        <div className="filter-group"><b>Category</b>{categories.map(name=><button className={category===name?'filter-option active':'filter-option'} key={name} onClick={()=>setCategory(name)}>{name}<span>{name==='All'?products.length:products.filter(item=>item.category===name).length}</span></button>)}</div>
        <div className="filter-group"><b>Size</b><div className="size-filter">{['All','S','M','L','XL','Free size','One size'].map(value=><button className={size===value?'selected':''} key={value} onClick={()=>setSize(value)}>{value}</button>)}</div></div>
        <div className="filter-group"><b>Price range</b><div className="price-range-label"><span>Up to</span><strong>{money(maxPrice)}</strong></div><input className="price-slider" type="range" min="500" max="10000" step="100" value={maxPrice} onChange={event=>setMaxPrice(Number(event.target.value))}/><div className="price-range-label"><span>৳500</span><span>৳10,000</span></div></div>
      </aside>
      <div className="shop-results">
        <div className="active-filters">{category!=='All'&&<button onClick={()=>setCategory('All')}>{category}<X/></button>}{size!=='All'&&<button onClick={()=>setSize('All')}>Size: {size}<X/></button>}{query&&<button onClick={()=>setQuery('')}>Search: {query}<X/></button>}</div>
        {filtered.length?<ProductGrid products={filtered} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onAdd={onAdd}/>:<div className="empty-state"><Sparkles/><h2>No pieces found just yet.</h2><p>Try adjusting your filters to find something lovely.</p><button className="button button-dark" onClick={()=>{setCategory('All');setSize('All');setMaxPrice(10000);setQuery('');}}>Clear filters</button></div>}
      </div>
    </div>
  </div>;
}

function ProductDetail({products,wishlist,onToggleWishlist,onAdd}){
  const {id}=useParams();
  const product=products.find(item=>String(item.id)===String(id));
  const [selectedSize,setSelectedSize]=useState('');
  const [selectedColor,setSelectedColor]=useState('');
  const [activeImage,setActiveImage]=useState(0);
  useEffect(()=>{setSelectedSize('');setSelectedColor('');setActiveImage(0);},[id]);
  if(!product)return <NotFound/>;
  const images=product.images?.length?product.images:[product.image];
  const size=selectedSize || product.sizes?.[0] || 'M';
  const color=selectedColor || product.colors?.[0] || 'Default';
  return <div className="page-wrap detail-page">
    <div className="breadcrumb"><Link to="/">Home</Link><ChevronRight/><Link to="/shop">Shop</Link><ChevronRight/><span>{product.name}</span></div>
    <div className="detail-layout">
      <div className="detail-gallery"><div className="detail-main-image"><img src={images[activeImage]} alt={product.name}/><span className="detail-image-label">AZMEYRA / {product.category}</span></div>{images.length>1&&<div className="detail-thumbnails">{images.map((image,index)=><button className={activeImage===index?'active':''} key={image} onClick={()=>setActiveImage(index)}><img src={image} alt={product.name+' view '+(index+1)}/></button>)}</div>}</div>
      <div className="detail-information"><span className="eyebrow">{product.category} / THE AZMEYRA EDIT</span><h1>{product.name}</h1><div className="detail-rating"><span><Star fill="currentColor"/> 4.9</span><span>Thoughtfully selected</span></div><div className="detail-price">{money(product.price)} {product.compareAt&&<del>{money(product.compareAt)}</del>}</div><p className="detail-description">{product.description}</p>
        <div className="detail-option"><div className="option-label"><b>Colour</b><span>{color}</span></div><div className="colour-options">{(product.colors||['Default']).map(value=><button className={color===value?'active':''} key={value} onClick={()=>setSelectedColor(value)}><i/> {value}</button>)}</div></div>
        <div className="detail-option"><div className="option-label"><b>Choose size</b><button className="size-guide" onClick={()=>document.getElementById('size-guide')?.scrollIntoView({behavior:'smooth',block:'center'})}>Size guide <ArrowUpRight/></button></div><div className="size-options">{(product.sizes||['S','M','L','XL']).map(value=><button className={size===value?'active':''} key={value} onClick={()=>setSelectedSize(value)}>{value}</button>)}</div></div>
        <div className="detail-stock"><span className="stock-dot"/>{product.stock>0?'In stock — ready to be yours':'Currently unavailable'}</div>
        <button className="button button-dark detail-add" disabled={product.stock<=0} onClick={()=>onAdd(product,{size,color})}>Add to bag <span>{money(product.price)}</span><ShoppingBag/></button>
        <button className={wishlist.includes(product.id)?'button button-outline detail-wish is-active':'button button-outline detail-wish'} onClick={()=>onToggleWishlist(product.id)}><Heart fill={wishlist.includes(product.id)?'currentColor':'none'}/>{wishlist.includes(product.id)?'Saved to wishlist':'Add to wishlist'}</button>
        <div className="service-notes"><div><Truck/><span>Delivery across Bangladesh</span></div><div><RotateCcwIcon/><span>Easy exchange support</span></div><div><ShieldCheck/><span>Selected with care</span></div></div>
        <div className="size-guide-panel" id="size-guide"><b>A note on fit</b><p>For size advice, share your measurements with our customer care team before ordering.</p></div>
      </div>
    </div>
    <section className="section-block related-section"><SectionHeading eyebrow="KEEP EXPLORING" title="You may also love." link="/shop"/><ProductGrid products={products.filter(item=>item.id!==product.id).slice(0,4)} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onAdd={onAdd}/></section>
  </div>;
}
function RotateCcwIcon(){return <span className="rotate-icon">↺</span>}

function CartRows({cart,onQuantity,onRemove}){return <div className="cart-lines">{cart.map(item=><div className="cart-line" key={item.id+'-'+item.size+'-'+item.color}><Link to={'/product/'+item.id} className="cart-line-image"><img src={item.image} alt={item.name}/></Link><div className="cart-line-info"><Link to={'/product/'+item.id}>{item.name}</Link><span>{item.size} · {item.color}</span><b>{money(item.price)}</b><div className="quantity-control"><button onClick={()=>onQuantity(item.id,item.size,item.color,item.qty-1)} aria-label="Decrease quantity"><Minus/></button><span>{item.qty}</span><button onClick={()=>onQuantity(item.id,item.size,item.color,item.qty+1)} aria-label="Increase quantity"><Plus/></button></div></div><button className="remove-item" aria-label="Remove item" onClick={()=>onRemove(item.id,item.size,item.color)}><Trash2/></button></div>)}</div>}

function CartDrawer({open,cart,total,onClose,onQuantity,onRemove}){return <AnimatePresence>{open&&<><motion.button className="drawer-scrim" aria-label="Close shopping bag" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}/><motion.aside className="cart-drawer" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:260}}><div className="drawer-header"><div><span className="eyebrow">YOUR AZMEYRA EDIT</span><h2>Your bag <span>({cart.reduce((sum,item)=>sum+item.qty,0)})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close bag"><X/></button></div>
  {cart.length?<><div className="drawer-items"><CartRows cart={cart} onQuantity={onQuantity} onRemove={onRemove}/></div><div className="drawer-footer"><div className="drawer-subtotal"><span>Subtotal</span><b>{money(total)}</b></div><p>Delivery details are confirmed at checkout.</p><Link className="button button-dark drawer-checkout" to="/checkout" onClick={onClose}>Continue to checkout <ArrowRight/></Link><Link className="drawer-view-cart" to="/cart" onClick={onClose}>View full bag</Link></div></>:<div className="drawer-empty"><ShoppingBag/><h3>Your bag is waiting.</h3><p>Find something that feels like you.</p><Link className="button button-dark" to="/shop" onClick={onClose}>Explore the collection <ArrowUpRight/></Link></div>}</motion.aside></>}</AnimatePresence>}

function CartPage({cart,total,onQuantity,onRemove}){return <div className="page-wrap cart-page"><div className="shop-intro"><span className="eyebrow">YOUR SELECTION</span><h1>Your <em>bag.</em></h1><p>A few lovely things, all in one place.</p></div>{cart.length?<div className="cart-page-layout"><div><CartRows cart={cart} onQuantity={onQuantity} onRemove={onRemove}/></div><aside className="order-summary"><span className="eyebrow">THE DETAILS</span><h2>Order summary</h2><div><span>Subtotal</span><b>{money(total)}</b></div><div><span>Delivery</span><span>Calculated at checkout</span></div><div className="summary-total"><b>Total</b><strong>{money(total)}</strong></div><Link className="button button-dark summary-checkout" to="/checkout">Continue to checkout <ArrowRight/></Link><p className="summary-reassurance"><ShieldCheck/> Secure checkout experience</p></aside></div>:<div className="empty-state cart-empty"><ShoppingBag/><h2>Your bag is waiting.</h2><p>There is always room for something lovely.</p><Link to="/shop" className="button button-dark">Explore the collection <ArrowUpRight/></Link></div>}</div>}

function Checkout({cart,total,setCart,orders,setOrders}){const [payment,setPayment]=useState('Cash on Delivery');const [orderId,setOrderId]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [invoice,setInvoice]=useState(null);if(!cart.length&&!orderId)return <div className="page-wrap"><div className="empty-state cart-empty"><ShoppingBag/><h2>Your bag is empty.</h2><Link className="button button-dark" to="/shop">Back to shopping <ArrowRight/></Link></div></div>;return <div className="page-wrap checkout-page"><div className="shop-intro"><span className="eyebrow">THE LAST LOVELY STEP</span><h1>Almost <em>yours.</em></h1></div>{orderId?<div className="order-success"><span className="success-mark"><Check/></span><span className="eyebrow">THANK YOU FOR CHOOSING AZMEYRA</span><h2>Your order is received.</h2><p>Your order number is <b>{orderId}</b>. Please keep this number for order support.</p><button type="button" className="button button-dark checkout-invoice-download" onClick={()=>{if(!invoice)return;const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));const rows=invoice.items.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.size||'—')+'</td><td>'+esc(x.color||'—')+'</td><td>'+Number(x.qty||1)+'</td><td>৳'+Number(x.price||0).toLocaleString('en-BD')+'</td><td>৳'+(Number(x.price||0)*Number(x.qty||1)).toLocaleString('en-BD')+'</td></tr>').join('');const html='<!doctype html><html><head><meta charset="utf-8"><title>AZMEYRA Invoice '+esc(orderId)+'</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"><style>*{box-sizing:border-box}body{font:13px 'Manrope',Arial,sans-serif;color:#171515;padding:42px;max-width:1000px;margin:0 auto;background:#fff}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #b9ada5;padding-bottom:23px;gap:25px}.brand img{display:block;width:190px;max-height:70px;object-fit:contain;object-position:left center}.brand-note{font:italic 11px 'Cormorant Garamond',serif;letter-spacing:1px;color:#81746c;margin-top:5px}h1{font:500 38px 'Cormorant Garamond',serif;letter-spacing:5px;margin:0}h2{font:500 27px 'Cormorant Garamond',serif;letter-spacing:2px;margin:0 0 6px}.muted{color:#756e69;font-size:11px;line-height:1.85}.grid{display:grid;grid-template-columns:1fr 1fr;gap:25px;margin:32px 0}.section-label{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#8c766b;font-weight:700}table{width:100%;border-collapse:collapse;margin-top:25px}th,td{padding:13px 9px;border-bottom:1px solid #e7e1dc;text-align:left;font-size:11px}th{background:#f7f4f1;color:#66584f;text-transform:uppercase;letter-spacing:1px;font-size:9px;font-weight:700}.totals{margin:25px 0 0 auto;width:280px}.totals p{display:flex;justify-content:space-between;padding:5px 0;margin:0;color:#625b56}.grand{font:600 23px 'Cormorant Garamond',serif;border-top:1px solid #171515;padding-top:13px!important;color:#171515!important}.foot{text-align:center;border-top:1px solid #e7e1dc;margin-top:48px;padding-top:22px;color:#897d75;font:italic 14px 'Cormorant Garamond',serif;letter-spacing:.5px}@media print{body{padding:15mm}}@media(max-width:600px){body{padding:22px}.brand img{width:145px}h1{font-size:30px}}</head><body><header><div class="brand"><img src="'+esc(brandLogo)+'" alt="AZMEYRA logo"><div class="brand-note">Elegance in Every Thread</div></div><div style="text-align:right"><h2>INVOICE</h2><div class="muted">Order: '+esc(orderId)+'<br>Date: '+esc(invoice.date)+'</div></div></header><div class="grid"><div><b>Customer</b><p>'+esc(invoice.name)+'<br>'+esc(invoice.phone)+'<br>'+esc(invoice.email||'')+'<br>'+esc(invoice.address)+'</p></div><div><b>Payment & Status</b><p>Cash on Delivery<br>Order received</p></div></div><table><thead><tr><th>Product</th><th>Size</th><th>Color</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>'+rows+'</tbody></table><div class="totals"><p><span>Subtotal</span><b>৳'+Number(invoice.subtotal).toLocaleString('en-BD')+'</b></p><p><span>Delivery</span><b>৳'+Number(invoice.delivery).toLocaleString('en-BD')+'</b></p><p class="grand"><span>Total</span><b>৳'+Number(invoice.total).toLocaleString('en-BD')+'</b></p></div><div class="foot">Thank you for shopping with AZMEYRA.</div><script>window.onload=()=>window.print()</script></body></html>';const blob=new Blob([html],{type:'text/html'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='AZMEYRA-Invoice-'+orderId+'.html';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);}}>Download Invoice <ArrowRight/></button><p className="checkout-invoice-hint">Invoice file download হবে। খুলে Print থেকে Save as PDF করতে পারবেন।</p><Link className="button button-dark" to="/shop">Continue exploring <ArrowRight/></Link></div>:<form className="checkout-grid" onSubmit={async event=>{event.preventDefault();setError('');const data=new FormData(event.currentTarget);if(payment!=='Cash on Delivery'){setError('Online payment is not active yet. Please choose Cash on Delivery.');return;}if(!supabase){setError('Store database is not configured yet. Please contact the store administrator.');return;}setBusy(true);try{const payload=cart.map(item=>({product_id:String(item.id),quantity:item.qty,size:item.size,color:item.color}));const {data:result,error:rpcError}=await supabase.rpc('create_guest_order',{p_customer_name:String(data.get('name')),p_phone:String(data.get('phone')),p_email:String(data.get('email')||''),p_shipping_address:String(data.get('address')),p_payment_method:'cod',p_items:payload});if(rpcError)throw rpcError;setInvoice({name:String(data.get('name')),phone:String(data.get('phone')),email:String(data.get('email')||''),address:String(data.get('address')),items:cart.map(item=>({name:item.name,price:item.price,qty:item.qty,size:item.size,color:item.color})),subtotal:Number(result.total),delivery:0,total:Number(result.total),date:new Date().toLocaleString()});setOrderId(result.order_number);setOrders(current=>[...current,{id:result.order_number,name:data.get('name'),phone:data.get('phone'),address:data.get('address'),payment:'Cash on Delivery',status:'Order received',items:cart,total:Number(result.total),created:new Date().toISOString()}]);setCart([]);}catch(err){setError(err.message||'Order could not be placed. Please try again.');}finally{setBusy(false);}}}>
  <div className="checkout-form-card"><span className="eyebrow">01 / WHERE TO?</span><h2>Delivery details</h2><div className="form-two"><label>Full name<input name="name" placeholder="Your name" required/></label><label>Phone number<input name="phone" type="tel" pattern="01[0-9]{9}" placeholder="01XXXXXXXXX" required/></label></div><label>Email address (optional)<input name="email" type="email" placeholder="you@example.com"/></label><label>Delivery address<textarea name="address" rows="4" placeholder="House, road, area, district..." required/></label><span className="eyebrow payment-eyebrow">02 / HOW TO PAY?</span><h2>Payment method</h2><div className="payment-options">{['Cash on Delivery','bKash','Nagad'].map(method=><button type="button" className={payment===method?'active':''} key={method} onClick={()=>setPayment(method)}>{method==='Cash on Delivery'?<Truck/>:<CreditCard/>}<span>{method}</span>{payment===method&&<Check/>}</button>)}</div>{payment!=='Cash on Delivery'&&<p className="payment-note">bKash and Nagad checkout will be enabled after merchant gateway setup. For now, choose Cash on Delivery.</p>}{error&&<p className="payment-note" role="alert">{error}</p>}</div>
  <aside className="order-summary"><span className="eyebrow">03 / YOUR EDIT</span><h2>In your bag</h2>{cart.map(item=><div className="checkout-item" key={item.id+'-'+item.size+'-'+item.color}><img src={item.image} alt={item.name}/><span>{item.name}<small>{item.size} · {item.color} · Qty {item.qty}</small></span><b>{money(item.price*item.qty)}</b></div>)}<div className="summary-total"><b>Total</b><strong>{money(total)}</strong></div><button className="button button-dark summary-checkout" type="submit" disabled={busy}>{busy?'Placing order…':'Place order'} <ArrowRight/></button><p className="summary-reassurance"><ShieldCheck/> Your order is securely submitted to AZMEYRA</p></aside>
</form>}</div>}

function Account({orders}){const [phone,setPhone]=useState('');const mine=orders.filter(order=>order.phone===phone);return <div className="page-wrap"><div className="shop-intro"><span className="eyebrow">YOUR AZMEYRA</span><h1>My <em>account.</em></h1><p>Enter the phone number used at checkout to view your demo orders.</p></div><div className="simple-panel"><label>Phone number<input value={phone} onChange={event=>setPhone(event.target.value)} placeholder="01XXXXXXXXX"/></label>{mine.map(order=><div className="order-history-card" key={order.id}><b>{order.id}</b><span>{order.status}</span><p>{money(order.total)} · {order.created.slice(0,10)}</p></div>)}<Link className="text-link" to="/track">Track an order <ArrowRight/></Link></div></div>}

function TrackOrder({orders}){const [id,setId]=useState('');const order=orders.find(item=>item.id===id.trim().toUpperCase());return <div className="page-wrap"><div className="shop-intro"><span className="eyebrow">ORDER SUPPORT</span><h1>Track your <em>order.</em></h1><p>Your order number is the key to the latest update.</p></div><div className="simple-panel"><label>Order number<input value={id} onChange={event=>setId(event.target.value)} placeholder="e.g. AZ12345678"/></label>{order?<div className="order-history-card"><b>{order.status}</b><p>{order.name} · {money(order.total)}</p><p>{order.address}</p></div>:id.length>4&&<p className="form-hint">No matching order was found in this browser's demo history.</p>}</div></div>}

function WishlistPage({products,wishlist,onToggleWishlist,onAdd}){const saved=products.filter(product=>wishlist.includes(product.id));return <div className="page-wrap"><div className="shop-intro"><span className="eyebrow">THE PIECES YOU SAVED</span><h1>Your wish <em>list.</em></h1><p>A little collection of things you love.</p></div>{saved.length?<ProductGrid products={saved} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onAdd={onAdd}/>:<div className="empty-state"><Heart/><h2>Nothing saved just yet.</h2><p>Tap the little heart on a piece to keep it close.</p><Link className="button button-dark" to="/shop">Explore the collection <ArrowUpRight/></Link></div>}</div>}

function AboutPage(){return <div className="page-wrap story-page"><div className="shop-intro"><span className="eyebrow">A NOTE FROM AZMEYRA</span><h1>Style should feel<br/><em>like coming home.</em></h1><p>Not more. Just more meaningful.</p></div><div className="about-grid"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400" alt="Thoughtful fashion styling"/><div><span className="eyebrow">OUR POINT OF VIEW</span><h2>For the woman<br/>who is <em>all of it.</em></h2><p>AZMEYRA is a considered edit of ladieswear for the many moments that make up your day. We believe getting dressed should feel personal, effortless and quietly beautiful.</p><p>From everyday essentials to pieces for the celebrations you will remember, each selection is made to help you express your own sense of style.</p><Link className="button button-dark" to="/shop">Explore the edit <ArrowRight/></Link></div></div><div className="values-row"><div><span>01</span><b>Thoughtful selection</b><p>Pieces chosen for their details, comfort and timeless appeal.</p></div><div><span>02</span><b>Everyday elegance</b><p>Style that works with the rhythm of real life.</p></div><div><span>03</span><b>Personal expression</b><p>Your wardrobe should always feel like your own.</p></div></div></div>}

function ContactPage(){return <div className="page-wrap contact-page"><div className="shop-intro"><span className="eyebrow">WE ARE HERE FOR YOU</span><h1>Let's talk <em>lovely.</em></h1><p>For product questions, sizing advice or delivery updates, send us a note.</p></div><div className="contact-layout"><div className="contact-details"><div><Mail/><span><b>Write to us</b><small>hello@azmeyra.com</small></span></div><div><PhoneIcon/><span><b>Call or WhatsApp</b><small>Share your preferred contact number to activate this link.</small></span></div><div><Clock3/><span><b>Customer care</b><small>Saturday – Thursday · 10 AM – 7 PM</small></span></div><div><MapPin/><span><b>Based in Bangladesh</b><small>Delivery available nationwide</small></span></div></div><form className="contact-form" onSubmit={event=>{event.preventDefault();alert('Message form preview only. Connect a backend to receive enquiries.')}}><label>Your name<input placeholder="Your name" required/></label><label>Email or phone<input placeholder="How can we reach you?" required/></label><label>What can we help with?<select defaultValue="Product enquiry"><option>Product enquiry</option><option>Size and fit</option><option>Delivery update</option><option>Exchange support</option><option>Something else</option></select></label><label>Your message<textarea rows="4" placeholder="Write your message..." required/></label><button className="button button-dark" type="submit">Send your message <ArrowUpRight/></button></form></div></div>}

function PhoneIcon(){return <span className="phone-symbol">⌕</span>}
function JournalPage(){const stories=[['The art of a thoughtful wardrobe','Build a collection that feels personal, versatile and entirely your own.','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1100'],['A little guide to occasion dressing','Find the balance between feeling special and feeling like yourself.','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1100'],['The beauty of the finishing touch','Small details have a lovely way of changing the whole look.','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1100']];return <div className="page-wrap journal-page"><div className="shop-intro"><span className="eyebrow">THE AZMEYRA JOURNAL</span><h1>Notes on <em>style.</em></h1><p>Ideas, inspiration and thoughtful ways to wear what you love.</p></div><div className="journal-grid">{stories.map((story,index)=><article key={story[0]}><img src={story[2]} alt={story[0]} loading="lazy"/><span className="eyebrow">STYLE NOTES · 0{index+1}</span><h2>{story[0]}</h2><p>{story[1]}</p><span className="journal-read">A LITTLE INSPIRATION <ArrowUpRight/></span></article>)}</div></div>}

function AdminPage({products,setProducts,orders,setOrders,session,isAdmin,loading}){
 const [role,setRole]=useState(isAdmin?'admin':'');const [section,setSection]=useState('Dashboard');const [busy,setBusy]=useState(false);const [notice,setNotice]=useState('');const [error,setError]=useState('');
 const [categories,setCategories]=useState([]),[dbProducts,setDbProducts]=useState([]),[dbOrders,setDbOrders]=useState([]),[items,setItems]=useState({}),[coupons,setCoupons]=useState([]),[customers,setCustomers]=useState([]);
 const [query,setQuery]=useState(''),[status,setStatus]=useState('All'),[catFilter,setCatFilter]=useState('All'),[stockFilter,setStockFilter]=useState('All'),[from,setFrom]=useState(''),[to,setTo]=useState(''),[page,setPage]=useState(1),[expanded,setExpanded]=useState(''),[days,setDays]=useState(7),[editing,setEditing]=useState(null),[categoryName,setCategoryName]=useState('');
 const [coupon,setCoupon]=useState({code:'',discount_type:'percentage',discount_value:'10',expires_at:'',usage_limit:''});
 const admin=role==='admin',staff=role==='staff';const notify=m=>{setNotice(m);setError('');};const fail=m=>{setError(m);setNotice('');};
 const refresh=async()=>{
  setBusy(true);
  const [a,b,c,d,e]=await Promise.all([supabase.from('categories').select('*').order('sort_order'),supabase.from('products').select('*,categories(name)').order('created_at',{ascending:false}),supabase.from('orders').select('*').order('created_at',{ascending:false}),admin?supabase.from('coupons').select('*').order('created_at',{ascending:false}):Promise.resolve({data:[],error:null}),admin?supabase.from('profiles').select('id,full_name,phone,role'):Promise.resolve({data:[],error:null})]);
  const bad=[a,b,c,d,e].find(x=>x.error);if(bad){fail(bad.error.message);setBusy(false);return;}
  setCategories(a.data||[]);setDbProducts(b.data||[]);setProducts((b.data||[]).filter(p=>p.is_active).map(p=>({id:p.id,name:p.name,category:p.categories?.name||'Collection',price:Number(p.price),tag:p.tag||'',image:p.images?.[0]||'',images:p.images||[],sizes:p.sizes||[],colors:p.colors||[],stock:p.stock,description:p.description||'',featured:Boolean(p.tag)})));setDbOrders(c.data||[]);setCoupons(d.data||[]);
  const ids=(c.data||[]).slice(0,500).map(x=>x.id);const ir=ids.length?await supabase.from('order_items').select('*').in('order_id',ids):{data:[]};const grouped={};(ir.data||[]).forEach(x=>(grouped[x.order_id]??=[]).push(x));setItems(grouped);
  if(admin){const map={};(c.data||[]).forEach(o=>{const k=o.user_id||o.phone;map[k]??={id:k,name:o.customer_name,phone:o.phone,count:0,spend:0};map[k].count++;map[k].spend+=Number(o.total||0);});(e.data||[]).forEach(p=>{map[p.id]??={id:p.id,name:p.full_name,phone:p.phone||'',count:0,spend:0};});setCustomers(Object.values(map));}
  setBusy(false);
 };
 useEffect(()=>{if(session?.user&&role)refresh();},[session?.user?.id,role]);
 useEffect(()=>{let live=true;if(session?.user)(async()=>{const {data}=await supabase.from('profiles').select('role').eq('id',session.user.id).maybeSingle();if(live)setRole(data?.role||'');})();return()=>{live=false;};},[session?.user?.id]);
 const printInvoice=(o)=>{
  const lines=items[o.id]||[];
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const rows=lines.map(x=>'<tr><td>'+esc(x.product_name)+'</td><td>'+esc(x.size||'—')+'</td><td>'+esc(x.color||'—')+'</td><td>'+Number(x.quantity||0)+'</td><td>'+money(x.unit_price)+'</td><td>'+money(Number(x.unit_price||0)*Number(x.quantity||0))+'</td></tr>').join('');
  const popup=window.open('','_blank','width=900,height=700');if(!popup){fail('Invoice popup blocked. Please allow pop-ups for this website.');return;}
  popup.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Invoice '+esc(o.order_number)+'</title><style>*{box-sizing:border-box}body{font:14px Arial,sans-serif;color:#111;margin:0;padding:38px}header{display:flex;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:18px}h1{font-size:30px;letter-spacing:4px;margin:0}h2{font-size:22px;margin:28px 0 12px}.muted{color:#666;font-size:12px;line-height:1.7}.meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0}.meta strong{display:block;margin-bottom:7px}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{border-bottom:1px solid #ddd;padding:12px 8px;text-align:left;font-size:12px}th{background:#f5f5f5;text-transform:uppercase;font-size:10px}.totals{margin:22px 0 0 auto;width:280px}.totals div{display:flex;justify-content:space-between;padding:7px 0}.grand{font-size:18px;font-weight:bold;border-top:2px solid #111;margin-top:6px;padding-top:12px!important}.foot{margin-top:50px;border-top:1px solid #ddd;padding-top:18px;text-align:center;color:#666;font-size:11px}@media print{body{padding:15mm}.no-print{display:none}}</style></head><body><header><div><h1>AZMEYRA</h1><div class="muted">Elegance in Every Thread</div></div><div style="text-align:right"><h2 style="margin:0">INVOICE</h2><div class="muted">Invoice: '+esc(o.order_number)+'<br>Date: '+esc(new Date(o.created_at).toLocaleString())+'<br>Status: '+esc(o.status)+'</div></div></header><div class="meta"><div><strong>Bill To</strong>'+esc(o.customer_name)+'<div class="muted">'+esc(o.phone)+'<br>'+esc(o.email||'')+'<br>'+esc(o.shipping_address)+'</div></div><div><strong>Payment & Order</strong><div class="muted">Payment method: '+esc(o.payment_method)+'<br>Payment status: '+esc(o.payment_status||'—')+'<br>Order number: '+esc(o.order_number)+'</div></div></div><h2>Order Items</h2><table><thead><tr><th>Product</th><th>Size</th><th>Color</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>'+rows+'</tbody></table><div class="totals"><div><span>Subtotal</span><b>'+money(o.subtotal)+'</b></div><div><span>Delivery</span><b>'+money(o.delivery_fee)+'</b></div><div class="grand"><span>Total</span><b>'+money(o.total)+'</b></div></div><div class="muted" style="margin-top:25px">Customer note: '+esc(o.customer_note||'—')+'</div><div class="foot">Thank you for shopping with AZMEYRA.<br>For assistance, please contact our store.</div><button class="no-print" onclick="window.print()" style="margin-top:24px;padding:12px 22px;background:#111;color:#fff;border:0">Print / Save as PDF</button></body></html>');
  popup.document.close();popup.focus();
 };
 const slug=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const signOut=()=>supabase.auth.signOut();
 const saveProduct=async ev=>{ev.preventDefault();const fd=new FormData(ev.currentTarget);setBusy(true);try{
  let images=editing?.item?.images||[];for(const file of Array.from(fd.getAll('images')).filter(x=>x instanceof File&&x.size)){const path=crypto.randomUUID()+'-'+file.name.replace(/[^a-zA-Z0-9._-]/g,'-');const up=await supabase.storage.from('product-images').upload(path,file,{contentType:file.type});if(up.error)throw up.error;images.push(supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl);}
  const name=String(fd.get('name')).trim();const payload={name,slug:editing?.item?.slug||slug(name)+'-'+Math.random().toString(36).slice(2,6),category_id:fd.get('category_id')||null,price:Number(fd.get('price')),description:String(fd.get('description')||''),sizes:String(fd.get('sizes')||'').split(',').map(x=>x.trim()).filter(Boolean),colors:String(fd.get('colors')||'').split(',').map(x=>x.trim()).filter(Boolean),stock:Number(fd.get('stock')||0),tag:fd.get('tag')||null,images,is_active:fd.get('is_active')==='on'};
  const r=editing?.item?await supabase.from('products').update({...payload,updated_at:new Date().toISOString()}).eq('id',editing.item.id):await supabase.from('products').insert(payload);if(r.error)throw r.error;setEditing(null);await refresh();notify('Product saved successfully.');
 }catch(e){fail(e.message);}finally{setBusy(false);}};
 const deleteProduct=async p=>{if(!window.confirm('Delete '+p.name+'?'))return;const {error:e}=await supabase.from('products').delete().eq('id',p.id);if(e)fail(e.message);else{await refresh();notify('Product deleted.');}};
 const updateOrder=async(o,s)=>{const {error:e}=await supabase.from('orders').update({status:s,updated_at:new Date().toISOString()}).eq('id',o.id);if(e)fail(e.message);else{await refresh();notify('Order status updated.');}};
 const saveCategory=async ev=>{ev.preventDefault();const target=editing?.kind==='category'?editing.item:null;const r=target?await supabase.from('categories').update({name:categoryName,slug:slug(categoryName),updated_at:new Date().toISOString()}).eq('id',target.id):await supabase.from('categories').insert({name:categoryName,slug:slug(categoryName),sort_order:categories.length+1,is_active:true});if(r.error)fail(r.error.message);else{setCategoryName('');setEditing(null);await refresh();notify('Category saved.');}};
 const deleteCategory=async c=>{if(!window.confirm('Delete category '+c.name+'?'))return;const {error:e}=await supabase.from('categories').delete().eq('id',c.id);if(e)fail(e.message);else{await refresh();notify('Category deleted.');}};
 const saveCoupon=async ev=>{ev.preventDefault();const data={...coupon,code:coupon.code.trim().toUpperCase(),discount_value:Number(coupon.discount_value),usage_limit:coupon.usage_limit?Number(coupon.usage_limit):null,expires_at:coupon.expires_at?new Date(coupon.expires_at).toISOString():null};const {error:e}=await supabase.from('coupons').insert(data);if(e)fail(e.message);else{setCoupon({code:'',discount_type:'percentage',discount_value:'10',expires_at:'',usage_limit:''});await refresh();notify('Coupon created.');}};
 const toggleCoupon=async c=>{const {error:e}=await supabase.from('coupons').update({is_active:!c.is_active}).eq('id',c.id);if(e)fail(e.message);else{await refresh();notify('Coupon updated.');}};
 const deleteCoupon=async c=>{if(!window.confirm('Delete coupon '+c.code+'?'))return;const {error:e}=await supabase.from('coupons').delete().eq('id',c.id);if(e)fail(e.message);else{await refresh();notify('Coupon deleted.');}};
 const productsFiltered=dbProducts.filter(p=>(!query||p.name.toLowerCase().includes(query.toLowerCase()))&&(catFilter==='All'||p.category_id===catFilter)&&(stockFilter==='All'||(stockFilter==='Low'&&p.stock>0&&p.stock<=5)||(stockFilter==='Out'&&p.stock===0)||(stockFilter==='In'&&p.stock>0)));
 const ordersFiltered=dbOrders.filter(o=>(!query||[o.customer_name,o.phone,o.order_number].join(' ').toLowerCase().includes(query.toLowerCase()))&&(status==='All'||o.status===status)&&(!from||o.created_at.slice(0,10)>=from)&&(!to||o.created_at.slice(0,10)<=to));
 const pageCount=Math.max(1,Math.ceil(ordersFiltered.length/20)),pageOrders=ordersFiltered.slice((page-1)*20,page*20);
 const today=new Date().toLocaleDateString('en-CA'),todaySales=dbOrders.filter(o=>o.created_at.slice(0,10)===today&&o.status!=='Cancelled').reduce((s,o)=>s+Number(o.total),0),revenue=dbOrders.filter(o=>o.status!=='Cancelled').reduce((s,o)=>s+Number(o.total),0),low=dbProducts.filter(p=>p.stock<=5).length;
 const chart=Array.from({length:days},(_,i)=>{const d=new Date();d.setDate(d.getDate()-days+1+i);const k=d.toLocaleDateString('en-CA');return {k,label:d.toLocaleDateString('en',{day:'numeric',month:'short'}),v:dbOrders.filter(o=>o.created_at.slice(0,10)===k&&o.status!=='Cancelled').reduce((s,o)=>s+Number(o.total),0)};}),max=Math.max(1,...chart.map(x=>x.v));
 const nav=admin?[['Dashboard','▦'],['Products','◇'],['Orders','▤'],['Categories','⌗'],['Coupons','％'],['Customers','♙'],['Settings','⚙']]:[['Dashboard','▦'],['Orders','▤']];
 if(loading)return <div className="page-wrap"><div className="simple-panel">Checking access…</div></div>;
 if(!session)return <div className="page-wrap admin-preview"><span className="eyebrow">SECURE STORE MANAGEMENT</span><h1>AZMEYRA <em>admin.</em></h1><div className="simple-panel" style={{maxWidth:480,margin:'32px auto',textAlign:'left'}}><h2>Admin login</h2><form onSubmit={async ev=>{ev.preventDefault();setBusy(true);const fd=new FormData(ev.currentTarget);const {error:e}=await supabase.auth.signInWithPassword({email:String(fd.get('email')).trim(),password:String(fd.get('password'))});setBusy(false);if(e)fail(e.message);}}><label>Email address<input name="email" type="email" required/></label><label style={{display:'block',marginTop:16}}>Password<input name="password" type="password" required/></label>{error&&<p role="alert">{error}</p>}<button className="button button-dark" style={{marginTop:20}} disabled={busy}>Sign in securely <ArrowRight/></button></form></div></div>;
 if(!admin&&!staff)return <div className="page-wrap admin-preview"><h1>Access <em>restricted.</em></h1><p>Only admin or staff accounts may enter.</p><button className="button button-dark" onClick={signOut}>Sign out</button></div>;
 const field=(label,name,value,type='text',props={})=><label className="adm-field">{label}<input name={name} type={type} defaultValue={value??''} {...props}/></label>;
 return <div className="az-admin-shell"><aside className="az-admin-sidebar"><img src={brandLogo} alt="AZMEYRA"/><span className="az-admin-caption">{staff?'STAFF WORKSPACE':'STORE MANAGEMENT'}</span>{nav.map(([n,ico])=><button key={n} className={section===n?'active':''} onClick={()=>{setSection(n);setQuery('');setPage(1);}}><span>{ico}</span>{n}</button>)}<Link to="/">↗ View Store</Link><button className="az-admin-logout" onClick={signOut}>Sign out</button></aside>
 <main className="az-admin-main"><header className="az-admin-top"><div><span className="eyebrow">AZMEYRA / CONTROL ROOM</span><h1>{section}</h1></div><div className="az-admin-user">{session.user.email}<button onClick={refresh} disabled={busy}>↻ Refresh</button></div></header>
 {(notice||error)&&<div className={error?'az-admin-alert error':'az-admin-alert'}>{error||notice}<button onClick={()=>{setError('');setNotice('');}}>×</button></div>}{busy&&<div className="az-admin-loading">Syncing with Supabase…</div>}
 {section==='Dashboard'&&<><div className="az-admin-stats"><article><small>Total Orders</small><b>{dbOrders.length}</b></article>{admin&&<article><small>Today's Sales</small><b>{money(todaySales)}</b></article>}{admin&&<article><small>Total Revenue</small><b>{money(revenue)}</b></article>}<article><small>Low Stock Products</small><b>{low}</b></article></div><section className="az-admin-card"><div className="az-admin-card-head"><h2>Sales overview</h2><select value={days} onChange={e=>setDays(Number(e.target.value))}><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></div><div className="az-admin-chart">{chart.map(d=><div key={d.k} title={d.label+': '+money(d.v)}><span style={{height:Math.max(3,d.v/max*100)+'%'}}/><small>{d.label}</small></div>)}</div></section><section className="az-admin-card"><h2>Recent orders</h2><div className="az-admin-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{dbOrders.slice(0,5).map(o=><tr key={o.id} onClick={()=>{setSection('Orders');setExpanded(o.id);}}><td>{o.order_number}</td><td>{o.customer_name}</td><td>{money(o.total)}</td><td>{o.status}</td><td>{new Date(o.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section></>}
 {section==='Products'&&<><div className="az-admin-toolbar"><input placeholder="Search products…" value={query} onChange={e=>setQuery(e.target.value)}/><select value={catFilter} onChange={e=>setCatFilter(e.target.value)}><option value="All">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={stockFilter} onChange={e=>setStockFilter(e.target.value)}><option value="All">All stock</option><option value="In">In stock</option><option value="Low">Low stock</option><option value="Out">Sold out</option></select><button onClick={()=>setEditing({kind:'product',item:null})}>＋ Add product</button></div>{editing?.kind==='product'&&<form className="az-admin-card az-admin-form" onSubmit={saveProduct}><div className="az-admin-card-head"><h2>{editing.item?'Edit product':'New product'}</h2><button type="button" onClick={()=>setEditing(null)}>Close ×</button></div><div className="az-admin-form-grid">{field('Product name','name',editing.item?.name,'text',{required:true})}<label className="adm-field">Category<select name="category_id" defaultValue={editing.item?.category_id||''}><option value="">Unassigned</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>{field('Price (BDT)','price',editing.item?.price,'number',{required:true,min:0})}{field('Stock quantity','stock',editing.item?.stock??0,'number',{min:0})}{field('Sizes (comma separated)','sizes',editing.item?.sizes?.join(', ')||'S, M, L, XL')}{field('Colors (comma separated)','colors',editing.item?.colors?.join(', '))}<label className="adm-field">Tag<select name="tag" defaultValue={editing.item?.tag||''}><option value="">None</option>{['New','Bestseller','Limited','Sold Out'].map(x=><option key={x}>{x}</option>)}</select></label><label className="adm-field">Upload images<input name="images" type="file" accept="image/png,image/jpeg,image/webp" multiple/></label><label className="adm-field az-admin-full">Description<textarea name="description" defaultValue={editing.item?.description||''}/></label><label className="adm-check"><input name="is_active" type="checkbox" defaultChecked={editing.item?.is_active??true}/> Published on store</label></div><button className="az-admin-primary" disabled={busy}>Save product</button></form>}<div className="az-admin-card az-admin-table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Tag</th><th>Actions</th></tr></thead><tbody>{productsFiltered.map(p=><tr key={p.id}><td><div className="az-admin-product"><img src={p.images?.[0]||''}/>{p.name}</div></td><td>{p.categories?.name||'—'}</td><td>{money(p.price)}</td><td>{p.stock}</td><td>{p.tag||'—'}</td><td><button onClick={()=>setEditing({kind:'product',item:p})}>Edit</button> <button className="danger" onClick={()=>deleteProduct(p)}>Delete</button></td></tr>)}</tbody></table></div></>}
 {section==='Orders'&&<><div className="az-admin-toolbar"><input placeholder="Search name, phone or order…" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}/><select value={status} onChange={e=>setStatus(e.target.value)}>{['All','Pending','Confirmed','Shipped','Delivered','Cancelled','Order received','Processing'].map(x=><option key={x}>{x}</option>)}</select><input type="date" value={from} onChange={e=>setFrom(e.target.value)}/><input type="date" value={to} onChange={e=>setTo(e.target.value)}/></div><div className="az-admin-card az-admin-table-wrap"><table><thead><tr><th>Order / Date</th><th>Customer</th><th>Phone / Address</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>{pageOrders.map(o=><React.Fragment key={o.id}><tr onClick={()=>setExpanded(expanded===o.id?'':o.id)}><td>{o.order_number}<small>{new Date(o.created_at).toLocaleString()}</small></td><td>{o.customer_name}</td><td>{o.phone}<small>{o.shipping_address}</small></td><td>{(items[o.id]||[]).reduce((s,x)=>s+x.quantity,0)}</td><td>{money(o.total)}</td><td>{o.payment_method}</td><td><select value={o.status} onClick={e=>e.stopPropagation()} onChange={e=>updateOrder(o,e.target.value)}>{['Pending','Confirmed','Shipped','Delivered','Cancelled','Order received','Processing'].map(x=><option key={x}>{x}</option>)}</select></td></tr>{expanded===o.id&&<tr><td colSpan="7"><div className="az-admin-order-detail"><button type="button" className="az-invoice-button" onClick={()=>printInvoice(o)}>Print / Download Invoice</button><b>{o.customer_name}</b> · {o.phone} · {o.email||'No email'}<p>{o.shipping_address}</p>{(items[o.id]||[]).map(x=><div key={x.id}>{x.product_name} × {x.quantity} · {x.size||'—'} · {x.color||'—'} · {money(x.unit_price*x.quantity)}</div>)}<strong>Subtotal {money(o.subtotal)} · Delivery {money(o.delivery_fee)} · Total {money(o.total)}</strong></div></td></tr>}</React.Fragment>)}</tbody></table></div><div className="az-admin-pagination"><span>{ordersFiltered.length} orders · Page {page} of {pageCount}</span><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</button><button disabled={page>=pageCount} onClick={()=>setPage(p=>p+1)}>Next</button></div></>}
 {section==='Categories'&&<><form className="az-admin-toolbar" onSubmit={saveCategory}><input placeholder="Category name" value={categoryName} onChange={e=>setCategoryName(e.target.value)} required/><button>{editing?.kind==='category'?'Save category':'＋ Add category'}</button>{editing?.kind==='category'&&<button type="button" onClick={()=>{setEditing(null);setCategoryName('');}}>Cancel</button>}</form><div className="az-admin-card az-admin-table-wrap"><table><thead><tr><th>Category</th><th>Products</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>{categories.map(c=><tr key={c.id}><td>{c.name}</td><td>{dbProducts.filter(p=>p.category_id===c.id).length}</td><td>{c.is_active?'Active':'Hidden'}</td><td><button onClick={()=>{setEditing({kind:'category',item:c});setCategoryName(c.name);}}>Edit</button> <button className="danger" onClick={()=>deleteCategory(c)}>Delete</button></td></tr>)}</tbody></table></div></>}
 {section==='Coupons'&&admin&&<><form className="az-admin-card az-admin-form" onSubmit={saveCoupon}><h2>Create coupon</h2><div className="az-admin-form-grid">{field('Code','code',coupon.code,'text',{required:true,onChange:e=>setCoupon({...coupon,code:e.target.value})})}<label className="adm-field">Type<select value={coupon.discount_type} onChange={e=>setCoupon({...coupon,discount_type:e.target.value})}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></label><label className="adm-field">Value<input type="number" min="1" value={coupon.discount_value} onChange={e=>setCoupon({...coupon,discount_value:e.target.value})}/></label><label className="adm-field">Expiry<input type="datetime-local" value={coupon.expires_at} onChange={e=>setCoupon({...coupon,expires_at:e.target.value})}/></label><label className="adm-field">Usage limit<input type="number" min="1" value={coupon.usage_limit} onChange={e=>setCoupon({...coupon,usage_limit:e.target.value})}/></label></div><button className="az-admin-primary">Create coupon</button></form><div className="az-admin-card az-admin-table-wrap"><table><thead><tr><th>Code</th><th>Discount</th><th>Expires</th><th>Usage</th><th>Status</th><th>Actions</th></tr></thead><tbody>{coupons.map(c=><tr key={c.id}><td>{c.code}</td><td>{c.discount_type==='percentage'?c.discount_value+'%':money(c.discount_value)}</td><td>{c.expires_at?new Date(c.expires_at).toLocaleString():'Never'}</td><td>{c.usage_count}/{c.usage_limit||'∞'}</td><td>{c.is_active?'Enabled':'Disabled'}</td><td><button onClick={()=>toggleCoupon(c)}>{c.is_active?'Disable':'Enable'}</button> <button className="danger" onClick={()=>deleteCoupon(c)}>Delete</button></td></tr>)}</tbody></table></div></>}
 {section==='Customers'&&admin&&<div className="az-admin-card az-admin-table-wrap"><div className="az-admin-toolbar"><input placeholder="Search customers…" value={query} onChange={e=>setQuery(e.target.value)}/></div><table><thead><tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Total spend</th></tr></thead><tbody>{customers.filter(c=>(c.name+' '+c.phone).toLowerCase().includes(query.toLowerCase())).map(c=><tr key={c.id}><td>{c.name||'Guest'}</td><td>{c.phone||'—'}</td><td>{c.count}</td><td>{money(c.spend)}</td></tr>)}</tbody></table></div>}
 {section==='Settings'&&admin&&<div className="az-admin-card"><h2>Access & storage</h2><p>Set a user's profiles.role to admin or staff in Supabase. Staff can manage orders only. Product images use the product-images Storage bucket.</p><p>Signed in: {session.user.email}</p></div>}
 </main></div>;
}
function NotFound(){return <div className="page-wrap empty-state"><span className="eyebrow">AZMEYRA / 404</span><h2>This page has wandered off.</h2><p>Let's get you back to something lovely.</p><Link className="button button-dark" to="/">Back to home <ArrowLeft/></Link></div>}

function Newsletter(){const [email,setEmail]=useState('');const [submitted,setSubmitted]=useState(false);return <section className="newsletter-section"><div><span className="eyebrow">A NOTE FROM US, NOW AND THEN</span><h2>A little loveliness<br/><em>in your inbox.</em></h2><p>New arrivals, thoughtful edits and a little inspiration.</p></div><form onSubmit={event=>{event.preventDefault();setSubmitted(true);setEmail('');}}><label htmlFor="newsletter-email">YOUR EMAIL ADDRESS</label><div className="newsletter-input"><input id="newsletter-email" type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@example.com" required/><button type="submit" aria-label="Subscribe"><ArrowUpRight/></button></div><small>{submitted?'Thank you — you are on the list.':'A considered note. Never too many.'}</small></form></section>}

function SiteFooter(){return <footer className="site-footer"><div className="footer-top"><div className="footer-brand-column"><Link to="/" className="footer-logo"><img src="/azmeyra-logo-light.svg" alt="AZMEYRA"/></Link><p>Thoughtfully selected pieces for your everyday moments.</p><div className="social-links"><a href="https://instagram.com" aria-label="Instagram"><span className="social-ig">IG</span></a><a href="https://wa.me/" aria-label="WhatsApp"><MessageCircle/></a></div></div><div className="footer-column"><b>EXPLORE</b><Link to="/shop">Shop all</Link><Link to="/about">Our story</Link><Link to="/blog">Journal</Link></div><div className="footer-column"><b>HELP & SUPPORT</b><Link to="/contact">Contact us</Link><Link to="/track">Track an order</Link><Link to="/account">My account</Link></div><div className="footer-column footer-contact"><b>THE AZMEYRA PROMISE</b><span><Truck/> Delivery across Bangladesh</span><span><ShieldCheck/> Thoughtfully selected</span><span><PackageCheck/> Easy exchange support</span></div></div><div className="footer-bottom"><span>© 2026 AZMEYRA. ALL RIGHTS RESERVED.</span><span>MADE WITH CARE IN BANGLADESH</span><span>THE ART OF EVERYDAY ELEGANCE</span></div></footer>}

export default App;
