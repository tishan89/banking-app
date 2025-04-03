import { useEffect, useMemo, useState } from 'react';
import { BankAccount, getAccounts, getTransactions, Transaction } from '../api';
import { Table, TableHead, TableBody, TableRow, TableCell, Box, Divider } from '@mui/material';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getAccountMap } from '../utils/accounts';
import CommonLoaders from '../components/CommonLoaders';

export const Transactions = () => {
  const [txs, setTxs] = useState<Transaction[]>([]);

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const acountMap = useMemo(() => getAccountMap(accounts), [accounts])
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getAccounts().then(setAccounts).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const transactions = await getTransactions();
        setTxs(transactions);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const sortedTxs = useMemo(() =>
    txs?.filter(tx => JSON.stringify(tx).toLowerCase().includes(searchValue.toLowerCase()))
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
      {isLoading && (<CommonLoaders />)}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>From Account</TableCell>
            <TableCell>To Account</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedTxs.map(tx => (
            <TableRow key={tx.id}>
              <TableCell>{acountMap.get(tx.from_account_id)?.account_no} ({tx.from_account_id})</TableCell>
              <TableCell>{acountMap.get(tx.to_account_id)?.account_no} ({tx.to_account_id})</TableCell>
              <TableCell>${tx.amount.toFixed(2)}</TableCell>
              <TableCell>{tx.currency}</TableCell>
              <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
