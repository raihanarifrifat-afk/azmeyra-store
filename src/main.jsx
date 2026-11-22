import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, ShoppingBag, Menu, X, Heart, ArrowRight, ChevronDown, Instagram, Facebook, Truck, RotateCcw, ShieldCheck, Plus, Minus } from 'lucide-react';
import './style.css';

const products = [
  { id: 1, name: 'Sana Embroidered Three-Piece', category: 'Three-Piece', price: 2450, old: 2850, tag: 'BESTSELLER', image: 'photo-1610030469983-98e550d6193c', color: 'Ivory' },
  { id: 2, name: 'Noor Classic Lawn Suit', category: 'Three-Piece', price: 1890, old: 2200, tag: 'NEW ARRIVAL', image: 'photo-1583391733956-6c78276477e3', color: 'Blush' },
  { id: 3, name: 'Mira Everyday Elegance', category: 'Two-Piece', price: 1650, old: null, tag: '', image: 'photo-1597983073493-88cd35cf93e6', color: 'Sage' },
  { id: 4, name: 'Zarif Printed Collection', category: 'Three-Piece', price: 2150, old: 2450, tag: 'LIMITED', image: 'photo-1603217192097-13c306522271', color: 'Rose' },
  { id: 5, name: 'Ayla Signature Kurti', category: 'Kurtis', price: 1350, old: null, tag: '', image: 'photo-1585487000160-6ebcf5909642', color: 'Sand' },
  { id: 6, name: 'Meher Festive Ensemble', category: 'Festive', price: 3250, old: 3800, tag: 'EXCLUSIVE', image: 'photo-1617627143750-d86bc21e42bb', color: 'Emerald' },
  { id: 7, name: 'Aarohi Soft Cotton Set', category: 'Two-Piece', price: 1750, old: null, tag: '', image: 'photo-1617922001439-4a2e6562f328', color: 'Blue' },
  { id: 8, name: 'Ruhani Elegant Edit', category: 'Festive', price: 2950, old: null, tag: 'NEW', image: 'photo-1590736969955-71cc94901144', color: 'Maroon' },
];
const categories = ['All', 'Three-Piece', 'Two-Piece', 'Kurtis', 'Festive'];
const photo = (id, w=800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
function App() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [notice, setNotice] = useState('');
  const [sort, setSort] = useState('featured');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const shown = useMemo(() => {
    let list = products.filter(p => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'low') list.sort((a,b)=>a.price-b.price);
    if (sort === 'high') list.sort((a,b)=>b.price-a.price);
    return list;
  }, [category, search, sort]);
  const count = cart.reduce((s, p) => s + p.qty, 0);
  const total = cart.reduce((s, p) => s + p.price*p.qty, 0);
  const add = p => { setCart(prev => { const found=prev.find(x=>x.id===p.id); return found ? prev.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x) : [...prev,{...p,qty:1}]; }); setNotice(`${p.name} added to your bag`); setTimeout(()=>setNotice(''),2500); };
  const qty = (id, d) => setCart(prev=>prev.map(p=>p.id===id?{...p,qty:p.qty+d}:p).filter(p=>p.qty>0));
  const toggleWish = id => setWishlist(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const choose = c => {setCategory(c);setMenuOpen(false);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'});};
  return <>
    <div className="announcement">A LITTLE LUXURY, DELIVERED TO YOUR DOOR <span>✦</span> FREE DELIVERY ON ORDERS OVER ৳3,500</div>
    <header className="header">
      <button className="icon-btn mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen?<X/>:<Menu/>}</button>
      <nav className={`nav left-nav ${menuOpen?'show':''}`}>
        <button onClick={()=>choose('All')}>HOME</button><button onClick={()=>choose('Three-Piece')}>THREE-PIECE</button><button onClick={()=>choose('Two-Piece')}>TWO-PIECE</button><button onClick={()=>choose('Kurtis')}>KURTIS</button>
      </nav>
      <a className="brand" href="#top"><img src="/azmeyra-logo.svg" alt="AZMEYRA — Elegance in Every Look" /></a>
      <div className="header-actions">
        <button className="icon-btn search-trigger" aria-label="Search" onClick={()=>setSearchOpen(!searchOpen)}><Search/></button>
        <button className="icon-btn bag-trigger" aria-label="Shopping bag" onClick={()=>setCartOpen(true)}><ShoppingBag/><span className="bag-count">{count}</span></button>
      </div>
    </header>
    {searchOpen && <div className="searchbar"><Search size={18}/><input autoFocus placeholder="Search your favourite pieces..." value={search} onChange={e=>{setSearch(e.target.value);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'});}}/><button onClick={()=>{setSearch('');setSearchOpen(false)}}><X size={18}/></button></div>}
    <main id="top">
      <section className="hero">
        <div className="hero-image" /><div className="hero-shade" />
        <div className="hero-content"><p className="eyebrow light">THE NEW SEASON EDIT · 2026</p><h1>Wear your<br/><em>kind of beautiful.</em></h1><p className="hero-copy">Thoughtfully chosen styles. Timeless details.<br/>A little elegance in every look.</p><button className="light-btn" onClick={()=>choose('All')}>EXPLORE COLLECTION <ArrowRight size={17}/></button></div>
        <div className="hero-index">01 <span/> 03</div>
      </section>
      <section className="benefits"><div><Truck/><span><b>DELIVERY ACROSS BANGLADESH</b><small>Carefully packed, right to your door</small></span></div><div><RotateCcw/><span><b>HASSLE-FREE EXCHANGE</b><small>Easy exchange within 3 days</small></span></div><div><ShieldCheck/><span><b>THOUGHTFUL QUALITY</b><small>Picked with care, made to love</small></span></div></section>
      <section className="collection" id="shop">
        <div className="section-heading"><div><p className="eyebrow">CURATED FOR YOU</p><h2>Find your <em>favourite.</em></h2></div><p className="section-note">Pieces that make every day<br/>feel a little more special.</p></div>
        <div className="shop-toolbar"><div className="categories">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="sort">SORT BY <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown size={13}/></label></div>
        <div className="product-grid">{shown.map(p=><article className="product" key={p.id}><div className="product-image"><img src={photo(p.image)} alt={p.name} loading="lazy"/>{p.tag&&<span className="product-tag">{p.tag}</span>}<button className={`wish ${wishlist.includes(p.id)?'chosen':''}`} onClick={()=>toggleWish(p.id)} aria-label="Add to wishlist"><Heart size={17} fill={wishlist.includes(p.id)?'currentColor':'none'}/></button><button className="quick-add" onClick={()=>add(p)}>ADD TO BAG <Plus size={15}/></button></div><div className="product-info"><div><h3>{p.name}</h3><p>{p.color} · {p.category}</p></div><div className="price"><b>৳{p.price.toLocaleString('en-BD')}</b>{p.old&&<del>৳{p.old.toLocaleString('en-BD')}</del>}</div></div></article>)}</div>
        {shown.length===0&&<div className="empty">No pieces found. Try another search.</div>}
        <div className="view-all"><button onClick={()=>{setCategory('All');setSearch('')}}>VIEW ALL PIECES <ArrowRight size={16}/></button></div>
      </section>
      <section className="story"><div className="story-photo"><img src={photo('photo-1603217192097-13c306522271',1000)} alt="Elegant fashion detail" loading="lazy"/></div><div className="story-copy"><p className="eyebrow">THE AZMEYRA FEELING</p><h2>Elegance is not<br/>a trend. It's a <em>feeling.</em></h2><p>We believe getting dressed should feel effortless. AZMEYRA brings together thoughtful designs, graceful details and everyday comfort — so you can feel like yourself, beautifully.</p><button className="text-link" onClick={()=>choose('All')}>DISCOVER OUR COLLECTION <ArrowRight size={16}/></button></div></section>
      <section className="newsletter"><p className="eyebrow">A NOTE FROM US</p><h2>A little beauty in<br/><em>your inbox.</em></h2><p>Be the first to know about new arrivals, special edits and lovely surprises.</p><form onSubmit={e=>{e.preventDefault();if(email.includes('@'))setSubscribed(true)}}><input type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)}/><button>{subscribed?'YOU’RE ON THE LIST':'SUBSCRIBE'} <ArrowRight size={16}/></button></form>{subscribed&&<small className="success">Thank you for joining the AZMEYRA circle.</small>}</section>
    </main>
    <footer><div className="footer-top"><div className="footer-brand"><img src="/azmeyra-logo.svg" alt="AZMEYRA"/><p>Elegance in every look.<br/>Made for the way you feel.</p></div><div><h4>EXPLORE</h4><button onClick={()=>choose('All')}>Shop all</button><button onClick={()=>choose('Three-Piece')}>Three-piece</button><button onClick={()=>choose('Two-Piece')}>Two-piece</button><button onClick={()=>choose('Festive')}>Festive edit</button></div><div><h4>WE’RE HERE</h4><a href="mailto:hello@azmeyra.com">Email us</a><a href="#top">Delivery & exchange</a><a href="#top">FAQs</a><a href="#top">Contact</a></div><div><h4>FOLLOW OUR STORY</h4><div className="socials"><a href="#top" aria-label="Instagram"><Instagram/></a><a href="#top" aria-label="Facebook"><Facebook/></a></div><p className="social-note">Find your daily dose of elegance.</p></div></div><div className="footer-bottom"><span>© 2026 AZMEYRA. ALL RIGHTS RESERVED.</span><span>MADE WITH CARE IN BANGLADESH</span></div></footer>
    {notice&&<div className="toast">{notice}</div>}
    {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag <span>({count})</span></h2></div><button className="icon-btn" onClick={()=>setCartOpen(false)}><X/></button></div>{cart.length===0?<div className="cart-empty"><ShoppingBag size={35}/><h3>Your bag is waiting.</h3><p>Find something lovely to make it yours.</p><button onClick={()=>setCartOpen(false)}>CONTINUE SHOPPING</button></div>:<><div className="cart-items">{cart.map(p=><div className="cart-item" key={p.id}><img src={photo(p.image,300)} alt={p.name}/><div className="cart-detail"><h3>{p.name}</h3><b>৳{p.price.toLocaleString('en-BD')}</b><div className="qty"><button onClick={()=>qty(p.id,-1)}><Minus size={13}/></button><span>{p.qty}</span><button onClick={()=>qty(p.id,1)}><Plus size={13}/></button></div></div><button className="remove" onClick={()=>qty(p.id,-p.qty)}>REMOVE</button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>৳{total.toLocaleString('en-BD')}</b></div><small>Delivery charges calculated at checkout.</small><button onClick={()=>setNotice('Checkout will be available after payment setup.')}>PROCEED TO CHECKOUT <ArrowRight size={16}/></button></div></>}</aside></div>}
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
