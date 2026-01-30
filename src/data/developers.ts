import { Developer } from '@/types/project';

export const developers: Developer[] = [
  {
    id: 'dev-1',
    name: 'Rahul Sharma',
    type: 'Internal',
    email: 'rahul@outrightcreators.com',
    phone: '+91 98765 43210',
  },
  {
    id: 'dev-2',
    name: 'Priya Patel',
    type: 'Internal',
    email: 'priya@outrightcreators.com',
    phone: '+91 98765 43211',
  },
  {
    id: 'dev-3',
    name: 'Amit Kumar',
    type: 'Internal',
    email: 'amit@outrightcreators.com',
    phone: '+91 98765 43212',
  },
  {
    id: 'dev-4',
    name: 'Sneha Reddy',
    type: 'Freelance',
    email: 'sneha.freelance@gmail.com',
    phone: '+91 98765 43213',
  },
  {
    id: 'dev-5',
    name: 'Vikram Singh',
    type: 'Freelance',
    email: 'vikram.dev@gmail.com',
    phone: '+91 98765 43214',
  },
  {
    id: 'dev-6',
    name: 'Ananya Gupta',
    type: 'Internal',
    email: 'ananya@outrightcreators.com',
    phone: '+91 98765 43215',
  },
];

export const getDeveloperById = (id: string): Developer | undefined => {
  return developers.find((dev) => dev.id === id);
};

export const getDevelopersByIds = (ids: string[]): Developer[] => {
  return developers.filter((dev) => ids.includes(dev.id));
};
