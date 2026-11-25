/* Impor Cookie Muse2API —— membaca cookie muse.ai lalu POST ke layanan muse2api.
 *
 * Poin penting: pakai chrome.cookies, bukan document.cookie.
 * Cookie sesi penting muse.ai (hatch_sess / hatch_vml) bertanda httpOnly,
 * tidak bisa dibaca JS halaman web, hanya bisa diambil lewat antarmuka cookies ekstensi browser.
 * hatch_gw adalah cache routing yang bisa diterbitkan ulang, tidak boleh menghalangi impor akun.
 */

const $ = (id) => document.getElementById(id);
const STORE = 'muse2api_ext_cfg';

const ESSENTIAL = ['hatch_sess'];

/* ================= Bahasa antarmuka / UI language =================
 * Bahasa Indonesia adalah bahasa sumber; Inggris diganti lewat kamus di bawah.
 * Saat menambah teks Indonesia baru, tambahkan bahasa Inggrisnya di I18N_EN (kalimat utuh, boleh mengandung placeholder {name}) atau I18N_EN_PATTERNS (teks dari server yang mengandung variabel). */
const LANG_STORE = 'muse2api_lang';
const LANG = (() => {
  try { const v = localStorage.getItem(LANG_STORE); if (v === 'id' || v === 'en') return v; } catch (e) {}
  return /^en\b/i.test(navigator.language || '') ? 'en' : 'id';
})();
function setLang(v) {
  try { localStorage.setItem(LANG_STORE, v); } catch (e) {}
  location.reload();
}

/* Kalimat utuh: Indonesia → Inggris */
const I18N_EN = {
  // popup.html teks statis
  'Impor Cookie Muse2API': 'Muse2API Cookie Import',
  'Sinkronkan sesi login muse.ai dari browser ini ke layanan muse2api Anda dalam sekali klik.':
    'Sync the muse.ai login session from this browser to your muse2api service in one click.',
  'Alamat Layanan (BASE URL)': 'Service URL (BASE URL)',
  'Label Akun (opsional)': 'Account label (optional)',
  'mis. muse-main': 'e.g. muse-main',
  'Baca dan Impor': 'Read and import',
  // popup.js log / status
  'Isi alamat layanan dulu': 'Please enter the service URL first',
  'Isi API Key dulu': 'Please enter the API Key first',
  'Membaca Cookie muse.ai…': 'Reading muse.ai cookies…',
  'Tidak dapat memastikan penyimpanan Cookie jendela saat ini. Buka ekstensi di jendela tempat Anda masuk ke Muse, dan pastikan ekstensi diizinkan berjalan dalam mode Samaran/Pribadi.':
    'Cannot identify the current window\'s cookie store. Open the extension in the window signed in to Muse, and allow it in Incognito/InPrivate mode if needed.',
  'Membaca Cookie muse.ai dari jendela {window} saat ini…': 'Reading muse.ai cookies from the current {window} window…',
  'Mode Samaran/Pribadi': 'Incognito/InPrivate',
  'Biasa': 'regular',
  '\nSumber Cookie: jendela {window} saat ini. Impor hanya menyimpan sesi login, silakan uji akun di halaman admin.':
    '\nCookie source: current {window} window. Import only saves the session; test the account on the admin page.',
  'Tidak menemukan Cookie muse.ai.\nBuka dan masuk ke https://muse.ai/ di browser ini dulu, lalu klik lagi.':
    'No muse.ai cookies found.\nOpen and log in to https://muse.ai/ in this browser first, then click again.',
  'Membaca {n} Cookie, tetapi ada item inti yang hilang: {missing}\nSesi login tidak terbaca, periksa status login browser ini dan izin ekstensi.':
    'Read {n} cookies, but missing core items such as: {missing}\nThe login session could not be read. Check this browser\'s login and extension permissions.',
  'Membaca {n} Cookie, mengunggah ke {base} …': 'Read {n} cookies, uploading to {base} …',
  'API Key salah (layanan mengembalikan 401).\nSalin API Key yang benar dari bagian atas tab "Kumpulan Akun" di halaman admin.':
    'Invalid API Key (the service returned 401).\nCopy the correct API Key from the top of the "Account Pool" tab on the admin page.',
  'Impor gagal: HTTP {status}\n{body}': 'Import failed: HTTP {status}\n{body}',
  '(otomatis)': '(auto)',
  'Tidak diketahui': 'unknown',
  '✓ Impor berhasil\nLabel akun: {label}\nID akun: {id}\nJumlah Cookie: {count}\nBerlaku sampai: {expires}\n':
    '✓ Imported successfully\nAccount label: {label}\nAccount ID: {id}\nCookie count: {count}\nValid until: {expires}\n',
  '\nPerhatian: {warning}': '\nNote: {warning}',
  'Terjadi kesalahan: {msg}\n\nPenyebab umum:\n· Alamat layanan salah atau layanan belum berjalan\n· Alamat ini bukan https (atau sertifikatnya tidak dipercaya)\n· Browser memblokir permintaan lintas origin':
    'Something went wrong: {msg}\n\nCommon causes:\n· The service URL is wrong or the service is not running\n· The URL is not https (or the certificate is not trusted)\n· The browser blocked the cross-origin request',
  // Pesan dari server (/admin/accounts) yang mungkin dikembalikan apa adanya
  'Tidak ada cookie yang dapat diparse, periksa formatnya': 'No cookies could be parsed; please check the format',
  'Tidak ada Authorization: Bearer <key>': 'Missing Authorization: Bearer <key>',
  'API key tidak valid': 'Invalid API key',
  '未解析到任何 cookie，请检查格式': 'No cookies could be parsed; please check the format',
  '缺少 Authorization: Bearer <key>': 'Missing Authorization: Bearer <key>',
  'API key 无效': 'Invalid API key',
};

