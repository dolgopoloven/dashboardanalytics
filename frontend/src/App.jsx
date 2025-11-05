import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function App() {
  const [stats, setStats] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [financial, setFinancial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    loadData();
    // Обновляем данные каждые 30 секунд
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [statsResponse, clinicsResponse, financialResponse] = await Promise.all([
        fetch('/api/real/appointments-stats'),
        fetch('/api/real/clinics'),
        fetch('/api/real/financial-stats')
      ]);

      const statsData = await statsResponse.json();
      const clinicsData = await clinicsResponse.json();
      const financialData = await financialResponse.json();

      setStats(statsData);
      setClinics(clinicsData);
      setFinancial(financialData);
      setLastUpdate(statsData.timestamp || new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>🔄 Загрузка динамических данных...</h2>
      <p>Данные обновляются в реальном времени</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h1>🏥 Медицинская аналитика (Динамические данные)</h1>
        <div style={{ color: '#666', fontSize: '14px' }}>
          Последнее обновление: {lastUpdate}
        </div>
      </div>
      
      <button 
        onClick={loadData}
        style={{
          padding: '8px 16px',
          background: '#1976D2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🔄 Обновить данные
      </button>

      {stats && financial && (
        <div>
          {/* Ключевые метрики */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', minWidth: '180px', flex: 1 }}>
              <h3>👥 Всего визитов</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976D2', margin: '5px 0' }}>{stats.total}</p>
              <small style={{ color: '#666' }}>за текущий период</small>
            </div>
            
            <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', minWidth: '180px', flex: 1 }}>
              <h3>💰 Общая выручка</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2E7D32', margin: '5px 0' }}>
                {(financial.total_revenue / 1000000).toFixed(1)} млн ₽
              </p>
              <small style={{ color: '#666' }}>рост {financial.revenue_growth}</small>
            </div>
            
            <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '8px', minWidth: '180px', flex: 1 }}>
              <h3>📈 Эффективность</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF6C00', margin: '5px 0' }}>
                {financial.financial_health}
              </p>
              <small style={{ color: '#666' }}>финансовое состояние</small>
            </div>
          </div>

          {/* Графики */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <Plot
                data={[{
                  values: Object.values(stats.by_status),
                  labels: ['Завершено', 'Предстоящие', 'Отменены'],
                  type: 'pie',
                  marker: { colors: ['#2E7D32', '#1976D2', '#D32F2F'] },
                  textinfo: 'label+percent+value',
                  hole: 0.4
                }]}
                layout={{ 
                  width: 400, 
                  height: 350, 
                  title: '📊 Статусы визитов',
                  showlegend: true
                }}
              />
            </div>

            <div style={{ flex: '1', minWidth: '300px' }}>
              <Plot
                data={[{
                  x: stats.revenue.months,
                  y: stats.revenue.amounts,
                  type: 'bar',
                  marker: { 
                    color: stats.revenue.amounts.map((_, i) => 
                      ['#1976D2', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'][i]
                    )
                  },
                  text: stats.revenue.amounts.map(amount => `₽${(amount/1000).toFixed(0)}к`),
                  textposition: 'auto'
                }]}
                layout={{ 
                  width: 500, 
                  height: 350, 
                  title: '💵 Выручка по месяцам',
                  yaxis: { title: 'Сумма (руб)' }
                }}
              />
            </div>
          </div>

          {/* Распределение услуг */}
          <div style={{ marginBottom: '30px' }}>
            <h2>🎯 Распределение услуг</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.entries(stats.services).map(([service, count]) => (
                <div key={service} style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  minWidth: '120px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{count}</div>
                  <div style={{ fontSize: '14px' }}>{service}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Информация о клиниках */}
          <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '10px', border: '1px solid #dee2e6' }}>
            <h2>🏥 Клиники сети</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {clinics.map(clinic => (
                <div key={clinic.id} style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#1976D2' }}>{clinic.title}</h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div>📍 {clinic.address}</div>
                    <div>📞 {clinic.phone}</div>
                    <div>👨‍⚕️ Врачей: {clinic.doctors_count}</div>
                    <div>📊 Загрузка: {clinic.utilization}</div>
                    <div>🎯 Мощность: {clinic.monthly_capacity} визитов/мес</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;