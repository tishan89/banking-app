import { useEffect, useMemo, useState } from 'react';
import { getAccounts, BankAccount } from '../api';
import { Collapse, MenuItem, Select, FormControl, InputLabel, Box, TextField, Divider } from '@mui/material';
import { AccountTable } from '../components/AccountTable';
import TransactionView from '../components/Transaction';
import NewAccount from '../components/NewAccount';
import CommonLoaders from '../components/CommonLoaders';

export const Accounts = () => {

  const [searchValue, setSearchValue] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const accounts = await getAccounts();
        setAccounts(accounts);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const sortedAccounts = useMemo(() => {
    return [...accounts]
      .filter(acc => JSON.stringify(acc).includes(searchValue))
      .sort((a, b) => (sort === 'asc' ? a.balance - b.balance : b.balance - a.balance));
  }, [accounts, searchValue, sort]);

  return (
    <Box display="flex" width="100%" flexGrow={1}>
      <Box display="flex" flexDirection="column" gap={1} flexGrow={1} p={2}>
        <Box display="flex" gap={1} justifyContent="flex-end" alignItems={'center'}>
          <TextField
            id="sort"
            value={searchValue}
            size='small'
            label="Search"
            onChange={(e) => setSearchValue(e.target.value)}
            variant="outlined"
            sx={{ width: 300 }}
          />
          <FormControl size="small" variant='outlined'>
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
          <NewAccount />
        </Box>
        <Divider />
        {isLoading && (<CommonLoaders />)}
        <AccountTable accounts={sortedAccounts} onSelect={(account) => setSelectedAccount(account)} selectedAccountId={selectedAccount?.id ?? null} />
      </Box>
      {selectedAccount && <Divider orientation='vertical' /> }
      <Collapse in={!!selectedAccount} orientation='horizontal' unmountOnExit>
          <TransactionView from={selectedAccount} accounts={accounts} onClose = {()=>setSelectedAccount(null)}  />
      </Collapse>
    </Box>
  );
};