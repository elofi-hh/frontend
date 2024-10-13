'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

interface Device {
  id: number;
  interface: string;
  mac: string;
  ip: string;
  data_in: number;
  data_out: number;
  data_total: number;
  first_date: number;
  last_date: number;
  elo: string;
}

interface ChartDataValues {
  date: string;
  bytes: number;
  mobile: number;
}

const endpoint = 'http://192.168.2.1:8080/'; // Replace with your actual endpoint

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const fetchDevices = async (): Promise<Map<string, Device[]>> => {
  try {
    const response = await axios.get(endpoint);
    return new Map(Object.entries(response.data));
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw new Error('Network response was not ok');
  }
};

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { set } from 'date-fns';

export const description = 'An interactive bar chart';

const chartConfig = {
  views: {
    label: 'Bytes'
  },
  bytes: {
    label: 'Bytes',
    color: 'hsl(var(--chart-1))'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('bytes');

  const [devices, setDevices] = useState<Device[]>([]);
  const [averageElo, setAverageElo] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);
  const [totalUpload, setTotalUpload] = useState(0);
  const [totalTotal, setTotalTotal] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);
  const [chartData, setChartData] = useState<ChartDataValues[]>([]);
  const [previousTotalBytes, setPreviousTotalBytes] = useState<number>(0);

  useEffect(() => {
    const updateDevices = async () => {
      try {
        const newDevices = await fetchDevices();
        const mostRecentKey = Array.from(newDevices.keys()).pop();
        const mostRecentDevices = mostRecentKey
          ? newDevices.get(mostRecentKey)
          : null;

        if (!mostRecentDevices) {
          return;
        }

        setDevices(mostRecentDevices);

        var count = 0;
        var previousTotalBytes2 = 0;
        const newChartData: ChartDataValues[] = [];
        newDevices.forEach((snapshot, index) => {
          const totalBytes = snapshot.reduce(
            (sum, device) => sum + device.data_in + device.data_out,
            0
          );

          setTotalTotal((prevTotal) => prevTotal + totalBytes);

          const previousBytes =
            previousTotalBytes2 !== 0 ? previousTotalBytes2 : totalBytes;
          const bytesDifference = totalBytes - previousBytes;

          if (bytesDifference > 0) {
            newChartData.push({
              date: (Date.now() - (newDevices.size - count) * 5000).toString(),
              bytes: bytesDifference,
              mobile: 0
            });
          }

          setPreviousTotalBytes(totalBytes);
          previousTotalBytes2 = totalBytes;

          count++;
        });

        setChartData(newChartData);

        setActiveChart('bytes');
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    updateDevices();
    const interval = setInterval(updateDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   console.log('chartData', chartData);
  // }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Live Bandwidth Usage</CardTitle>
          <CardDescription>Showing recent bandwidth usage</CardDescription>
        </div>
        <div className="flex">
          {['bytes'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {formatBytes(totalTotal)}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // console.log('Tick value:', value); // Debugging log
                const date = new Date(Number(value)); // Ensure value is in milliseconds
                return date.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    // console.log('Tooltip value:', value); // Debugging log
                    const date = new Date(Number(value)); // Ensure value is in milliseconds
                    return date.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