/* Blok rich-text: data-i18n="key" → innerHTML Inggris */
const I18N_EN_HTML = {
  steps: '<b>Before you start, check two things:</b><br>\n'
    + '    1. You are logged in to <a href="https://muse.ai/" target="_blank"\n'
    + '       style="color:#4f8cff">muse.ai</a> in <b>this browser</b> (you can see the chat interface).<br>\n'
    + '    2. The service URL and API Key above are filled in (you can copy them from the top of the "Account Pool" tab on the muse2api admin page).',
  foot: 'This extension does only one thing: it uses the browser\'s <code>chrome.cookies</code> API to read muse.ai\n'
    + '    cookies (including the httpOnly ones) and POSTs them to the service URL you entered.\n'
    + '    Nothing is collected or uploaded to any third-party server.',
};

/* Teks dari server yang mengandung variabel: [regex, string pengganti]
 * Regex di bawah mencocokkan pesan Mandarin dari server (server masih mengembalikan Mandarin);
 * terjemahan Indonesianya tercakup oleh entri kamus I18N_EN di atas bila pesannya sudah diterjemahkan. */
const I18N_EN_PATTERNS = [
  [/^缺少核心 cookie：(.*)，该账号可能无法生成$/s, 'Missing core cookies: $1; this account may not be able to generate'],
];

function t(s, vars) {
  let out = s;
  if (LANG === 'en' && typeof s === 'string') {
    if (Object.prototype.hasOwnProperty.call(I18N_EN, s)) out = I18N_EN[s];
    else for (const [re, rep] of I18N_EN_PATTERNS) if (re.test(s)) { out = s.replace(re, rep); break; }
  }
  if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return out;
}

function applyLang() {
  $('langSel').value = LANG;
  if (LANG !== 'en') return;
  document.documentElement.lang = 'en';
  document.title = t(document.title);
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const html = I18N_EN_HTML[el.dataset.i18n];
    if (html) el.innerHTML = html;
  });
  document.querySelectorAll('[data-i18n-text]').forEach((el) => {
    el.textContent = t(el.textContent.trim());
  });
  document.querySelectorAll('[placeholder]').forEach((el) => {
    el.placeholder = t(el.placeholder);
  });
}

function log(html, cls) {
  const el = $('log');
  el.className = 'show';
  el.innerHTML = cls ? `<span class="${cls}">${html}</span>` : html;
}

/* Normalisasi alamat layanan: buang slash akhir dan akhiran /v1 */
function normBase(v) {
  let s = (v || '').trim();
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  s = s.replace(/\/+$/, '');
  s = s.replace(/\/v1$/i, '');
  return s;
}

async function loadCfg() {
  const o = await chrome.storage.local.get(STORE);
  const c = o[STORE] || {};
  if (c.base) $('base').value = c.base;
  if (c.key) $('key').value = c.key;
  if (c.label) $('label').value = c.label;
  // Bila belum pernah ada konfigurasi, coba tebak dari tab aktif (saat pengguna sedang di halaman admin)
  if (!c.base) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const u = tab && tab.url ? new URL(tab.url) : null;
      if (u && /\/admin/.test(u.pathname)) {
        $('base').value = u.origin;
        const k = new URLSearchParams(u.search).get('key');
        if (k) $('key').value = k;
      }
    } catch (e) { /* abaikan */ }
  }
}

async function saveCfg() {
  await chrome.storage.local.set({
    [STORE]: {
      base: normBase($('base').value),
      key: $('key').value.trim(),
      label: $('label').value.trim(),
    },
  });
}

