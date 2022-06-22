import React from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';

// <CustomInput name="name" label={msg.addDashboardModal.name} clearFieldIcon={true} value={values.name} onChange={handleInputChange} />

/*
const DarkInput = withStyles(styles)(props => {
  const { classes } = props;
  return <Input InputProps={ {classes: classes}} />;
});
*/
const CustomInput = props => {
  const theme = useTheme();

  const Adornment = () => (
    <>
      {props.value !== '' && (
        <InputAdornment position="end">
          <IconButton
            aria-label="clear field"
            onClick={() =>
              props.onChange({ target: { name: props.name, value: '' } })
            }
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </InputAdornment>
      )}
    </>
  );

  return (
    <>
      <InputLabel htmlFor={`${props.name}-label`}>{props.label}</InputLabel>
      <Input
        inputProps={{
          min: props.min,
          max: props.max,
          style: {
            WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.modals} inset`,
            WebkitTextFillColor: theme.palette.foreground,
          },
        }}
        name={props.name}
        id={`${props.name}-label`}
        value={props.value}
        type={props.type}
        disabled={props.disabled}
        onChange={props.onChange}
        fullWidth
        rowsMax={2}
        rows={2}
        multiline={props.multiline}
        {...(props.clearFieldIcon ? { endAdornment: <Adornment /> } : {})}
      />
    </>
  );
};

export default CustomInput;
