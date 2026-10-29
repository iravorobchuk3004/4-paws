import type { Preview } from '@storybook/react-native';
import { View } from 'react-native';

import { AppProvider } from '@/store';
import { colors } from '@/theme';

// Every story gets the app store (saved hearts, user, etc.) and the cream app background.
const preview: Preview = {
  decorators: [
    (Story) => (
      <AppProvider>
        <View style={{ flex: 1, padding: 16, backgroundColor: colors.cream }}>
          <Story />
        </View>
      </AppProvider>
    ),
  ],
  parameters: {
    controls: { expanded: true },
  },
};

export default preview;
