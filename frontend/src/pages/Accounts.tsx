// src/pages/Accounts.tsx
import { useEffect, useState } from 'react';
import { getAccounts, getTransactions, BankAccount, Transaction } from '../api';
import { Card, CardContent, Collapse, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel, Grid, Typography, Container } from '@mui/material';

export const Accounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    getAccounts().then(setAccounts).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedAccountId !== null) {
      getTransactions(selectedAccountId).then(setTransactions).catch(console.error);
    }
  }, [selectedAccountId]);

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
            </Collapse>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};