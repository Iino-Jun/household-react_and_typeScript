import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Category } from "@mui/icons-material";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import LiquorIcon from '@mui/icons-material/Liquor';
import GiteIcon from '@mui/icons-material/Gite';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaidIcon from '@mui/icons-material/Paid';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import Face4Icon from '@mui/icons-material/Face4';
import { ExpenseCategory, IncomeCategory, Transaction } from "../types";
import {zodResolver} from "@hookform/resolvers/zod"
import { TransactionSchema } from "../validations/schema";
import { Schema } from "../validations/schema";

interface TransactionForm {
  onColseForm: () => void;
  isEnteryDraweropen: boolean;
  currentDay: string;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null;
  onDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
  onUpdateTransaction:  (transaction: Schema, transactionId: string) => Promise<void>;
  isMobile: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type IncomeExpense = "income" | "expense"

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory,
  icon: JSX.Element
}

const TransactionForm = ({onColseForm, isEnteryDraweropen, currentDay, onSaveTransaction, selectedTransaction, onDeleteTransaction, setSelectedTransaction, onUpdateTransaction, isMobile, isDialogOpen, setIsDialogOpen}: TransactionForm) => {
  const formWidth = 320;

  const expenseCategory: CategoryItem[] = [
    {label: "食費", icon: <RestaurantMenuIcon fontSize='small' />},
    {label:"日用品", icon: <EventAvailableIcon fontSize='small' />},
    {label:"住居費", icon: <GiteIcon fontSize='small' />},
    {label:"交際費", icon: <GroupIcon fontSize='small' />},
    {label:"娯楽", icon: <LiquorIcon fontSize='small' />},
    {label:"交通費", icon: <DirectionsCarIcon fontSize='small' />}
  ]
  const incomeCategory: CategoryItem[] = [
    {label:"給与", icon: <PaidIcon fontSize='small' />},
    {label:"副収入", icon: <CurrencyYenIcon fontSize='small' />},
    {label:"お小遣い", icon: <Face4Icon fontSize='small' />}
  ]
  const [categories, setCategories] = useState(expenseCategory);

  const {
    control, 
    setValue, 
    watch,
    formState:{errors}, 
    handleSubmit,
    reset
  } = useForm<Schema>({
    defaultValues: {
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: ""
    },
    resolver: zodResolver(TransactionSchema)
  })
  console.log(errors,"errors")

  // 終始タイプを切り替える関数
  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue("type", type)
    setValue("category", "")
  }

  // 収支タイプを監視
  const currentType = watch("type")

  useEffect(()=> {
    setValue("date", currentDay)
  }, [currentDay])

  useEffect(()=> {
    const newCategoies = currentType === "expense" ? expenseCategory : incomeCategory;
    setCategories(newCategoies)
  },[currentType])

  // 送信処理
  const onsubmit: SubmitHandler<Schema> = (data) => {
    console.log(data, "data")
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
      .then(()=> {
        console.log("更新しました")
        setSelectedTransaction(null)
        if (isMobile) {
          setIsDialogOpen(false)
        }
      })
      .catch((error) => {
        console.error(error)
      })
    } else {
      onSaveTransaction(data)
      .then(()=> {
        console.log("保存しました")
      })
      .catch((error) => {
        console.error(error)
      })
    }

    reset({
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: ""
    })
  }
  useEffect(()=> {
    // 選択肢が更新されたか確認
    if (selectedTransaction) {
      const categoryExist = categories.some((category)=> category.label === selectedTransaction.category) 
      setValue("category", categoryExist?selectedTransaction.category: "")
    }
  },[selectedTransaction, categories])

  useEffect(()=> {
    if(selectedTransaction) {
      setValue("type", selectedTransaction.type)
      setValue("date", selectedTransaction.date)
      setValue("amount", selectedTransaction.amount)
      setValue("content", selectedTransaction.content)
    } else {
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "",
        content: ""
      })
    }
  }, [selectedTransaction])

  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id)
      if (isMobile) {
        setIsDialogOpen(false)
      }
      setSelectedTransaction(null)
    }
  }
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
          <Typography variant="h6">入力</Typography>
          {/* 閉じるボタン */}
          <IconButton
            onClick={onColseForm}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onsubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({field}) => (
              <ButtonGroup fullWidth>
                <Button 
                variant={field.value === "expense" ? "contained" : "outlined"} 
                color="error" 
                onClick={()=>incomeExpenseToggle("expense")}>
                  支出
                </Button>
                <Button onClick={()=>incomeExpenseToggle("income")}
                  color={"primary"}
                  variant={field.value === "income" ? "contained" : "outlined"}
                >
                収入</Button>
              </ButtonGroup>
            )}
          />
          {/* 日付 */}
          <Controller
          name="date"
          control={control}
          render={({field})=> (
            <TextField
              {...field}
              label="日付"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          )}
          />
          {/* カテゴリ */}
          <Controller
          name="category"
          control={control}
          render={({field})=> (
            <TextField 
              {...field} 
              id="カテゴリ" 
              label="カテゴリ" 
              select
              error={!!errors.category}
              helperText={errors.category?.message}
              InputLabelProps={{htmlFor: "category"}}
              inputProps={{id: "category"}}
              >
              {categories.map((category)=>(
                <MenuItem value={category.label} key={category.label}>
                  <ListItemIcon>
                  {category.icon}
                  </ListItemIcon>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>
          )}
          />
          {/* 金額 */}
          <Controller
          name="amount"
          control={control}
          render={({field})=> (
            <TextField 
              {...field}
              label="金額" 
              type="number" 
              value={field.value === 0 ? "": field.value} 
              onChange={(e)=> {
                const newValue = parseInt(e.target.value, 10) || 0
                field.onChange(newValue);
              }}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />
          )}
          />
          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({field})=> (
              <TextField 
                {...field} 
                label="内容" 
                type="text"
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />
          {/* 保存ボタン */}
          <Button type="submit" variant="contained" color={currentType ==="income"? "primary": "error"} fullWidth>
            {selectedTransaction? "更新": "保存"}
          </Button>
          
          {selectedTransaction && (
            <Button onClick={handleDelete} variant="outlined" color={"secondary"} fullWidth>
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  )
  return (
    <>
      {isMobile ? (
      // mobile
      <Dialog open={isDialogOpen} onClose={onColseForm} fullWidth maxWidth={"sm"}>
        <DialogContent>
          {formContent}
        </DialogContent>
      </Dialog>
      ) : (
      // PC
      <Box
        sx={{
          position: "fixed",
          top: 64,
          right: isEnteryDraweropen? formWidth: "-2%", // フォームの位置を調整
          width: formWidth,
          height: "100%",
          bgcolor: "background.paper",
          zIndex: (theme) => theme.zIndex.drawer - 1,
          transition: (theme) =>
            theme.transitions.create("right", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          p: 2, // 内部の余白
          boxSizing: "border-box", // ボーダーとパディングをwidthに含める
          boxShadow: "0px 0px 15px -5px #777777",
        }}
      >
        {formContent}
      </Box>
      )}
    </>
  );
};
export default TransactionForm;
