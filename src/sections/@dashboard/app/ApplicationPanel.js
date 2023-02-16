import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import {
  Grid,
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

ApplicationPanel.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ApplicationPanel({ title, subheader, ...other }) {
  const [open, setOpen] = useState(null);
  const [openAddDoc, setopenAddDoc] = useState(null);
  const [dbcollections, setdbcollections] = useState([]);
  const [database, setdatabase] = useState([{ DatabaseName: '', collections: dbcollections, dburi: '' }]);
  const [newcollection, setnewcollection] = useState('');
  const [currentURI, setcurrentURI] = useState();
  const [currentDB, setcurrentDB] = useState();
  const [currentMURI, setcurrentMURI] = useState();

  const [loading, setloading] = useState(false);

  const obj = useSelector((state) => state.authReducer);
  console.log(obj);
  const [dbURI, setdbURI] = useState('');
  const [newAddedDatabase, setnewAddedDatabase] = useState('');
  const [MongoURI, setMongoURI] = useState('');
  const [MongoPass, setMongoPass] = useState('');

  const makePostRequest = async (UrlPath, data) => {
    const response = await fetch(`${UNIFY_URI}${UrlPath}`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      body: JSON.stringify(data),
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      credentials: 'same-origin', // *default, no-cache, reload, force-cache, only-if-cached
      // include, *same-origin, omit
      headers: {
        'X-Parse-Application-Id': data.name,
        'Content-Type': 'application/json',

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body data type must match "Content-Type" header
    });
    console.log(response);
    return response.json();
  };
  const NewDatabaseChange = (event) => {
    setnewAddedDatabase(event.target.value);
  };
  const AMongoURI = (event) => {
    setMongoURI(event.target.value);
  };

  const NewCollectionChange = (event) => {
    setnewcollection(event.target.value);
  };
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleAddDocumentsOpen = (event, dburi, db) => {
    setopenAddDoc(event.currentTarget);
    setcurrentURI(dburi);
    setcurrentDB(db);
  };
  const CreateDatabase = (newdatabase) => {
    setloading(true);
    const data = {
      name: newdatabase,
      key: 'navdeep',
      mongouri: MongoURI,
    };

    makePostRequest('/unify/dyno/data', data)
      .then((resData) => {
        setdatabase((prevdatabase) => [
          ...prevdatabase,
          { DatabaseName: newdatabase, collections: [''], dburi: resData.dbURI },
        ]);
        setdbURI(resData.dbURI);
        return resData;
      })
      .then((resData) => {
        const collectiondata = dbcollections;
        const UserDataUpdate = {
          email: obj.email,
          databases: {
            DatabaseName: newdatabase,
            collections: collectiondata,
            dburi: resData.dbURI,
          },
        };
        makePostRequest('/signup/register/user_update', UserDataUpdate).then((res) => {
          console.log(res);
        });
        setOpen(null);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClose = () => {
    setOpen(null);
  };
  const handleAddDocumentsClose = () => {
    setopenAddDoc(null);
  };
  // const chartOptions = merge(BaseOptionChart(), {
  //   plotOptions: { bar: { columnWidth: '16%' } },
  //   fill: { type: chartData.map((i) => i.fill) },
  //   labels: chartLabels,
  //   xaxis: { type: 'datetime' },
  //   tooltip: {
  //     shared: true,
  //     intersect: false,
  //     y: {
  //       formatter: (y) => {
  //         if (typeof y !== 'undefined') {
  //           return `${y.toFixed(0)} visits`;
  //         }
  //         return y;
  //       },
  //     },
  //   },
  // });
  const createCollection = (dbName, collectionName) => {
    setloading(true);

    const data = {
      collectionname: collectionName,
      databaseName: currentDB,
      mongouri: MongoURI,
    };
    console.log(data);
    makePostRequest(`/unify/dyno/createcollection`, data)
      .then((resData) => {
        console.log(resData);
        setdbcollections((prevdatabase) => [...prevdatabase, collectionName]);
        return resData;
      })
      .then((resData) => {
        const UserDataUpdate = {
          email: obj.email,
          databases: {
            DatabaseName: currentDB,
            collection: collectionName,
          },
        };
        console.log(UserDataUpdate);
        makePostRequest('/signup/register/user_collection_update', UserDataUpdate)
          .then((res) => {
            console.log('sending coll. update req.');
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
        setopenAddDoc(null);
        setloading(false);
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setdatabase(obj.userdatabases);
    console.log(database);
  }, [dbcollections]);
  const Loading = () => {
    if (loading === true) {
      return <CircularProgress />;
    }
  };
  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Button variant="contained" onClick={handleOpen} style={{ margin: 10 }}>
            {subheader}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Loading />
        </Grid>
      </Grid>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Name your database </Typography>

            <TextField
              label="Database Name"
              fullWidth
              style={{ margin: 10 }}
              onChange={NewDatabaseChange}
              value={newAddedDatabase}
            />
            <Typography variant="subtitle2">Only if you want to use your own mongoDB cluster.</Typography>

            <TextField
              label="MongoDB URI(optional)"
              fullWidth
              style={{ margin: 10 }}
              onChange={AMongoURI}
              value={MongoURI}
            />

            <Button
              variant="contained"
              onClick={() => {
                CreateDatabase(newAddedDatabase);
              }}
              style={{ margin: 10 }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </MenuPopover>
      <TableBody>
        <TableRow>
          <TableCell align="left">
            <Typography variant="subtitle1">Status</Typography>
          </TableCell>
          <TableCell align="center">
            <Typography variant="subtitle1">Name</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle1">API endpoint</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle1">Collection Name</Typography>
          </TableCell>

          <TableCell align="left">
            <Typography variant="subtitle1">Add Collections</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
      {database.map((db, index) => {
        return (
          <TableBody key={index}>
            <TableRow>
              <TableCell align="left">
                <Label variant="ghost" color={'success'}>
                  active
                </Label>
              </TableCell>
              <TableCell>
                <Typography variant="h5" noWrap>
                  {db.DatabaseName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ wordWrap: 'break-word', width: '15rem' }}>
                  {UNIFY_URI}/unify/dyno/{db.DatabaseName}
                </Typography>
              </TableCell>

              <TableCell>
                {db.collections.map((collection) => {
                  return (
                    <TableCell>
                      <Typography variant="subtitle2">{collection}</Typography>
                    </TableCell>
                  );
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="text"
                  onClick={(e) => {
                    handleAddDocumentsOpen(e, db.DatabaseName, db.DatabaseName);
                  }}
                >
                  + Add Collection
                </Button>
                <MenuPopover
                  open={Boolean(openAddDoc)}
                  anchorEl={openAddDoc}
                  onClose={handleAddDocumentsClose}
                  sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">Add Collection</Typography>

                      <TextField
                        label="Collection Name"
                        fullWidth
                        style={{ margin: 10 }}
                        onChange={(e) => NewCollectionChange(e)}
                        value={newcollection}
                      />

                      <Button
                        variant="contained"
                        onClick={() => {
                          createCollection(newAddedDatabase, newcollection);
                        }}
                        style={{ margin: 10 }}
                      >
                        Create
                      </Button>
                    </Box>
                  </Box>
                </MenuPopover>
              </TableCell>

              <TableCell align="right">
                <UserMoreMenu />
              </TableCell>
            </TableRow>
          </TableBody>
        );
      })}
    </Card>
  );
}
