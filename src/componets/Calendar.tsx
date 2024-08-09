import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'
import React from 'react'
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import '../Caalender.css'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { Balance, CalendarContent, Transaction } from '../types';
import { formatCurrency } from '../utils/formatting'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from '@mui/material'
import { light } from '@mui/material/styles/createPalette'
import { isSameMonth } from 'date-fns'


interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  currentDay: string;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  today: string;
  onDateClick: (dateInfo: DateClickArg) => void;
}
const Calendar = ({monthlyTransactions, setCurrentMonth,currentDay, setCurrentDay, today, onDateClick}:CalendarProps) => {
  const theme = useTheme()
  // const events = [
  //   { title: 'Meeting', start: "2024-08-02" },
  //   { title: 'samon ran', start: "2024-08-12", income: 300, expense: 200, balance: 100 }
  // ]
  const dailyBalances = calculateDailyBalances(monthlyTransactions)
  console.log(dailyBalances,"dailyBalances")

  // fullcalendar用のイベントを生成する関数
  const createCalendarEvents = (dailyBalances:Record<string,Balance>): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date)=> {
      const {income, expense, balance} =dailyBalances[date]
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency (balance)
      }
    })
  }
  const calendarEvents = createCalendarEvents(dailyBalances)
  console.log(calendarEvents,"calendarEvents")

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className='money' id='event-income'>
          {eventInfo.event.extendedProps.income}
        </div>
        <div className='money' id='event-expense'>
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className='money' id='event-balance'>
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    )
  }

  const handleDateSet = (dateSetInfo:DatesSetArg) => {
    const currentMonth = dateSetInfo.view.currentStart
    setCurrentMonth(currentMonth)
    const todayDate = new Date()
    if (isSameMonth(todayDate,currentMonth)) {
      setCurrentDay(today)
    }
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin,interactionPlugin]}
      initialView='dayGridMonth'
      locale={jaLocale}
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet= {handleDateSet}
      dateClick={onDateClick}
    />
  )
}

export default Calendar