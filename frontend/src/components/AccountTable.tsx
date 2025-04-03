import React from 'react'
import { BankAccount } from '../api'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface AccountTableProps {
    accounts: BankAccount[],
    onSelect: (account: BankAccount) => void
    selectedAccountId: number | null
}

export const AccountTable: React.FC<AccountTableProps> = (props) => {
    const {accounts} = props
return (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Owner</TableCell>
                    <TableCell>Account No</TableCell>
                    <TableCell>Bank</TableCell>
                    <TableCell>Balance</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {accounts.map((account) => (
                    <TableRow
                        key={account.account_no}
                        onClick={() => props.onSelect(account)}
                        style={{
                            cursor: 'pointer',
                            backgroundColor: props.selectedAccountId === account.id ? '#f0f8ff' : 'transparent',
                        }}
                    >
                        <TableCell>{account.owner}</TableCell>
                        <TableCell>{account.account_no}</TableCell>
                        <TableCell>{account.bank_name}</TableCell>
                        <TableCell>${account.balance.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);
}
