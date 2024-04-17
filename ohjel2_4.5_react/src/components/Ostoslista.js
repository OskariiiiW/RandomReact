import {List, ListItem, ListItemText} from '@material-ui/core';

function Ostoslista(props) {
  return <List>
    {props.ostokset.map((ostos, idx) => {
        return <ListItem key={idx} divider={true}>
            <ListItemText id={ostos.id} primary={ostos.ostos}/>;
        </ListItem>
    })}
  </List>
}
export default Ostoslista;