import { Box, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import MonthlySummary from '../componets/MonthlySummary'
import Calendar from '../componets/Calendar'
import TransactionMenu from '../componets/TransactionMenu'
import TransactionForm from '../componets/TransactionForm'
import { Transaction } from '../types'
import { format } from 'date-fns'
import { Schema } from '../validations/schema'
import { DateClickArg } from '@fullcalendar/interaction'

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>
  onUpdateTransaction:  (transaction: Schema, transactionId: string) => Promise<void>;
}

const Home = ({monthlyTransactions, setCurrentMonth ,onSaveTransaction, onDeleteTransaction, onUpdateTransaction}:HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay ,setCurrentDay] =useState(today);
  const [isEnteryDraweropen, setIsEnteryDraweropen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr)
    setIsMobileDrawerOpen(true)
  }
  const handleCloseMobileBrawer = () => {
    setIsMobileDrawerOpen(false)
  }

  // 1日分のデータを取得
  const dailyTransactions = monthlyTransactions.filter((transaction)=>{
    return transaction.date === currentDay
  })
  console.log(dailyTransactions,'dailyTransactions')

  const colseForm = () => {
    setSelectedTransaction(null);
    if(isMobile) {
      setIsDialogOpen(!isDialogOpen)
    } else {
      setIsEnteryDraweropen(!isEnteryDraweropen)
    }
  }

  // フォームの開閉処理（内訳追加ボタンを押した時）
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true)
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null);
      } else {
        setIsEnteryDraweropen(!isEnteryDraweropen)
      }
    }
  }
  
  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    if (isMobile) {
      setIsDialogOpen(true)
    } else {
      setIsEnteryDraweropen(true)
    }

  }
  return (
    <Box sx={{display: 'flex'}}>
      {/* 左側のコンテンツ */}
      <Box sx={{flexGrow: 1}}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calendar 
          monthlyTransactions={monthlyTransactions}
          currentDay={currentDay}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          today={today}
          onDateClick={handleDateClick}
        />
      </Box>
      {/* 右側のコンテンツ */}
      <Box>
        <TransactionMenu 
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          handleAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileBrawer}
        />
        <TransactionForm
          onColseForm={colseForm} 
          isEnteryDraweropen={isEnteryDraweropen}
          currentDay={currentDay}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction= {selectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          setSelectedTransaction={setSelectedTransaction}
          onUpdateTransaction={onUpdateTransaction}
          isMobile={isMobile}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />

      </Box>
    </Box>
  )
}

export default Home