const defaultNFTs = [
    { id: 1, name: "Cyber Forest Dreams", price: 120, category: "Art", creator: "PixelMaster", img: "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?w=800", likes: 142, comments: [] },
    { id: 2, name: "Neon Mountain Peak", price: 85, category: "Collectibles", creator: "Alpinist_Q", img: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?w=800", likes: 98, comments: [] },
    { id: 3, name: "Galaxy Waterfall", price: 210, category: "Art", creator: "CyberNature", img: "https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?w=800", likes: 310, comments: [] },
    { id: 4, name: "Digital Ocean Ridge", price: 65, category: "Games", creator: "AbyssWatcher", img: "https://images.pexels.com/photos/1226302/pexels-photo-1226302.jpeg?w=800", likes: 74, comments: [] },
    { id: 5, name: "Cosmic Butterfly", price: 150, category: "Art", creator: "DreamWeaver", img: "https://images.pexels.com/photos/87611/butterfly-insects-animal-wings-87611.jpeg?w=800", likes: 256, comments: [] },
    { id: 6, name: "Future City 3000", price: 320, category: "Collectibles", creator: "NeoArtist", img: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?w=800", likes: 489, comments: [] }
];

if (!localStorage.getItem('nfts')) {
    localStorage.setItem('nfts', JSON.stringify(defaultNFTs));
}
if (!localStorage.getItem('myNfts')) {
    localStorage.setItem('myNfts', JSON.stringify([]));
}

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let authMode = 'register';

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function switchPage(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${pageId}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }

    if (pageId === 'catalog') renderCatalog();
    if (pageId === 'my-nfts') renderMyNFTs();
}

function renderCatalog() {
    const nfts = JSON.parse(localStorage.getItem('nfts'));
    const grid = document.getElementById('catalog-grid');
    const searchVal = document.getElementById('search-input').value.toLowerCase();
    
    grid.innerHTML = '';
    const filtered = nfts.filter(item => item.name.toLowerCase().includes(searchVal));
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; grid-column:1/-1;">No NFTs found 🔍</p>';
        return;
    }
    
    filtered.forEach(item => {
        grid.innerHTML += `
            <div class="nft-card" onclick="viewDetails(${item.id})">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?w=800'">
                <h3>${item.name}</h3>
                <p>Category: ${item.category}</p>
                <p style="color: var(--accent-green); margin-top: 8px; font-weight: 700;">${item.price} QUBE</p>
                <div style="display:flex; justify-content:space-between; margin-top:12px; font-size:14px;">
                    <span>❤️ ${item.likes}</span>
                    <span>👤 ${item.creator}</span>
                </div>
            </div>
        `;
    });
}

