// 聯絡表單 Worker
// POST /  （欄位 name、email、message；website 是防機器人的隱藏欄，要空白）
// 1. 檢查欄位  2. 同一個 IP 10 分鐘最多 5 則  3. 存進 D1  4. 有設定 EMAIL 就寄信通知
// 回傳 JSON：{ ok: true } 或 { ok: false, error: "原因" }

const LIMIT = { name: 80, email: 120, message: 3000 };

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(env, origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method === 'GET') return json({ ok: true, service: 'contact', db: !!env.DB, email: !!env.EMAIL }, 200, cors);
    if (request.method !== 'POST') return json({ ok: false, error: '只接受 POST' }, 405, cors);
    if (!originAllowed(env, origin)) return json({ ok: false, error: '這個網站不能使用此表單' }, 403, cors);
    if (!env.DB) return json({ ok: false, error: '還沒接上資料庫（README 步驟 2）' }, 500, cors);

    // 讀表單：支援 FormData 和 JSON
    let data = {};
    const type = request.headers.get('Content-Type') || '';
    try {
      if (type.includes('application/json')) data = await request.json();
      else data = Object.fromEntries(await request.formData());
    } catch {
      return json({ ok: false, error: '表單格式不對' }, 400, cors);
    }

    // 機器人會把隱藏欄位填滿；假裝成功，不存
    if (String(data.website || '').trim()) return json({ ok: true }, 200, cors);

    const name = clean(data.name, LIMIT.name);
    const email = clean(data.email, LIMIT.email);
    const message = clean(data.message, LIMIT.message, true);
    if (!name || !email || !message) return json({ ok: false, error: '名字、Email、內容都要填' }, 400, cors);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: 'Email 格式不對' }, 400, cors);

    // 同一個 IP 10 分鐘內最多 5 則（只存雜湊，不存真實 IP）
    const ipHash = await sha256((request.headers.get('CF-Connecting-IP') || 'unknown') + (env.SALT || 'contact'));
    const recent = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM messages WHERE ip_hash = ? AND created_at > datetime('now', '-10 minutes')"
    ).bind(ipHash).first();
    if (recent && recent.n >= 5) return json({ ok: false, error: '送太多次了，請稍後再試' }, 429, cors);

    const page = clean(request.headers.get('Referer'), 300);
    const row = await env.DB.prepare(
      'INSERT INTO messages (name, email, message, page, ip_hash) VALUES (?, ?, ?, ?, ?) RETURNING id'
    ).bind(name, email, message, page, ipHash).first();

    // 寄信不影響回覆速度：放到背景做
    if (env.EMAIL && env.MAIL_TO && env.MAIL_FROM) {
      ctx.waitUntil(notify(env, { id: row.id, name, email, message, page }));
    }
    return json({ ok: true, id: row.id }, 200, cors);
  },
};

async function notify(env, m) {
  try {
    await env.EMAIL.send({
      to: env.MAIL_TO,
      from: { email: env.MAIL_FROM, name: '個人網站聯絡表單' },
      replyTo: m.email,
      subject: `【網站留言】${m.name}`,
      text: `${m.name}（${m.email}）留言：\n\n${m.message}\n\n——\n來自：${m.page || '未知頁面'}\n直接回覆這封信就會寄給對方。`,
    });
    await env.DB.prepare('UPDATE messages SET mailed = 1 WHERE id = ?').bind(m.id).run();
  } catch (err) {
    console.error('寄信失敗', err?.code || '', err?.message || err);
  }
}

function clean(v, max, multiline = false) {
  let s = String(v ?? '').trim();
  if (!multiline) s = s.replace(/\s+/g, ' ');
  return s.slice(0, max);
}

function originAllowed(env, origin) {
  const allow = (env.ALLOWED_ORIGIN || '*').split(',').map((s) => s.trim().replace(/\/$/, ''));
  return allow.includes('*') || allow.includes(origin.replace(/\/$/, ''));
}

function corsHeaders(env, origin) {
  return {
    'Access-Control-Allow-Origin': originAllowed(env, origin) && origin ? origin : (env.ALLOWED_ORIGIN || '*').split(',')[0].trim(),
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
}

async function sha256(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}
