import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function App() {
  const [realData, setRealData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      const [dataResponse, statusResponse] = await Promise.all([
        fetch('/api/real/data'),
        fetch('/api/connection-status')
      ]);

      const data = await dataResponse.json();
      const status = await statusResponse.json();

      setRealData(data);
      setConnectionStatus(status);
    } catch (error) {
      console.error('Error loading real data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>🔄 Загрузка реальных данных из МИС...</h2>
      <p>Подключение к медицинской информационной системе</p>
    </div>
  );

  const data = realData?.data;
  const usingFallback = realData?.using_fallback;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Заголовок с статусом */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '15px',
        background: usingFallback ? '#FFF3CD' : '#D1ECF1',
        borderRadius: '8px',
        border: `1px solid ${usingFallback ? '#FFEAA8' : '#BEE5EB'}`
      }}>
        <div>
          <h1 style={{ margin: 0, color: usingFallback ? '#856404' : '#0C5460' }}>
            🏥 Медицинская аналитика {usingFallback ? '(Демо-данные)' : '(Реальные данные)'}
          </h1>
          <p style={{ margin: '5px 0 0 0', color: usingFallback ? '#856404' : '#0C5460' }}>
            {connectionStatus?.message}
            {connectionStatus?.clinic_name && ` • ${connectionStatus.clinic_name}`}
          </p>
        </div>
        <div style={{
          padding: '8px 16px',
          background: usingFallback ? '#FFC107' : '#17A2B8',
          color: 'white',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {usingFallback ? 'ДЕМО-РЕЖИМ' : 'РЕАЛЬНЫЕ ДАННЫЕ'}
        </div>
      </div>

      {data && (
        <div>
          {/* Ключевые метрики */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ 
              background: usingFallback ? '#E2E3E5' : '#E3F2FD', 
              padding: '20px', 
              borderRadius: '8px', 
              minWidth: '180px', 
              flex: 1 
            }}>
              <h3>👥 Всего визитов</h3>
              <p style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: usingFallback ? '#6C757D' : '#1976D2', 
                margin: '5px 0' 
              }}>
                {data.total_appointments}
              </p>
              <small style={{ color: '#666' }}>за 30 дней</small>
            </div>
            
            <div style={{ 
              background: usingFallback ? '#E2E3E5' : '#E8F5E8', 
              padding: '20px', 
              borderRadius: '8px', 
              minWidth: '180px', 
              flex: 1 
            }}>
              <h3>💰 Выручка</h3>
              <p style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: usingFallback ? '#6C757D' : '#2E7D32', 
                margin: '5px 0' 
              }}>
                {(data.revenue_data.total_revenue / 1000000).toFixed(1)}M ₽
              </p>
              <small style={{ color: '#666' }}>средний чек: {data.revenue_data.average_receipt} ₽</small>
            </div>
            
            <div style={{ 
              background: usingFallback ? '#E2E3E5' : '#FFF3E0', 
              padding: '20px', 
              borderRadius: '8px', 
              minWidth: '180px', 
              flex: 1 
            }}>
              <h3>📊 Эффективность</h3>
              <p style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: usingFallback ? '#6C757D' : '#EF6C00', 
                margin: '5px 0' 
              }}>
                {Math.round((data.by_status.completed / data.total_appointments) * 100)}%
              </p>
              <small style={{ color: '#666' }}>доля завершенных</small>
            </div>
          </div>

          {/* Графики */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
            {/* Статусы визитов */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <Plot
                data={[{
                  values: Object.values(data.by_status),
                  labels: Object.keys(data.by_status).map(key => {
                    const labels = {
                      'completed': 'Завершено',
                      'upcoming': 'Предстоящие', 
                      'refused': 'Отменены'
                    };
                    return labels[key] || key;
                  }),
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

            {/* Выручка по месяцам */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <Plot
                data={[{
                  x: data.revenue_data.months,
                  y: data.revenue_data.amounts,
                  type: 'bar',
                  marker: { 
                    color: data.revenue_data.amounts.map((_, i) => 
                      ['#1976D2', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'][i]
                    )
                  },
                  text: data.revenue_data.amounts.map(amount => `₽${(amount/1000).toFixed(0)}к`),
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

          {/* Информация о клиниках */}
          {data.clinics && data.clinics.length > 0 && (
            <div style={{ 
              background: usingFallback ? '#F8F9FA' : '#E8F5E8', 
              padding: '25px', 
              borderRadius: '10px',
              marginBottom: '30px'
            }}>
              <h2>🏥 Клиники в системе</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {data.clinics.map(clinic => (
                  <div key={clinic.id} style={{ 
                    background: 'white', 
                    padding: '20px', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#1976D2' }}>{clinic.title}</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {clinic.city && <div>📍 {clinic.city}</div>}
                      {clinic.phone && <div>📞 {clinic.phone}</div>}
                      {clinic.address && <div>🏢 {clinic.address}</div>}
                      {clinic.email && <div>📧 {clinic.email}</div>}
                      <div>📊 Визитов: {data.by_clinic[clinic.title] || 0}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Категории услуг */}
          {data.services_by_category && Object.keys(data.services_by_category).length > 0 && (
            <div style={{ 
              background: usingFallback ? '#F8F9FA' : '#E3F2FD', 
              padding: '25px', 
              borderRadius: '10px' 
            }}>
              <h2>🎯 Категории услуг</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {Object.entries(data.services_by_category).map(([category, count]) => (
                  <div key={category} style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    minWidth: '150px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{count}</div>
                    <div style={{ fontSize: '14px' }}>{category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button 
        onClick={loadRealData}
        style={{
          padding: '10px 20px',
          background: usingFallback ? '#6C757D' : '#28A745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px',
          fontSize: '16px'
        }}
      >
        🔄 Обновить данные
      </button>
    </div>
  );
}

export default App;