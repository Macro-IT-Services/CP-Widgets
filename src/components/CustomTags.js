import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

/*
import CustomTags from '../components/CustomTags';

<CustomTags 
  name="groups" 
  label="Groups"
  freeSolo
  placeholder="..." 

  list={[{title:'Tag 1', value:'tag_1',}, {title:'Tag 2', value:'tag_2'}, {title:'Tag 3', value:'tag_3'},{title:'Fix Tag 1', value:'fix_tag_1',}, {title:'Fix Tag 2', value:'fix_tag_2'}]}  

  listFixed={[{title:'Fix Tag 1', value:'fix_tag_1',}, {title:'Fix Tag 2', value:'fix_tag_2'}]} 
  
  value={values.groups} 
  onChange={handleInputChange} 
/>

list - all possible objects in form of {title:'Aaa 1', value:'aaa_1'} ("title" - to show, "value" - to distinct from each other, like id)
listFixed - all object those can't be removed (displayed as disabled)
freeSolo - set true if typing new tags is allowed

value - in form of:

Array(4)
0: {title: "Fix Tag 1", value: "fix_tag_1"}
1: {title: "Fix Tag 2", value: "fix_tag_2"}
2: {title: "Tag 1", value: "tag_1"}
3: {title: "fgfgfg", value: "fgfgfg"}

example:

  const [values, setValue] = useReducer( (prev, updated) => ({...prev, ...updated}), {
    groups:[ {title:'Fix Tag 1', value:'fix_tag_1'}, {title:'Fix Tag 2', value:'fix_tag_2'}, {title:'Tag 1', value:'tag_1',} ], 
    name: '', 
    title: '', 
    titleStyle: 'dark', 
    compactMode: '' 
  } );


*/

const styles = theme => ({
  chip: {
    color: theme.palette.white,
    backgroundColor: theme.palette.blue,
    marginBottom: '7px',
    marginRight: '5px',
  },
});

const useStyles = makeStyles(theme => styles(theme));

const CustomTags = props => {
  //console.log("CustomTags props", props)

  let {
    name,
    label,
    list,
    listFixed = [],
    value,
    onChange,
    placeholder,
    freeSolo,
  } = props;

  const classes = useStyles();

  return (
    <>
      <InputLabel htmlFor={`${props.name}-label`}>{label}</InputLabel>

      <Autocomplete
        multiple
        id={`${props.name}-label`}
        options={list}
        freeSolo={freeSolo}
        getOptionLabel={option => option.title}
        style={{ marginTop: '10px' }}
        value={value}
        onChange={(event, newValue) => {
          //console.log('newValue', newValue)
          const newValueTmp = newValue.map(item => {
            if (!item.value) return { title: item, value: item };
            else return item;
          });
          //console.log('newValueTmp', newValueTmp)
          onChange({
            target: {
              name: name,
              value: [
                ...listFixed,
                ...newValueTmp
                  .filter(
                    option =>
                      listFixed.findIndex(
                        item => item.value === option.value
                      ) === -1
                  )
                  .filter(
                    (v, i, a) =>
                      a.findIndex(
                        t => t.title === v.title && t.value === v.value
                      ) === i
                  ),
              ],
            },
          });
        }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            // option: {title: "Tag 1", value: "tag_1"}  index: 0

            <Chip
              size="small"
              color="primary"
              label={option.title}
              {...getTagProps({ index })}
              disabled={
                listFixed.findIndex(item => item.value === option.value) !== -1
              }
              className={classes.chip}
            />
          ))
        }
        renderInput={params => (
          <TextField {...params} variant="standard" placeholder={placeholder} />
        )}
        closeIcon={<CloseIcon />}
      />
    </>
  );
};

export default CustomTags;
