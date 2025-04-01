// src/pages/Transactions.tsx
import { useEffect, useState } from 'react';
import { getTransactions, Transaction } from '../api';
import { List, ListItem, ListItemText, Container } from '@mui/material';

export const Transactions = () => {
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions().then(setTxs).catch(console.error);
  }, []);

  return (
    <Container>
      <List>
        {txs.map(tx => (
          <ListItem key={tx.id} divider>
            <ListItemText
              primary={`From ${tx.from_account_id} to ${tx.to_account_id}`}
              secondary={`$${tx.amount.toFixed(2)} ${tx.currency}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
