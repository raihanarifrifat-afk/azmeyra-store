import React, { useEffect, useMemo, useState } from 'react';
import brandLogo from './assets/azmeyra-logo.svg';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight,
  Clock3, CreditCard, Heart, Instagram, Mail, MapPin, Menu, MessageCircle, Minus,
  PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles,
  Star, Trash2, Truck, UserRound, X
} from 'lucide-react';

const CATEGORIES = [
  { name:'Saree', count:'01', image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900' },
  { name:'Salwar Kameez', count:'02', image:'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=900' },
  { name:'Kurti', count:'03', image:'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=900' },
  { name:'Western', count:'04', image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900' },
  { name:'Gown', count:'05', image:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900' },
  { name:'Abaya & Burka', count:'06', image:'https://images.unsplash.com/photo-1585487000160-6ebcf38cd4a3?w=900' },
  { name:'Nightwear', count:'07', image:'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900' },
  { name:'Accessories', count:'08', image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900' }
];

const SEED = [
  { id:1, name:'Heritage Floral Saree', category:'Saree', price:2850, compareAt:3400, tag:'New arrival', image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000', images:['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200'], sizes:['Free size'], colors:['Plum','Ivory'], stock:12, description:'A graceful statement piece with rich detail and an effortless drape. Made for celebrations, gatherings and the moments worth remembering.', featured:true },
  { id:2, name:'Ivory Embroidered Set', category:'Salwar Kameez', price:3200, tag:'Bestseller', image:'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=1000', images:['https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=1200'], sizes:['S','M','L','XL'], colors:['Ivory','Sage'], stock:8, description:'An understated embroidered set that pairs delicate detailing with everyday comfort.', featured:true },
  { id:3, name:'Everyday Linen Kurti', category:'Kurti', price:1450, tag:'Just in', image:'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=1000', images:['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=1200'], sizes:['S','M','L','XL'], colors:['Sand','Olive'], stock:18, description:'An easy, breathable silhouette made for long days and relaxed plans.', featured:true },
  { id:4, name:'Modern Co-ord Set', category:'Western', price:2350, tag:'New arrival', image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000', images:['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200'], sizes:['S','M','L'], colors:['Black','Stone'], stock:10, description:'A polished two-piece look for days when getting dressed should feel effortless.', featured:true },
  { id:5, name:'Midnight Occasion Gown', category:'Gown', price:4600, tag:'Limited edit', image:'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000', images:['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200'], sizes:['S','M','L','XL'], colors:['Midnight','Wine'], stock:5, description:'A refined occasion silhouette with a little drama and a beautiful finish.', featured:true },
  { id:6, name:'Classic Black Abaya', category:'Abaya & Burka', price:2750, tag:'Bestseller', image:'https://images.unsplash.com/photo-1585487000160-6ebcf38cd4a3?w=1000', images:['https://images.unsplash.com/photo-1585487000160-6ebcf38cd4a3?w=1200'], sizes:['S','M','L','XL'], colors:['Black','Mocha'], stock:9, description:'A clean, versatile abaya designed around a timeless and comfortable fit.', featured:true },
  { id:7, name:'Soft Lounge Set', category:'Nightwear', price:1650, tag:'Everyday favourite', image:'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1000', images:['https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1200'], sizes:['S','M','L','XL'], colors:['Blush','Cream'], stock:14, description:'Soft textures and an easy fit for slower mornings and restful evenings.', featured:false },
  { id:8, name:'Pearl Detail Earrings', category:'Accessories', price:650, tag:'Small treasure', image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000', images:['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200'], sizes:['One size'], colors:['Gold'], stock:22, description:'A delicate finishing touch that brings a soft glow to any look.', featured:false }
];

const money = value => '৳' + Number(value || 0).toLocaleString('en-BD');
const readStore = (key, fallback) => { try { const value=localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
const writeStore = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const fadeUp = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:.65,ease:[.22,.61,.36,1]}} };
const reveal = { initial:'hidden', whileInView:'visible', viewport:{once:true,amount:.12}, variants:fadeUp };

function App(){
  const location = useLocation();
  const navigate = useNavigate();
  const [products,setProducts] = useState(()=>readStore('az-products',SEED));
  const [cart,setCart] = useState(()=>readStore('az-cart',[]));
  const [wishlist,setWishlist] = useState(()=>readStore('az-wish',[]));
  const [orders,setOrders] = useState(()=>readStore('az-orders',[]));
  const [search,setSearch] = useState('');
  const [searchOpen,setSearchOpen] = useState(false);
  const [mobileMenu,setMobileMenu] = useState(false);
  const [cartOpen,setCartOpen] = useState(false);
  const [toast,setToast] = useState('');

  useEffect(()=>writeStore('az-products',products),[products]);
  useEffect(()=>writeStore('az-cart',cart),[cart]);
  useEffect(()=>writeStore('az-wish',wishlist),[wishlist]);
  useEffect(()=>writeStore('az-orders',orders),[orders]);
  useEffect(()=>{ window.scrollTo({top:0,behavior:'smooth'}); setMobileMenu(false); setSearchOpen(false); },[location.pathname]);
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
    <AnnouncementBar/>
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
          <form className="search-form" onSubmit={submitSearch}><Search/><input autoFocus value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search sarees, kurtis, occasionwear..."/><button className="search-submit" type="submit">Search <ArrowUpRight/></button><button className="search-close icon-button" type="button" onClick={()=>setSearchOpen(false)} aria-label="Close search"><X/></button></form>
          <div className="search-suggestions"><span>POPULAR SEARCHES</span>{['Saree','Kurti','Abaya & Burka','Occasionwear'].map(term=><button key={term} onClick={()=>{setSearch(term);navigate('/shop?search='+encodeURIComponent(term));setSearchOpen(false);}}>{term}</button>)}</div>
        </motion.div>}
      </AnimatePresence>
    </header>

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
          <Route path="/admin" element={<AdminPage products={products} setProducts={setProducts} orders={orders} setOrders={setOrders}/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </motion.main>
    </AnimatePresence>
    <SiteFooter/>
    <a className="floating-chat" href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp chat"><MessageCircle/></a>
    <MobileDock cartCount={cartCount}/>
    <CartDrawer open={cartOpen} cart={cart} total={cartTotal} onClose={()=>setCartOpen(false)} onQuantity={setQuantity} onRemove={removeFromCart}/>
    <AnimatePresence>{toast && <motion.div className="toast-message" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:14}}><Check size={16}/>{toast}</motion.div>}</AnimatePresence>
  </div>;
}

function AnnouncementBar(){return <div className="announcement"><span>COMPLIMENTARY DELIVERY ON ORDERS OVER ৳5,000</span><span className="announcement-note">A LITTLE SOMETHING, JUST FOR YOU</span></div>}

function MobileDock({cartCount}){return <nav className="mobile-dock" aria-label="Quick navigation"><NavLink to="/"><span className="dock-symbol">⌂</span>Home</NavLink><NavLink to="/shop"><Search/>Shop</NavLink><NavLink to="/wishlist"><Heart/>Saved</NavLink><NavLink to="/cart"><ShoppingBag/>Bag <b>{cartCount}</b></NavLink></nav>}

function Home({products,wishlist,onToggleWishlist,onAdd}){
  const arrivals=products.filter(item=>item.tag==='New arrival' || item.tag==='Just in').slice(0,4);
  const bestsellers=products.filter(item=>item.tag==='Bestseller').slice(0,4);
  return <>
    <section className="hero-editorial">
      <div className="hero-photo" role="img" aria-label="Elegant traditional saree collection"/>
      <div className="hero-shade"/>
      <div className="hero-frame">
        <motion.div className="hero-copy" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.2,.7,.2,1]}}>
          <span className="eyebrow hero-eyebrow"><i/> THE AZMEYRA EDIT · 2026</span>
          <h1>Made to be<br/><em>remembered.</em></h1>
          <p>Thoughtfully chosen pieces for the days that become your favourite memories.</p>
          <div className="hero-actions"><Link className="button button-cream" to="/shop">Explore the collection <ArrowUpRight/></Link><Link className="text-link text-link-light" to="/about">Discover our story <ArrowRight/></Link></div>
        </motion.div>
        <div className="hero-caption"><span>01 / THE NEW SEASON</span><span>CRAFTED FOR YOUR MOMENTS</span></div>
      </div>
      <div className="hero-vertical">ELEGANCE IN EVERY LOOK</div>
    </section>

    <section className="intro-strip"><span>LESS, BUT LOVELIER</span><i/> <span>ELEGANCE IN EVERY LOOK</span><i/> <span>MADE FOR YOUR MOMENTS</span></section>

    <section className="benefit-band">
      <div className="benefit-item"><span className="benefit-icon"><Truck/></span><div><b>Delivery across Bangladesh</b><small>Carefully packed, right to your door</small></div></div>
      <div className="benefit-item"><span className="benefit-icon"><ShieldCheck/></span><div><b>Thoughtful quality</b><small>Pieces selected with care</small></div></div>
      <div className="benefit-item"><span className="benefit-icon"><PackageCheck/></span><div><b>Easy exchange</b><small>Friendly support when you need it</small></div></div>
    </section>

    <motion.section className="section-block category-section" {...reveal}>
      <SectionHeading eyebrow="FIND YOUR FEELING" title="A world of ways to wear." link="/shop" linkText="View all categories"/>
      <div className="category-grid">
        {CATEGORIES.map((category,index)=><Link className="category-card" to={'/shop?category='+encodeURIComponent(category.name)} key={category.name}>
          <img src={category.image} alt={category.name} loading="lazy"/>
          <span className="category-number">{category.count}</span><span className="category-overlay"/>
          <span className="category-title">{category.name}<ArrowUpRight/></span>
        </Link>)}
      </div>
    </motion.section>

    <motion.section className="section-block arrivals-section" {...reveal}>
      <SectionHeading eyebrow="FRESH FROM THE EDIT" title="New, and noteworthy." link="/shop" linkText="Shop new arrivals"/>
      <ProductGrid products={arrivals.length?arrivals:products.slice(0,4)} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onAdd={onAdd}/>
    </motion.section>

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

function SectionHeading({eyebrow,title,link,linkText='Explore all'}){return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{link&&<Link className="text-link" to={link}>{linkText}<ArrowUpRight/></Link>}</div>}

function ProductGrid({products,wishlist,onToggleWishlist,onAdd}){return <div className="product-grid">{products.map(product=><ProductCard key={product.id} product={product} wished={wishlist.includes(product.id)} onToggle={()=>onToggleWishlist(product.id)} onAdd={()=>onAdd(product)}/>)}</div>}

function ProductCard({product,wished,onToggle,onAdd}){return <motion.article className="product-card" whileHover={{y:-5}} transition={{duration:.22}}>
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
  const product=products.find(item=>item.id===Number(id));
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

function Checkout({cart,total,setCart,orders,setOrders}){const [payment,setPayment]=useState('Cash on Delivery');const [orderId,setOrderId]=useState('');if(!cart.length&&!orderId)return <div className="page-wrap"><div className="empty-state cart-empty"><ShoppingBag/><h2>Your bag is empty.</h2><Link className="button button-dark" to="/shop">Back to shopping <ArrowRight/></Link></div></div>;return <div className="page-wrap checkout-page"><div className="shop-intro"><span className="eyebrow">THE LAST LOVELY STEP</span><h1>Almost <em>yours.</em></h1></div>{orderId?<div className="order-success"><span className="success-mark"><Check/></span><span className="eyebrow">THANK YOU FOR CHOOSING AZMEYRA</span><h2>Your order is received.</h2><p>Your demo order number is <b>{orderId}</b>. Live order processing will require a connected store database and payment service.</p><Link className="button button-dark" to="/shop">Continue exploring <ArrowRight/></Link></div>:<form className="checkout-grid" onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);const id='AZ'+Date.now().toString().slice(-8);setOrders(current=>[...current,{id,name:data.get('name'),phone:data.get('phone'),address:data.get('address'),payment,status:'Order received',items:cart,total,created:new Date().toISOString()}]);setCart([]);setOrderId(id);}}>
  <div className="checkout-form-card"><span className="eyebrow">01 / WHERE TO?</span><h2>Delivery details</h2><div className="form-two"><label>Full name<input name="name" placeholder="Your name" required/></label><label>Phone number<input name="phone" type="tel" pattern="01[0-9]{9}" placeholder="01XXXXXXXXX" required/></label></div><label>Delivery address<textarea name="address" rows="4" placeholder="House, road, area, district..." required/></label><span className="eyebrow payment-eyebrow">02 / HOW TO PAY?</span><h2>Payment method</h2><div className="payment-options">{['Cash on Delivery','bKash','Nagad'].map(method=><button type="button" className={payment===method?'active':''} key={method} onClick={()=>setPayment(method)}>{method==='Cash on Delivery'?<Truck/>:<CreditCard/>}<span>{method}</span>{payment===method&&<Check/>}</button>)}</div>{payment!=='Cash on Delivery'&&<p className="payment-note">Online payment is shown as a preview selection. A merchant account and secure server-side gateway connection are needed before accepting payments.</p>}</div>
  <aside className="order-summary"><span className="eyebrow">03 / YOUR EDIT</span><h2>In your bag</h2>{cart.map(item=><div className="checkout-item" key={item.id+'-'+item.size}><img src={item.image} alt={item.name}/><span>{item.name}<small>{item.size} · {item.color} · Qty {item.qty}</small></span><b>{money(item.price*item.qty)}</b></div>)}<div className="summary-total"><b>Total</b><strong>{money(total)}</strong></div><button className="button button-dark summary-checkout" type="submit">Place demo order <ArrowRight/></button><p className="summary-reassurance"><ShieldCheck/> Your details stay within this demo checkout</p></aside>
</form>}</div>}

