import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { msg } from '../messages';

// <CustomSelect name="titleStyle" label={msg.addDashboardModal.titleStyle} list={[{value:'dark',title:msg.addDashboardModal.dark}, {value:'light',title:msg.addDashboardModal.light}]} value={values.titleStyle} onChange={handleInputChange} />

//const styles = theme => ({

const CustomSelectColor = props => {
  const theme = useTheme();

  const useStyles = makeStyles(() => ({
    gutter: {
      paddingLeft: '16px',
    },

    colorDefault: {
      backgroundColor: theme.palette.wBlue,
      color: theme.palette.wWhite,
      '&:focus': {
        backgroundColor: theme.palette.wBlue,
        color: theme.palette.wWhite,
      },
      '&:hover': {
        backgroundColor: '#3790F3 !important',
        color: theme.palette.wWhite,
      },
    },

    colorRed: {
      backgroundColor: theme.palette.wRed,
      color: theme.palette.wWhite,
      '&:focus': {
        backgroundColor: theme.palette.wRed,
        color: theme.palette.wWhite,
      },
      '&:hover': {
        backgroundColor: '#E51010 !important',
        color: theme.palette.wWhite,
      },
      '&$selected:hover': {
        backgroundColor: theme.palette.wBlue,
        color: theme.palette.wWhite,
      },
    },

    colorBlue: {
      backgroundColor: theme.palette.wBlue,
      color: theme.palette.wWhite,
      '&:focus': {
        backgroundColor: theme.palette.wBlue,
        color: theme.palette.wWhite,
      },
      '&:hover': {
        backgroundColor: '#3790F3 !important',
        color: theme.palette.wWhite,
      },
    },

    colorGreen: {
      backgroundColor: theme.palette.wGreen,
      color: theme.palette.wWhite,
      '&:focus': {
        backgroundColor: theme.palette.wGreen,
        color: theme.palette.wWhite,
      },
      '&:hover': {
        backgroundColor: '#3E8D42 !important',
        color: theme.palette.wWhite,
      },
    },

    colorYellow: {
      backgroundColor: theme.palette.wYellow,
      color: theme.palette.wBlack,
      '&:focus': {
        backgroundColor: theme.palette.wYellow,
        color: theme.palette.wBlack,
      },
      '&:hover': {
        backgroundColor: '#FFE610 !important',
        color: theme.palette.wBlack,
      },
    },

    colorOrange: {
      backgroundColor: theme.palette.wOrange,
      color: theme.palette.wWhite,
      '&:focus': {
        backgroundColor: theme.palette.wOrange,
        color: theme.palette.wWhite,
      },
      '&:hover': {
        backgroundColor: '#FF8528 !important',
        color: theme.palette.wWhite,
      },
    },

    /*
    selectRoot: {
      width: "200px",
      "&:focus": {
        backgroundColor: "yellow"
      }
    },

    rootMenuItem: {
  
      "&:hover": {
        backgroundColor: "transparent !important",
      }
    }
    */
  }));

  const { name, label, onChange } = props;

  //  const useStyles = makeStyles(theme => styles(theme));
  const classes = useStyles();

  //const [value, setValue] = useState('default');

  /*
  const handleOnChange = e => {

     setValue(e.target.value)
    onChange(e)
  }
  */

  const colorsMap = {
    red: theme.palette.wRed,
    green: theme.palette.wGreen,
    orange: theme.palette.wOrange,
    yellow: theme.palette.wYellow,
    blue: theme.palette.wBlue,
    black: theme.palette.wBlack,
    white: theme.palette.wWhite,
    transparent: theme.palette.wTransparent,
    default: theme.palette.wBlue, //'default' ?
  };

  return (
    <>
      <InputLabel htmlFor={`${name}-label`} style={{ marginBottom: '10px' }}>
        {label}
      </InputLabel>
      <Select
        name={name}
        id={`${name}-label`}
        value={props.value}
        labelId={`${name}-label`}
        onChange={props.onChange}
        fullWidth
        classes={{ root: classes.gutter }}
        style={{
          backgroundColor: colorsMap[props.value],
          color:
            props.value === 'yellow'
              ? theme.palette.wBlack
              : theme.palette.wWhite,
        }}
      >
        <MenuItem
          value="default"
          key="default"
          classes={{ root: classes.colorDefault }}
        >
          Default
        </MenuItem>
        <MenuItem value="red" key="red" classes={{ root: classes.colorRed }}>
          Red
        </MenuItem>
        <MenuItem value="blue" key="blue" classes={{ root: classes.colorBlue }}>
          Blue
        </MenuItem>
        <MenuItem
          value="green"
          key="green"
          classes={{ root: classes.colorGreen }}
        >
          Green
        </MenuItem>
        <MenuItem
          value="yellow"
          key="yellow"
          classes={{ root: classes.colorYellow }}
        >
          Yellow
        </MenuItem>
        <MenuItem
          value="orange"
          key="orange"
          classes={{ root: classes.colorOrange }}
        >
          Orange
        </MenuItem>
      </Select>
    </>
  );
};

export default CustomSelectColor;
