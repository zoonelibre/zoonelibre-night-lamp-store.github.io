
const PRODUCTS = window.ZOONELIBRE_PRODUCTS || [];
const grid = document.getElementById('products');
const search = document.getElementById('search');
const category = document.getElementById('category');
const color = document.getElementById('color');
const sort = document.getElementById('sort');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const productModal = document.getElementById('productModal');

let cart = JSON.parse(localStorage.getItem('zoonelibre-cart') || '[]');

function money(n){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n); }

function renderFilters(){
  const cats = [...new Set(PRODUCTS.map(p=>p.category))].sort();
  const cols = [...new Set(PRODUCTS.map(p=>p.color))].sort();
  category.innerHTML = '<option value="">All categories</option>' + cats.map(x=>`<option>${x}</option>`).join('');
  color.innerHTML = '<option value="">All colors</option>' + cols.map(x=>`<option>${x}</option>`).join('');
}

function getFiltered(){
  let items = PRODUCTS.filter(p=>{
    const q = search.value.trim().toLowerCase();
    return (!q || `${p.name} ${p.variant} ${p.brand} ${p.category} ${p.color} ${p.type}`.toLowerCase().includes(q))
      && (!category.value || p.category===category.value)
      && (!color.value || p.color===color.value);
  });
  if(sort.value==='low') items.sort((a,b)=>a.price-b.price);
  if(sort.value==='high') items.sort((a,b)=>b.price-a.price);
  if(sort.value==='name') items.sort((a,b)=>a.name.localeCompare(b.name));
  return items;
}

function card(p){
  const deal = p.compare ? `<span class="compare">${money(p.compare)}</span>` : '';
  return `
  <article class="card">
    <div class="photo" data-view="${p.id}">
      <img loading="lazy" src="${p.image}" alt="${p.name} ${p.variant}" onerror="this.onerror=null;this.src='assets/fallback-product.svg'">
      <span class="badge">${p.category}</span>
      <button class="wish" title="Save item" aria-label="Save item">♡</button>
    </div>
    <div class="body">
      <div class="brandline">${p.brand}</div>
      <h3>${p.name}</h3>
      <div class="variant">${p.variant}</div>
      <p class="desc">${p.desc}</p>
      <div class="chips"><span class="chip">${p.color}</span><span class="chip">${p.type}</span></div>
      <div class="price-row">
        <div class="price"><strong>${money(p.price)}</strong>${deal}</div>
        <button class="add" data-add="${p.id}">Add</button>
      </div>
      <div class="source">Reference price · <a href="${p.url}" target="_blank" rel="noopener">View source</a></div>
    </div>
  </article>`;
}

function render(){
  const items = getFiltered();
  grid.innerHTML = items.length ? items.map(card).join('') : '<div class="empty">No lamps match your filters.</div>';
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>addToCart(b.dataset.add));
  document.querySelectorAll('[data-view]').forEach(el=>el.onclick=(e)=>{
    if(e.target.classList.contains('wish')) return;
    openProduct(el.dataset.view);
  });
  document.querySelectorAll('.wish').forEach(b=>b.onclick=(e)=>{
    e.stopPropagation(); b.textContent = b.textContent==='♡' ? '♥' : '♡';
  });
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  const found = cart.find(x=>x.id===id);
  found ? found.qty++ : cart.push({id,qty:1});
  saveCart(); renderCart();
  cartDrawer.classList.add('open');
}
function saveCart(){ localStorage.setItem('zoonelibre-cart',JSON.stringify(cart)); }
function renderCart(){
  let total=0, count=0;
  cartItems.innerHTML = cart.map(row=>{
    const p=PRODUCTS.find(x=>x.id===row.id); if(!p) return '';
    total += p.price*row.qty; count += row.qty;
    return `<div class="cart-item"><div><b>${p.name}</b><br><small>${p.variant} · Qty ${row.qty}</small><br><button class="remove" data-remove="${p.id}">Remove</button></div><strong>${money(p.price*row.qty)}</strong></div>`;
  }).join('') || '<p>Your cart is empty.</p>';
  cartTotal.textContent=money(total); cartCount.textContent=count;
  document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{
    cart=cart.filter(x=>x.id!==b.dataset.remove); saveCart(); renderCart();
  });
}
function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
  productModal.innerHTML = `<div class="modal-card">
    <button class="modal-close" id="modalClose">×</button>
    <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/fallback-product.svg'">
    <div class="modal-content">
      <div class="brandline">${p.brand}</div>
      <h2>${p.name}</h2>
      <h3>${p.variant}</h3>
      <p>${p.desc}</p>
      <div class="chips"><span class="chip">${p.category}</span><span class="chip">${p.color}</span><span class="chip">${p.type}</span></div>
      <h2>${money(p.price)} ${p.compare?`<span class="compare">${money(p.compare)}</span>`:''}</h2>
      <button class="btn btn-primary" data-modal-add="${p.id}">Add to Cart</button>
      <a class="btn" style="margin-left:6px;background:#f0f1f6" href="${p.url}" target="_blank" rel="noopener">Official Source</a>
      <p class="disclaimer">Price shown is a current retail reference captured for this demo storefront and can change at the retailer. Verify price, stock, resale rights and fulfillment before accepting customer payment.</p>
    </div>
  </div>`;
  productModal.classList.add('open');
  document.getElementById('modalClose').onclick=()=>productModal.classList.remove('open');
  productModal.querySelector('[data-modal-add]').onclick=()=>addToCart(p.id);
}

[search,category,color,sort].forEach(el=>el.addEventListener('input',render));
document.getElementById('cartOpen').onclick=()=>cartDrawer.classList.add('open');
document.getElementById('cartClose').onclick=()=>cartDrawer.classList.remove('open');
cartDrawer.onclick=e=>{if(e.target===cartDrawer)cartDrawer.classList.remove('open')};
productModal.onclick=e=>{if(e.target===productModal)productModal.classList.remove('open')};
document.getElementById('checkout').onclick=()=>alert('Demo checkout: connect Stripe, PayPal, Shopify or another payment provider before accepting real orders.');
document.getElementById('newsletter').onsubmit=e=>{e.preventDefault();alert('Thanks for joining Zoonelibre!');e.target.reset();}

renderFilters(); render(); renderCart();