async function grabCookies() {
  // Ekstensi spanning berbagi konteks reguler dengan jendela samaran.
  // Pilih store dari tab aktif secara eksplisit; jangan menebak atau memakai fallback.
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const stores = await chrome.cookies.getAllCookieStores();
  const store = tab && stores.find((s) => s.tabIds.includes(tab.id));
  if (!store) {
    throw new Error(t('Tidak dapat memastikan penyimpanan Cookie jendela saat ini. Buka ekstensi di jendela tempat Anda masuk ke Muse, dan pastikan ekstensi diizinkan berjalan dalam mode Samaran/Pribadi.'));
  }
  const windowKind = t(tab.incognito ? 'Mode Samaran/Pribadi' : 'Biasa');
  log(t('Membaca Cookie muse.ai dari jendela {window} saat ini…', { window: windowKind }));
  // Filter URL mengecualikan subdomain dan path yang tidak terkait. Chrome mengurutkan
  // hasil berdasarkan path terpanjang, lalu waktu pembuatan paling awal (seperti cookies.get).
  const all = await chrome.cookies.getAll({ url: 'https://muse.ai/api/session', storeId: store.id });
  const out = Object.create(null), exp = Object.create(null);
  for (const c of all) {
    if (Object.prototype.hasOwnProperty.call(out, c.name)) continue;
    out[c.name] = c.value;
    if (c.expirationDate) exp[c.name] = Math.floor(c.expirationDate);
  }
  return { cookies: out, expires: exp, windowKind };
}

async function run() {
  const base = normBase($('base').value);
  const key = $('key').value.trim();
  const label = $('label').value.trim();

  if (!base) return log(t('Isi alamat layanan dulu'), 'bad');
  if (!key) return log(t('Isi API Key dulu'), 'bad');

  $('go').disabled = true;
  log(t('Membaca Cookie muse.ai…'));

  try {
    const { cookies, expires, windowKind } = await grabCookies();
    const names = Object.keys(cookies);
    if (!names.length) {
      return log(t('Tidak menemukan Cookie muse.ai.\nBuka dan masuk ke '
                 + 'https://muse.ai/ di browser ini dulu, lalu klik lagi.'), 'bad');
    }
    const missing = ESSENTIAL.filter((n) => !cookies[n]);
    if (missing.length) {
      log(t('Membaca {n} Cookie, tetapi ada item inti yang hilang: {missing}\n'
          + 'Sesi login tidak terbaca, periksa status login browser ini dan izin ekstensi.',
          { n: names.length, missing: missing.join(', ') }), 'warn');
      return;
    }

    log(t('Membaca {n} Cookie, mengunggah ke {base} …', { n: names.length, base }));

    const r = await fetch(base + '/admin/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
      },
      body: JSON.stringify({ label, cookies, expires }),
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

    if (r.status === 401) {
      return log(t('API Key salah (layanan mengembalikan 401).\n'
                 + 'Salin API Key yang benar dari bagian atas tab "Kumpulan Akun" di halaman admin.'), 'bad');
    }
    if (!r.ok) {
      const body = typeof data.detail === 'string' ? t(data.detail) : text.slice(0, 300);
      return log(t('Impor gagal: HTTP {status}\n{body}', { status: r.status, body }), 'bad');
    }

    const a = (data.added && data.added[0]) || {};
    await saveCfg();
    log(t('✓ Impor berhasil\nLabel akun: {label}\nID akun: {id}\nJumlah Cookie: {count}\nBerlaku sampai: {expires}\n', {
          label: a.label || label || t('(otomatis)'),
          id: a.id || '?',
          count: a.cookie_count || names.length,
          expires: a.expires_at ? new Date(a.expires_at * 1000).toLocaleString() : t('Tidak diketahui'),
        })
        + t('\nSumber Cookie: jendela {window} saat ini. Impor hanya menyimpan sesi login, silakan uji akun di halaman admin.', { window: windowKind })
        + (data.warning ? t('\nPerhatian: {warning}', { warning: t(data.warning) }) : ''), 'ok');
  } catch (e) {
    log(t('Terjadi kesalahan: {msg}\n\nPenyebab umum:\n'
        + '· Alamat layanan salah atau layanan belum berjalan\n'
        + '· Alamat ini bukan https (atau sertifikatnya tidak dipercaya)\n'
        + '· Browser memblokir permintaan lintas origin', { msg: e && e.message ? e.message : String(e) }), 'bad');
  } finally {
    $('go').disabled = false;
  }
}

applyLang();
$('langSel').addEventListener('change', (e) => setLang(e.target.value));
$('go').addEventListener('click', run);
loadCfg();
