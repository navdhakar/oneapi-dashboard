import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import {
  Card,
  CardHeader,
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  TableRow,
  TableBody,
  TableCell,
  Tab,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  CircularProgress,
} from '@mui/material';
// components
import { BaseOptionChart } from '../../../components/chart';
import MenuPopover from '../../../components/MenuPopover';
import Label from '../../../components/Label';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../user';

import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { UNIFY_URI } from '../../../config';
// ----------------------------------------------------------------------
import { makePostRequest, makeGETRequest } from '../../../Api/Apikit';

ApplicationPanel.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ApplicationPanel({ title, subheader, ...other }) {
  const [open, setOpen] = useState(null);
  const [openAddDoc, setopenAddDoc] = useState(null);
  const [addEmailhook, setaddEmailhook] = useState(false);
  const [addRedirecthook, setaddRedirecthook] = useState(false);
  const [selectedDatabase, setselectedDatabase] = useState(null);
  const [loading, setloading] = useState(false);
  const [Description, setDescription] = useState('');
  const [triggerdata, settriggerdata] = useState('');

  const [Eserviceinitialized, setEserviceinitialized] = useState(false);
  const [Sserviceinitialized, setSserviceinitialized] = useState(false);

  const obj = useSelector((state) => state.authReducer);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleAddDocumentsOpen = (event, dburi, db) => {
    setopenAddDoc(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const handleAddDocumentsClose = () => {
    setopenAddDoc(null);
  };

  const InitHookServices = () => {
    setloading(true);
    if (addEmailhook) {
      const data = {
        emailbody: Description,
      };
      makePostRequest(`/unify/paymentservices/updateemail/${obj.urltoken}`, data)
        .then((res) => {
          console.log(res);
          setEserviceinitialized(true);
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const Loading = () => {
    if (loading === true) {
      return <CircularProgress />;
    }
  };
  useEffect(() => {
    setaddEmailhook(true);
    makeGETRequest(`/unify/paymentservices/reciever/${obj.urltoken}`)
      .then((res) => {
        console.log(res);
        // setEmail(res.email);
        // setName(res.name);
        settriggerdata(res.triggerdata);
        // setAmount(res.amount);
        // setProductName(res.productname);
        // setProductURL(res.productlink);
      })
      .catch((e) => {
        console.log(e);
        // setalerttext('server is down, please try again!!');
        // setalert(true);
      });
    // setselectedDatabase(obj.userauthinfo.DatabaseName);
    // setEserviceinitialized(obj.userauthinfo.Status);
  });
  const handledescription = (event) => {
    setDescription(event.target.value);
  };
  const AuthInfo = (props) => {
    return (
      <TableBody>
        <TableRow>
          <TableCell align="left">
            <Label variant="ghost" color={props.serviceactive ? 'success' : 'error'}>
              {props.serviceactive ? 'active' : 'inactive'}
            </Label>
          </TableCell>
          <TableCell align="left">
            <Typography variant="subtitle2">{props.type} </Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="subtitle2" sx={{ wordWrap: 'break-word', width: '15rem' }}>
              Send emails to your users on successful transaction.
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle2" align="center">
              {props.data ? props.data : triggerdata}
            </Typography>
          </TableCell>
          {/* <TableCell>
            <Typography variant="subtitle2" align="center">
              {props.collection}
            </Typography>
          </TableCell> */}

          {props.serviceactive ? null : (
            <TableCell>
              <Button
                variant="contained"
                onClick={() => {
                  InitHookServices();
                }}
                style={{ margin: 10 }}
              >
                Save
              </Button>
            </TableCell>
          )}
          <TableCell>
            <Loading />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  };
  return (
    <Card {...other}>
      <CardHeader title={title} />
      <Button variant="contained" onClick={handleOpen} style={{ margin: 10 }}>
        {subheader}
      </Button>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Add any hooks </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={addEmailhook}
                    onChange={() => {
                      setaddEmailhook(!addEmailhook);
                    }}
                  />
                }
                label="Send E-mail"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={addRedirecthook}
                    onChange={() => {
                      setaddRedirecthook(!addRedirecthook);
                    }}
                  />
                }
                label="Redirect web page"
              />
            </FormGroup>
          </Box>
        </Box>
      </MenuPopover>
      <TableBody>
        <TableRow>
          <TableCell align="left">
            <Typography variant="subtitle1">Status</Typography>
          </TableCell>
          <TableCell align="left">
            <Typography variant="subtitle1">Hook Type</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="subtitle1">Description</Typography>
          </TableCell>
          <TableCell>
            <Button
              variant="text"
              onClick={(e) => {
                handleAddDocumentsOpen(e);
              }}
            >
              Edit Data
            </Button>
            <MenuPopover
              open={Boolean(openAddDoc)}
              anchorEl={openAddDoc}
              onClose={handleAddDocumentsClose}
              sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">Email Body</Typography>

                  <TextField
                    Name="Product Description"
                    label="Message Body"
                    onChange={handledescription}
                    multiline
                    maxRows={4}
                    sx={{ width: 300 }}
                  />
                </Box>
              </Box>
            </MenuPopover>
          </TableCell>
          {/* <TableCell>
            <Typography variant="subtitle1">In Collection</Typography>
          </TableCell> */}
        </TableRow>
      </TableBody>
      {addEmailhook ? (
        <AuthInfo type={'E-mail'} data={Description} collection={'UserInfo'} serviceactive={Eserviceinitialized} />
      ) : null}
      {addRedirecthook ? (
        <AuthInfo
          type={'SMS'}
          database={selectedDatabase}
          collection={'UserPhone'}
          serviceactive={Sserviceinitialized}
        />
      ) : null}
    </Card>
  );
}
