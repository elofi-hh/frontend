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

interface BarOnGraph {
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

const endpoint = 'http://192.168.2.1:8080/'; // Replace with your actual endpoint

const fetchDevices = async (): Promise<[Device[]]> => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    // console.error('Error fetching devices:', error);
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

export const description = 'An interactive bar chart';

const chartData = [{ date: '2024-04-01', bytes: 222, mobile: 150 }];

const chartConfig = {
  views: {
    label: 'Page Views'
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
  const [devices, setDevices] = useState<Device[]>([]);
  const [averageElo, setAverageElo] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);
  const [totalUpload, setTotalUpload] = useState(0);
  const [totalTotal, setTotalTotal] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);
  // const [chartData, setChartData] = useState(0);

  useEffect(() => {
    const updateDevices = async () => {
      try {
        const newDevices = await fetchDevices();
        const mostRecentDevices = newDevices[newDevices.length - 1]; // Get the most recent array

        setDevices(mostRecentDevices);

        const { totalElo, totalDownload, totalUpload, deviceCount } =
          mostRecentDevices.reduce(
            (acc, device) => {
              acc.totalElo += 1; // TODO: fix this
              acc.totalDownload += Number(device.data_in);
              acc.totalUpload += Number(device.data_out);
              acc.deviceCount += 1;
              return acc;
            },
            { totalElo: 0, totalDownload: 0, totalUpload: 0, deviceCount: 0 }
          );

        console.log('here', totalDownload);

        setAverageElo(totalElo / deviceCount);
        setTotalDownload(totalDownload);
        setTotalUpload(totalUpload);
        setTotalTotal(totalDownload + totalUpload);
        setDeviceCount(deviceCount);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    updateDevices();
    const interval = setInterval(updateDevices, 5000);

    return () => clearInterval(interval);
  }, []);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('bytes');

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Live Bandwidth Usage</CardTitle>
          <CardDescription>
            Showing bandwidth usage for the last 5 minutes
          </CardDescription>
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
                  {totalTotal.toLocaleString()}
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
                const date = new Date(value);
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
                    return new Date(value).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }); // Convert to Unix time
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
