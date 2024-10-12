import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import './DeviceList.css'; // Import the CSS file

const devices = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    avatar: '/avatars/01.png',
    amount: '+$1,999.00'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    avatar: '/avatars/02.png',
    amount: '+$39.00'
  },
  {
    id: 3,
    name: 'Sophia Brown',
    email: 'sophia.brown@email.com',
    avatar: '/avatars/03.png',
    amount: '+$299.00'
  },
  {
    id: 4,
    name: 'Liam Johnson',
    email: 'liam.johnson@email.com',
    avatar: '/avatars/04.png',
    amount: '+$499.00'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    avatar: '/avatars/05.png',
    amount: '+$129.00'
  },
  {
    id: 6,
    name: 'Noah Davis',
    email: 'noah.davis@email.com',
    avatar: '/avatars/06.png',
    amount: '+$89.00'
  },
  {
    id: 7,
    name: 'Ava Martinez',
    email: 'ava.martinez@email.com',
    avatar: '/avatars/07.png',
    amount: '+$1,299.00'
  },
  {
    id: 8,
    name: 'William Garcia',
    email: 'william.garcia@email.com',
    avatar: '/avatars/08.png',
    amount: '+$599.00'
  },
  {
    id: 9,
    name: 'Isabella Rodriguez',
    email: 'isabella.rodriguez@email.com',
    avatar: '/avatars/09.png',
    amount: '+$199.00'
  },
  {
    id: 10,
    name: 'James Martinez',
    email: 'james.martinez@email.com',
    avatar: '/avatars/10.png',
    amount: '+$999.00'
  },
  {
    id: 11,
    name: 'Mia Hernandez',
    email: 'mia.hernandez@email.com',
    avatar: '/avatars/11.png',
    amount: '+$79.00'
  },
  {
    id: 12,
    name: 'Benjamin Lopez',
    email: 'benjamin.lopez@email.com',
    avatar: '/avatars/12.png',
    amount: '+$1,599.00'
  },
  {
    id: 13,
    name: 'Charlotte Gonzalez',
    email: 'charlotte.gonzalez@email.com',
    avatar: '/avatars/13.png',
    amount: '+$299.00'
  },
  {
    id: 14,
    name: 'Lucas Perez',
    email: 'lucas.perez@email.com',
    avatar: '/avatars/14.png',
    amount: '+$499.00'
  },
  {
    id: 15,
    name: 'Amelia Sanchez',
    email: 'amelia.sanchez@email.com',
    avatar: '/avatars/15.png',
    amount: '+$1,099.00'
  },
  {
    id: 16,
    name: 'Henry Ramirez',
    email: 'henry.ramirez@email.com',
    avatar: '/avatars/16.png',
    amount: '+$699.00'
  },
  {
    id: 17,
    name: 'Evelyn Torres',
    email: 'evelyn.torres@email.com',
    avatar: '/avatars/17.png',
    amount: '+$399.00'
  },
  {
    id: 18,
    name: 'Alexander Flores',
    email: 'alexander.flores@email.com',
    avatar: '/avatars/18.png',
    amount: '+$1,299.00'
  },
  {
    id: 19,
    name: 'Harper Rivera',
    email: 'harper.rivera@email.com',
    avatar: '/avatars/19.png',
    amount: '+$199.00'
  },
  {
    id: 20,
    name: 'Elijah Ramirez',
    email: 'elijah.ramirez@email.com',
    avatar: '/avatars/20.png',
    amount: '+$2,099.00'
  }
];

export function DeviceList({ deviceCount }: { deviceCount: number }) {
  return (
    <div className="space-y-8">
      <div className="device-list-container">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={device.avatar} alt={`${device.name} Avatar`} />
              <AvatarFallback>{device.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{device.name}</p>
              <p className="text-sm text-muted-foreground">{device.email}</p>
            </div>
            <div className="ml-auto font-medium">{device.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const deviceCount = devices.length;