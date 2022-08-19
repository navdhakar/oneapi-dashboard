import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Button, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { UNIFY_URI } from '../../../config';
import { makePostRequest, makeGETRequest } from '../../../Api/Apikit';
// ----------------------------------------------------------------------

export default function OnePayment() {
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [senderEmail, setsenderEmail] = useState('');

  const [Amount, setAmount] = useState(0);
  const [Name, setName] = useState('');

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
    makeGETRequest(`/unify/paymentservices/reciever/${lastSegment}`).then((res) => {
      console.log(res);
      setEmail(res.email);
      setName(res.name);
    });
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  });

  const openPayModal = () => {
    const amount = Number(Amount) * 100;
    const options = {
      key: 'rzp_test_2x7BgqQ0pkYHTZ',
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
          databaseName: Name,
          email: senderEmail,
        };
        makePostRequest('/Payments/InitPayments/payment', values)
          .then((res) => {
            navigate(`/paymentsuccess/${senderEmail}`);
          })
          .catch((e) => console.log(e));
      },
      prefill: {
        name: 'navdeep',
        email: senderEmail,
        contact: '1234567890',
      },
      notes: {
        address: 'Hello World',
      },
      theme: {
        color: '#528ff0',
      },
    };

    makePostRequest('/Payments/InitPayments/order', { amount: amount })
      .then((res) => {
        options.order_id = res.id;
        options.amount = res.amount;
        console.log(options);
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      })
      .catch((e) => console.log(e));
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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Iconify icon={'bx:rupee'} width={24} height={24} />

        <TextField
          Name="amount"
          label="Amount"
          type={'number'}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{ backgroundColor: '#118C4F' }}
        loading={isSubmitting}
        onClick={() => {
          openPayModal();
        }}
      >
        Pay
      </LoadingButton>
    </Stack>
  );
}
