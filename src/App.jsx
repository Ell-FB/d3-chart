import { useState, useEffect } from 'react'
import Chart from './components/Chart'
// Import the data from data.json
import jsonData from '../constants/data.json'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Load data from data.json
    setData(jsonData);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400">D3.js Chart Visualization</h1>

      <div className="w-full max-w-6xl mx-auto">
        {data.length > 0 ? (
          data.map((chart, index) => (
            <Chart key={index} chartData={chart} />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading chart data...</p>
        )}
      </div>
    </div>
  )
}

export default App
