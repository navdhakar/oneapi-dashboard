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
import { makePostRequest } from '../../../Api/Apikit';

ApplicationPanel.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ApplicationPanel({ title, subheader, chartLabels, chartData, ...other }) {
  const [open, setOpen] = useState(null);
  const [openAddDoc, setopenAddDoc] = useState(null);
  const [addEmailauth, setaddEmailauth] = useState(false);
  const [addsmsauth, setaddsmsauth] = useState(false);
  const [selectedDatabase, setselectedDatabase] = useState(null);
  const [loading, setloading] = useState(false);

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

  const InitAuthServices = () => {
    setloading(true);
    if (addEmailauth) {
      const data = {
        databaseName: selectedDatabase,
      };
      makePostRequest('/AuthServices/InitEmailAuth/enable', data)
        .then((data) => {
          console.log(data);
          setEserviceinitialized(true);
        })
        .then(() => {
          const data = {
            email: obj.email,
            status: true,
            authuri: 'http://localhost:8002/unify/dyno/(getstoredata/createcollection)/newcomp',
            databasename: selectedDatabase,
            collectionName: 'UserInfo',
            type: 'E-mail',
          };
          makePostRequest('/signup/register/enable_auth', data).then((res) => {
            console.log(res);
            setloading(false);
          });
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
    setaddEmailauth(true);
    setselectedDatabase(obj.userauthinfo.DatabaseName);
    setEserviceinitialized(obj.userauthinfo.Status);
  });
  const AuthInfo = (props) => {
    return (
      <TableBody>
        <TableRow>
          <TableCell align="left">
            <Label variant="ghost" color={props.serviceactive ? 'success' : 'error'}>
              {props.serviceactive ? 'active' : 'inactive'}
            </Label>
          </TableCell>
          <TableCell align="center">
            <Typography variant="subtitle2" sx={{ wordWrap: 'break-word', width: '15rem' }}>
              http://localhost:8002/unify/dyno/(getstoredata/createcollection)/newcomp
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle2" sx={{ color: '#1877F2' }} align="center">
              {props.database}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle2" align="center">
              {props.collection}
            </Typography>
          </TableCell>

          <TableCell align="left">
            <Typography variant="subtitle2">{props.type} Authentication</Typography>
          </TableCell>
          {props.serviceactive ? null : (
            <TableCell>
              <Button
                variant="contained"
                onClick={() => {
                  InitAuthServices();
                }}
                style={{ margin: 10 }}
              >
                Enable
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
            <Typography variant="subtitle1">Enable Authentication </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={addEmailauth}
                    onChange={() => {
                      setaddEmailauth(!addEmailauth);
                    }}
                  />
                }
                label="E-mail Authentication"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={addsmsauth}
                    onChange={() => {
                      setaddsmsauth(!addsmsauth);
                    }}
                  />
                }
                label="SMS authentication"
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
          <TableCell align="center">
            <Typography variant="subtitle1">User Authentication</Typography>
          </TableCell>
          <TableCell>
            <Button
              variant="text"
              onClick={(e) => {
                handleAddDocumentsOpen(e);
              }}
            >
              + Add Database
            </Button>
            <MenuPopover
              open={Boolean(openAddDoc)}
              anchorEl={openAddDoc}
              onClose={handleAddDocumentsClose}
              sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">Add Database</Typography>

                  <FormGroup>
                    <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group">
                      {obj.userdatabases.map((database) => {
                        return (
                          <FormControlLabel
                            control={
                              <Radio
                                value={database.DatabaseName}
                                onClick={(e) => {
                                  setselectedDatabase(e.target.value);
                                }}
                              />
                            }
                            label={database.DatabaseName}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormGroup>
                </Box>
              </Box>
            </MenuPopover>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle1">In Collection</Typography>
          </TableCell>

          <TableCell align="left">
            <Typography variant="subtitle1">Type</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
      {addEmailauth ? (
        <AuthInfo
          type={'E-mail'}
          database={selectedDatabase}
          collection={'UserInfo'}
          serviceactive={Eserviceinitialized}
        />
      ) : null}
      {addsmsauth ? (
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
