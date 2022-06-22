import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Grid from '@material-ui/core/Grid';
import { useApolloClient } from '@apollo/client';
import { mediaServer } from '../constants';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// <CustomSelect name="titleStyle" label={msg.addDashboardModal.titleStyle} list={[{value:'dark',title:msg.addDashboardModal.dark}, {value:'light',title:msg.addDashboardModal.light}]} value={values.titleStyle} onChange={handleInputChange} />

const CustomSelectIcon = props => {
  //  console.log('CustomSelectIcon props',props)

  const useStyles = makeStyles(theme => ({
    /*
    icon: {
      filter: 'invert(100%) brightness(0%) ',
      marginRight: '10px',
    },
*/
  }));

  const classes = useStyles();
  const icons = useSelector(state => state.settings.icons);

  return (
    <>
      <InputLabel htmlFor={`${props.name}-label`}>{props.label}</InputLabel>
      <Select
        name={props.name}
        id={`${props.name}-label`}
        value={props.value}
        labelId={`${props.name}-label`}
        onChange={props.onChange}
        fullWidth
      >
        {icons.map(item => {
          const svgUrl = `${mediaServer}/download/${
            item.id
          }/${localStorage.getItem('authToken')}`;
          //const svgUrl = 'http://localhost:3000/test.svg';
          //          console.log('svgUrl2', svgUrl)

          return (
            <MenuItem value={item.id} key={item.id}>
              <Grid alignItems="center" container direction="row">
                <Grid item>
                  {/*<img className={classes.icon} src={`${mediaServer}/download/${item.id}/${localStorage.getItem('authToken')}`}/>*/}

                  <div
                    style={{
                      //height: `${icon_px}px`,
                      width: 'auto',
                      WebkitMask: `url(${svgUrl}) no-repeat 50% 50%`,
                      mask: `url(${svgUrl}) no-repeat 50% 50%`,
                      WebkitMaskSize: 'cover',
                      maskSize: 'cover',
                      backgroundColor: '#000000',
                      marginRight: '10px',
                    }}
                  >
                    <img src={svgUrl} style={{ visibility: 'hidden' }} />
                  </div>
                </Grid>
                <Grid item>{item.name}</Grid>
              </Grid>
            </MenuItem>
          );
        })}
      </Select>
    </>
  );
};

export default CustomSelectIcon;
