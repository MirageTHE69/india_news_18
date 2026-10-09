/**
 * India News 18 / Breaking Edition — Share Market page data
 * Prices, charts and movers come from TradingView's free embeddable widgets
 * (no API key, no backend). Only BSE symbols are used: TradingView does not
 * license NSE data (Nifty etc.) for embedding on other sites. Each widget is a <script> tag whose body is its
 * JSON config, so it has to be created through the DOM — scripts inserted via
 * innerHTML never run.
 */

const WIDGET_BASE = 'https://s3.tradingview.com/external-embedding/embed-widget-';

const COMMON = { colorTheme: 'light', isTransparent: true, locale: 'en' };

export const MARKET_CHART_SYMBOLS = [
  { symbol: 'BSE:SENSEX', label: 'Sensex' },
  { symbol: 'BSE:BSE500', label: 'BSE 500' },
  { symbol: 'BSE:RELIANCE', label: 'Reliance' },
  { symbol: 'BSE:TCS', label: 'TCS' },
  { symbol: 'BSE:HDFCBANK', label: 'HDFC Bank' },
  { symbol: 'BSE:INFY', label: 'Infosys' },
  { symbol: 'BSE:ICICIBANK', label: 'ICICI Bank' },
  { symbol: 'BSE:SBIN', label: 'SBI' },
  { symbol: 'BSE:ITC', label: 'ITC' },
  { symbol: 'BSE:LT', label: 'L&T' },
  { symbol: 'BSE:BHARTIARTL', label: 'Bharti Airtel' },
  { symbol: 'TVC:GOLD', label: 'Gold' }
];

const TAPE_SYMBOLS = [
  { proName: 'BSE:SENSEX', title: 'Sensex' },
  { proName: 'BSE:BSE500', title: 'BSE 500' },
  { proName: 'FX_IDC:USDINR', title: 'USD/INR' },
  { proName: 'TVC:GOLD', title: 'Gold' },
  { proName: 'TVC:SILVER', title: 'Silver' },
  { proName: 'TVC:UKOIL', title: 'Brent Crude' },
  { proName: 'BSE:RELIANCE', title: 'Reliance' },
  { proName: 'BSE:TCS', title: 'TCS' },
  { proName: 'BSE:HDFCBANK', title: 'HDFC Bank' },
  { proName: 'BSE:INFY', title: 'Infosys' },
  { proName: 'BSE:SBIN', title: 'SBI' }
];

const GLANCE_GROUPS = [
  {
    name: 'Indices',
    symbols: [
      { name: 'BSE:SENSEX', displayName: 'S&P BSE Sensex' },
      { name: 'BSE:BSE500', displayName: 'BSE 500' },
      { name: 'BSE:IT', displayName: 'BSE IT' }
    ]
  },
  {
    name: 'Gold, Oil & Rupee',
    symbols: [
      { name: 'TVC:GOLD', displayName: 'Gold (USD/oz)' },
      { name: 'TVC:SILVER', displayName: 'Silver (USD/oz)' },
      { name: 'TVC:UKOIL', displayName: 'Brent Crude' },
      { name: 'FX_IDC:USDINR', displayName: 'US Dollar / Rupee' }
    ]
  }
];

