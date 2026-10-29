import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Progress } from '@/components/Progress';
import { Timeline } from '@/components/Timeline';

const meta = {
  title: 'Status/Timeline',
  component: Timeline,
  args: {
    steps: [
      { title: 'Sent', text: '29 Oct · 14:20', state: 'done' },
      { title: 'Shelter review', text: 'Reply in ~2 days', state: 'current' },
      { title: 'Meet Luna', text: '', state: 'next' },
      { title: 'Welcome home', text: '', state: 'next' },
    ],
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Application: Story = {};

export const ProgressBar: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Progress value={0.25} />
      <Progress value={0.64} />
      <Progress value={1} />
    </View>
  ),
};
