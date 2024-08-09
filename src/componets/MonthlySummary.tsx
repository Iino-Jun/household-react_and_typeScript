import { Grid ,Card, CardContent, Stack, Typography } from '@mui/material'
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import React from 'react'
import { Transaction } from '../types';
import { financeCalculations } from '../utils/financeCalculations';
import { formatCurrency } from '../utils/formatting';

interface MonthlySummaryProps {
  monthlyTransactions: Transaction[]
}

const MonthlySummary = ({monthlyTransactions}:MonthlySummaryProps) => {
  const {income, expense, balance} = financeCalculations(monthlyTransactions);
  
  return (
    <Grid container spacing={{sx: 1, sm: 2}} mb={2}>
      {/* 収入 */}
      <Grid item xs={4} display={"flex"} flexDirection={'column'}>
        <Card sx={{
          bgcolor: (theme) => theme.palette.incomeColor.main,
          color: 'white',
          borderRadius: '10px',
          flexGrow: 1 }}
        >
          <CardContent sx={{padding: {xs: 1, sm: 2}}}>
            <Stack direction={"row"}>
              <CallMadeIcon sx={{fontSize: '2rem'}} />
              <Typography>収入</Typography>
            </Stack>
            <Typography 
              textAlign={"right"} variant='h5' fontWeight={"fontWeightBold"}
              sx={{wordBreak: "break-word", fontSize: {xs: '.8rem', sm: '1rem', md: '1.2rem'}}}
            >¥{formatCurrency(balance)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* 支出 */}
      <Grid item xs={4} display={"flex"} flexDirection={'column'}>
        <Card sx={{
          bgcolor: (theme) => theme.palette.expenseColor.main, 
          color: 'white',
          borderRadius: '10px', 
          flexGrow: 1 }}
        >
          <CardContent sx={{padding: {xs: 1, sm: 2}}}>
            <Stack direction={"row"}>
              <CallReceivedIcon sx={{fontSize: '2rem'}} />
              <Typography>支出</Typography>
            </Stack>
            <Typography 
              textAlign={"right"} variant='h5' fontWeight={"fontWeightBold"}
              sx={{wordBreak: "break-word", fontSize: {xs: '.8rem', sm: '1rem', md: '1.2rem'}}}
            >¥{formatCurrency(expense)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* 残高 */}
      <Grid item xs={4} display={"flex"} flexDirection={'column'}>
        <Card sx={{bgcolor: (theme) => theme.palette.balanceColor.main, 
          color: 'white',
          borderRadius: '10px',
          flexGrow: 1 }}
        >
          <CardContent sx={{padding: {xs: 1, sm: 2}}}>
            <Stack direction={"row"}>
              <LocalAtmIcon sx={{fontSize: '2rem'}} />
              <Typography>残高</Typography>
            </Stack>
            <Typography 
              textAlign={"right"} variant='h5' fontWeight={"fontWeightBold"}
              sx={{wordBreak: "break-word", fontSize: {xs: '.8rem', sm: '1rem', md: '1.2rem'}}}
            >¥{formatCurrency(balance)}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default MonthlySummary