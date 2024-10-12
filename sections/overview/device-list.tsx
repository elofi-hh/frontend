'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import './DeviceList.css'; // Import the CSS file

interface Device {
  id: number;
  download: string;
  upload: string;
  user: string;
  elo: string;
}

const endpoint = 'https://your-api-endpoint.com/devices'; // Replace with your actual endpoint

const fetchDevices = async (): Promise<Device[]> => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [averageElo, setAverageElo] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);
  const [totalUpload, setTotalUpload] = useState(0);
  const [totalTotal, setTotalTotal] = useState(0);

  useEffect(() => {
    const updateDevices = async () => {
      try {
        const newDevices = await fetchDevices();
        setDevices(newDevices);

        const totalElo = newDevices.reduce(
          (sum, device) => sum + Number(device.elo.replace(/,/g, '')),
          0
        );
        setAverageElo(totalElo / newDevices.length);

        const totalDownload = newDevices.reduce(
          (sum, device) => sum + Number(device.download.replace(/,/g, '')),
          0
        );
        setTotalDownload(totalDownload);

        const totalUpload = newDevices.reduce(
          (sum, device) => sum + Number(device.upload.replace(/,/g, '')),
          0
        );
        setTotalUpload(totalUpload);

        setTotalTotal(totalDownload + totalUpload);
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
        <div className="flex items-center py-2">
          <div className="ml-auto flex space-x-8">
            <div className="text-center">
              <p className="text-sm font-medium">Download</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Upload</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Total</p>
            </div>
          </div>
        </div>
        {devices.map((device) => {
          const download = Number(device.download.replace(/,/g, ''));
          const upload = Number(device.upload.replace(/,/g, ''));
          const total = download + upload;
          return (
            <div key={device.id} className="flex items-center py-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {device.user
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {device.user}
                </p>
                <p className="text-sm text-muted-foreground">
                  ELO: {device.elo}
                </p>
              </div>
              <div className="ml-auto flex space-x-12">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {device.download}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {device.upload}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{total}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex items-center py-2">
          <div className="ml-auto flex space-x-8">
            <div className="text-center">
              <p className="text-sm font-medium">Average ELO</p>
              <p className="text-sm">{averageElo.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
