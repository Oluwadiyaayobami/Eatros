import React from 'react'
import AppLayout from '../layout/AppLayout'
import AcctBalance from '../layout/AcctBalance'
import MoneyIn_Out from '../layout/MoneyIn_Out'
import TransactionHistory from '../layout/TransactionHistory'

const page = () => {
return(
    <>
    <AppLayout>
        <AcctBalance />
        <MoneyIn_Out />
        <TransactionHistory />
    </AppLayout>
</>
)
}

export default page