import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { fn } from 'storybook/test';

import { CategoryTile } from '@/components/CategoryTile';
import { allCategory, categories, Category } from '@/data/pets';

const meta = {
  title: 'Pets/CategoryTile',
  component: CategoryTile,
  args: { category: categories[0], selected: false, onPress: fn() },
} satisfies Meta<typeof CategoryTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };

function Picker() {
  const [current, setCurrent] = useState<Category>(allCategory);
  return (
    <ScrollView horizontal contentContainerStyle={{ gap: 12 }}>
      {[allCategory, ...categories].map((c) => (
        <CategoryTile key={c.label} category={c} selected={current === c} onPress={() => setCurrent(c)} />
      ))}
    </ScrollView>
  );
}

export const Interactive: Story = { render: () => <Picker /> };
