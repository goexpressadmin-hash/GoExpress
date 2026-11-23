import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  Clock3,
  Compass,
  Menu,
  Play,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Property = {
  name: string;
  location: string;
  category: string;
  price: string;
  priceValue: number;
  detail: string;
  accent: string;
  number: string;
  tag: string;
  image: string;
};

type ModalType = 'login' | 'signup' | 'enquiry' | null;

const properties: Property[] = [
  { name: 'The Meridian Estate', location: 'Miami, Florida', category: 'Luxury Residential', price: '$4.85M', priceValue: 4850000, detail: '6 beds  ·  7 baths  ·  6,940 sq ft', accent: 'estate-sunset', number: '01', tag: 'Featured residence', image: '/a3debe72bd28aa5d8f237c0b6ea0676f.jpg' },
  { name: 'The Palm House', location: 'Boca Raton, Florida', category: 'Luxury Residential', price: '$3.2M', priceValue: 3200000, detail: '5 beds  ·  6 baths  ·  5,420 sq ft', accent: 'palm-house', number: '02', tag: 'Private collection', image: '/5b10a949d0b1b521b6ef47ab34fed4b3.jpg' },
  { name: 'Atlas House', location: 'Washington, DC', category: 'New Development', price: '$1.95M', priceValue: 1950000, detail: '4 beds  ·  4 baths  ·  3,180 sq ft', accent: 'atlas-house', number: '03', tag: 'New release', image: '/a8817f0f344594a994ab64717622d49a.jpg' },
  { name: 'The Lakeside Reserve', location: 'Austin, Texas', category: 'Development Opportunity', price: '$8.6M', priceValue: 8600000, detail: '18.4 acres  ·  Approved plans', accent: 'lakeside', number: '04', tag: 'Development site', image: '/0c43ac3dffdd40e7243e59934c7868db.jpg' },
];

const locations = ['All locations', 'Miami, Florida', 'Boca Raton, Florida', 'Washington, DC', 'Austin, Texas'];
const categories = ['All categories', 'Luxury Residential', 'New Development', 'Development Opportunity'];

function getWashingtonTime(): { time: string; date: string } {
  const now = new Date();
  return {
    time: new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(now),
    date: new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now).toUpperCase(),
  };
}

