import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Resizer from 'react-image-file-resizer';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Input,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import {
  setName,
  setEmail,
  setPhoto,
  setJwtToken,
  setuserDatabases,
  setuserAuthInfo,
  seturlToken,
} from '../../../redux/action';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { UNIFY_URI } from '../../../config';
import { makePostRequest } from '../../../Api/Apikit';

// ----------------------------------------------------------------------

export default function AutoLinkForm() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [Verification, setVerification] = useState(false);
  const [OTP, setOTP] = useState('');
  const [Name, setName] = useState('');
  const [Accountno, setAccountno] = useState(0);
  const [Secret, setSecret] = useState('');
  const [IFSC, setIFSC] = useState('');
  const [Verified, setVerified] = useState(false);
  const [Trigger, setTrigger] = useState('Email');
  const [Triggerdata, setTriggerdata] = useState('');
  const [alert, setalert] = useState(false);
  const [alerttext, setalerttext] = useState('');
  const [loading, setloading] = useState(false);
  const [Amount, setAmount] = useState(0);
  const [ProductName, setProductName] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [selectedBanner, setSelectedBanner] = useState();

  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isBannerPicked, setIsBannerPicked] = useState(false);

  const [producturl, setproducturl] = useState('');
  const [productimage, setproductimage] = useState('');
  const [Description, setDescription] = useState('');
  const [compressedFile, setCompressedFile] = useState(null);
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name required'),
    lastName: Yup.string().required('Last Name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        400,
        'JPEG',
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });
  const userObj = useSelector((state) => state.authReducer);
  console.log(userObj.email);
  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    setloading(true);
    const data = {
      email: Email,
    };
    makePostRequest('/unify/paymentservices/verifyemail', data)
      .then((res) => {
        console.log(res);
        setloading(false);
        setVerification(true);
      })
      .catch((err) => {
        console.log(err);
        setalerttext('email verify did not succeed, try again');
        setalert(true);
      });
  };
  const data = {
    otp: '',
    name: '',
    email: '',
    accountno: '',
    ifsc: '',
    secret: '',
    verified: false,
    trigger: 'Email',
    triggerdata: '',
    amount: '',
    productname: '',
    productlink: '',
    accountemail: '',
    productimage: '',
    productdescription: '',
  };
  const onCreate = async () => {
    setloading(true);
    const formData = new FormData();
    const imgData = new FormData();

    formData.append('file', selectedFile);
    formData.append('file', selectedBanner);

    formData.append('upload_preset', 'paylink');
    formData.append('cloud_name', 'dmzhcquzz');
    imgData.append('file', selectedBanner);
    imgData.append('upload_preset', 'paylink');
    imgData.append('cloud_name', 'dmzhcquzz');
    fetch('https://api.cloudinary.com/v1_1/dmzhcquzz/upload', {
      method: 'post',
      body: imgData,
    })
      .then((resp) => resp.json())
      .then((res) => {
        data.otp = OTP;
        data.name = Name;
        data.email = Email;
        data.accountno = Accountno;
        data.ifsc = IFSC;
        data.secret = Secret;
        data.triggerdata = Triggerdata;
        data.amount = Amount;
        data.productname = ProductName;
        data.accountemail = userObj.email;
        data.productimage = res.secure_url;
        data.productdescription = Description;
      })
      .then(() => {
        fetch('https://api.cloudinary.com/v1_1/dmzhcquzz/upload', {
          method: 'post',
          body: formData,
        })
          .then((resp) => resp.json())
          .then((res) => {
            console.log(res.secure_url);
            setproducturl(res.secure_url);
            data.productlink = res.secure_url;
            console.log(data);
            makePostRequest('/unify/paymentservices/enable', data)
              .then((res) => {
                console.log(res);
                const maildata = {
                  email: Email,
                  paylink: `https://app.nocodepayments.dev/paylinkpayment/${res.urlToken}`,
                  name: Name,
                };
                makePostRequest('/Payments/InitPayments/sendlinkmail', maildata).then((resp) => {
                  setloading(false);
                  navigate(`/dashboard/paylink/`);
                });
              })
              .catch((err) => {
                console.log(err);
                setalerttext('Payments enable failed');
                setalert(true);
              });
          });
      })
      .catch((err) => {
        console.log(err);
        setalerttext('Payments enable failed');
        setalert(true);
      });

    console.log(formData);
    console.log(productimage);
    console.log(producturl);
  };
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };
  const dataURIToBlob = (dataURI) => {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mimeString });
  };
  const changeBanner = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    await resizeFile(file).then((image) => {
      const newFile = dataURIToBlob(image);
      newFile.name = file.name;
      setSelectedBanner(newFile);
      setIsBannerPicked(true);
    });
  };
  const handleOTP = (event) => {
    setOTP(event.target.value);
  };
  const handleaccount = (event) => {
    setAccountno(event.target.value);
  };
  const handlesecret = (event) => {
    setSecret(event.target.value);
  };
  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleifsc = (event) => {
    setIFSC(event.target.value);
  };
  const handletriggerdata = (event) => {
    setTriggerdata(event.target.value);
  };
  const handletamount = (event) => {
    setAmount(event.target.value);
  };
  const handledescription = (event) => {
    setDescription(event.target.value);
  };
  const handletproductname = (event) => {
    setProductName(event.target.value);
  };
  const Loading = () => {
    if (loading === true) {
      return <CircularProgress sx={{ color: '#118C4F' }} />;
    }
  };
  return (
    <Stack spacing={3}>
      <TextField
        Name="email"
        label="PayPal Email address"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      {Verification ? null : (
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ backgroundColor: '#2681f8' }}
          loading={isSubmitting}
          onClick={() => {
            onSubmit();
          }}
        >
          {loading ? <Loading /> : 'Register'}
        </LoadingButton>
      )}
      {Verification ? (
        <>
          <TextField Name="otp" label="OTP" type={'number'} onChange={handleOTP} />
          <TextField Name="product name" label="Product Name" onChange={handletproductname} />
          {isFilePicked ? (
            <>
              <Typography variant="body2" sx={{ mt: 5 }}>
                Filename: {selectedFile.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 5 }}>
                Filetype: {selectedFile.type}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" sx={{ mt: 5 }}>
              Select a file
            </Typography>
          )}

          <Button variant="contained" component="label">
            Upload File
            <input type="file" name="product" hidden onChange={changeHandler} />
          </Button>
          <TextField
            Name="Product Description"
            label="Product Description(Max 100 words)"
            onChange={handledescription}
            multiline
            maxRows={4}
          />
          {isBannerPicked ? (
            <>
              <Typography variant="body2" sx={{ mt: 5 }}>
                Filename: {selectedBanner.name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 5 }}>
                Filetype: {selectedBanner.type}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" sx={{ mt: 5 }}>
              Select banner
            </Typography>
          )}
          <Button variant="contained" component="label">
            Product cover image
            <input type="file" name="product" hidden onChange={changeBanner} />
          </Button>

          <TextField Name="amount" label="Amount($) in USD" onChange={handletamount} />
          <TextField Name="account no" label="Account Number" type={'number'} onChange={handleaccount} />
          <TextField Name="name" label="Account Holder Name" onChange={handleName} />

          <TextField Name="IFSC code" label="IFSC Code" onChange={handleifsc} />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Trigger </InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={'Email'} label="Trigger">
              <MenuItem value={'Email'}>Email</MenuItem>
              <MenuItem value={'SMS'}>SMS</MenuItem>
            </Select>
          </FormControl>
          <TextField
            Name="trigger data"
            label="Your personalized message for every customer"
            onChange={handletriggerdata}
          />

          <TextField Name="Secret" label="Secret" onChange={handlesecret} />
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              onCreate();
            }}
            sx={{ backgroundColor: '#00d36b' }}
            style={{ margin: 10 }}
          >
            {loading ? <Loading /> : 'Create'}
          </Button>
        </>
      ) : null}
      {alert ? (
        <Alert severity="error" sty>
          <span style={{ fontFamily: 'Roboto Mono, monospace' }}>{alerttext}</span>
        </Alert>
      ) : null}
    </Stack>
  );
}