function viewDetails(id) {
    const nfts = JSON.parse(localStorage.getItem('nfts'));
    const item = nfts.find(x => x.id === id);
    if (!item) return;
    
    switchPage('nft-details');
    
    const container = document.getElementById('nft-detail-content');
    let commentsHTML = (item.comments || []).map(c => `
        <div style="margin-bottom:12px; padding:12px; background: rgba(0,0,0,0.2); border-radius:12px;">
            <span style="color: var(--accent-green); font-weight:600;">@${c.user}</span>
            <p style="margin-top:6px;">${c.text}</p>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div style="display:flex; gap:40px; flex-wrap: wrap; margin-top: 20px;">
            <img src="${item.img}" style="max-width:450px; width:100%; border-radius:24px; object-fit:cover; height: auto; max-height: 450px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);" onerror="this.src='https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?w=800'">
            <div style="flex: 1; min-width: 280px;">
                <h2 style="font-size:42px; margin-bottom:16px;">${item.name}</h2>
                <p style="color:var(--text-muted); margin-bottom:8px;">Creator: <span style="color:var(--accent-green); font-weight:600;">${item.creator}</span></p>
                <p style="color:var(--text-muted); margin-bottom:24px;">Category: ${item.category}</p>
                
                <div style="background: rgba(0,0,0,0.3); padding:28px; border-radius:20px; border:1px solid var(--border-color); margin-bottom:30px;">
                    <p style="color:var(--text-muted); font-size:14px;">Current Price</p>
                    <h3 style="font-size:32px; color:var(--accent-green); margin: 10px 0 20px 0;">${item.price} QUBE</h3>
                    ${currentUser ? `<button onclick="buyNFT(${item.id})" class="btn-primary" style="width:100%;">💎 Buy Now</button>` : '<p style="color:var(--text-muted); text-align:center;">🔐 Sign in to buy this asset</p>'}
                </div>

                <button onclick="likeNFT(${item.id})" class="btn-secondary" style="margin-bottom:30px;">❤️ Vote (${item.likes})</button>
                
                <div class="comments-section">
                    <h3 style="margin-bottom:20px;">💬 Comments (${(item.comments || []).length})</h3>
                    <div class="comments-list" style="max-height:250px; overflow-y:auto; margin-bottom:20px;">${commentsHTML || '<p style="color:var(--text-muted); text-align:center;">No comments yet. Be the first! 💬</p>'}</div>
                    ${currentUser ? `
                        <div style="display:flex; gap:12px;">
                            <input type="text" id="new-comment-text" placeholder="Write a comment..." style="flex:1; background:var(--input-bg); border:1px solid var(--border-color); padding:12px 16px; border-radius:50px; color:white;">
                            <button onclick="addComment(${item.id})" class="btn-primary" style="padding:12px 24px;">Send</button>
                        </div>
                    ` : '<p style="color:var(--text-muted); text-align:center;">🔐 Sign in to leave comments</p>'}
                </div>
            </div>
        </div>
    `;
}

function likeNFT(id) {
    let nfts = JSON.parse(localStorage.getItem('nfts'));
    const item = nfts.find(x => x.id === id);
    if (item) {
        item.likes += 1;
        localStorage.setItem('nfts', JSON.stringify(nfts));
        viewDetails(id);
    }
}

function addComment(id) {
    const text = document.getElementById('new-comment-text').value;
    if (!text.trim()) return;

    let nfts = JSON.parse(localStorage.getItem('nfts'));
    const item = nfts.find(x => x.id === id);
    if (item) {
        if (!item.comments) item.comments = [];
        item.comments.push({ user: currentUser.login, text: text.trim() });
        localStorage.setItem('nfts', JSON.stringify(nfts));
        document.getElementById('new-comment-text').value = '';
        viewDetails(id);
    }
}

function buyNFT(id) {
    let nfts = JSON.parse(localStorage.getItem('nfts'));
    let myNfts = JSON.parse(localStorage.getItem('myNfts'));
    
    const item = nfts.find(x => x.id === id);
    
    if (!myNfts.some(x => x.id === id)) {
        myNfts.push(JSON.parse(JSON.stringify(item)));
        localStorage.setItem('myNfts', JSON.stringify(myNfts));
        alert(`✅ Success! "${item.name}" added to your collection.`);
        switchPage('my-nfts');
        renderMyNFTs();
    } else {
        alert("⚠️ You already own this NFT.");
    }
}

function renderMyNFTs() {
    const myNfts = JSON.parse(localStorage.getItem('myNfts'));
    const grid = document.getElementById('my-nfts-grid');
    grid.innerHTML = '';

    if (myNfts.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; grid-column:1/-1;">🎨 You don\'t own any NFTs yet. Browse the catalog!</p>';
        return;
    }

    myNfts.forEach(item => {
        grid.innerHTML += `
            <div class="nft-card" onclick="viewDetails(${item.id})">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?w=800'">
                <h3>${item.name}</h3>
                <p style="color: var(--accent-green); font-weight: 700;">${item.price} QUBE</p>
                <p style="color:var(--text-muted); font-size:12px;">Owned by you ✅</p>
            </div>
        `;
    });
}

function toggleModal(modalId, show) {
    document.getElementById(modalId).classList.toggle('hidden', !show);
}

function switchAuthMode() {
    authMode = authMode === 'register' ? 'login' : 'register';
    document.getElementById('modal-title').innerText = authMode === 'register' ? '✨ Register' : '🔑 Login';
    document.getElementById('auth-submit-btn').innerText = authMode === 'register' ? 'Register' : 'Login';
    document.getElementById('switch-auth-mode').innerText = authMode === 'register' ? 'Already have an account? Login →' : 'New here? Register →';
}

function openAuth() {
    if (currentUser) {
        if (confirm(`Logout ${currentUser.login}?`)) {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthUI();
            switchPage('catalog');
        }
    } else {
        toggleModal('auth-modal', true);
        document.getElementById('auth-login').value = '';
        document.getElementById('auth-password').value = '';
    }
}

function updateAuthUI() {
    const btn = document.getElementById('sidebar-auth-btn');
    if (currentUser) {
        btn.innerHTML = `👤 ${currentUser.login} ↓`;
    } else {
        btn.innerHTML = "🔐 Login/Register";
    }
}

document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('auth-login').value.trim();
    if (!login) {
        alert("Please enter a username");
        return;
    }
    currentUser = { login: login };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    toggleModal('auth-modal', false);
    updateAuthUI();
    renderCatalog();
    alert(`🎉 Welcome ${login}!`);
});

document.getElementById('create-nft-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) {
        alert("🔐 Please login first to create NFTs!");
        openAuth();
        return;
    }
    
    let nfts = JSON.parse(localStorage.getItem('nfts'));
    
    const imgUrl = document.getElementById('nft-img-url').value.trim();
    const nftName = document.getElementById('nft-name').value.trim();
    const nftPrice = parseFloat(document.getElementById('nft-price').value);
    
    if (!nftName || !imgUrl || isNaN(nftPrice)) {
        alert("⚠️ Please fill all required fields!");
        return;
    }
    
    const newNFT = {
        id: Date.now(),
        name: nftName,
        price: nftPrice,
        category: document.getElementById('nft-category').value,
        creator: currentUser.login,
        img: imgUrl,
        likes: 0,
        comments: []
    };

    nfts.push(newNFT);
    localStorage.setItem('nfts', JSON.stringify(nfts));
    document.getElementById('create-nft-form').reset();
    alert(`🚀 "${nftName}" created successfully!`);
    switchPage('catalog');
    renderCatalog();
});

document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('profile-username').value;
    const bio = document.getElementById('profile-bio').value;
    if (currentUser) {
        if (!currentUser.profile) currentUser.profile = {};
        if (username) currentUser.profile.username = username;
        if (bio) currentUser.profile.bio = bio;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    alert("💾 Profile saved successfully!");
    document.getElementById('profile-username').value = '';
    document.getElementById('profile-bio').value = '';
});

renderCatalog();
updateAuthUI();