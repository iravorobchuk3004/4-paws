// Design tokens from the 4 Paws Figma file.
export const colors = {
  purple: '#6252CE',
  purpleSelected: '#C2B9FF',
  purpleTint: '#F3EDFE',
  purpleBorder: '#F4EEFF',
  cream: '#FAF8F3',
  white: '#FFFFFF',
  black: '#1B1B1B',
  grey: '#62615F',
  greyMuted: '#6F6B66',
  grey1: '#A9A9A9',
  greyOption: '#EAEAEA',
  greyBg: '#EDEBEB',
  pink: '#FFB6D4',
  pinkTag: '#FFD7E8',
};

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  button: {
    shadowColor: colors.purple,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
};
