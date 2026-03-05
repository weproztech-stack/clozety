const Order = require("../Models/Order");
const User = require("../Models/User");
const Payment = require("../Models/Payment");
const Product = require("../Models/ProductModel/Product");

// ─── Helper: build month bucket list ─────────────────────────────────────────
function buildMonthRange(count) {
  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
    });
  }
  return months;
}

// ─── API: JSON stats for charts ───────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    // range: "3" | "6" | "12" | "all"  (default 6)
    const range = req.query.range || "6";
    const isAll = range === "all";
    const monthCount = isAll ? 12 : parseInt(range, 10);
    const months = buildMonthRange(monthCount);

    let startDate = null;
    if (!isAll) {
      startDate = new Date();
      startDate.setDate(1);
      startDate.setMonth(startDate.getMonth() - (monthCount - 1));
    }

    const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

    // ── KPI cards (always all-time totals) ──
    const [totalOrders, totalUsers, totalProducts, revenueResult, pendingOrders] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments(),
        Product.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
        Order.countDocuments({ orderStatus: "pending" }),
      ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // ── Revenue per month (paid orders) ──
    const revenueByMonth = await Order.aggregate([
      { $match: { paymentStatus: "paid", ...dateFilter } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    // ── Orders per month ──
    const ordersByMonth = await Order.aggregate([
      { $match: { ...dateFilter } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // ── New users per month ──
    const usersByMonth = await User.aggregate([
      { $match: { ...dateFilter } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // ── Donut charts (always all-time) ──
    const [orderStatusData, paymentMethodData] = await Promise.all([
      Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
      Payment.aggregate([{ $group: { _id: "$method", count: { $sum: 1 } } }]),
    ]);

    // Map aggregated data to ordered month buckets
    const mapToMonths = (data, field = "count") =>
      months.map(({ year, month }) => {
        const found = data.find(
          (d) => d._id.year === year && d._id.month === month
        );
        return found ? found[field] : 0;
      });

    res.json({
      kpi: { totalOrders, totalUsers, totalProducts, totalRevenue, pendingOrders },
      monthLabels: months.map((m) => m.label),
      revenueOverTime: mapToMonths(revenueByMonth, "revenue"),
      ordersOverTime: mapToMonths(ordersByMonth),
      usersOverTime: mapToMonths(usersByMonth),
      orderStatus: orderStatusData.map((d) => ({ label: d._id, value: d.count })),
      paymentMethods: paymentMethodData.map((d) => ({ label: d._id, value: d.count })),
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
};

// ─── Page: HTML dashboard ─────────────────────────────────────────────────────
const getStatsPage = (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Clozety — Analytics</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0f1117;
      --surface:  #1a1d27;
      --border:   #2a2d3a;
      --accent:   #7c6ef7;
      --accent2:  #56cfb2;
      --accent3:  #f7a76c;
      --accent4:  #f76c8a;
      --text:     #e8eaf0;
      --muted:    #8b8fa8;
      --radius:   14px;
    }

    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

    header {
      background: linear-gradient(135deg, #1a1d27 0%, #12111f 100%);
      border-bottom: 1px solid var(--border);
      padding: 18px 32px;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px);
    }
    .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .logo-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--accent); box-shadow: 0 0 12px var(--accent);
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .logo-text { font-size: 18px; font-weight: 700; color: var(--text); }
    .logo-text span { color: var(--accent); }
    .back-btn {
      display: flex; align-items: center; gap: 8px;
      background: var(--surface); border: 1px solid var(--border);
      color: var(--muted); text-decoration: none;
      padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
      transition: all .2s;
    }
    .back-btn:hover { color: var(--text); border-color: var(--accent); }

    main { max-width: 1300px; margin: 0 auto; padding: 32px 24px 60px; }

    /* ── Title row with range picker ── */
    .title-row {
      display: flex; align-items: flex-start; justify-content: space-between;
      flex-wrap: wrap; gap: 16px; margin-bottom: 32px;
    }
    .title-block { display: flex; flex-direction: column; gap: 4px; }
    h1.page-title {
      font-size: 28px; font-weight: 800;
      background: linear-gradient(135deg, #fff 40%, var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .page-sub { color: var(--muted); font-size: 14px; }

    /* ── Range picker buttons ── */
    .range-btns {
      display: flex; gap: 8px; align-items: center;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; padding: 5px;
    }
    .range-btn {
      background: transparent; border: none; cursor: pointer;
      color: var(--muted); font-family: 'Inter', sans-serif;
      font-size: 12px; font-weight: 600; padding: 6px 14px;
      border-radius: 7px; transition: all .15s;
    }
    .range-btn:hover { color: var(--text); }
    .range-btn.active {
      background: var(--accent); color: #fff;
      box-shadow: 0 2px 10px rgba(124,110,247,.4);
    }

    /* ── KPI cards ── */
    .kpi-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px; margin-bottom: 32px;
    }
    .kpi-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 22px 24px;
      position: relative; overflow: hidden; transition: transform .2s, box-shadow .2s;
    }
    .kpi-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,.4); }
    .kpi-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      border-radius: var(--radius) var(--radius) 0 0;
    }
    .kpi-card.c1::before { background: linear-gradient(90deg, var(--accent), #a98fff); }
    .kpi-card.c2::before { background: linear-gradient(90deg, var(--accent2), #4ef0d0); }
    .kpi-card.c3::before { background: linear-gradient(90deg, var(--accent3), #ffcc94); }
    .kpi-card.c4::before { background: linear-gradient(90deg, var(--accent4), #ff99b3); }
    .kpi-card.c5::before { background: linear-gradient(90deg, #6cd4f7, #a0eaff); }
    .kpi-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 10px; }
    .kpi-value { font-size: 28px; font-weight: 800; color: var(--text); }
    .kpi-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 32px; opacity: .12; }

    /* ── Charts ── */
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .charts-grid.triple { grid-template-columns: 1fr 1fr 1fr; }
    @media (max-width: 900px) { .charts-grid, .charts-grid.triple { grid-template-columns: 1fr; } }

    .chart-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 24px; transition: box-shadow .2s;
      position: relative;
    }
    .chart-card:hover { box-shadow: 0 4px 24px rgba(124,110,247,.08); }
    .chart-title { font-size: 15px; font-weight: 700; margin-bottom: 4px; color: var(--text); }
    .chart-sub { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
    .chart-wrap { position: relative; height: 240px; }

    /* ── Chart loading shimmer ── */
    .chart-refreshing::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.03), transparent);
      animation: shimmer 1s infinite;
      border-radius: var(--radius);
    }
    @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

    /* ── Loading overlay ── */
    #loading {
      position: fixed; inset: 0; background: var(--bg);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      z-index: 9999; gap: 16px;
    }
    .spinner {
      width: 48px; height: 48px; border: 3px solid var(--border);
      border-top-color: var(--accent); border-radius: 50%;
      animation: spin .8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    #loading p { color: var(--muted); font-size: 14px; }

    .error-box {
      background: rgba(247,108,138,.1); border: 1px solid rgba(247,108,138,.3);
      border-radius: var(--radius); padding: 20px 24px; color: var(--accent4); display: none;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>

<div id="loading">
  <div class="spinner"></div>
  <p>Loading analytics…</p>
</div>

<header>
  <a class="logo" href="/admin">
    <div class="logo-dot"></div>
    <span class="logo-text">Clozety <span>Admin</span></span>
  </a>
  <a class="back-btn" href="/admin">← Back to Panel</a>
</header>

<main>
  <div class="title-row">
    <div class="title-block">
      <h1 class="page-title">Analytics Dashboard</h1>
      <p class="page-sub" id="pageSub">Live data from your MongoDB</p>
    </div>
    <div class="range-btns">
      <button class="range-btn" data-range="1">1M</button>
      <button class="range-btn" data-range="3">3M</button>
      <button class="range-btn active" data-range="6">6M</button>
      <button class="range-btn" data-range="12">12M</button>
      <button class="range-btn" data-range="all">All Time</button>
    </div>
  </div>

  <div class="error-box" id="errBox">⚠️ Could not load stats. Make sure the server is running and MongoDB is connected.</div>

  <!-- KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card c1">
      <div class="kpi-label">Total Revenue</div>
      <div class="kpi-value" id="kpi-revenue">—</div>
      <div class="kpi-icon">💰</div>
    </div>
    <div class="kpi-card c2">
      <div class="kpi-label">Total Orders</div>
      <div class="kpi-value" id="kpi-orders">—</div>
      <div class="kpi-icon">📦</div>
    </div>
    <div class="kpi-card c3">
      <div class="kpi-label">Total Users</div>
      <div class="kpi-value" id="kpi-users">—</div>
      <div class="kpi-icon">👥</div>
    </div>
    <div class="kpi-card c4">
      <div class="kpi-label">Pending Orders</div>
      <div class="kpi-value" id="kpi-pending">—</div>
      <div class="kpi-icon">⏳</div>
    </div>
    <div class="kpi-card c5">
      <div class="kpi-label">Total Products</div>
      <div class="kpi-value" id="kpi-products">—</div>
      <div class="kpi-icon">🛍️</div>
    </div>
  </div>

  <!-- Row 1 -->
  <div class="charts-grid">
    <div class="chart-card" id="card-revenue">
      <div class="chart-title">Revenue Over Time</div>
      <div class="chart-sub">Monthly revenue from paid orders (INR)</div>
      <div class="chart-wrap"><canvas id="revenueChart"></canvas></div>
    </div>
    <div class="chart-card" id="card-orders">
      <div class="chart-title">Orders Over Time</div>
      <div class="chart-sub">Total orders placed per month</div>
      <div class="chart-wrap"><canvas id="ordersChart"></canvas></div>
    </div>
  </div>

  <!-- Row 2 -->
  <div class="charts-grid triple">
    <div class="chart-card" id="card-users">
      <div class="chart-title">New Users Per Month</div>
      <div class="chart-sub" id="usersSub">Registrations over selected period</div>
      <div class="chart-wrap"><canvas id="usersChart"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Order Status Breakdown</div>
      <div class="chart-sub">Distribution of all order statuses</div>
      <div class="chart-wrap"><canvas id="orderStatusChart"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">Payment Methods</div>
      <div class="chart-sub">How customers are paying</div>
      <div class="chart-wrap"><canvas id="paymentMethodChart"></canvas></div>
    </div>
  </div>
</main>

<script>
const ACCENT  = '#7c6ef7';
const ACCENT2 = '#56cfb2';
const ACCENT3 = '#f7a76c';
const ACCENT4 = '#f76c8a';
const ACCENT5 = '#6cd4f7';
const PIE_COLORS = [ACCENT, ACCENT2, ACCENT3, ACCENT4, ACCENT5, '#a98fff', '#4ef0d0'];

Chart.defaults.color = '#8b8fa8';
Chart.defaults.borderColor = '#2a2d3a';
Chart.defaults.font.family = 'Inter';

const makeGradient = (ctx, color) => {
  const g = ctx.createLinearGradient(0, 0, 0, 240);
  g.addColorStop(0, color + '55');
  g.addColorStop(1, color + '00');
  return g;
};

// Track chart instances so we can destroy & recreate on range change
const charts = {};

function destroyChart(id) {
  if (charts[id]) { charts[id].destroy(); delete charts[id]; }
}

function makeLineChart(id, labels, data, color) {
  destroyChart(id);
  const ctx = document.getElementById(id).getContext('2d');
  charts[id] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: color,
        backgroundColor: makeGradient(ctx, color),
        fill: true,
        pointBackgroundColor: color,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: '#2a2d3a' } },
        y: { grid: { color: '#2a2d3a' }, beginAtZero: true },
      },
      elements: { point: { radius: 4, hoverRadius: 6 }, line: { tension: 0.4 } },
      animation: { duration: 400 },
    }
  });
}

function makeBarChart(id, labels, data, color) {
  destroyChart(id);
  const ctx = document.getElementById(id).getContext('2d');
  charts[id] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ data, backgroundColor: color + 'cc', hoverBackgroundColor: color }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#2a2d3a' }, beginAtZero: true },
      },
      borderRadius: 6,
      animation: { duration: 400 },
    }
  });
}

function makeDoughnut(id, labels, data, colors) {
  destroyChart(id);
  const ctx = document.getElementById(id).getContext('2d');
  charts[id] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors.slice(0, data.length), borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' } }
      },
      cutout: '65%',
      animation: { duration: 400 },
    }
  });
}

