// cart.js — shared shopping cart logic, used on every page
const CART_KEY = 'swashiv_cart';

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }catch(e){ return []; }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product){
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name);
  if(existing){
    existing.qty += 1;
  }else{
    cart.push({ name: product.name, price: product.price, image: product.image, category: product.category, qty: 1 });
  }
  saveCart(cart);
}

function removeFromCart(index){
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateQty(index, qty){
  const cart = getCart();
  if(qty <= 0){
    cart.splice(index, 1);
  }else{
    cart[index].qty = qty;
  }
  saveCart(cart);
}

function getCartCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal(){
  return getCart().reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
}

function updateCartBadge(){
  const badge = document.getElementById('cartBadge');
  if(badge){
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
