import { useTheme } from '@material-ui/core/styles';

const useColors = colors => {
  let [colorScheme = 'darkonlight', colorReplace = null] = colors;

  //console.log('useColors.js colorScheme', colorScheme);

  const theme = useTheme();

  const colorSchemes = {
    darkonlight: {
      bg: theme.palette.wWhite,
      fg: theme.palette.wBlue,
      replaces: 'fg',
    },
    lightondark: {
      bg: theme.palette.wBlue,
      fg: theme.palette.wWhite,
      replaces: 'bg',
    },
    darkontransparent: {
      bg: theme.palette.wTransparent,
      fg: theme.palette.wBlue,
      replaces: 'fg',
    },
    lightontransparent: {
      bg: theme.palette.wTransparent,
      fg: theme.palette.wWhite,
      replaces: 'fg',
    },
    // for ImageBox (because it's lack of foreground)
    dark: {
      bg: theme.palette.wWhite,
      fg: theme.palette.wBlue,
      replaces: 'fg',
    },
    light: {
      bg: theme.palette.wBlue,
      fg: theme.palette.wWhite,
      replaces: 'bg',
    },
    transparent: {
      bg: theme.palette.wTransparent,
      fg: theme.palette.wWhite,
      replaces: 'fg',
    },
  };

  let bgColor, fgColor;

  //  console.log('!!!', colorSchemes, colorScheme)
  // for incorrect records in database
  if (!colorSchemes.hasOwnProperty(colorScheme)) colorScheme = 'darkonlight';

  if (colorReplace) {
    switch (colorSchemes[colorScheme].replaces) {
      case 'bg':
        bgColor = colorReplace;
        fgColor = colorSchemes[colorScheme].fg;
        break;

      case 'fg':
        fgColor = colorReplace;
        bgColor = colorSchemes[colorScheme].bg;
        break;

      default:
    } //switch
  } else {
    fgColor = colorSchemes[colorScheme].fg;
    bgColor = colorSchemes[colorScheme].bg;
  } //else

  return [fgColor, bgColor];
};

export default useColors;
/*
Usage:

import useColors from './useColors';



*/
