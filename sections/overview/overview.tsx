'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PageContainer from '@/components/layout/page-container';
import { DeviceList } from './device-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Fetch onboarding status
const checkOnboarded = async (): Promise<boolean> => {
  try {
    const response = await axios.get('/api/check_onboarded');
    return response.data.onboarded; // Assuming your API returns { onboarded: true/false }
  } catch (error) {
    console.error('Failed to check onboarding status:', error);
    return false;
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
  const [isOnboarded, setIsOnboarded] = useState(true); // Assuming true initially
  const [showModal, setShowModal] = useState(false);

  const [textareaContent, setTextareaContent] = useState('');

  // Onboarding check when component loads
  useEffect(() => {
    const fetchOnboardedStatus = async () => {
      const onboarded = await checkOnboarded();
      if (!onboarded) {
        setIsOnboarded(false);
        setShowModal(true);
      }
    };
    fetchOnboardedStatus();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // await axios.post('/api/submit', { message: textareaContent });
      console.log('Message submitted:', textareaContent);
      setShowModal(false); // Optionally close the modal after submission
    } catch (error) {
      console.error('Failed to submit message:', error);
    }
  };

  useEffect(() => {
    if (!isOnboarded) return; // Skip fetching devices if the user isn't onboarded

    const updateDevices = async () => {
      try {
        const newDevicesMap = await fetchDevices();
        const mostRecentKey = Array.from(newDevicesMap.keys()).pop();
        const mostRecentDevices = mostRecentKey
          ? newDevicesMap.get(mostRecentKey)
          : null;

        if (!mostRecentDevices) {
          return;
        }

        // Fetch device and ELO rankings
        const devicesWithElo = await Promise.all(
          mostRecentDevices.map(async (device) => {
            try {
              const eloStr = await getEloRanking(device.mac);
              const elo = parseFloat(eloStr);
              if (isNaN(elo)) throw new Error('Invalid ELO value');
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

        const filteredDevices = devicesWithElo.filter((device) => {
          const total = Number(device.data_in) + Number(device.data_out);
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
  }, [isOnboarded]); // Only fetch devices if the user is onboarded

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <Modal
          title="Complete Onboarding"
          description="Please provide the required information to proceed."
          isOpen={showModal}
          onClose={handleCloseModal}
        >
          {/* Textarea and Button for input */}
          <Textarea
            placeholder="Enter your message here"
            value={textareaContent}
            onChange={handleTextareaChange}
          />
          <div className="mt-4">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </Modal>

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
              <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
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

              <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Device ELO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageElo}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
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

              <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
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
            <div className="grid grid-cols-1 gap-4 pt-10 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 transition-shadow duration-300 hover:border-2 hover:border-indigo-500 hover:shadow-xl md:col-span-3">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
