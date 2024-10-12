'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

const chartData = [
  { date: '2024-04-01', bytes: 222, mobile: 150 },
  { date: '2024-04-02', bytes: 97, mobile: 180 },
  { date: '2024-04-03', bytes: 167, mobile: 120 },
  { date: '2024-04-04', bytes: 242, mobile: 260 },
  { date: '2024-04-05', bytes: 373, mobile: 290 },
  { date: '2024-04-06', bytes: 301, mobile: 340 },
  { date: '2024-04-07', bytes: 245, mobile: 180 },
  { date: '2024-04-08', bytes: 409, mobile: 320 },
  { date: '2024-04-09', bytes: 59, mobile: 110 },
  { date: '2024-04-10', bytes: 261, mobile: 190 },
  { date: '2024-04-11', bytes: 327, mobile: 350 },
  { date: '2024-04-12', bytes: 292, mobile: 210 },
  { date: '2024-04-13', bytes: 342, mobile: 380 },
  { date: '2024-04-14', bytes: 137, mobile: 220 },
  { date: '2024-04-15', bytes: 120, mobile: 170 },
  { date: '2024-04-16', bytes: 138, mobile: 190 },
  { date: '2024-04-17', bytes: 446, mobile: 360 },
  { date: '2024-04-18', bytes: 364, mobile: 410 },
  { date: '2024-04-19', bytes: 243, mobile: 180 },
  { date: '2024-04-20', bytes: 89, mobile: 150 },
  { date: '2024-04-21', bytes: 137, mobile: 200 },
  { date: '2024-04-22', bytes: 224, mobile: 170 },
  { date: '2024-04-23', bytes: 138, mobile: 230 },
  { date: '2024-04-24', bytes: 387, mobile: 290 },
  { date: '2024-04-25', bytes: 215, mobile: 250 },
  { date: '2024-04-26', bytes: 75, mobile: 130 },
  { date: '2024-04-27', bytes: 383, mobile: 420 },
  { date: '2024-04-28', bytes: 122, mobile: 180 },
  { date: '2024-04-29', bytes: 315, mobile: 240 },
  { date: '2024-04-30', bytes: 454, mobile: 380 },
  { date: '2024-05-01', bytes: 165, mobile: 220 },
  { date: '2024-05-02', bytes: 293, mobile: 310 },
  { date: '2024-05-03', bytes: 247, mobile: 190 },
  { date: '2024-05-04', bytes: 385, mobile: 420 },
  { date: '2024-05-05', bytes: 481, mobile: 390 },
  { date: '2024-05-06', bytes: 498, mobile: 520 },
  { date: '2024-05-07', bytes: 388, mobile: 300 },
  { date: '2024-05-08', bytes: 149, mobile: 210 },
  { date: '2024-05-09', bytes: 227, mobile: 180 },
  { date: '2024-05-10', bytes: 293, mobile: 330 },
  { date: '2024-05-11', bytes: 335, mobile: 270 },
  { date: '2024-05-12', bytes: 197, mobile: 240 },
  { date: '2024-05-13', bytes: 197, mobile: 160 },
  { date: '2024-05-14', bytes: 448, mobile: 490 },
  { date: '2024-05-15', bytes: 473, mobile: 380 },
  { date: '2024-05-16', bytes: 338, mobile: 400 },
  { date: '2024-05-17', bytes: 499, mobile: 420 },
  { date: '2024-05-18', bytes: 315, mobile: 350 },
  { date: '2024-05-19', bytes: 235, mobile: 180 },
  { date: '2024-05-20', bytes: 177, mobile: 230 },
  { date: '2024-05-21', bytes: 82, mobile: 140 },
  { date: '2024-05-22', bytes: 81, mobile: 120 },
  { date: '2024-05-23', bytes: 252, mobile: 290 },
  { date: '2024-05-24', bytes: 294, mobile: 220 },
  { date: '2024-05-25', bytes: 201, mobile: 250 },
  { date: '2024-05-26', bytes: 213, mobile: 170 },
  { date: '2024-05-27', bytes: 420, mobile: 460 },
  { date: '2024-05-28', bytes: 233, mobile: 190 },
  { date: '2024-05-29', bytes: 78, mobile: 130 },
  { date: '2024-05-30', bytes: 340, mobile: 280 },
  { date: '2024-05-31', bytes: 178, mobile: 230 },
  { date: '2024-06-01', bytes: 178, mobile: 200 },
  { date: '2024-06-02', bytes: 470, mobile: 410 },
  { date: '2024-06-03', bytes: 103, mobile: 160 },
  { date: '2024-06-04', bytes: 439, mobile: 380 },
  { date: '2024-06-05', bytes: 88, mobile: 140 },
  { date: '2024-06-06', bytes: 294, mobile: 250 },
  { date: '2024-06-07', bytes: 323, mobile: 370 },
  { date: '2024-06-08', bytes: 385, mobile: 320 },
  { date: '2024-06-09', bytes: 438, mobile: 480 },
  { date: '2024-06-10', bytes: 155, mobile: 200 },
  { date: '2024-06-11', bytes: 92, mobile: 150 },
  { date: '2024-06-12', bytes: 492, mobile: 420 },
  { date: '2024-06-13', bytes: 81, mobile: 130 },
  { date: '2024-06-14', bytes: 426, mobile: 380 },
  { date: '2024-06-15', bytes: 307, mobile: 350 },
  { date: '2024-06-16', bytes: 371, mobile: 310 },
  { date: '2024-06-17', bytes: 475, mobile: 520 },
  { date: '2024-06-18', bytes: 107, mobile: 170 },
  { date: '2024-06-19', bytes: 341, mobile: 290 },
  { date: '2024-06-20', bytes: 408, mobile: 450 },
  { date: '2024-06-21', bytes: 169, mobile: 210 },
  { date: '2024-06-22', bytes: 317, mobile: 270 },
  { date: '2024-06-23', bytes: 480, mobile: 530 },
  { date: '2024-06-24', bytes: 132, mobile: 180 },
  { date: '2024-06-25', bytes: 141, mobile: 190 },
  { date: '2024-06-26', bytes: 434, mobile: 380 },
  { date: '2024-06-27', bytes: 448, mobile: 490 },
  { date: '2024-06-28', bytes: 149, mobile: 200 },
  { date: '2024-06-29', bytes: 103, mobile: 160 },
  { date: '2024-06-30', bytes: 446, mobile: 400 }
];

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
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('bytes');

  const total = React.useMemo(
    () => ({
      bytes: chartData.reduce((acc, curr) => acc + curr.bytes, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0)
    }),
    []
  );

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
                  {total[key as keyof typeof total].toLocaleString()}
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
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
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
