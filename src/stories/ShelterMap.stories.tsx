import type { Meta, StoryObj } from '@storybook/react-native';

import { ShelterMap } from '@/components/ShelterMap';

const meta = {
  title: 'Location/ShelterMap',
  component: ShelterMap,
  args: { shelter: 'Paw Haven' },
  argTypes: { shelter: { control: 'select', options: ['Paw Haven', 'Safe Tails', 'Happy Tails'] } },
} satisfies Meta<typeof ShelterMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PawHaven: Story = {};
export const SafeTails: Story = { args: { shelter: 'Safe Tails' } };
