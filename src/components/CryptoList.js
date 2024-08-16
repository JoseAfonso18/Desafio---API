import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './CryptoList.css';

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    })
    .then(response => setCryptos(response.data))
    .catch(error => setError(error.message));
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: 7,
        },
      })
      .then(response => {
        const prices = response.data.prices.map(price => ({
          x: new Date(price[0]),
          y: price[1],
        }));

        setChartData({
          labels: prices.map(p => p.x.toLocaleDateString()),
          datasets: [{
            label: `${selectedCrypto.name} Price in Last 7 Days`,
            data: prices.map(p => p.y),
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
          }],
        });
      })
      .catch(error => setError(error.message));
    }
  }, [selectedCrypto]);

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <div>Erro: {error}</div>;
  if (!cryptos.length) return <div>Carregando...</div>;

  return (
    <div className="crypto-container">
      <h1>Top 10 Criptomoedas</h1>
      <input
        type="text"
        placeholder="Buscar criptomoeda..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <ul>
        {filteredCryptos.map(crypto => (
          <li
            key={crypto.id}
            className="crypto-item"
            onClick={() => setSelectedCrypto(crypto)}
          >
            <img src={crypto.image} alt={crypto.name} />
            <span>{crypto.name} ({crypto.symbol.toUpperCase()})</span>
            <span>Preço: ${crypto.current_price.toFixed(2)}</span>
            <span>Variação 24h: {crypto.price_change_percentage_24h.toFixed(2)}%</span>
            <span>Capitalização de Mercado: ${crypto.market_cap.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      {selectedCrypto && chartData && (
        <div className="crypto-chart">
          <h2>{selectedCrypto.name} - Histórico de Preços (7 dias)</h2>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default CryptoList;