const WATCHLIST_GROUPS = [
  {
    name: 'Banking & Finance',
    symbols: [
      { name: 'BSE:HDFCBANK', displayName: 'HDFC Bank' },
      { name: 'BSE:ICICIBANK', displayName: 'ICICI Bank' },
      { name: 'BSE:SBIN', displayName: 'State Bank of India' },
      { name: 'BSE:KOTAKBANK', displayName: 'Kotak Mahindra Bank' },
      { name: 'BSE:AXISBANK', displayName: 'Axis Bank' },
      { name: 'BSE:BAJFINANCE', displayName: 'Bajaj Finance' }
    ]
  },
  {
    name: 'IT',
    symbols: [
      { name: 'BSE:TCS', displayName: 'TCS' },
      { name: 'BSE:INFY', displayName: 'Infosys' },
      { name: 'BSE:HCLTECH', displayName: 'HCL Technologies' },
      { name: 'BSE:WIPRO', displayName: 'Wipro' },
      { name: 'BSE:TECHM', displayName: 'Tech Mahindra' }
    ]
  },
  {
    name: 'Energy & Auto',
    symbols: [
      { name: 'BSE:RELIANCE', displayName: 'Reliance Industries' },
      { name: 'BSE:ONGC', displayName: 'ONGC' },
      { name: 'BSE:NTPC', displayName: 'NTPC' },
      { name: 'BSE:MARUTI', displayName: 'Maruti Suzuki' },
      { name: 'BSE:M_M', displayName: 'Mahindra & Mahindra' },
      { name: 'BSE:LT', displayName: 'Larsen & Toubro' }
    ]
  },
  {
    name: 'Currency',
    symbols: [
      { name: 'FX_IDC:USDINR', displayName: 'US Dollar / Rupee' },
      { name: 'FX_IDC:EURINR', displayName: 'Euro / Rupee' },
      { name: 'FX_IDC:GBPINR', displayName: 'Pound / Rupee' }
    ]
  }
];

const WIDGET_CONFIGS = {
  tape: () => ['ticker-tape', {
    ...COMMON,
    symbols: TAPE_SYMBOLS,
    showSymbolLogo: true,
    displayMode: 'adaptive'
  }],
  glance: () => ['market-quotes', {
    ...COMMON,
    width: '100%',
    height: '100%',
    symbolsGroups: GLANCE_GROUPS,
    showSymbolLogo: true
  }],
  chart: symbol => ['advanced-chart', {
    autosize: true,
    symbol,
    interval: 'D',
    timezone: 'Asia/Kolkata',
    theme: 'light',
    style: '1',
    locale: 'en',
    allow_symbol_change: true,
    hide_side_toolbar: true,
    calendar: false,
    support_host: 'https://www.tradingview.com'
  }],
  movers: () => ['hotlists', {
    ...COMMON,
    exchange: 'BSE',
    dateRange: '1D',
    showChart: false,
    showSymbolLogo: true,
    showFloatingTooltip: false,
    width: '100%',
    height: '100%'
  }],
  heatmap: () => ['stock-heatmap', {
    ...COMMON,
    exchanges: [],
    dataSource: 'SENSEX',
    grouping: 'sector',
    blockSize: 'market_cap_basic',
    blockColor: 'change',
    hasTopBar: false,
    isDataSetEnabled: false,
    isZoomEnabled: true,
    hasSymbolTooltip: true,
    isMonoSize: false,
    width: '100%',
    height: '100%'
  }],
  watchlist: () => ['market-quotes', {
    ...COMMON,
    width: '100%',
    height: '100%',
    symbolsGroups: WATCHLIST_GROUPS,
    showSymbolLogo: true
  }]
};

/**
 * Mount a TradingView widget into `host`. `kind` is a key of WIDGET_CONFIGS;
 * `arg` is passed to its config builder (the symbol, where one is needed).
 */
export function mountMarketWidget(host, kind, arg) {
  if (!host || !WIDGET_CONFIGS[kind]) return;
  const [name, config] = WIDGET_CONFIGS[kind](arg);

  const wrap = document.createElement('div');
  wrap.className = 'tradingview-widget-container';
  wrap.style.height = '100%';
  wrap.style.width = '100%';
  const inner = document.createElement('div');
  inner.className = 'tradingview-widget-container__widget';
  inner.style.height = '100%';
  inner.style.width = '100%';
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `${WIDGET_BASE}${name}.js`;
  script.text = JSON.stringify(config);
  wrap.append(inner, script);

  host.replaceChildren(wrap);
}

/**
 * NSE/BSE cash-market session: Mon–Fri, 9:15 a.m. to 3:30 p.m. IST.
 * Exchange holidays are not known here, so this is the scheduled session only.
 */
export function isMarketSessionOpen(now = new Date()) {
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  if (day === 0 || day === 6) return false;
  const mins = ist.getHours() * 60 + ist.getMinutes();
  return mins >= 9 * 60 + 15 && mins <= 15 * 60 + 30;
}
