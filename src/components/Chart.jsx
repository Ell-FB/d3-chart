import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

const Chart = ({ chartData }) => {
  const chartRef = useRef(null);
  const [error, setError] = useState(null);
  const [svg, setSvg] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [margin, setMargin] = useState({ top: 40, right: 30, bottom: 50, left: 60 });
  const [x, setX] = useState(null);
  const [data, setData] = useState([]);

  // Determine if the chart is single or multi-series
  const isMultiSeries = (data) => {
    if (!data || data.length === 0) return false;
    // Check if the second element of the first data point is an array
    return Array.isArray(data[0][1]);
  };

  // Function to render the chart
  const renderChart = useCallback(() => {
    // Reset error state
    setError(null);

    // Validate chartData
    if (!chartData) {
      setError("Chart data is missing");
      return;
    }

    if (!chartRef.current) return;

    // Validate required properties
    if (!chartData.title) {
      setError("Chart title is missing");
      return;
    }

    if (!chartData.data || !Array.isArray(chartData.data) || chartData.data.length === 0) {
      setError("Chart data is invalid or empty");
      return;
    }

    // Clear any existing chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Get container width for responsive sizing
    const containerWidth = chartRef.current.clientWidth || 800;

    // Set margin, width, and height
    const newMargin = { top: 40, right: 30, bottom: 50, left: 60 };
    const newWidth = containerWidth - newMargin.left - newMargin.right;
    const newHeight = 400 - newMargin.top - newMargin.bottom;

    setMargin(newMargin);
    setWidth(newWidth);
    setHeight(newHeight);

    // Create SVG
    const newSvg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', newWidth + newMargin.left + newMargin.right)
      .attr('height', newHeight + newMargin.top + newMargin.bottom)
      .append('g')
      .attr('transform', `translate(${newMargin.left},${newMargin.top})`);

    // Add title
    newSvg.append('text')
      .attr('x', newWidth / 2)
      .attr('y', -newMargin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(chartData.title);

    // Set data
    const newData = chartData.data;
    setData(newData);

    const multi = isMultiSeries(newData);

    // Create scales
    const xExtent = d3.extent(newData, d => d[0]);
    const newX = d3.scaleLinear()
      .domain(xExtent)
      .range([0, newWidth]);

    // Set x scale
    setX(newX);

    // Set svg
    setSvg(newSvg);

    // Add X axis
    newSvg.append('g')
      .attr('transform', `translate(0,${newHeight})`)
      .call(d3.axisBottom(newX));

    // Add X axis label
    newSvg.append('text')
      .attr('x', newWidth / 2)
      .attr('y', newHeight + newMargin.bottom - 10)
      .style('text-anchor', 'middle')
      .text('Time');

    if (multi) {
      // Multi-series chart
      try {
        // Find the number of series (assuming all data points have the same number of series)
        const seriesCount = newData[0][1].length;

        // Find y domain across all series
        const allValues = newData.flatMap(d => d[1]);
        const yExtent = d3.extent(allValues.flat().filter(v => v !== null));

        const y = d3.scaleLinear()
          .domain(yExtent)
          .range([newHeight, 0]);

        // Add Y axis
        newSvg.append('g')
          .call(d3.axisLeft(y));

        // Add Y axis label
        newSvg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - newMargin.left)
          .attr('x', 0 - (newHeight / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .text('Value');

        // Define line generator
        const line = d3.line()
          .x(d => newX(d[0]))
          .y(d => y(d[1]))
          .defined(d => d[1] !== null); // Skip null values

        // Colors for different series
        const colors = ['blue', 'green', 'red', 'purple', 'orange', 'teal'];
        const seriesNames = chartData.seriesNames || Array(seriesCount).fill('').map((_, i) => `Series ${i+1}`);

        // Add lines for each series dynamically
        for (let i = 0; i < seriesCount; i++) {
          const seriesData = newData.map(d => [d[0], d[1][i]]).filter(d => d[1] !== null);
          const color = colors[i % colors.length];

          newSvg.append('path')
            .datum(seriesData)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('d', line);

          // Add to legend
          const legendY = newHeight + newMargin.bottom - 15;
          const legendX = newMargin.left + (newWidth / seriesCount) * i;

          // Add colored line to legend
          newSvg.append('line')
            .attr('x1', legendX)
            .attr('y1', legendY)
            .attr('x2', legendX + 20)
            .attr('y2', legendY)
            .attr('stroke', color)
            .attr('stroke-width', 2);

          // Add series name to legend
          newSvg.append('text')
            .attr('x', legendX + 25)
            .attr('y', legendY + 4)
            .text(seriesNames[i])
            .style('font-size', '12px')
            .attr('alignment-baseline', 'middle');
        }
      } catch (err) {
        console.error("Error rendering multi-series chart:", err);
        setError("Error rendering multi-series chart: " + err.message);
      }
    } else {
      // Single-series chart
      try {
        // Find y domain
        const yExtent = d3.extent(newData.map(d => d[1]).filter(v => v !== null));

        const y = d3.scaleLinear()
          .domain(yExtent)
          .range([newHeight, 0]);

        // Add Y axis
        newSvg.append('g')
          .call(d3.axisLeft(y));

        // Add Y axis label
        newSvg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - newMargin.left)
          .attr('x', 0 - (newHeight / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .text('Value');

        // Define line generator
        const line = d3.line()
          .x(d => newX(d[0]))
          .y(d => y(d[1]))
          .defined(d => d[1] !== null); // Skip null values

        // Add the line
        newSvg.append('path')
          .datum(newData.filter(d => d[1] !== null))
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 2)
          .attr('d', line);
      } catch (err) {
        console.error("Error rendering single-series chart:", err);
        setError("Error rendering single-series chart: " + err.message);
      }
    }
  }, [chartData, isMultiSeries]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      renderChart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderChart]);

  // Initial render
  useEffect(() => {
    renderChart();
  }, [renderChart]);

  return (
    <div className="chart-container mb-8">
      {error ? (
        <div className="error-message p-4 bg-red-100 text-red-700 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div ref={chartRef}></div>
      )}
    </div>
  );
};

export default Chart;
