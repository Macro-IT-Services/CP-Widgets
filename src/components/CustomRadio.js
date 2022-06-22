import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';

/*
import CustomRadio from '../components/CustomRadio';

<CustomRadio name="radiotest" label="Test radios" list={[
  { icon:<VolumeUpIcon/>, title:"All notifications", value:"all_not" },
  { icon:<StarOutlineIcon/>, title:"Favorites only", value:"fav_only", disabled: true },
  { icon:<VolumeOffIcon/>, title:"Mute all", value:"mute_all" },
]} value={values.radiotest} onChange={handleInputChange} />



list - array of radiobuttons
value - value for group in format {title:'Mute all',value:'mute_all'}

set initial value:

  const [values, setValue] = useReducer( (prev, updated) => ({...prev, ...updated}), {
    radiotest: {title:'Mute all',value:'mute_all'},
    name: '', 
    title: '', 
    titleStyle: 'dark', 
    compactMode: '' 
  } );


*/

const styles = theme => ({
  label: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  radio: {
    '&$checked': {
      color: theme.palette.blue,
    },
  },
  checked: {},
});

const useStyles = makeStyles(theme => styles(theme));

const CustomRadio = props => {
  //console.log("CustomRadio props", props)
  const classes = useStyles();

  return (
    <div style={{ marginBottom: '15px' }}>
      {props.label && (
        <InputLabel htmlFor={`${props.name}-label`}>{props.label}</InputLabel>
      )}

      <RadioGroup
        name={props.name}
        id={`${props.name}-label`}
        value={props.value.value}
        onChange={e => {
          //console.log(e.target.value)
          //      console.log('list',props.list)
          props.onChange({
            target: {
              name: props.name,
              value: {
                title: props.list.find(item => item.value === 'mute_all').title,
                value: e.target.value,
              },
            },
          });
        }}
        style={{ marginTop: '15px' }}
      >
        {props.list.map(item => (
          <FormControlLabel
            key={item.value}
            labelPlacement="start"
            value={item.value}
            control={
              <Radio
                classes={{ root: classes.radio, checked: classes.checked }}
              />
            }
            label={
              <Grid container>
                {item.icon}
                <Typography style={{ marginLeft: '20px' }}>
                  {item.title}
                </Typography>
              </Grid>
            }
            classes={{ root: classes.label }}
            disabled={item.disabled}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default CustomRadio;
