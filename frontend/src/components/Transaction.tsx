import  { useCallback, useEffect } from 'react'
import { BankAccount, createTransaction, getTransactions, Transaction } from '../api'
import { Box, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material'
import { Stack, Button } from '@mui/material'
import { useState } from 'react'
import NoData from './NoData'
import { Close, MonetizationOn } from '@mui/icons-material'

interface TransactionProps {
    from: BankAccount | null;
    onClose: () => void
}

export default function TransactionView(props: TransactionProps) {
    const { from, onClose } = props
    const [transferForm, setTransferForm] = useState({
        to_account_no: '',
        to_bank: '',
        amount: ''
    })
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [tabIndex, setTabIndex] = useState(0)

    const fetchTransactions = useCallback(async () => {
        if (!from) return
        const data = await getTransactions(from.id);
        setTransactions(data)
    }, [from])

    useEffect(() => {
        if (tabIndex === 1) {
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
                        {transactions.length > 0 ? (
                            <Stack spacing={1}>
                                {transactions.map((transaction, index) => (
                                    <Box key={index} p={1} border={1} borderRadius={1}>
                                        <Typography variant="body2">
                                            {transaction.from_account_id} to {transaction.to_account_id}
                                        </Typography>
                                        <Typography variant="body2">
                                            Amount: {transaction.amount} {transaction.currency}
                                        </Typography>
                                        <Typography variant="body2">
                                            Date: {new Date().toLocaleString()}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                           <NoData message="No transactions found." />
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    )
}
