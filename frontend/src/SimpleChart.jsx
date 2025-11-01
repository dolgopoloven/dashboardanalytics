import Plot from 'react-plotly.js';

function SimpleChart({ data }) {
  return (
    <div style={{ margin: '20px 0' }}>
      <Plot
        data={[
          {
            x: data.months,
            y: data.sales,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue', size: 8 },
            line: { color: 'blue', width: 2 },
            name: 'Продажи'
          },
        ]}
        layout={{ 
          width: 700, 
          height: 400, 
          title: 'Продажи по месяцам',
          xaxis: { title: 'Месяцы' },
          yaxis: { title: 'Продажи' },
          paper_bgcolor: '#f9f9f9',
          plot_bgcolor: '#f9f9f9'
        }}
        config={{ responsive: true }}
      />
    </div>
  );
}

export default SimpleChart;