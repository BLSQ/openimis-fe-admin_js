import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    maxWidth: 750,
  },
  tableContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
});

export default function BasicTable({subscriptions, handleMutation}) {
    const classes = useStyles();
    // const handleMutation = async(topic, active, uuid=null) => {
    //   // await mutation({variables: {
    //   //       operation: active ? "unsubscribe" : "subscribe_to_life_event", 
    //   //       topic: topic,
    //   //       uuid: uuid,
    //   // }}).then(() => refetch());
    // };

    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Topic</TableCell>
                <TableCell align="right">Is Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions ? (
                subscriptions.map(({ topic, uuid, active }) => (
                <TableRow key={uuid}>
                    <TableCell component="th" scope="row">
                    {topic}
                    </TableCell>
                    <TableCell align="right">
                    <FormControlLabel
                        control={<Switch 
                            checked={active} 
                            onChange={()=>handleMutation(topic, active, uuid)} 
                        />} 
                        label=""
                    />
                    </TableCell>
                </TableRow>
                ))
              ) : <h2>Nothing to see here</h2>
              }
            </TableBody>
          </Table>
        </TableContainer>
      );
    }