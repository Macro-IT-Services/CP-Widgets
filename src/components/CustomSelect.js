import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// <CustomSelect name="titleStyle" label={msg.addDashboardModal.titleStyle} list={[{value:'dark',title:msg.addDashboardModal.dark}, {value:'light',title:msg.addDashboardModal.light}]} value={values.titleStyle} onChange={handleInputChange} />

const CustomSelect = props => {
  //console.log('props',props)
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
        {props.list.map(item => (
          <MenuItem value={item.value} key={item.value}>
            {item.title}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default CustomSelect;
