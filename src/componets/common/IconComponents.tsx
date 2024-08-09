import React from 'react'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import LiquorIcon from '@mui/icons-material/Liquor';
import GiteIcon from '@mui/icons-material/Gite';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaidIcon from '@mui/icons-material/Paid';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import Face4Icon from '@mui/icons-material/Face4';
import { IncomeCategory, ExpenseCategory } from '../../types';

const IconComponents:Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
  食費: <RestaurantMenuIcon fontSize='small' />,
  日用品: <EventAvailableIcon fontSize='small' />,
  住居費: <GiteIcon fontSize='small' />,
  交際費: <GroupIcon fontSize='small' />,
  娯楽: <LiquorIcon fontSize='small' />,
  交通費: <DirectionsCarIcon fontSize='small' />,
  給与: <PaidIcon fontSize='small' />,
  副収入: <CurrencyYenIcon fontSize='small' />,
  お小遣い: <Face4Icon fontSize='small' />,
}

export default IconComponents