function App() {
  const [clock, setClock] = useState(getWashingtonTime);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [location, setLocation] = useState('All locations');
  const [category, setCategory] = useState('All categories');
  const [maxPrice, setMaxPrice] = useState('Any price');
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setClock(getWashingtonTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSessionEmail(data.session?.user.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSessionEmail(session?.user.email ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  const filteredProperties = useMemo(() => properties.filter((property) => {
    const locationMatch = location === 'All locations' || property.location === location;
    const categoryMatch = category === 'All categories' || property.category === category;
    const priceMatch = maxPrice === 'Any price' || (maxPrice === 'Under $3M' && property.priceValue < 3000000) || (maxPrice === '$3M – $6M' && property.priceValue >= 3000000 && property.priceValue <= 6000000) || (maxPrice === '$6M+' && property.priceValue > 6000000);
    return locationMatch && categoryMatch && priceMatch;
  }), [category, location, maxPrice]);

  function openEnquiry(property: Property) {
    setSelectedProperty(property);
    setModal('enquiry');
  }

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>, type: 'login' | 'signup') {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    if (!supabase) {
      setNotice('Account access is ready to connect once the secure account service is available.');
      return;
    }
    const result = type === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) {
      setNotice(result.error.message);
      return;
    }
    setSessionEmail(email);
    setModal(null);
    setNotice(type === 'signup' ? 'Your GO EXPRESS account has been created.' : 'Welcome back to GO EXPRESS.');
  }

  async function handleEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      property_name: selectedProperty?.name ?? 'General enquiry',
      full_name: String(form.get('full_name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      message: String(form.get('message') ?? ''),
    };
    if (supabase) {
      const { error } = await supabase.from('property_enquiries').insert(payload);
      if (error) {
        setNotice('We could not send your enquiry right now. Please try again.');
        return;
      }
    }
    setModal(null);
    setNotice('Thank you. A GO EXPRESS property advisor will be in touch shortly.');
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div className="security-strip"><ShieldCheck size={15} /> <span>IMPORTANT SECURITY NOTICE</span><b>GO EXPRESS IS NOT ON ANY SOCIAL MEDIA PLATFORM.</b><span className="security-hide">Never send money through unofficial accounts.</span></div>
      <header className="site-header">
        <div className="topline container"><div className="clock"><Clock3 size={14} /><span>WASHINGTON, DC <strong>|</strong> {clock.time}</span><span className="clock-date">{clock.date}</span></div><div className="top-actions"><button onClick={() => setModal('signup')}>Join GO EXPRESS</button><button className="top-login" onClick={() => setModal('login')}>Member login <ArrowRight size={14} /></button></div></div>
        <div className="navline container"><button className="brand" onClick={() => scrollTo('top')} aria-label="GO EXPRESS home"><img className="brand-logo-image" src="/file_000000000a4481f489f39a2930091069.png" alt="GO EXPRESS logo" /><span><b>GO</b> EXPRESS<small>REAL ESTATE · INVESTMENT · PARTNERS</small></span></button><nav className={menuOpen ? 'nav-links open' : 'nav-links'}><button onClick={() => scrollTo('properties')}>Properties</button><button onClick={() => scrollTo('opportunities')}>Opportunities</button><button onClick={() => scrollTo('partnership')}>Partner with us</button><button onClick={() => scrollTo('about')}>About</button><button onClick={() => scrollTo('contact')}>Contact</button></nav><button className="menu-toggle" onClick={() => setMenuOpen((current) => !current)} aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button><button className="member-button" onClick={() => setModal(sessionEmail ? null : 'login')}><UserRound size={17} /> {sessionEmail ? 'Member' : 'Sign in'}</button></div>
      </header>

      <main id="top">
        <section className="hero" style={{ backgroundImage: "linear-gradient(122deg, rgba(10, 27, 45, .78), rgba(35, 64, 91, .52)), url('/a3debe72bd28aa5d8f237c0b6ea0676f.jpg')" }}>
          <div className="hero-ambient ambient-one" /><div className="hero-ambient ambient-two" />
          <div className="hero-grid" />
          <div className="container hero-content"><p className="eyebrow light"><span /> EST. 2014 · UNITED STATES</p><h1>Building opportunities.<br /><em>Connecting people.</em><br />Investing in the future.</h1><p className="hero-copy">Discover distinctive real estate and considered opportunities across the American market, guided by the people who know it best.</p><div className="hero-actions"><button className="button button-gold" onClick={() => scrollTo('properties')}>Explore properties <ArrowRight size={17} /></button><button className="button button-ghost" onClick={() => setModal('signup')}>Join GO EXPRESS <ArrowRight size={17} /></button></div></div>
          <div className="hero-bottom container"><span>PROPERTY / INVESTMENT / PARTNERSHIPS</span><span className="scroll-cue"><span /> Scroll to explore</span><span>01 <i>/</i> 04</span></div>
        </section>

        <section className="market-intro container" id="about"><div><p className="eyebrow"><span /> A more considered way to move</p><h2>Real estate with<br /><em>room to grow.</em></h2></div><div className="intro-copy"><p>GO EXPRESS brings together exceptional property, trusted professionals and meaningful opportunity under one roof.</p><p className="muted">Whether you are looking for a place to call home, a new market to enter or a partner to help you move forward, our perspective is built around what comes next.</p><button className="text-button" onClick={() => scrollTo('opportunities')}>Our approach <ArrowRight size={16} /></button></div></section>

        <section className="property-section" id="properties"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span /> Curated collection</p><h2>Find your <em>next place.</em></h2></div><button className="view-all" onClick={() => { setLocation('All locations'); setCategory('All categories'); setMaxPrice('Any price'); }}>Reset search <ArrowRight size={16} /></button></div><div className="search-panel"><div className="search-label"><Search size={18} /><span>Explore the collection</span></div><label>Location<select value={location} onChange={(event) => setLocation(event.target.value)}>{locations.map((item) => <option key={item}>{item}</option>)}</select></label><label>Property type<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Price range<select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option>Any price</option><option>Under $3M</option><option>$3M – $6M</option><option>$6M+</option></select></label><button className="filter-button"><SlidersHorizontal size={16} /> Filters</button></div><div className="result-line"><span>{filteredProperties.length} featured properties</span><span><Check size={14} /> Verified demonstration inventory</span></div><div className="property-grid">{filteredProperties.map((property) => <article className="property-card" key={property.name}><div className={`property-visual ${property.accent}`}><img src={property.image} alt={`${property.name} exterior`} loading="lazy" /><span className="property-number">{property.number}</span><span className="property-tag">{property.tag}</span><button className="play-button" aria-label={`Preview ${property.name}`}><Play size={15} fill="currentColor" /></button></div><div className="property-info"><div><p className="property-location">{property.location}</p><h3>{property.name}</h3><p className="property-detail">{property.detail}</p></div><div className="property-bottom"><strong>{property.price}</strong><button onClick={() => openEnquiry(property)}>Enquire <ArrowRight size={15} /></button></div></div></article>)}</div>{filteredProperties.length === 0 && <div className="empty-results"><Compass size={24} /> No properties match those filters yet.</div>}</div></section>

        <section className="opportunity-section" id="opportunities"><div className="container opportunity-layout"><div className="opportunity-copy"><p className="eyebrow light"><span /> Beyond the address</p><h2>Opportunity,<br /><em>well placed.</em></h2><p>From residential projects to long-term development potential, we help our members see the full picture before making their next move.</p><div className="stats"><div><strong>10</strong><span>markets across<br />the United States</span></div><div><strong>11+</strong><span>years of<br />local perspective</span></div></div><button className="button button-gold" onClick={() => setModal('enquiry')}>Discover opportunities <ArrowRight size={17} /></button></div><div className="opportunity-card"><div className="opportunity-art"><Building2 size={32} /><span>NEW YORK · MIAMI · AUSTIN</span></div><div className="opportunity-card-copy"><p>GO EXPRESS / INSIGHT 04</p><h3>Investing in what is next</h3><span>Explore our market perspective <ArrowRight size={15} /></span></div></div></div></section>

        <section className="partner-section" id="partnership"><div className="container partner-layout"><div><p className="eyebrow"><span /> Built together</p><h2>Bring your<br /><em>ambition.</em></h2></div><div><p className="partner-lead">We partner with the people shaping the places people want to be.</p><p className="muted">Independent agents, developers, owners and operators — if you have a property, a project or a point of view, there is a place for it here.</p><button className="text-button" onClick={() => setModal('enquiry')}>Partner with GO EXPRESS <ArrowRight size={16} /></button></div></div></section>

        <section className="contact-section" id="contact"><div className="container contact-layout"><div><p className="eyebrow light"><span /> Stay in the know</p><h2>Make your<br /><em>next move.</em></h2></div><div className="contact-card"><Sparkles size={20} /><h3>Personal perspective, when it matters.</h3><p>Join the GO EXPRESS circle for new listings, market notes and thoughtful opportunities.</p><a className="contact-email" href="mailto:goexpressadmin@gmail.com">goexpressadmin@gmail.com</a><button className="button button-dark" onClick={() => setModal('signup')}>Become a member <ArrowRight size={16} /></button></div></div></section>
      </main>

      <footer className="footer"><div className="container footer-top"><div className="footer-brand"><button className="brand footer-logo" onClick={() => scrollTo('top')}><img className="brand-logo-image" src="/file_000000000a4481f489f39a2930091069.png" alt="GO EXPRESS logo" /><span><b>GO</b> EXPRESS<small>REAL ESTATE · INVESTMENT · PARTNERS</small></span></button><p>Property, perspective and possibility — connected.</p><a className="footer-email" href="mailto:goexpressadmin@gmail.com">goexpressadmin@gmail.com</a></div><div className="footer-links"><div><b>Explore</b><button onClick={() => scrollTo('properties')}>Properties</button><button onClick={() => scrollTo('opportunities')}>Opportunities</button><button onClick={() => scrollTo('partnership')}>Partnerships</button></div><div><b>Company</b><button onClick={() => scrollTo('about')}>About GO EXPRESS</button><button onClick={() => scrollTo('contact')}>Contact</button><button onClick={() => setModal('login')}>Member login</button></div></div></div><div className="footer-security container"><ShieldCheck size={17} /><p><strong>IMPORTANT SECURITY NOTICE — BEWARE OF SCAMMERS!</strong><br />GO EXPRESS is not on any social media platform. We do not operate through unofficial Facebook, Instagram, TikTok, Telegram or WhatsApp investment accounts. Always use our official website for company announcements and enquiries.</p></div><div className="footer-bottom container"><span>© 2026 GO EXPRESS. Demonstration platform.</span><span>Privacy · Terms · Investment risk disclosure</span></div></footer>

      {notice && <div className="toast"><Check size={17} /> {notice}<button onClick={() => setNotice('')}><X size={15} /></button></div>}
      {modal && <div className="modal-backdrop" onMouseDown={() => setModal(null)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)}><X size={18} /></button>{modal === 'enquiry' ? <><p className="eyebrow"><span /> Start a conversation</p><h2>Enquire about<br /><em>{selectedProperty?.name ?? 'an opportunity'}.</em></h2><form onSubmit={handleEnquiry}><input name="full_name" placeholder="Full name" required /><input name="email" type="email" placeholder="Email address" required /><input name="phone" placeholder="Phone number" /><textarea name="message" placeholder="How can we help?" rows={4} required defaultValue={selectedProperty ? `I would like to learn more about ${selectedProperty.name}.` : ''} /><button className="button button-dark" type="submit">Send enquiry <ArrowRight size={16} /></button></form></> : <><p className="eyebrow"><span /> GO EXPRESS members</p><h2>{modal === 'signup' ? <>Join the<br /><em>circle.</em></> : <>Welcome<br /><em>back.</em></>}</h2><form onSubmit={(event) => handleAuth(event, modal)}>{modal === 'signup' && <input name="full_name" placeholder="Full name" required />}<input name="email" type="email" placeholder="Email address" required /><input name="password" type="password" placeholder="Password" minLength={6} required /><button className="button button-dark" type="submit">{modal === 'signup' ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></button></form><p className="modal-switch">{modal === 'signup' ? 'Already a member?' : 'New to GO EXPRESS?'} <button onClick={() => setModal(modal === 'signup' ? 'login' : 'signup')}>{modal === 'signup' ? 'Sign in' : 'Create an account'}</button></p></>}</div></div>}
    </div>
  );
}

export default App;
