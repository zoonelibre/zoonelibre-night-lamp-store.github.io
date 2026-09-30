
const PRODUCTS = [
{"id": "fado-white", "name": "White Globe Night Lamp", "variant": "Warm White Globe", "brand": "Zoonelibre", "price": 29.99, "category": "Ambient", "color": "White", "type": "Globe", "desc": "Soft-glow round night lamp for cozy bedside and ambient lighting.", "reference": "IKEA FADO Table Lamp, white, 10 in", "source": "https://www.ikea.com/us/en/p/fado-table-lamp-white-70096377/", "image": "assets/products/fado-white.jpg"},
{"id": "spetsboj", "name": "Modern Dimmable Night Lamp", "variant": "White Adjustable Shade", "brand": "Zoonelibre", "price": 19.99, "category": "Bedside", "color": "White", "type": "Dimmable", "desc": "Compact modern bedside lamp with a directional shade and warm light.", "reference": "IKEA SPETSBOJ Table Lamp, dimmable white, 9 in", "source": "https://www.ikea.com/us/en/cat/table-lamps-10732/f/metal-table-lamps-f-materials--47350/", "image": "assets/products/spetsboj.jpg"},
{"id": "varmblixt", "name": "Orange Donut Glow Lamp", "variant": "Orange Glass Style", "brand": "Zoonelibre", "price": 89.99, "category": "Decorative", "color": "Orange", "type": "Statement", "desc": "Sculptural orange night lamp with a warm decorative glow.", "reference": "IKEA VARMBLIXT LED Table/Wall Lamp, orange glass/round, 12 in", "source": "https://www.ikea.com/us/en/p/varmblixt-led-table-wall-lamp-orange-glass-round-90525150/", "image": "assets/products/varmblixt.jpg"},
{"id": "dejsa", "name": "Beige Opal Night Lamp", "variant": "Beige / Soft Opal Style", "brand": "Zoonelibre", "price": 89.99, "category": "Bedside", "color": "Beige", "type": "Glass", "desc": "Elegant nightstand lamp with a smooth warm opal-style glow.", "reference": "IKEA DEJSA Table Lamp, beige/opal glass, 11 in", "source": "https://www.ikea.com/us/en/p/dejsa-table-lamp-beige-opal-glass-00404987/", "image": "assets/products/dejsa.jpg"},
{"id": "fado-pink", "name": "Pink Globe Night Lamp", "variant": "Pink Ambient Glow", "brand": "Zoonelibre", "price": 29.99, "category": "Ambient", "color": "Pink", "type": "Globe", "desc": "Pink globe lamp for bedrooms, dorm rooms and decorative setups.", "reference": "IKEA FADO Table Lamp, pink/glass, 10 in", "source": "https://www.ikea.com/us/en/p/fado-table-lamp-pink-glass-00592634/", "image": "assets/products/fado-pink.jpg"},
{"id": "smart-globe", "name": "Smart RGB Globe Night Lamp", "variant": "Color + White Spectrum", "brand": "Zoonelibre", "price": 44.98, "category": "Smart", "color": "Multicolor", "type": "Smart Globe", "desc": "Color-changing smart lamp for relaxing ambience and custom room lighting.", "reference": "IKEA FADO / KAJPLATS Smart Table Lamp", "source": "https://www.ikea.com/us/en/p/fado-kajplats-table-lamp-with-led-bulb-smart-color-and-white-spectrum-s29654971/", "image": "assets/products/smart-globe.jpg"},
{"id": "tokabo", "name": "Warm Globe Bedside Lamp", "variant": "Soft Warm White", "brand": "Zoonelibre", "price": 19.99, "category": "Bedside", "color": "White", "type": "Globe", "desc": "Small round night lamp for shelves, nightstands and compact spaces.", "reference": "IKEA TOKABO Table Lamp, glass opal", "source": "https://www.ikea.com/us/en/p/tokabo-table-lamp-glass-opal-80358019/", "image": "assets/products/tokabo.jpg"},
{"id": "tvaerhand", "name": "Black & Wood Edison Lamp", "variant": "Black Frame / Wood Base", "brand": "Zoonelibre", "price": 24.99, "category": "Decorative", "color": "Black", "type": "Exposed Bulb", "desc": "Minimal black-and-wood lamp with an exposed warm bulb aesthetic.", "reference": "IKEA TVÄRHAND Table Lamp, black/bamboo", "source": "https://www.ikea.com/us/en/p/tvaerhand-table-lamp-black-bamboo-60518410/", "image": "assets/products/tvaerhand.jpg"},
{"id": "taernaby", "name": "Vintage Lantern Night Lamp", "variant": "Anthracite Vintage Style", "brand": "Zoonelibre", "price": 34.99, "category": "Vintage", "color": "Anthracite", "type": "Lantern", "desc": "Vintage-inspired lantern-style night light with warm ambience.", "reference": "IKEA TÄRNABY Table Lamp, dimmable anthracite, 10 in", "source": "https://www.ikea.com/us/en/p/taernaby-table-lamp-dimmable-anthracite-00323887/", "image": "assets/products/taernaby.jpg"},
{"id": "grono", "name": "Frosted Cube Night Lamp", "variant": "Warm White Cube", "brand": "Zoonelibre", "price": 12.99, "category": "Modern", "color": "White", "type": "Cube", "desc": "Simple frosted cube lamp with soft diffused light for nighttime use.", "reference": "IKEA GRÖNÖ Table Lamp, frosted glass white, 9 in", "source": "https://www.ikea.com/us/en/p/groenoe-table-lamp-frosted-glass-white-10373221/", "image": "assets/products/grono.jpg"}
];

