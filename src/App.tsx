import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './componets/AppLayout';
import {theme} from './theme/theme'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Transaction } from './types';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { db } from './firebase';
import { format } from 'date-fns';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';

// firestoreエラーかどうかを判断する型ガード
function isFireStoreError(err: unknown):err is {code: string, message: string} {
  return typeof err === "object" && err !== null && "code" in err
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // firestoreのデータを全て取得
  useEffect(()=> {
    const fetchTransactions = async () => {
      try{
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        const transacttionsData = querySnapshot.docs.map((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          return {
            ...doc.data(),
            id: doc.id
          } as Transaction // ...doc.data()がTransactionの型を持っていることをtype scriptに伝える * 型が間違っていてもtype scriptが型があっていると判断するので、使用は慎重に
        });
        console.log(transacttionsData,"transacttionsData")
        setTransactions(transacttionsData);
      } catch (err) {
        // error
        if (isFireStoreError(err)) {
          console.error("firestoreのエラーは: ",err)
          // console.error("firestoreのエラーメッセージは: ",err.message)
          // console.error("firestoreのエラーコードは: ",err.code)
        } else {
          console.error("一般的なエラーは: ",err)
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  },[])
  // 1月分のデータのみ取得
  const monthlyTransactions = transactions.filter((transaction)=> {
    return transaction.date.startsWith(formatMonth(currentMonth))
  })
  console.log(monthlyTransactions,"monthlyTransactions")

  //取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    console.log(transaction,"transaction")
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      console.log("Document written with ID: ", docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transaction
      } as Transaction
       // categoryについて、Schemaで ""を許容しているが、Transactionでは許容していないためエラー 
       // → ""は型としては許容しているが、実際に""が入るとバリデーションが出て実質的にcategoryに入ってくることはないためTransaction型として扱うことアサーションでtypescriptに伝える
      setTransactions((prevTransaction)=>[...prevTransaction, newTransaction])
    } catch(err) {
      // error
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは: ",err)
        // console.error("firestoreのエラーメッセージは: ",err.message)
        // console.error("firestoreのエラーコードは: ",err.code)
      } else {
        console.error("一般的なエラーは: ",err)
      }
    }
  }

  // 取引を削除する処理
  const handleDeleteTransaction = async (transactionIds: string | readonly string[]) => {
    try {
      const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds]
      for(const id of idsToDelete) {
        // firestoreのデータ削除
        await deleteDoc(doc(db, "Transactions", id));
        // const fileteredTransactions = transactions.filter((transaction)=> transaction.id !== id)
        const fileteredTransactions = transactions.filter((transaction)=>!idsToDelete.includes(transaction.id))
        setTransactions(fileteredTransactions)
      }
    } catch(err) {
      // error
      if (isFireStoreError(err)) {
        console.error("firestoreのエラーは: ",err)
        // console.error("firestoreのエラーメッセージは: ",err.message)
        // console.error("firestoreのエラーコードは: ",err.code)
      } else {
        console.error("一般的なエラーは: ",err)
      }
    }
  }
  // 取引を更新する処理
  const handleUpdateTransaction = async (transaction: Schema, transactionId: string) => {
    try {
        // firestoreのデータ更新
        const docRef = doc(db, "Transactions", transactionId);

        // Set the "capital" field of the city 'DC'
        await updateDoc(docRef, transaction);

        // フロント更新
        const updatedTransactions = transactions.map((t)=> 
          t.id === transactionId ? {...t, ...transaction}: t
        ) as Transaction[]
        setTransactions(updatedTransactions)
      } catch(err) {
        // error
        if (isFireStoreError(err)) {
          console.error("firestoreのエラーは: ",err)
          // console.error("firestoreのエラーメッセージは: ",err.message)
          // console.error("firestoreのエラーコードは: ",err.code)
        } else {
          console.error("一般的なエラーは: ",err)
        }
      }
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Router>
        <Routes>
          <Route path= "/" element={<AppLayout />}>
            <Route 
            index 
            element={
              <Home 
              monthlyTransactions={monthlyTransactions}
              setCurrentMonth={setCurrentMonth}
              onSaveTransaction={handleSaveTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              />
            } 
          />
            <Route 
            path="/report" 
            element={
              <Report
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              monthlyTransactions={monthlyTransactions}
              isLoading={isLoading}
              onDeleteTransaction={handleDeleteTransaction}
              />
            } 
            />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
// test
