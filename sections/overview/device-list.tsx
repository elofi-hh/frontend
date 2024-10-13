'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import './DeviceList.css'; // Import the CSS file
import axios from 'axios';

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

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [averageElo, setAverageElo] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);
  const [totalUpload, setTotalUpload] = useState(0);
  const [totalTotal, setTotalTotal] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);

  useEffect(() => {
    const updateDevices = async () => {
      try {
        const newDevices = await fetchDevices();

        console.log('newDevices', newDevices);

        const mostRecentKey = Array.from(newDevices.keys()).pop(); // Get the last key
        const mostRecentDevices = mostRecentKey
          ? newDevices.get(mostRecentKey)
          : null; // Get the most recent array

        if (!mostRecentDevices) {
          return;
        }

        console.log(newDevices);
        console.log(mostRecentDevices);
        console.log(mostRecentDevices[0].mac);

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

  return (
    <div className="space-y-8">
      <div className="device-list-container">
        <div className="grid grid-cols-[auto_1fr_repeat(3,minmax(0,1fr))] items-center gap-4 py-2 font-medium">
          <div className="col-span-2">Device</div>
          <div className="text-center">Download</div>
          <div className="text-center">Upload</div>
          <div className="text-center">Total</div>
        </div>
        {devices.map((device) => {
          const download = Number(device.data_in);
          const upload = Number(device.data_out);
          const total = download + upload;
          return (
            <div
              key={device.id}
              className="grid grid-cols-[auto_1fr_repeat(3,minmax(0,1fr))] items-center gap-4 py-2"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {device.mac
                    .split(':')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{device.mac}</p>
                <p className="text-sm text-muted-foreground">
                  ELO: {device.elo}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {device.data_out}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {device.data_in}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{total}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
