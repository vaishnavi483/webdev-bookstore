(function(){
  'use strict';
  const CART_KEY='glbajaj_cart',USERS_KEY='glbajaj_users',SESSION_KEY='glbajaj_session';
  const BOOKS=[
    {id:'cse-1',category:'CSE',title:'XML Bible',author:'Winston',price:499,cover:'covers/cse1.svg'},
    {id:'cse-2',category:'CSE',title:'Artificial Intelligence',author:'S. Russell',price:699,cover:'covers/cse2.svg'},
    {id:'cse-3',category:'CSE',title:'Java 2',author:'Watson',price:549,cover:'covers/cse3.svg'},
    {id:'cse-4',category:'CSE',title:'HTML in 24 Hours',author:'Sam Peter',price:399,cover:'covers/cse4.svg'},
    {id:'ece-1',category:'ECE',title:'Digital Design',author:'M. Morris Mano',price:599,cover:'covers/ece1.svg'},
    {id:'ece-2',category:'ECE',title:'Microelectronic Circuits',author:'Sedra & Smith',price:799,cover:'covers/ece2.svg'},
    {id:'ece-3',category:'ECE',title:'Signals and Systems',author:'Oppenheim',price:649,cover:'covers/ece3.svg'},
    {id:'ece-4',category:'ECE',title:'Communication Systems',author:'Simon Haykin',price:749,cover:'covers/ece4.svg'},
    {id:'eee-1',category:'EEE',title:'Electrical Machines',author:'P. S. Bimbhra',price:599,cover:'covers/eee1.svg'},
    {id:'eee-2',category:'EEE',title:'Power System Analysis',author:'Hadi Saadat',price:699,cover:'covers/eee2.svg'},
    {id:'eee-3',category:'EEE',title:'Control Systems Engineering',author:'Nagrath & Gopal',price:649,cover:'covers/eee3.svg'},
    {id:'eee-4',category:'EEE',title:'Power Electronics',author:'M. H. Rashid',price:749,cover:'covers/eee4.svg'},
    {id:'civil-1',category:'Civil',title:'Strength of Materials',author:'R. K. Bansal',price:599,cover:'covers/civil1.svg'},
    {id:'civil-2',category:'Civil',title:'Surveying Vol. 1',author:'B. C. Punmia',price:499,cover:'covers/civil2.svg'},
    {id:'civil-3',category:'Civil',title:'Concrete Technology',author:'M. S. Shetty',price:549,cover:'covers/civil3.svg'},
    {id:'civil-4',category:'Civil',title:'Soil Mechanics',author:'B. C. Punmia',price:599,cover:'covers/civil4.svg'}
  ];
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch(_){return f}}
  function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function cart(){return read(CART_KEY,[]).filter(item=>BOOKS.some(book=>book.id===item.id))}
  function session(){return read(SESSION_KEY,null)}
  function money(v){return '₹'+Number(v).toFixed(2)}
  function id(v){return document.getElementById(v)}
  window.BookStore={addToCart(book){const c=cart(),x=c.find(i=>i.id===book.id);if(x)x.quantity++;else c.push({...book,quantity:1});write(CART_KEY,c);badges();renderCart();window.alert(book.title+' was added to your cart.')},clearCart(){localStorage.removeItem(CART_KEY);renderCart();badges()},logout(){localStorage.removeItem(SESSION_KEY);window.location.href='index.html'}};
  function badges(){const n=cart().reduce((s,i)=>s+i.quantity,0);document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=n);document.querySelectorAll('[data-auth-action]').forEach(e=>{const u=session();e.textContent=u?'Logout':'Login';e.onclick=u?ev=>{ev.preventDefault();BookStore.logout()}:null;if(u)e.href='#logout'})}
  function renderBooks(){const target=id('book-grid');if(!target)return;const category=document.body.dataset.category||'all';const books=category==='all'?BOOKS:BOOKS.filter(book=>book.category.toLowerCase()===category.toLowerCase());const empty=id('books-empty');if(!books.length){target.hidden=true;if(empty)empty.hidden=false;return}if(empty)empty.hidden=true;target.hidden=false;target.innerHTML=books.map(book=>`<article class="book-card"><img class="book-cover" src="${book.cover}" alt="${book.title} cover"><div class="content"><h3>${book.title}</h3><p>${book.author}</p><p>${book.category}</p><div class="price">${money(book.price)}</div><button class="button" type="button" data-add-book="${book.id}">Add to cart</button></div></article>`).join('');target.querySelectorAll('[data-add-book]').forEach(button=>button.addEventListener('click',()=>{const book=BOOKS.find(item=>item.id===button.dataset.addBook);if(book)BookStore.addToCart(book)}))}
  function renderCart(){const b=id('cart-items');if(!b)return;const c=cart(),empty=id('cart-empty'),content=id('cart-content');if(!c.length){if(empty)empty.hidden=false;if(content)content.hidden=true;return}if(empty)empty.hidden=true;if(content)content.hidden=false;b.innerHTML=c.map(i=>`<tr><td>${i.title}</td><td>${i.author||'—'}</td><td>${money(i.price)}</td><td><input class="quantity" type="number" min="1" value="${i.quantity}" data-quantity="${i.id}" aria-label="Quantity for ${i.title}"></td><td>${money(i.price*i.quantity)}</td><td><button class="button danger" type="button" data-remove="${i.id}">Remove</button></td></tr>`).join('');const total=c.reduce((s,i)=>s+i.price*i.quantity,0);id('cart-count-total').textContent=c.reduce((s,i)=>s+i.quantity,0);id('cart-total').textContent=money(total);b.querySelectorAll('[data-remove]').forEach(q=>q.addEventListener('click',()=>{write(CART_KEY,cart().filter(i=>i.id!==q.dataset.remove));renderCart();badges()}));b.querySelectorAll('[data-quantity]').forEach(q=>q.addEventListener('change',()=>{const n=cart(),i=n.find(x=>x.id===q.dataset.quantity);if(i)i.quantity=Math.max(1,Number(q.value)||1);write(CART_KEY,n);renderCart();badges()}))}
  function message(i,m,error){const e=id(i);if(e){e.hidden=false;e.textContent=m;e.className='notice'+(error?' error':'')}}
  function forms(){const r=id('registration-form');if(r)r.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(r).entries());if(!d.name||!d.email||!d.password||d.password.length<6)return message('registration-message','Enter your name, email, and a password of at least 6 characters.',true);const u=read(USERS_KEY,[]);if(u.some(x=>x.email.toLowerCase()===d.email.toLowerCase()))return message('registration-message','An account with this email already exists.',true);u.push({name:d.name.trim(),email:d.email.trim(),password:d.password});write(USERS_KEY,u);message('registration-message','Registration successful. You can now log in.');r.reset()});const l=id('login-form');if(l)l.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(l).entries()),u=read(USERS_KEY,[]).find(x=>x.email.toLowerCase()===d.email.toLowerCase()&&x.password===d.password);if(!u)return message('login-message','Invalid email or password.',true);write(SESSION_KEY,{name:u.name,email:u.email});message('login-message','Login successful. Welcome, '+u.name+'!');l.reset();badges()});const ch=id('checkout-button');if(ch)ch.addEventListener('click',()=>{if(!session())return message('checkout-message','Please log in before checking out.',true);if(!cart().length)return;window.alert('Order placed successfully. Thank you for shopping with us!');BookStore.clearCart()})}
  function removeNestedHeader(){
    if(window.name==='f3')document.querySelector('.topbar')?.remove();
  }
  function keepNavigationInsideMainFrame(){
    if(window.self===window.top)return;
    document.querySelectorAll('a[href$=".html"]').forEach(link=>{
      if(!link.target)link.target='f3';
    });
  }
  window.addEventListener('storage',badges);
  document.addEventListener('DOMContentLoaded',()=>{removeNestedHeader();badges();renderBooks();renderCart();forms();keepNavigationInsideMainFrame()});
}());
