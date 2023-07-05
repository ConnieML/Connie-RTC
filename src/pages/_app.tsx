import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Input } from 'postcss'
import { useState } from 'react';
import { putData, deleteData } from '../add_data'

export default function App({ Component, pageProps }: AppProps) {
  
  async function handleAddEntry () {
    try{
      await( putData('api/dynamoCreate', {TableName: "starter_db", Item: {
        org_id: 'org-Id',
        user_id: 'user-Id'
      }}))
    }catch{
      console.log("error putting data!")
    }
  }
  
  async function handleDeleteEntry () {
    try{
      await( deleteData('api/dynamoDelete', {TableName: "starter_db", Key: {
        org_id: 'org-Id',
        user_id: 'user-Id'
      }}))
    }catch{
      console.log("error putting data!")
    }
  }

  return <div>
    
    <button onClick={handleAddEntry}>Add entry!</button>
    <button onClick={handleDeleteEntry}>Delete entry!</button>
    <Component {...pageProps} />
  </div>
    
}
