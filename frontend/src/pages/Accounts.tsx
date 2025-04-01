// src/pages/Accounts.tsx
import { useEffect, useState } from 'react';
import { getAccounts, getTransactions, createTransaction, BankAccount, Transaction } from '../api';
import { Card, CardContent, Collapse, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel, Grid, Typography, Container, TextField, Button, Stack } from '@mui/material';

export const Accounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [transferForm, setTransferForm] = useState({
    to_account_no: '',
    to_bank: '',
    amount: '',
  });

  useEffect(() => {
    getAccounts().then(setAccounts).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedAccountId !== null) {
      getTransactions(selectedAccountId).then(setTransactions).catch(console.error);
    }
  }, [selectedAccountId]);

  const handleTransfer = async () => {
    if (!selectedAccountId) return;
    try {
      await createTransaction({
        from_account_id: selectedAccountId,
        account_no: transferForm.to_account_no,
        bank_name: transferForm.to_bank,
        amount: parseFloat(transferForm.amount),
        currency: 'USD',
        user_id: 1,
      });
      setTransferForm({ to_account_no: '', to_bank: '', amount: '' });
      getTransactions(selectedAccountId).then(setTransactions);
    } catch (e) {
      console.error('Transaction failed', e);
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) =>
    sort === 'asc' ? a.balance - b.balance : b.balance - a.balance,
  );

  return (
    <Container>
      <FormControl sx={{ m: 2, minWidth: 180 }} size="small">
        <InputLabel id="sort-label">Sort</InputLabel>
        <Select
          labelId="sort-label"
          id="sort"
          value={sort}
          label="Sort"
          onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
        >
          <MenuItem value={'asc'}>Balance: Low → High</MenuItem>
          <MenuItem value={'desc'}>Balance: High → Low</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={2} padding={2}>
        {sortedAccounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card onClick={() => setSelectedAccountId(account.id)}>
              <CardContent>
                <Typography variant="h6">{account.bank_name}</Typography>
                <Typography>Owner: {account.owner}</Typography>
                <Typography>Account #: {account.account_no}</Typography>
                <Typography>Balance: ${account.balance.toFixed(2)}</Typography>
              </CardContent>
            </Card>
            <Collapse in={selectedAccountId === account.id}>
              <List dense>
                {transactions.map((tx) => (
                  <ListItem key={tx.id} divider>
                    <ListItemText
                      primary={`From ${tx.from_account_id} to ${tx.to_account_id}`}
                      secondary={`$${tx.amount.toFixed(2)} ${tx.currency}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Stack spacing={1} sx={{ p: 2 }}>
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
                <Button variant="contained" onClick={handleTransfer}>Transfer</Button>
              </Stack>
            </Collapse>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
