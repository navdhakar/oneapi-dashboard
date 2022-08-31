import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { UNIFY_URI, RZR_KEYID } from '../../../config';
import { makePostRequest, makeGETRequest } from '../../../Api/Apikit';

// ----------------------------------------------------------------------

export default function OnePayment() {
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [senderEmail, setsenderEmail] = useState('');
  const [triggerdata, settriggerdata] = useState('');
  const [PhoneNo, setPhoneNo] = useState('');
  const [urlToken, seturlToken] = useState('');
  const [Amount, setAmount] = useState(0);
  const [Name, setName] = useState('');
  const [rzpOID, setrzpOID] = useState('');
  const [rzpSIG, setrzpSIG] = useState('');
  const [alert, setalert] = useState(false);
  const [alerttext, setalerttext] = useState('');
  const [loading, setloading] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name required'),
    lastName: Yup.string().required('Last Name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

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

  useEffect(() => {
    const url = window.location.href.split('/');
    const lastSegment = url.pop() || url.pop();
    seturlToken(lastSegment);
    makeGETRequest(`/unify/paymentservices/reciever/${lastSegment}`)
      .then((res) => {
        console.log(res);
        setEmail(res.email);
        setName(res.name);
        settriggerdata(res.triggerdata);
        setAmount(res.amount);
      })
      .catch((e) => {
        console.log(e);
        setalerttext('server is down, please try again!!');
        setalert(true);
      });
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  });

  const openPayModal = () => {
    const amount = Number(Amount) * 100;
    const options = {
      key: RZR_KEYID,
      amount: 0, // 2000 paise = INR 20, amount in paisa
      name: '',
      description: '',
      order_id: '',
      handler: function (response) {
        console.log(response);
        const values = {
          razorpay_signature: response.razorpay_signature,
          razorpay_order_id: response.razorpay_order_id,
          transactionid: response.razorpay_payment_id,
          transactionamount: amount,
          databaseName: Email.substring(0, Email.indexOf('@')),
          email: senderEmail,
          emailText: triggerdata,
          nameMReciever: Name,
          phoneno: PhoneNo,
          EmailMReciever: Email,
        };
        makePostRequest('/Payments/InitPayments/payment', values)
          .then((res) => {
            const data = {
              dueamount: res.transaction.transactionamount,
              transactionid: res.transaction.transactionid,
              razorpay_order_id: res.transaction.rzpoid,
              razorpay_signature: res.transaction.rzpsig,
            };
            console.log(data);
            makePostRequest(`/unify/paymentservices/update/${urlToken}`, data)
              .then((resp) => {
                setloading(false);
                console.log(resp);
                navigate(`/paymentsuccess/${senderEmail}`);
              })
              .catch((e) => {
                console.log(e);
                setalerttext('oops!!, your payment was not updated, contact support');
                setloading(false);
                setalert(true);
              });
          })
          .catch((e) => {
            console.log(e);
            setalerttext('Payment was not successfull');
            setloading(false);
            setalert(true);
          });
      },
      prefill: {
        name: 'navdeep',
        email: senderEmail,
        contact: String(PhoneNo),
      },
      notes: {
        address: `payment to ${Email}`,
      },
      theme: {
        color: '#528ff0',
      },
    };

    makePostRequest('/Payments/InitPayments/order', { amount: amount })
      .then((res) => {
        setloading(true);

        options.order_id = res.id;
        options.amount = res.amount;
        console.log(options);
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      })
      .catch((e) => {
        console.log(e);
        setloading(false);
      });
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
        label="Your email address"
        onChange={(e) => {
          setsenderEmail(e.target.value);
        }}
      />
      <TextField
        Name="phone no"
        label="Phone Number"
        type={'number'}
        onChange={(e) => {
          setPhoneNo(e.target.value);
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Iconify icon={'bx:rupee'} width={24} height={24} />

        <TextField
          Name="amount"
          label="Amount"
          type={'number'}
          value={Amount}
          // onChange={(e) => {
          //   setAmount(e.target.value);
          // }}
        />
      </Box>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{ backgroundColor: '#00d36b' }}
        loading={isSubmitting}
        onClick={() => {
          openPayModal();
        }}
      >
        {loading ? <Loading /> : 'Pay'}
      </LoadingButton>
      {alert ? <Alert severity="error">{alerttext}</Alert> : null}
    </Stack>
  );
}