const RANGE_LABELS = { '1': 'Last 1 Month', '3': 'Last 3 Months', '6': 'Last 6 Months', '12': 'Last 12 Months', 'all': 'All Time' };

async function loadStats(range) {
  // Show shimmer on chart cards
  document.querySelectorAll('.chart-card').forEach(c => c.classList.add('chart-refreshing'));

  try {
    const res = await fetch('/admin-api/stats/data?range=' + range);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const d = await res.json();

    // ── Update subtitle ──
    document.getElementById('pageSub').textContent =
      'Live data from your MongoDB — ' + (RANGE_LABELS[range] || range);

    // ── KPIs (always all-time) ──
    document.getElementById('kpi-revenue').textContent  = '₹' + d.kpi.totalRevenue.toLocaleString('en-IN');
    document.getElementById('kpi-orders').textContent   = d.kpi.totalOrders.toLocaleString();
    document.getElementById('kpi-users').textContent    = d.kpi.totalUsers.toLocaleString();
    document.getElementById('kpi-pending').textContent  = d.kpi.pendingOrders.toLocaleString();
    document.getElementById('kpi-products').textContent = d.kpi.totalProducts.toLocaleString();

    // ── Time-series charts ──
    makeLineChart('revenueChart', d.monthLabels, d.revenueOverTime, ACCENT);
    makeBarChart('ordersChart',   d.monthLabels, d.ordersOverTime,  ACCENT2);
    makeBarChart('usersChart',    d.monthLabels, d.usersOverTime,   ACCENT3);

    // ── Donut charts (always all-time, no need to redraw if range changes) ──
    makeDoughnut('orderStatusChart', d.orderStatus.map(s => s.label), d.orderStatus.map(s => s.value), PIE_COLORS);
    makeDoughnut('paymentMethodChart', d.paymentMethods.map(s => s.label), d.paymentMethods.map(s => s.value), [ACCENT4, ACCENT5, ACCENT, ACCENT2, ACCENT3]);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('errBox').style.display = 'none';
  } catch (e) {
    console.error(e);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('errBox').style.display = 'block';
  } finally {
    document.querySelectorAll('.chart-card').forEach(c => c.classList.remove('chart-refreshing'));
  }
}

// ── Range button wiring ──
let currentRange = '6';
document.querySelectorAll('.range-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const range = btn.dataset.range;
    if (range === currentRange) return;
    currentRange = range;
    document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadStats(range);
  });
});

// Initial load
loadStats(currentRange);
</script>
</body>
</html>`;

  res.send(html);
};

module.exports = { getStats, getStatsPage };
