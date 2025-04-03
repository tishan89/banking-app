import { useEffect, useMemo, useState } from 'react';
import { getTransactions, Transaction } from '../api';
import { Table, TableHead, TableBody, TableRow, TableCell, Box, Divider } from '@mui/material';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export const Transactions = () => {
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions().then(setTxs).catch(console.error);
  }, []);
  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const sortedTxs = useMemo(() => 
    txs
      .filter(tx => JSON.stringify(tx).toLowerCase().includes(searchValue.toLowerCase()))
      .sort((a, b) => (sort === 'asc' ? a.amount - b.amount : b.amount - a.amount)),
    [txs, searchValue, sort]
  );

  return (
    <Box display="flex" flexDirection="column" gap={1} p={2} flexGrow={1}>
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems={'center'}>
        <TextField
          id="search"
          value={searchValue}
          size="small"
          label="Search"
          onChange={(e) => setSearchValue(e.target.value)}
          variant="outlined"
          sx={{ width: 300 }}
        />
        <FormControl size="small" variant="outlined">
          <InputLabel id="sort-label">Sort</InputLabel>
          <Select
            labelId="sort-label"
            id="sort"
            value={sort}
            label="Sort"
            onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">Balance: Low → High</MenuItem>
            <MenuItem value="desc">Balance: High → Low</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>From Account</TableCell>
            <TableCell>To Account</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Currency</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTxs.map(tx => (
            <TableRow key={tx.id}>
              <TableCell>{tx.from_account_id}</TableCell>
              <TableCell>{tx.to_account_id}</TableCell>
              <TableCell>${tx.amount.toFixed(2)}</TableCell>
              <TableCell>{tx.currency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
