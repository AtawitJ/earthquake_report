import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import MapComponent from './MapComponent';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css'; // สำหรับ pulse และ UI

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [selectedDate, setSelectedDate] = useState('All');
  const [theme, setTheme] = useState('dark');
  const [mapCenter] = useState([13.736717, 100.523186]);

  // Fetch ทุก 5 นาที
  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/api/earthquakes")
        .then(res => res.json())
        .then(data => setEarthquakes(data.DailyEarthquakes || []))
        .catch(err => console.error("❌ Fetch error:", err));
    };
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 นาที
    return () => clearInterval(interval);
  }, []);

  const groupedByMonthYear = earthquakes.reduce((acc, eq) => {
    const date = eq.DateTimeThai.split(' ')[0];
    const monthYear = date.slice(0, 7); // yyyy-mm
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push({ 
      ...eq, 
      date,
      coordinates: [parseFloat(eq.Latitude), parseFloat(eq.Longitude)],
      magnitude: parseFloat(eq.Magnitude),
      depth: parseFloat(eq.Depth),
      location: eq.OriginThai
    });
    return acc;
  }, {});

    // หลังจาก groupedByMonthYear
  const availableMonths = Object.keys(groupedByMonthYear).sort(); // เรียงเดือนจากเก่าสุด -> ล่าสุด
  const latestMonth = availableMonths[availableMonths.length - 1]; // เดือนล่าสุด

  const availableDates = selectedMonthYear && groupedByMonthYear[selectedMonthYear]
    ? ['All', ...[...new Set(groupedByMonthYear[selectedMonthYear].map(e => e.date))]]
    : [];

  // ตั้งค่า default เดือนล่าสุดและ All dates
  useEffect(() => {
    if (latestMonth) {
      setSelectedMonthYear(latestMonth);
      setSelectedDate('All');
    }
  }, [latestMonth]);


  const filteredEarthquakes = selectedMonthYear
    ? selectedDate === 'All'
      ? groupedByMonthYear[selectedMonthYear]
      : groupedByMonthYear[selectedMonthYear].filter(e => e.date === selectedDate)
    : [];

  const getColorByMagnitude = (mag) => {
    if (mag < 3) return '#90ee90';
    if (mag < 5) return '#ffff66';
    if (mag < 6) return '#ffa500';
    if (mag < 7) return '#ff3333';
    return '#8b0000';
  };

  const backgroundColor = theme === 'dark' ? '#1e1e1e' : '#f4f4f4';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <div style={{ padding: '10px', backgroundColor, color: textColor, minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🚨 Earthquake Reporting</h1>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Theme : {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {availableMonths.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <label>Month-Year: </label>
          <select
            value={selectedMonthYear}
            onChange={(e) => {
              setSelectedMonthYear(e.target.value);
              const firstDate = groupedByMonthYear[e.target.value][0]?.date;
              setSelectedDate(firstDate);
            }}
            style={{ background: '#333', color: '#fff', border: '1px solid #555', marginRight: '10px' }}
          >
            {availableMonths.map(monthYear => (
              <option key={monthYear} value={monthYear}>{monthYear}</option>
            ))}
          </select>

          <label>Date: </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ background: '#333', color: '#fff', border: '1px solid #555' }}
          >
            {availableDates.map(date => (
              <option key={date} value={date}>
                {date === 'All' ? 'All Dates' : date}
              </option>
            ))}
          </select>

        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <MapComponent 
          earthquakes={filteredEarthquakes} 
          mapCenter={mapCenter} 
          getColorByMagnitude={getColorByMagnitude} 
          theme={theme}  
        />
      </div>

      {filteredEarthquakes.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>📊 Magnitude Chart</h2>
          <BarChart data={filteredEarthquakes} theme={theme} />
        </div>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '24px', opacity: 0.7 }}>
        🚀 Created by <a href="https://github.com/AtawitJ" target="_blank" rel="noopener noreferrer" style={{ color: textColor, textDecoration: 'underline' }}>AtawitJ</a>
      </div>
    </div>
  );
}

export default App;
