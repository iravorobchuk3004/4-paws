import type { Meta, StoryObj } from '@storybook/react-native';

import { Celebration } from '@/components/Celebration';

const meta = {
  title: 'Feedback/Celebration',
  component: Celebration,
  args: { animal: 'dog' },
  argTypes: { animal: { control: 'select', options: ['dog', 'cat', 'rabbit', 'bird'] } },
} satisfies Meta<typeof Celebration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HappyDog: Story = {};
export const HappyCat: Story = { args: { animal: 'cat' } };
export const HappyRabbit: Story = { args: { animal: 'rabbit' } };
