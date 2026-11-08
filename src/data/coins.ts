import axios from 'axios';

export interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_24h?: string;
}

interface TickersResponse {
  data: Coin[];
  info?: { coins_num?: number };
}

const endpoint = 'https://api.coinlore.net/api/tickers/';
export const pageSize = 100;

export async function getCoins(start = 0, signal?: AbortSignal): Promise<TickersResponse> {
  const response = await axios.get<TickersResponse>(endpoint, {
    params: { start, limit: pageSize },
    timeout: 15000,
    signal,
  });
  if (!Array.isArray(response.data?.data)) {
    throw new Error('Format data dari CoinLore tidak sesuai.');
  }
  return response.data;
}
