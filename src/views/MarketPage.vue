<template>
  <ion-page>
    <ion-content :fullscreen="true" class="market-content">
      <ion-refresher slot="fixed" @ion-refresh="onPullRefresh">
        <ion-refresher-content pulling-text="Tarik untuk memperbarui" refreshing-spinner="crescent" />
      </ion-refresher>

      <div class="app-layout">
        <aside class="sidebar" aria-label="Navigasi aplikasi">
          <div class="brand"><span class="brand-icon"><ion-icon :icon="pulseOutline" /></span>nexa<span>crypto</span></div>
          <div class="sidebar-label">WORKSPACE</div>
          <div class="nav-active"><ion-icon :icon="gridOutline" /> Market Overview</div>
          <div class="sidebar-space" />
          <div class="sidebar-card"><ion-icon :icon="shieldCheckmarkOutline" /><strong>Live market data</strong><p>Harga dan peringkat diambil langsung dari CoinLore API.</p></div>
          <div class="sidebar-foot">MSIM4401 · TUGAS 03</div>
        </aside>

        <main class="main-panel">
          <header class="mobile-header"><div class="brand"><span class="brand-icon"><ion-icon :icon="pulseOutline" /></span>nexa<span>crypto</span></div><span>MARKET</span></header>
          <div class="content-wrap">
            <div class="page-head"><div><span class="eyebrow">MARKET OVERVIEW</span><h1>Explore the market<span>.</span></h1><p>Harga aset digital, langsung dalam satu tampilan.</p></div><div class="head-actions"><button class="theme-button" type="button" :aria-label="theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'" :aria-pressed="theme === 'light'" @click="toggleTheme"><ion-icon :icon="theme === 'dark' ? sunnyOutline : moonOutline" /><span>{{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}</span></button><button class="refresh-button" type="button" :disabled="loading || refreshing" @click="refreshCoins" aria-label="Refresh data cryptocurrency"><ion-icon :icon="refreshOutline" :class="{ spinning: refreshing }" /><span>{{ refreshing ? 'Memperbarui' : 'Refresh data' }}</span></button></div></div>

            <section class="overview-grid" aria-label="Ringkasan pasar">
              <div class="featured-card"><div class="featured-orbit" aria-hidden="true" /><div class="featured-top"><span class="live-pill"><i /> LIVE MARKET</span><ion-icon :icon="trendingUpOutline" /></div><div class="featured-body"><span class="featured-kicker">ASET PERINGKAT #1</span><div class="featured-name"><span class="featured-avatar">{{ topCoin?.symbol?.slice(0, 1) || '₿' }}</span><strong>{{ topCoin?.name || 'Memuat aset...' }}</strong><small>{{ topCoin?.symbol || '—' }}</small></div><div class="featured-price">{{ topCoin ? formatUsd(topCoin.price_usd) : '—' }} <small>USD</small></div></div><div class="featured-foot"><span>Data dari CoinLore</span><span>{{ lastUpdated ? `Update ${formatTime(lastUpdated)}` : 'Menunggu data' }}</span></div></div>
              <div class="metric-grid"><div class="metric"><span class="metric-icon purple"><ion-icon :icon="layersOutline" /></span><div><small>TOTAL ASET</small><strong>{{ totalCoins ? formatInteger(totalCoins) : '—' }}</strong><span>tercatat di CoinLore</span></div></div><div class="metric"><span class="metric-icon mint"><ion-icon :icon="listOutline" /></span><div><small>DATA DIMUAT</small><strong>{{ formatInteger(coins.length) }}</strong><span>aset siap dijelajahi</span></div></div></div>
            </section>

            <section class="market-section" aria-labelledby="market-title">
              <div class="section-title"><div><span class="eyebrow">DISCOVER</span><h2 id="market-title">Daftar cryptocurrency</h2></div><span class="source"><i /> CoinLore API</span></div>
              <div class="toolbar"><div class="active-tab"><ion-icon :icon="statsChartOutline" /> Semua aset <span>{{ formatInteger(coins.length) }}</span></div><div class="search"><ion-icon :icon="searchOutline" /><input v-model.trim="search" type="search" aria-label="Cari nama atau simbol cryptocurrency" placeholder="Cari nama atau simbol..." /><button v-if="search" type="button" aria-label="Hapus pencarian" @click="search = ''"><ion-icon :icon="closeOutline" /></button></div></div>
              <div class="market-table"><div class="table-head"><span>#</span><span>ASET</span><span>HARGA USD</span><span>24 JAM</span></div>
                <div v-if="loading" class="state" role="status"><div class="loader" /><strong>Mengambil data pasar...</strong><p>Mohon tunggu sebentar.</p></div>
                <div v-else-if="error && !coins.length" class="state" role="alert"><ion-icon :icon="cloudOfflineOutline" /><strong>Data belum dapat dimuat</strong><p>{{ error }}</p><button class="small-button" type="button" @click="refreshCoins">Coba lagi</button></div>
                <div v-else-if="!filteredCoins.length" class="state"><ion-icon :icon="searchOutline" /><strong>Aset tidak ditemukan</strong><p>Coba nama atau simbol lain.</p></div>
                <div v-else><article v-for="coin in filteredCoins" :key="coin.id" class="coin-row"><span class="rank">{{ coin.rank }}</span><div class="coin-identity"><span class="coin-avatar" :style="avatarStyle(coin.symbol)">{{ coin.symbol.slice(0, 1) }}</span><span class="coin-names"><strong>{{ coin.name }}</strong><small>{{ coin.symbol }}</small></span></div><div class="coin-price"><strong>{{ formatUsd(coin.price_usd) }}</strong><small>USD</small></div><div class="coin-change" :class="changeClass(coin.percent_change_24h)">{{ formatChange(coin.percent_change_24h) }}</div></article></div>
              </div>
              <p v-if="error && coins.length" class="inline-error" role="alert">{{ error }}</p>
              <div v-if="coins.length" class="pagination-panel" aria-label="Navigasi daftar aset">
                <div class="pagination-summary">
                  <span class="pagination-symbol"><ion-icon :icon="layersOutline" /></span>
                  <div class="pagination-copy">
                    <strong>{{ search ? `${formatInteger(filteredCoins.length)} hasil ditemukan` : `${formatInteger(coins.length)} aset dimuat` }}</strong>
                    <span>{{ search ? `Pencarian dari ${formatInteger(coins.length)} aset yang dimuat` : `Dari ${formatInteger(totalCoins)} aset tersedia` }}</span>
                  </div>
                </div>
                <button v-if="hasMore && !search" class="pagination-next" type="button" :disabled="loadingMore || refreshing" @click="loadMore">
                  <span>{{ loadingMore ? 'Memuat data...' : 'Lihat lebih banyak' }}</span>
                  <ion-icon :icon="loadingMore ? refreshOutline : arrowForwardOutline" :class="{ spinning: loadingMore }" />
                </button>
                <span v-else class="pagination-status">{{ search ? 'Pencarian aktif' : 'Semua aset dimuat' }}</span>
                <div v-if="!search" class="pagination-track" role="progressbar" :aria-valuenow="coins.length" :aria-valuemax="Math.max(totalCoins, coins.length)" aria-label="Progres aset yang dimuat"><span :style="{ width: `${loadProgress}%` }" /></div>
              </div>
            </section>
            <footer><span>© 2026 NexaCrypto · MSIM4401 Tugas 03</span><a href="https://www.coinlore.com/cryptocurrency-data-api" target="_blank" rel="noopener noreferrer">Powered by CoinLore <ion-icon :icon="openOutline" /></a></footer>
          </div>
        </main>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { IonContent, IonIcon, IonPage, IonRefresher, IonRefresherContent } from '@ionic/vue';
import { arrowForwardOutline, closeOutline, cloudOfflineOutline, gridOutline, layersOutline, listOutline, moonOutline, openOutline, pulseOutline, refreshOutline, searchOutline, shieldCheckmarkOutline, statsChartOutline, sunnyOutline, trendingUpOutline } from 'ionicons/icons';
import { getCoins, type Coin } from '../data/coins';

const coins = ref<Coin[]>([]), totalCoins = ref(0), loading = ref(true), refreshing = ref(false), loadingMore = ref(false), error = ref(''), search = ref('');
const lastUpdated = ref<Date | null>(null);
type Theme = 'dark' | 'light';
const theme = ref<Theme>(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
function setTheme(value: Theme): void {
  theme.value = value;
  document.documentElement.dataset.theme = value;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'light' ? '#f6f8fc' : '#080d18');
  try { localStorage.setItem('nexa-theme', value); } catch { /* Storage may be disabled. */ }
}
function toggleTheme(): void { setTheme(theme.value === 'dark' ? 'light' : 'dark'); }
let activeRequest: AbortController | null = null;
const topCoin = computed(() => coins.value.find(coin => Number(coin.rank) === 1) ?? coins.value[0]);
const filteredCoins = computed(() => { const q = search.value.toLocaleLowerCase('id-ID'); return q ? coins.value.filter(c => `${c.name} ${c.symbol}`.toLocaleLowerCase('id-ID').includes(q)) : coins.value; });
const hasMore = computed(() => totalCoins.value > coins.value.length);
const loadProgress = computed(() => totalCoins.value > 0 ? Math.min(100, Math.round(coins.value.length / totalCoins.value * 100)) : 0);
const formatInteger = (n: number) => new Intl.NumberFormat('id-ID').format(n);
const formatTime = (d: Date) => new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(d);
function formatUsd(value: string): string { const n = Number(value); if (!Number.isFinite(n)) return '—'; const digits = n >= 1 ? 2 : n >= .01 ? 4 : 8; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: digits }).format(n); }
function formatChange(value?: string): string { const n = Number(value); return value && Number.isFinite(n) ? `${n > 0 ? '+' : ''}${n.toFixed(2)}%` : '—'; }
function changeClass(value?: string): string { const n = Number(value); return !value || !Number.isFinite(n) ? 'neutral' : n < 0 ? 'negative' : 'positive'; }
function avatarStyle(symbol: string): Record<string, string> { const p = [['#f4a340','#fff3e5'],['#6084e8','#eff2ff'],['#4cbca7','#edfff9'],['#a484eb','#f8f1ff'],['#e27688','#fff1f5']]; const i = [...symbol].reduce((s,c) => s + c.charCodeAt(0),0) % p.length; return { backgroundColor: p[i][0], color: p[i][1] }; }
function friendlyError(err: unknown): string { if (!navigator.onLine) return 'Periksa koneksi internet Anda, lalu coba lagi.'; if (err instanceof Error && err.message.includes('Format data')) return err.message; return 'Koneksi ke CoinLore gagal. Silakan tekan Refresh untuk mencoba kembali.'; }
async function refreshCoins(): Promise<void> { if (refreshing.value) return; activeRequest?.abort(); const request = new AbortController(); activeRequest = request; refreshing.value = true; error.value = ''; try { const result = await getCoins(0, request.signal); coins.value = result.data; totalCoins.value = result.info?.coins_num ?? result.data.length; lastUpdated.value = new Date(); } catch (err) { if (!request.signal.aborted) error.value = friendlyError(err); } finally { if (activeRequest === request) { activeRequest = null; refreshing.value = false; loading.value = false; } } }
async function loadMore(): Promise<void> { if (loadingMore.value || refreshing.value || !hasMore.value) return; loadingMore.value = true; error.value = ''; const request = new AbortController(); activeRequest = request; try { const result = await getCoins(coins.value.length, request.signal); const ids = new Set(coins.value.map(c => c.id)); const incoming = result.data.filter(c => !ids.has(c.id)); coins.value = [...coins.value, ...incoming]; totalCoins.value = result.info?.coins_num ?? coins.value.length; if (!incoming.length) totalCoins.value = coins.value.length; } catch (err) { if (!request.signal.aborted) error.value = friendlyError(err); } finally { if (activeRequest === request) activeRequest = null; loadingMore.value = false; } }
async function onPullRefresh(event: CustomEvent): Promise<void> { await refreshCoins(); (event.target as HTMLIonRefresherElement).complete(); }
onMounted(() => { setTheme(theme.value); refreshCoins(); });
onUnmounted(() => activeRequest?.abort());
</script>
