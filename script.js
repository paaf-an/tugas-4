/* ── DATA ── */
const allProducts = [
  { id:1, name:'Luxury Chair',      cat:'Chair', price:'Rp 4.500.000', img:'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=600', modal:'modal1' },
  { id:2, name:'Modern Lamp',       cat:'Lamp',  price:'Rp 1.200.000', img:'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600', modal:'modal2' },
  { id:3, name:'Premium Sofa',      cat:'Sofa',  price:'Rp 12.500.000',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600', modal:'' },
  { id:4, name:'Oak Dining Table',  cat:'Table', price:'Rp 7.800.000', img:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600', modal:'' },
  { id:5, name:'Velvet Armchair',   cat:'Chair', price:'Rp 5.900.000', img:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600', modal:'' },
  { id:6, name:'Pendant Light',     cat:'Lamp',  price:'Rp 2.300.000', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600', modal:'' },
  { id:7, name:'L-Shape Sofa',      cat:'Sofa',  price:'Rp 18.000.000',img:'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=600', modal:'' },
  { id:8, name:'Decorative Vase',   cat:'Decor', price:'Rp 450.000',   img:'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=600', modal:'' },
  { id:9, name:'Marble Coffee Table',cat:'Table', price:'Rp 6.200.000',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600', modal:'' },
];

let cart = [];

/* ── PAGE NAVIGATION ── */
function showPage(page){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const navEl = document.getElementById('nav-'+page);
  if(navEl) navEl.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});

  // close mobile menu
  const menu = document.getElementById('navMenu');
  if(menu.classList.contains('show')){
    bootstrap.Collapse.getInstance(menu)?.hide();
  }

  if(page === 'products') renderProducts('All');
}

/* ── PRODUCTS RENDER ── */
function renderProducts(cat){
  const grid = document.getElementById('productsGrid');
  const filtered = cat === 'All' ? allProducts : allProducts.filter(p => p.cat === cat);
  grid.innerHTML = filtered.map(p => `
    <div class="product-item" onclick="${p.modal ? `document.getElementById('${p.modal}').dispatchEvent(new Event('click'))` : `addToCart('${p.name}','${p.price}')`}">
      <img src="${p.img}&auto=format&fit=crop" alt="${p.name}" loading="lazy">
      <div class="product-item-body">
        <span style="font-size:11px;letter-spacing:3px;color:#bbb">${p.cat.toUpperCase()}</span>
        <h5>${p.name}</h5>
        <p>Premium minimalist design</p>
        <div class="d-flex align-items-center justify-content-between">
          <span class="price">${p.price}</span>
          <button class="btn-custom py-2 px-3" style="font-size:12px" onclick="event.stopPropagation();addToCart('${p.name}','${p.price}')">
            <i class="bi bi-bag-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(btn, cat){
  document.querySelectorAll('#page-products .category-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

/* ── HOME CATEGORY FILTER ── */
function filterCategory(btn, cat){
  document.querySelectorAll('#page-home .category-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cards = document.querySelectorAll('#page-home .product-card[data-category]');
  cards.forEach(c => {
    c.style.display = (cat === 'All' || c.dataset.category === cat) ? '' : 'none';
  });
}

/* ── CART ── */
function addToCart(name, price){
  cart.push({name, price});
  updateCartBadge();
  showToast(`✓ ${name} added to cart`);
  // close any open modal
  document.querySelectorAll('.modal.show').forEach(m => bootstrap.Modal.getInstance(m)?.hide());
}

function updateCartBadge(){
  const count = cart.length;
  ['cartBadge','cartBadgeDesktop'].forEach(id => {
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
}

function openCart(){
  const modal = new bootstrap.Modal(document.getElementById('cartModal'));
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if(cart.length === 0){
    itemsEl.innerHTML = '<p class="text-center text-muted py-4">Your cart is empty.</p>';
    totalEl.textContent = '';
  } else {
    itemsEl.innerHTML = cart.map((item,i) => `
      <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
        <div>
          <p class="mb-0 fw-600">${item.name}</p>
          <small style="color:#d89c4a">${item.price}</small>
        </div>
        <button class="btn btn-sm btn-light rounded-pill px-3" onclick="removeFromCart(${i})">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `).join('');
    totalEl.textContent = `${cart.length} item(s) in cart`;
  }
  modal.show();
}

function removeFromCart(index){
  cart.splice(index,1);
  updateCartBadge();
  openCart();
}

function checkoutCart(){
  if(cart.length === 0){ showToast('Your cart is empty!'); return; }
  bootstrap.Modal.getInstance(document.getElementById('cartModal'))?.hide();
  cart = [];
  updateCartBadge();
  showToast('Order placed! Thank you 🎉');
}

/* ── CONTACT FORM ── */
function sendContactForm(){
  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if(!name || !email || !message){
    showToast('Please fill in all required fields.');
    return;
  }
  if(!/\S+@\S+\.\S+/.test(email)){
    showToast('Please enter a valid email address.');
    return;
  }

  // Reset form
  ['contactName','contactEmail','contactSubject','contactMessage'].forEach(id => {
    document.getElementById(id).value = '';
  });
  showToast('Message sent! We\'ll reply within 24 hours.');
}

/* ── NEWSLETTER ── */
function subscribeNewsletter(){
  const email = document.getElementById('newsletterEmail').value.trim();
  if(!email || !/\S+@\S+\.\S+/.test(email)){
    showToast('Please enter a valid email address.');
    return;
  }
  document.getElementById('newsletterEmail').value = '';
  showToast('Subscribed! Welcome to Mirigine. 🎉');
}

/* ── SEARCH ── */
const searchData = allProducts;
function handleSearch(q){
  const box = document.getElementById('searchResults');
  if(!q.trim()){ box.classList.remove('show'); return; }
  const results = searchData.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  if(results.length === 0){
    box.innerHTML = '<p style="padding:14px;color:#888;font-size:13px;text-align:center">No results found.</p>';
  } else {
    box.innerHTML = results.map(p => `
      <div class="search-result-item" onclick="goToProduct('${p.name}','${p.price}')">
        <img src="${p.img}&w=80&h=80&fit=crop" alt="${p.name}">
        <div><span>${p.name}</span><small>${p.price}</small></div>
      </div>
    `).join('');
  }
  box.classList.add('show');
}
function hideSearch(){ setTimeout(()=> document.getElementById('searchResults').classList.remove('show'), 200); }
function goToProduct(name, price){
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').classList.remove('show');
  showPage('products');
  showToast(`Viewing: ${name}`);
}

/* ── TOAST ── */
function showToast(msg){
  const t = document.getElementById('toastNotif');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 3000);
}

/* ── INTERSECTION OBSERVER (cards) ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card').forEach(c => observer.observe(c));

/* ── INIT ── */
renderProducts('All');
