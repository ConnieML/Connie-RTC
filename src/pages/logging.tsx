import React, { useEffect, useRef, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';

export default function Line() {
  const canvasEl = useRef<HTMLCanvasElement>(null);

  const colors = {
    purple: {
      default: 'rgba(149, 76, 233, 1)',
      half: 'rgba(149, 76, 233, 0.5)',
      quarter: 'rgba(149, 76, 233, 0.25)',
      zero: 'rgba(149, 76, 233, 0)',
    },
    indigo: {
      default: 'rgba(80, 102, 120, 1)',
      quarter: 'rgba(80, 102, 120, 0.25)',
    },
  };

  const [callData, setCallData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/endpoint-url'); 
        const data = await response.json();
        setCallData(data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // ...

  const transformData = (data: any[]) => {
    const callsByHour = new Array(24).fill(0); // Initialize an array to hold the count of calls for each hour

    // Loop through the data and increment the count for the corresponding hour
    data.forEach((call: any) => {
      const startTime = new Date(call.startTime);
      const hour = startTime.getHours();
      callsByHour[hour]++;
    });

    return callsByHour;
  };

// ...


  const transformedData = transformData(callData);

  useEffect(() => {
    if (canvasEl.current === null) return;
    const ctx = canvasEl.current.getContext('2d') as CanvasRenderingContext2D;

    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);

    const data = {
      labels: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
      ],
      datasets: [
        {
          label: 'Number of Calls',
          data: transformedData,
          backgroundColor: colors.purple.default,
          borderColor: colors.indigo.default,
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15,
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'line',
      data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Number of Calls',
            font: {
              size: 20
            }
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: { color: 'white' },
            grid: {
              color: () => '#969696',
            },
          },
          y: {
            ticks: { color: 'white' },
            grid: {
              color: () => '#969696',
            },
          },
        },
      },
    };
    

    const myLineChart = new Chart(ctx, config);

    return function cleanup() {
      myLineChart.destroy();
    };
  });

  return (
    <article>
      <canvas ref={canvasEl} className="w-[54vw]" />
    </article>
  );
}
