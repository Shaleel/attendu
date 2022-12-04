import palette from './colors';
export const light = {
    cardBackground: palette.white,
    screenBackground: '#f2f6ff',
    border: palette.lightgrey,
    activeBorder: palette.primaryBlue,
    active: palette.primaryBlue,
    secondary: palette.lightBlue,
    inputBG: palette.white,
    selectedInput: palette.lightestBlue,
    selectedButton: '#3062c7',
    text: palette.black,
    secondaryText: palette.grey,
};

export const dark = {
    ...light,
    text: palette.white,
    secondary: palette.darkgrey,
    cardBackground: palette.darkBlue,
    selectedInput: palette.darkBlue,
    screenBackground: palette.darkBlack,
    inputBG: palette.darkBlue,
};