const grid = document.getElementById('productGrid');
const q = document.getElementById('q');
const cat = document.getElementById('cat');
const color = document.getElementById('color');
const sort = document.getElementById('sort');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
let cart = JSON.parse(localStorage.getItem('zoonelibre-cart') || '[]');

function money(n){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n); }

function initFilters(){
  cat.innerHTML = '<option value="">All categories</option>' + [...new Set(PRODUCTS.map(p=>p.category))].sort().map(v=>`<option>${v}</option>`).join('');
  color.innerHTML = '<option value="">All colors</option>' + [...new Set(PRODUCTS.map(p=>p.color))].sort().map(v=>`<option>${v}</option>`).join('');
}
function list(){
  let items = PRODUCTS.filter(p=>{
    const s = q.value.trim().toLowerCase();
    return (!s || `${p.name} ${p.variant} ${p.brand} ${p.color} ${p.category} ${p.type}`.toLowerCase().includes(s))
      && (!cat.value || p.category===cat.value)
      && (!color.value || p.color===color.value);
  });
  if(sort.value==='low') items.sort((a,b)=>a.price-b.price);
  if(sort.value==='high') items.sort((a,b)=>b.price-a.price);
  if(sort.value==='name') items.sort((a,b)=>a.name.localeCompare(b.name));
  grid.innerHTML = items.map(p=>`
    <article class="card">
      <div class="photo"><img src="${p.image}" alt="${p.name} ${p.variant}"><span class="badge">${p.category}</span></div>
      <div class="body">
        <div class="brandline">${p.brand}</div>
        <h3>${p.name}</h3>
        <div class="variant">${p.variant}</div>
        <p class="desc">${p.desc}</p>
        <div class="chips"><span class="chip">${p.color}</span><span class="chip">${p.type}</span></div>
        <div class="bottom">
          <div class="price"><strong>${money(p.price)}</strong></div>
          <button class="buy" data-id="${p.id}">Add</button>
        </div>
        <div class="source">Reference price · <a href="${p.source}" target="_blank" rel="noopener">View source</a></div>
      </div>
    </article>
  `).join('') || '<p>No products found.</p>';

  document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>add(b.dataset.id));
}

function add(id){
  const found = cart.find(x=>x.id===id);
  if(found) found.qty += 1; else cart.push({id, qty:1});
  saveCart(); renderCart(); cartDrawer.classList.add('open');
}
function saveCart(){ localStorage.setItem('zoonelibre-cart', JSON.stringify(cart)); }
function renderCart(){
  let total = 0, count = 0;
  cartItems.innerHTML = cart.map(row=>{
    const p = PRODUCTS.find(x=>x.id===row.id); if(!p) return '';
    total += p.price * row.qty; count += row.qty;
    return `<div class="cart-item"><div><b>${p.name}</b><br><small>${p.variant} · Qty ${row.qty}</small><br><button class="remove" data-remove="${p.id}">Remove</button></div><strong>${money(p.price*row.qty)}</strong></div>`;
  }).join('') || '<p>Your cart is empty.</p>';
  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{
    cart = cart.filter(x=>x.id!==b.dataset.remove);
    saveCart(); renderCart();
  });
}

document.getElementById('cartOpen').onclick = ()=>cartDrawer.classList.add('open');
document.getElementById('cartClose').onclick = ()=>cartDrawer.classList.remove('open');
cartDrawer.onclick = e=>{ if(e.target===cartDrawer) cartDrawer.classList.remove('open'); };
[q,cat,color,sort].forEach(el=>el.addEventListener('input', list));
document.getElementById('newsletter').onsubmit = e=>{ e.preventDefault(); alert('Thanks for joining Zoonelibre!'); e.target.reset(); };
document.getElementById('checkout').onclick = ()=>alert('Demo checkout: connect Stripe, PayPal or Shopify before taking real orders.');

initFilters(); list(); renderCart();