function Account({orders}){const [phone,setPhone]=useState('');const mine=orders.filter(order=>order.phone===phone);return <div className="page-wrap"><div className="shop-intro"><span className="eyebrow">YOUR AZMEYRA</span><h1>My <em>account.</em></h1><p>Enter the phone number used at checkout to view your demo orders.</p></div><div className="simple-panel"><label>Phone number<input value={phone} onChange={event=>setPhone(event.target.value)} placeholder="01XXXXXXXXX"/></label>{mine.map(order=><div className="order-history-card" key={order.id}><b>{order.id}</b><span>{order.status}</span><p>{money(order.total)} · {order.created.slice(0,10)}</p></div>)}<Link className="text-link" to="/track">Track an order <ArrowRight/></Link></div></div>}

function TrackOrder({orders}){const [id,setId]=useState('');const order=orders.find(item=>item.id===id.trim().toUpperCase());return <div className="page-wrap"><div className="shop-intro"><span className="eyebrow">ORDER SUPPORT</span><h1>Track your <em>order.</em></h1><p>Your order number is the key to the latest update.</p></div><div className="simple-panel"><label>Order number<input value={id} onChange={event=>setId(event.target.value)} placeholder="e.g. AZ12345678"/></label>{order?<div className="order-history-card"><b>{order.status}</b><p>{order.name} · {money(order.total)}</p><p>{order.address}</p></div>:id.length>4&&<p className="form-hint">No matching order was found in this browser's demo history.</p>}</div></div>}

function WishlistPage({products,wishlist,onToggleWishlist,onAdd}){const saved=products.filter(product=>wishlist.includes(product.id));return <div className="page-wrap"><div className="shop-intro"><span className="eyebrow">THE PIECES YOU SAVED</span><h1>Your wish <em>list.</em></h1><p>A little collection of things you love.</p></div>{saved.length?<ProductGrid products={saved} wishlist={wishlist} onToggleWishlist={onToggleWishlist} onAdd={onAdd}/>:<div className="empty-state"><Heart/><h2>Nothing saved just yet.</h2><p>Tap the little heart on a piece to keep it close.</p><Link className="button button-dark" to="/shop">Explore the collection <ArrowUpRight/></Link></div>}</div>}

function AboutPage(){return <div className="page-wrap story-page"><div className="shop-intro"><span className="eyebrow">A NOTE FROM AZMEYRA</span><h1>Style should feel<br/><em>like coming home.</em></h1><p>Not more. Just more meaningful.</p></div><div className="about-grid"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400" alt="Thoughtful fashion styling"/><div><span className="eyebrow">OUR POINT OF VIEW</span><h2>For the woman<br/>who is <em>all of it.</em></h2><p>AZMEYRA is a considered edit of ladieswear for the many moments that make up your day. We believe getting dressed should feel personal, effortless and quietly beautiful.</p><p>From everyday essentials to pieces for the celebrations you will remember, each selection is made to help you express your own sense of style.</p><Link className="button button-dark" to="/shop">Explore the edit <ArrowRight/></Link></div></div><div className="values-row"><div><span>01</span><b>Thoughtful selection</b><p>Pieces chosen for their details, comfort and timeless appeal.</p></div><div><span>02</span><b>Everyday elegance</b><p>Style that works with the rhythm of real life.</p></div><div><span>03</span><b>Personal expression</b><p>Your wardrobe should always feel like your own.</p></div></div></div>}

function ContactPage(){return <div className="page-wrap contact-page"><div className="shop-intro"><span className="eyebrow">WE ARE HERE FOR YOU</span><h1>Let's talk <em>lovely.</em></h1><p>For product questions, sizing advice or delivery updates, send us a note.</p></div><div className="contact-layout"><div className="contact-details"><div><Mail/><span><b>Write to us</b><small>hello@azmeyra.com</small></span></div><div><PhoneIcon/><span><b>Call or WhatsApp</b><small>Share your preferred contact number to activate this link.</small></span></div><div><Clock3/><span><b>Customer care</b><small>Saturday – Thursday · 10 AM – 7 PM</small></span></div><div><MapPin/><span><b>Based in Bangladesh</b><small>Delivery available nationwide</small></span></div></div><form className="contact-form" onSubmit={event=>{event.preventDefault();alert('Message form preview only. Connect a backend to receive enquiries.')}}><label>Your name<input placeholder="Your name" required/></label><label>Email or phone<input placeholder="How can we reach you?" required/></label><label>What can we help with?<select defaultValue="Product enquiry"><option>Product enquiry</option><option>Size and fit</option><option>Delivery update</option><option>Exchange support</option><option>Something else</option></select></label><label>Your message<textarea rows="4" placeholder="Write your message..." required/></label><button className="button button-dark" type="submit">Send your message <ArrowUpRight/></button></form></div></div>}

function PhoneIcon(){return <span className="phone-symbol">⌕</span>}
function JournalPage(){const stories=[['The art of a thoughtful wardrobe','Build a collection that feels personal, versatile and entirely your own.','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1100'],['A little guide to occasion dressing','Find the balance between feeling special and feeling like yourself.','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1100'],['The beauty of the finishing touch','Small details have a lovely way of changing the whole look.','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1100']];return <div className="page-wrap journal-page"><div className="shop-intro"><span className="eyebrow">THE AZMEYRA JOURNAL</span><h1>Notes on <em>style.</em></h1><p>Ideas, inspiration and thoughtful ways to wear what you love.</p></div><div className="journal-grid">{stories.map((story,index)=><article key={story[0]}><img src={story[2]} alt={story[0]} loading="lazy"/><span className="eyebrow">STYLE NOTES · 0{index+1}</span><h2>{story[0]}</h2><p>{story[1]}</p><span className="journal-read">A LITTLE INSPIRATION <ArrowUpRight/></span></article>)}</div></div>}

function AdminPage({products,setProducts,orders,setOrders}){const [opened,setOpened]=useState(false);const [section,setSection]=useState('Overview');if(!opened)return <div className="page-wrap admin-preview"><span className="eyebrow">STORE MANAGEMENT</span><h1>AZMEYRA <em>studio.</em></h1><p>This is a local preview panel. Add secure Supabase authentication and staff roles before production use.</p><button className="button button-dark" onClick={()=>setOpened(true)}>Open preview dashboard <ArrowRight/></button></div>;return <div className="page-wrap admin-layout"><aside className="admin-sidebar"><img src={brandLogo} alt="AZMEYRA"/>{['Overview','Products','Orders'].map(item=><button className={section===item?'active':''} key={item} onClick={()=>setSection(item)}>{item}</button>)}<Link to="/">Back to store <ArrowUpRight/></Link></aside><div className="admin-content"><span className="eyebrow">AZMEYRA / ADMIN</span><h1>{section}</h1>{section==='Overview'?<div className="admin-stats"><div><span>Products</span><b>{products.length}</b></div><div><span>Orders</span><b>{orders.length}</b></div><div><span>Order value</span><b>{money(orders.reduce((sum,order)=>sum+order.total,0))}</b></div></div>:section==='Products'?<><button className="button button-dark" onClick={()=>{const name=prompt('Product name?');if(name)setProducts(current=>[...current,{...SEED[2],id:Date.now(),name,price:1500,stock:1}]);}}>Add product <Plus/></button>{products.map(product=><div className="admin-row" key={product.id}>{product.name} · {money(product.price)}<button onClick={()=>setProducts(current=>current.filter(item=>item.id!==product.id))}>Remove</button></div>)}</>:orders.map(order=><div className="admin-row" key={order.id}>{order.id} · {order.name} · {money(order.total)}<select value={order.status} onChange={event=>setOrders(current=>current.map(item=>item.id===order.id?{...item,status:event.target.value}:item))}>{['Order received','Confirmed','Processing','Shipped','Delivered','Cancelled'].map(status=><option key={status}>{status}</option>)}</select></div>)}</div></div>}

function NotFound(){return <div className="page-wrap empty-state"><span className="eyebrow">AZMEYRA / 404</span><h2>This page has wandered off.</h2><p>Let's get you back to something lovely.</p><Link className="button button-dark" to="/">Back to home <ArrowLeft/></Link></div>}

function Newsletter(){const [email,setEmail]=useState('');const [submitted,setSubmitted]=useState(false);return <section className="newsletter-section"><div><span className="eyebrow">A NOTE FROM US, NOW AND THEN</span><h2>A little loveliness<br/><em>in your inbox.</em></h2><p>New arrivals, thoughtful edits and a little inspiration.</p></div><form onSubmit={event=>{event.preventDefault();setSubmitted(true);setEmail('');}}><label htmlFor="newsletter-email">YOUR EMAIL ADDRESS</label><div className="newsletter-input"><input id="newsletter-email" type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@example.com" required/><button type="submit" aria-label="Subscribe"><ArrowUpRight/></button></div><small>{submitted?'Thank you — you are on the list.':'A considered note. Never too many.'}</small></form></section>}

function SiteFooter(){return <footer className="site-footer"><div className="footer-top"><div className="footer-brand-column"><Link to="/" className="footer-logo"><img src="/azmeyra-logo-light.svg" alt="AZMEYRA"/></Link><p>Thoughtfully selected pieces for your everyday moments.</p><div className="social-links"><a href="https://instagram.com" aria-label="Instagram"><Instagram/></a><a href="https://wa.me/" aria-label="WhatsApp"><MessageCircle/></a></div></div><div className="footer-column"><b>EXPLORE</b><Link to="/shop">Shop all</Link><Link to="/about">Our story</Link><Link to="/blog">Journal</Link></div><div className="footer-column"><b>HELP & SUPPORT</b><Link to="/contact">Contact us</Link><Link to="/track">Track an order</Link><Link to="/account">My account</Link></div><div className="footer-column footer-contact"><b>THE AZMEYRA PROMISE</b><span><Truck/> Delivery across Bangladesh</span><span><ShieldCheck/> Thoughtfully selected</span><span><PackageCheck/> Easy exchange support</span></div></div><div className="footer-bottom"><span>© 2026 AZMEYRA. ALL RIGHTS RESERVED.</span><span>MADE WITH CARE IN BANGLADESH</span><span>THE ART OF EVERYDAY ELEGANCE</span></div></footer>}

export default App;
