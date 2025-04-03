import { useCallback, useEffect, useMemo } from 'react'
import { BankAccount, createTransaction, getTransactions, Transaction } from '../api'
import { Box, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material'
import { Stack, Button } from '@mui/material'
import { useState } from 'react'
import NoData from './NoData'
import { Close, MonetizationOn } from '@mui/icons-material'
import { getAccountMap } from '../utils/accounts'
import CommonLoaders from './CommonLoaders'

interface TransactionProps {
    from: BankAccount | null;
    onClose: () => void
    accounts: BankAccount[]
}

export default function TransactionView(props: TransactionProps) {
    const { from, accounts, onClose } = props
    const acountMap = useMemo(() => getAccountMap(accounts), [accounts])
    const [transferForm, setTransferForm] = useState({
        to_account_no: '',
        to_bank: '',
        amount: ''
    })
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [tabIndex, setTabIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const fetchTransactions = useCallback(async () => {
        if (!from) return
        const data = await getTransactions(from.id);
        setTransactions(data)
        setIsLoading(false)
    }, [from])

    useEffect(() => {
        if (tabIndex === 1) {
            setIsLoading(true)
            fetchTransactions();
        }
    }, [fetchTransactions, from, tabIndex])


    const handleTransfer = async () => {
        if (!from || transferForm.to_account_no === '' || transferForm.to_bank === '' || transferForm.amount === '') {
            return
        }
        try {
            await createTransaction({
                from_account_id: from.id,
                account_no: transferForm.to_account_no,
                bank_name: transferForm.to_bank,
                amount: parseFloat(transferForm.amount),
                currency: 'USD',
                user_id: 1,
            });
            fetchTransactions();
            setTransferForm({ to_account_no: '', to_bank: '', amount: '' });
        } catch (e) {
            console.error('Transaction failed', e);
        }
    };

    const isNotCompleted = transferForm.to_account_no === '' || transferForm.to_bank === '' || transferForm.amount === ''
    return (
        <Box sx={{ width: 400 }} gap={1} p={2} display="flex" flexDirection="column">
            <Typography variant="h6" gutterBottom>
                Transfer
                <IconButton
                    onClick={onClose}
                    sx={{ float: 'right' }}
                    color='error'
                    size='small'
                >
                    <Close />
                </IconButton>
            </Typography>
            <Box>
                <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)}>
                    <Tab label="New Transaction" />
                    <Tab label="History" />
                </Tabs>
                {tabIndex === 0 && (
                    <Box p={2}>
                        {from && (
                            <Stack spacing={2}>
                                <TextField
                                    label="Sender Name"
                                    value={from.owner}
                                    size="small"
                                    disabled
                                />
                                <TextField
                                    label="Sender Account"
                                    value={from.account_no}
                                    size="small"
                                    disabled
                                />
                                <TextField
                                    label="Sender Bank"
                                    value={from.bank_name}
                                    size="small"
                                    disabled
                                />
                                <TextField
                                    label="Recipient Account #"
                                    value={transferForm.to_account_no}
                                    onChange={(e) => setTransferForm({ ...transferForm, to_account_no: e.target.value })}
                                    size="small"
                                />
                                <TextField
                                    label="Recipient Bank"
                                    value={transferForm.to_bank}
                                    onChange={(e) => setTransferForm({ ...transferForm, to_bank: e.target.value })}
                                    size="small"
                                />
                                <TextField
                                    label="Amount (USD)"
                                    type="number"
                                    value={transferForm.amount}
                                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                                    size="small"
                                />
                                <Button variant="contained" disabled={isNotCompleted} startIcon={<MonetizationOn />} onClick={handleTransfer}>Transfer</Button>
                            </Stack>
                        )}
                    </Box>
                )}
                {tabIndex === 1 && (
                    <Box p={2}>

                        {isLoading ? <CommonLoaders /> : <>
                            {transactions.length > 0 ? (
                                <Stack spacing={1}>
                                    {transactions.map((transaction, index) => (
                                        <Box key={index} p={1} border={1} borderRadius={1}>
                                            <Typography variant="body2">
                                                From: {acountMap.get(transaction.from_account_id)?.account_no} ({acountMap.get(transaction.from_account_id)?.bank_name}) | {acountMap.get(transaction.from_account_id)?.owner}
                                            </Typography>
                                            <Typography variant="body2">
                                                To: {acountMap.get(transaction.to_account_id)?.account_no} ({acountMap.get(transaction.to_account_id)?.bank_name}) | {acountMap.get(transaction.to_account_id)?.owner}
                                            </Typography>

                                            <Typography variant="body2">
                                                Amount: {transaction.amount} {transaction.currency}
                                            </Typography>
                                            <Typography variant="body2">
                                                Date: {new Date(transaction.created_at).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <NoData message="No transactions found." />
                            )}
                        </>}
                    </Box>
                )}
            </Box>
        </Box>
    )
}
