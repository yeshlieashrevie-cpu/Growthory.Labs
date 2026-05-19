const supabase = window.supabase.createClient(
    'https://wtljgekzjufyddnrgmbq.supabase.co/rest/v1/',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bGpnZWt6anVmeWRkbnJnbWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODIxNTksImV4cCI6MjA5NDc1ODE1OX0.t6a-ueTua16pgNOrJumVtZZ9W5_MptWDThCnb5KNIoU'
var maxReachedPage = 1;
var currentPage = 1;

function handleNavClick(n) {
    if (n <= maxReachedPage) {
        showPage(n);
    } else {
        var step = document.getElementById('nav-' + n);
        step.classList.add('pulse-red');
        setTimeout(() => {
            step.classList.remove('pulse-red');
        }, 1000);
    }
}

function showPage(n) {
    currentPage = n;
    if (n > maxReachedPage) maxReachedPage = n;
    
    document.querySelectorAll('.page').forEach((p) => {
        p.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-step').forEach((s) => {
        s.classList.remove('active');
        var num = parseInt(s.id.replace('nav-', ''));
        if (num < n) {
            s.classList.add('done');
        } else {
            s.classList.remove('done');
        }
    });
    
    document.getElementById('page-' + n).classList.add('active');
    
    var ns = document.getElementById('nav-' + n);
    if (ns) ns.classList.add('active');
    
    var fills = { 1: '25%', 2: '50%', 3: '75%', 4: '100%', 5: '100%' };
    document.getElementById('progress').style.width = fills[n] || '25%';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage3() {
    var req = ['fname', 'lname', 'email', 'phone', 'city'];
    for (var i = 0; i < req.length; i++) {
        var el = document.getElementById(req[i]);
        if (!el.value.trim()) {
            el.focus();
            el.style.borderColor = '#7D39EB';
            setTimeout(() => { el.style.borderColor = ''; }, 2000);
            return;
        }
    }
    showPage(3);
}

function goToPage4() {
    var req = ['cafe-name', 'cafe-location', 'target-audience', 'usp', 'primary-goal'];
    for (var i = 0; i < req.length; i++) {
        var el = document.getElementById(req[i]);
        if (!el.value.trim()) {
            el.focus();
            el.style.borderColor = '#7D39EB';
            setTimeout(() => { el.style.borderColor = ''; }, 2000);
            return;
        }
    }
    showPage(4);
}

function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(function() {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.color = '#000000';
        btn.style.background = '#C6FF33';
        setTimeout(function() {
            btn.textContent = orig;
            btn.style.color = '';
            btn.style.background = '';
        }, 1500);
    });
}

/* ===================================== */
/* SCROLL REVEAL ANIMATIONS              */
/* ===================================== */

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => { entry.target.classList.add('show'); });
        } else {
            entry.target.classList.remove('show');
        }
    });
}, { threshold: 0.22 });

document.querySelectorAll('.deliverable').forEach((el) => { observer.observe(el); });
document.querySelectorAll('.timeline-step').forEach((el) => { observer.observe(el); });
document.querySelectorAll('.agreement-box').forEach((el) => { observer.observe(el); });
document.querySelectorAll('.privacy-note').forEach((el) => { observer.observe(el); });

const timeline = document.querySelector('.timeline');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            timeline.classList.add('show-line');
        } else {
            timeline.classList.remove('show-line');
        }
    });
}, { threshold: 0.15 });
timelineObserver.observe(timeline);

/* ===================================== */
/* AUTO EXPANDING TEXTAREAS              */
/* ===================================== */

function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

document.querySelectorAll('#page-3 textarea').forEach((textarea) => {
    autoResizeTextarea(textarea);
    textarea.addEventListener('input', function() { autoResizeTextarea(this); });
});

/* ===================================== */
/* PAYMONGO CHECKOUT                     */
/* ===================================== */

/*
 * HOW TO SET UP:
 * 1. Log in to your PayMongo dashboard (dashboard.paymongo.com)
 * 2. Go to Payment Links → Create Link
 * 3. Set amount to ₱1,200, add description "Café Content Starter Pack"
 * 4. Copy the link URL and paste it below as PAYMONGO_PAYMENT_LINK
 *
 * The button will redirect the customer to your PayMongo-hosted
 * checkout page where they can pay via GCash, Maya, card, or bank.
 * After payment, PayMongo redirects them back to your success URL
 * (set that in your Payment Link settings to your page's URL + ?success=1).
 */

var PAYMONGO_PAYMENT_LINK = 'https://checkout.paymongo.com/links/REPLACE_WITH_YOUR_LINK';

document.getElementById('paymongo-btn').addEventListener('click', function() {
    
    var btn = this;
    
    // Collect customer name and email from the form to append as query params
    // so PayMongo can pre-fill the checkout form (optional but helpful)
    var fname = document.getElementById('fname') ? document.getElementById('fname').value.trim() : '';
    var lname = document.getElementById('lname') ? document.getElementById('lname').value.trim() : '';
    var email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
    
    // Show loading state on button
    btn.textContent = 'Redirecting to checkout...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    // Build URL — PayMongo payment links accept ?email= to pre-fill
    var checkoutUrl = PAYMONGO_PAYMENT_LINK;
    if (email) {
        checkoutUrl += (checkoutUrl.includes('?') ? '&' : '?') + 'email=' + encodeURIComponent(email);
    }
    
    // Short delay so the user sees the button state change, then redirect
    setTimeout(function() {
        window.location.href = checkoutUrl;
    }, 400);
});

/* Handle return from PayMongo (success redirect) */
(function checkPaymentReturn() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
        // Clear the query string cleanly
        history.replaceState({}, '', window.location.pathname);
        showPage(5);
    }
})();
