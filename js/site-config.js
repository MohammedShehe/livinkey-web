/* Livinkey public site — remote configuration.
 * Reads /public/site-config (managed from Admin → Website control) and applies:
 *   announcement banner · maintenance screen · contact & social links · feature switches.
 * Fails silently: if the API is unreachable the site looks exactly as authored in HTML.
 */
(function () {
    'use strict';
    var API = 'https://api.livinkey.com/api/public/site-config';
    var CACHE = 'lk_site_config_v1', TTL = 60 * 1000;
    var OLD = { wa: '919878383497', mail: 'livinkey@gmail.com', ig: 'instagram.com/livinkey', fb: 'facebook.com/livin.key.9' };

    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
    function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : ''; }
    function prettyPhone(d) { d = String(d || '').replace(/\D/g, ''); return d.length === 12 && d.indexOf('91') === 0 ? '+91 ' + d.slice(2, 7) + ' ' + d.slice(7) : (d ? '+' + d : ''); }

    function fetchConfig() {
        try { var c = JSON.parse(sessionStorage.getItem(CACHE) || 'null'); if (c && Date.now() - c.at < TTL) return Promise.resolve(c.data); } catch (e) {}
        var ctl = window.AbortController ? new AbortController() : null;
        var t = setTimeout(function () { ctl && ctl.abort(); }, 4000);
        return fetch(API, { signal: ctl ? ctl.signal : undefined, headers: { Accept: 'application/json' } })
            .then(function (r) { return r.json(); })
            .then(function (j) { clearTimeout(t); var d = j && j.success ? j.data : null; if (d) try { sessionStorage.setItem(CACHE, JSON.stringify({ at: Date.now(), data: d })); } catch (e) {} return d; })
            .catch(function () { clearTimeout(t); return null; });
    }

    function banner(a) {
        if (!a || !a.enabled || !a.text) return;
        var palette = { info: ['#E8F1F9', '#1F5A8A'], success: ['#E9F4E0', '#2F6B17'], warning: ['#FDF3DF', '#8A5A00'], danger: ['#FCECEA', '#A92B22'] }[a.type] || ['#E8F1F9', '#1F5A8A'];
        var el = document.createElement('div');
        el.id = 'lkAnnounce'; el.setAttribute('role', 'status');
        el.style.cssText = 'position:relative;z-index:1100;padding:.55rem 2.6rem .55rem 1rem;text-align:center;font:600 .86rem/1.4 system-ui,sans-serif;background:' + palette[0] + ';color:' + palette[1];
        var link = safeUrl(a.link);
        el.innerHTML = (link ? '<a href="' + esc(link) + '" style="color:inherit;text-decoration:underline">' + esc(a.text) + '</a>' : esc(a.text)) +
            '<button type="button" aria-label="Dismiss" style="position:absolute;right:.6rem;top:50%;transform:translateY(-50%);background:none;border:0;color:inherit;font-size:1.1rem;cursor:pointer;line-height:1">&times;</button>';
        var key = 'lk_ann_' + a.text.length + '_' + a.text.slice(0, 20);
        try { if (sessionStorage.getItem(key)) return; } catch (e) {}
        el.querySelector('button').addEventListener('click', function () { el.remove(); try { sessionStorage.setItem(key, '1'); } catch (e) {} });
        document.body.insertBefore(el, document.body.firstChild);
    }

    function maintenance(m, name) {
        if (!m || !m.enabled) return;
        try { if (/[?&]bypass-maintenance=1/.test(location.search)) sessionStorage.setItem('lk_bypass', '1'); if (sessionStorage.getItem('lk_bypass')) return; } catch (e) {}
        var el = document.createElement('div');
        el.id = 'lkMaintenance';
        el.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:1.5rem;text-align:center;background:#0E1410;color:#fff;font-family:system-ui,sans-serif';
        el.innerHTML = '<div style="max-width:460px"><div style="font-size:2.6rem;color:#92C24A">&#128273;</div><h1 style="font-size:1.7rem;margin:.6rem 0">' + esc(name || 'Livinkey') + ' will be right back</h1><p style="color:rgba(255,255,255,.75);line-height:1.6">' + esc(m.message || 'We are performing scheduled maintenance.') + '</p></div>';
        document.documentElement.style.overflow = 'hidden';
        document.body.appendChild(el);
    }

    function links(cfg) {
        var c = cfg.contact || {}, s = cfg.social || {};
        document.querySelectorAll('a[href]').forEach(function (a) {
            var h = a.getAttribute('href') || '';
            if (c.whatsapp && h.indexOf('wa.me/' + OLD.wa) !== -1) {
                a.setAttribute('href', h.replace(OLD.wa, c.whatsapp.replace(/\D/g, '')));
                if (/98783\s?83497/.test(a.textContent)) a.textContent = prettyPhone(c.whatsapp);
            } else if (c.email && h.indexOf('mailto:' + OLD.mail) === 0) {
                a.setAttribute('href', h.replace(OLD.mail, c.email));
                if (a.textContent.trim() === OLD.mail) a.textContent = c.email;
            } else if (safeUrl(s.instagram) && h.indexOf(OLD.ig) !== -1) a.setAttribute('href', s.instagram);
            else if (safeUrl(s.facebook) && h.indexOf(OLD.fb) !== -1) a.setAttribute('href', s.facebook);
        });
        if (c.phone) document.querySelectorAll('[data-lk-phone]').forEach(function (n) { n.textContent = c.phone; n.setAttribute('href', 'tel:' + c.phone.replace(/[^\d+]/g, '')); });
        if (c.address) document.querySelectorAll('[data-lk-address]').forEach(function (n) { n.textContent = c.address; });
    }

    function features(f) {
        if (!f) return;
        var hide = function (sel) { document.querySelectorAll(sel).forEach(function (n) { n.style.display = 'none'; }); };
        if (f.chatbot === false) hide('#chatbot-container');
        if (f.reviews === false) hide('#detailReviews, .reviews-section');
        if (f.stats === false) document.querySelectorAll('[data-count-to]').forEach(function (n) { var box = n.closest('.stat-box'); if (box) box.style.display = 'none'; });
    }

    function apply(cfg) {
        if (!cfg) return;
        maintenance(cfg.maintenance, cfg.site_name);
        banner(cfg.announcement);
        links(cfg);
        features(cfg.features);
    }

    function run() { fetchConfig().then(apply); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
