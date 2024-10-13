'use client';
import React, { useState, useEffect } from 'react';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { DeviceList } from './device-list';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { getEloRanking } from './web3'; // Assuming this exists and gets ELO for devices

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
  elo: number | 'N/A';
}

const endpoint = 'http://192.168.2.1:8080/'; // Replace with your actual endpoint

const fetchDevices = async (): Promise<Map<string, Device[]>> => {
  try {
    const response = await axios.get(endpoint);
    return new Map(Object.entries(response.data));
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw new Error('Network response was not ok');
  }
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function OverViewPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [averageElo, setAverageElo] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);
  const [totalUpload, setTotalUpload] = useState(0);
  const [totalTotal, setTotalTotal] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);

  useEffect(() => {
    const updateDevices = async () => {
      try {
        const newDevicesMap = await fetchDevices();
        const mostRecentKey = Array.from(newDevicesMap.keys()).pop(); // Get the last key
        const mostRecentDevices = mostRecentKey
          ? newDevicesMap.get(mostRecentKey)
          : null; // Get the most recent array

        if (!mostRecentDevices) {
          return;
        }

        // Fetch ELO rankings for each device
        const devicesWithElo = await Promise.all(
          mostRecentDevices.map(async (device) => {
            try {
              const eloStr = await getEloRanking(device.mac); // Get ELO from web3.js
              const elo = parseFloat(eloStr);
              if (isNaN(elo)) {
                throw new Error('Invalid ELO value');
              }
              return { ...device, elo };
            } catch (error) {
              console.error(
                `Failed to fetch ELO for device ${device.mac}`,
                error
              );
              return { ...device, elo: 'N/A' };
            }
          })
        );

        // Filter out devices with zero traffic
        const filteredDevices = devicesWithElo.filter((device) => {
          const download = Number(device.data_in);
          const upload = Number(device.data_out);
          const total = download + upload;
          return total !== 0;
        });

        setDevices(filteredDevices);

        const { totalElo, totalDownload, totalUpload, deviceCount } =
          filteredDevices.reduce(
            (acc, device) => {
              acc.totalElo += typeof device.elo === 'number' ? device.elo : 0;
              acc.totalDownload += Number(device.data_in);
              acc.totalUpload += Number(device.data_out);
              acc.deviceCount += 1;
              return acc;
            },
            { totalElo: 0, totalDownload: 0, totalUpload: 0, deviceCount: 0 }
          );

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
    const interval = setInterval(updateDevices, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Network Analytics Dashboard
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <span className="font-EloFi text-2xl">
              {/* EloFi Admin Dashboard */}
            </span>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Traffic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(totalTotal)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Device ELO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageElo}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Download
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(totalDownload)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(totalUpload)}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Render Graphs and Device List */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Device List</CardTitle>
                  <CardDescription>
                    {/* There are {deviceCount} device(s) currently connected. */}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeviceList />
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
