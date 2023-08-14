import React, { useEffect, useRef, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';

interface CallData {
  startTime: string;
  duration: number; // Add the duration property to CallData
}

export default function Line() {
  const callChartDataRef = useRef<HTMLCanvasElement>(null); // Ref for call data chart
  const avgDurationChartDataRef = useRef<HTMLCanvasElement>(null); // Ref for average duration chart

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

  const [callData, setCallData] = useState<CallData[]>([]);
  const [callDurations, setCallDurations] = useState<number[]>([]); // State to hold call durations
  const [averageDurations, setAverageDurations] = useState<number[]>([]); // State to hold average durations
  const [filterBy, setFilterBy] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Define the start time and end time values
        const startTime = '2023-06-10';
        const endTime = '2023-06-20';

        // Append the start time and end time values to the URL as query parameters
        const response = await fetch(
          `/api/calls?startTime=${startTime}&endTime=${endTime}`
        );
        const data = await response.json();
        setCallData(data);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const transformData = (data: CallData[]): number[] => {
    let callsByInterval: number[] = [];
    if (filterBy === 'day') {
      callsByInterval = new Array(24).fill(0);
      data.forEach((call: CallData) => {
        const startTime = new Date(call.startTime);
        const hour = startTime.getHours();
        callsByInterval[hour]++;
      });
    } else if (filterBy === 'week') {
      callsByInterval = new Array(7).fill(0);
      data.forEach((call: CallData) => {
        const startTime = new Date(call.startTime);
        const dayOfWeek = startTime.getDay();
        callsByInterval[dayOfWeek]++;
      });
    } else if (filterBy === 'month') {
      callsByInterval = new Array(31).fill(0);
      data.forEach((call: CallData) => {
        const startTime = new Date(call.startTime);
        const dayOfMonth = startTime.getDate();
        callsByInterval[dayOfMonth - 1]++;
      });
    }
    return callsByInterval;
  };

  const transformDurationData = (data: CallData[]): number[] => {
    let durationsByInterval: number[] = [];
    if (filterBy === 'day') {
      durationsByInterval = new Array(24).fill(0);
      data.forEach((call: CallData) => {
        const startTime = new Date(call.startTime);
        const hour = startTime.getHours();
        durationsByInterval[hour] += call.duration;
      });
    } else if (filterBy === 'week') {
      durationsByInterval = new Array(7).fill(0);
      data.forEach((call: CallData) => {
        const startTime = new Date(call.startTime);
        const dayOfWeek = startTime.getDay();
        durationsByInterval[dayOfWeek] += call.duration;
      });
    } else if (filterBy === 'month') {
      durationsByInterval = new Array(31).fill(0);
      data.forEach((call: CallData) => {
        const startTime = new Date(call.startTime);
        const dayOfMonth = startTime.getDate();
        durationsByInterval[dayOfMonth - 1] += call.duration;
      });
    }
    return durationsByInterval;
  };

  const calculateAverageDurations = (
    callData: CallData[],
    durationsByInterval: number[]
  ): number[] => {
    const callCounts = transformData(callData);
    return durationsByInterval.map((totalDuration, index) =>
      callCounts[index] > 0 ? totalDuration / callCounts[index] : 0
    );
  };

  const transformedData: number[] = transformData(callData);
  const transformedDurations: number[] = transformDurationData(callData);
  const avgDurationsByInterval: number[] = calculateAverageDurations(
    callData,
    transformedDurations
  );

  useEffect(() => {
    if (callChartDataRef.current === null) return;
    const ctx = callChartDataRef.current.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    let labels: string[] = [];
    let data: number[] = [];
    let yAxesMax = 1.25 * Math.max(...transformedData);

    if (filterBy === 'day') {
      labels = [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
      ];
      data = transformedData;
    } else if (filterBy === 'week') {
      labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      data = transformedData;
    } else if (filterBy === 'month') {
      labels = Array.from(
        { length: transformedData.length },
        (_, i) => i + 1
      ).map(String);
      data = transformedData;
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Average Call Duration',
          data,
          backgroundColor: colors.purple.half,
          borderColor: colors.indigo.default,
          pointStyle: 'circle',
          pointRadius: 6, // Adjust the size of the circles
          pointHoverRadius: 9, // Adjust the size of the circles on hover
        },
      ],
    };
    const config: ChartConfiguration = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Number of Calls',
            font: {
              size: 20,
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: { color: 'black' },
            grid: {
              color: () => '#969696',
            },
          },
          y: {
            ticks: {
              color: 'black',
              stepSize: yAxesMax / 5, // Divide the y-axes range into 5 equal steps
            },
            max: yAxesMax,
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
  }, [filterBy, transformedData]);

  useEffect(() => {
    if (avgDurationChartDataRef.current === null) return;
    const ctx = avgDurationChartDataRef.current.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    let labels: string[] = [];
    let data: number[] = [];

    let yAxesMax = 1.25 * Math.max(...avgDurationsByInterval);

    if (filterBy === 'day') {
      labels = [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
      ];
      data = avgDurationsByInterval;
    } else if (filterBy === 'week') {
      labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      data = avgDurationsByInterval;
    } else if (filterBy === 'month') {
      labels = Array.from(
        { length: avgDurationsByInterval.length },
        (_, i) => i + 1
      ).map(String);
      data = avgDurationsByInterval;
    }

    console.log('WAIT');
    console.log(labels);
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Average Call Duration',
          data,
          backgroundColor: colors.purple.half,
          borderColor: colors.indigo.default,
          pointStyle: 'circle',
          pointRadius: 6, // Adjust the size of the circles
          pointHoverRadius: 9, // Adjust the size of the circles on hover
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Average Call Duration',
            font: {
              size: 20,
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: { color: 'black' },
            grid: {
              color: () => '#969696',
            },
          },
          y: {
            ticks: {
              color: 'black',
              stepSize: yAxesMax / 5, // Divide the y-axes range into 5 equal steps
              callback: (value) =>
                typeof value === 'number' ? `${value}s` : value,
            },
            max: yAxesMax,
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
  }, [filterBy, avgDurationsByInterval]);

  return (
    <article>
      <div>
        <div>
          <span style={{ marginLeft: '3rem' }}>Filter By:</span>{' '}
          <select
            value={filterBy}
            onChange={(e) =>
              setFilterBy(e.target.value as 'day' | 'week' | 'month')
            }
            style={{
              borderRadius: '0.25rem', // Add rounded edges
              backgroundColor: '#f3f4f6', // Change the background color
              padding: '0.5rem', // Add some padding
            }}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <div style={{ display: 'flex', maxWidth: '100vw', overflowX: 'auto' }}>
          <div style={{ flex: 1 }}>
            <canvas ref={callChartDataRef} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <canvas ref={avgDurationChartDataRef} style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </article>
  );
}
