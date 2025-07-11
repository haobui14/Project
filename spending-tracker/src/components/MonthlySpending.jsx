import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import NotesIcon from '@mui/icons-material/Notes';
import { useTheme } from '@mui/material/styles';
import useMonthlySpending from '../utils/useMonthlySpending';

export default function MonthlySpending({ year, month, onDataChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data, saveData, updateData, loading, error } = useMonthlySpending(
    year,
    month
  );

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [partialDialogOpen, setPartialDialogOpen] = useState(false);
  const [partialAmount, setPartialAmount] = useState('');
  const [partialError, setPartialError] = useState('');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteEditId, setNoteEditId] = useState(null);

  // Per-item partial payment dialog state
  const [itemPartialDialogOpen, setItemPartialDialogOpen] = useState(false);
  const [itemPartialAmount, setItemPartialAmount] = useState('');
  const [itemPartialError, setItemPartialError] = useState('');
  const [partialItemId, setPartialItemId] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const spendings = data?.items || [];
  // Determine if any item is partially paid
  const hasPartialPaid = spendings.some(
    (item) => item.amountPaid > 0 && !item.paid
  );
  let monthPaidStatus = 'unpaid';
  if (hasPartialPaid) monthPaidStatus = 'partial';
  else if (spendings.length > 0 && spendings.every((item) => item.paid))
    monthPaidStatus = 'paid';
  const total = spendings.reduce((sum, s) => sum + (s.amount || 0), 0);
  const paid = spendings.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
  const unpaid = total - paid;

  // Notify parent component when data changes
  useEffect(() => {
    if (onDataChange && data) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

  const handleAddSpending = (e) => {
    e.preventDefault();
    if (!name || !amount || isNaN(amount)) return;
    const newItem = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      paid: false,
      amountPaid: 0,
      note: '',
    };
    const newItems = [...spendings, newItem];
    const newTotal = newItems.reduce((sum, s) => sum + s.amount, 0);
    const newPaid = newItems
      .filter((s) => (s.amountPaid || 0) >= s.amount)
      .reduce((sum, s) => sum + s.amount, 0);
    let newStatus = 'unpaid';
    if (newPaid === newTotal && newTotal > 0) newStatus = 'paid';
    else if (newPaid > 0) newStatus = 'partial';

    saveData({
      ...data,
      items: newItems,
      total: newTotal,
      paid: newPaid,
      status: newStatus,
      createdAt: data?.createdAt || new Date(),
      updatedAt: new Date(),
    });
    setName('');
    setAmount('');
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
  };

  const handleEditSave = (id) => {
    if (!editName || !editAmount || isNaN(editAmount)) return;
    updateData(id, { name: editName, amount: parseFloat(editAmount) });
    setEditId(null);
    setEditName('');
    setEditAmount('');
  };

  const handleDelete = (id) => {
    updateData(id, { _delete: true });
  };

  const handleMarkPaid = (id) => {
    // For fully paid, set amountPaid = amount and paid=true
    const item = spendings.find((s) => s.id === id);
    if (!item) return;
    updateData(id, { paid: true, amountPaid: item.amount });
  };

  const handleMarkMonthFullyPaid = () => {
    // Mark all items as paid and update the document status
    const updatedItems = spendings.map((s) => ({
      ...s,
      paid: true,
      amountPaid: s.amount,
    }));
    const newTotal = updatedItems.reduce((sum, s) => sum + s.amount, 0);
    const newPaid = newTotal;
    saveData({
      ...data,
      items: updatedItems,
      total: newTotal,
      paid: newPaid,
      status: 'paid',
      updatedAt: new Date(),
    });
  };

  // Per-item partial payment dialog handlers
  const handleOpenItemPartialDialog = (item) => {
    setPartialItemId(item.id);
    setItemPartialAmount('');
    setItemPartialError('');
    setItemPartialDialogOpen(true);
  };

  const handleItemPartialPaid = () => {
    const item = spendings.find((s) => s.id === partialItemId);
    if (!item) return;

    const alreadyPaid = item.amountPaid || 0;
    const left = item.amount - alreadyPaid;
    const partial = parseFloat(itemPartialAmount);

    if (isNaN(partial) || partial <= 0 || partial > left) {
      setItemPartialError(
        `Enter a valid amount (greater than 0 and less than or equal to ${left})`
      );
      return;
    }

    const newAmountPaid = alreadyPaid + partial;
    const updatedItem = {
      ...item,
      amountPaid: newAmountPaid,
      paid: newAmountPaid >= item.amount,
    };

    const updatedItems = spendings.map((s) =>
      s.id === item.id ? updatedItem : s
    );

    // Recalculate overall paid and status
    const newPaid = updatedItems
      .filter((s) => (s.amountPaid || 0) >= s.amount)
      .reduce((sum, s) => sum + s.amount, 0);
    const newTotal = updatedItems.reduce((sum, s) => sum + s.amount, 0);
    let newStatus = 'partial';
    if (newPaid === newTotal && newTotal > 0) newStatus = 'paid';

    saveData({
      ...data,
      items: updatedItems,
      total: newTotal,
      paid: newPaid,
      status: newStatus,
      updatedAt: new Date(),
    });

    setItemPartialDialogOpen(false);
    setPartialItemId(null);
    setItemPartialAmount('');
  };

  const handleOpenPartialDialog = () => {
    setPartialDialogOpen(true);
    setPartialAmount('');
    setPartialError('');
  };

  // Batch update for partial paid (applies partial across all items, not per item)
  const handlePartialPaid = () => {
    // Spread the amount across unpaid items
    const unpaidSpendings = spendings.filter((s) => !s.paid);
    const unpaidTotal = unpaidSpendings.reduce(
      (sum, s) => sum + (s.amount - (s.amountPaid || 0)),
      0
    );
    const partial = parseFloat(partialAmount);
    if (isNaN(partial) || partial <= 0 || partial > unpaidTotal) {
      setPartialError(
        'Enter a valid amount (greater than 0 and less than or equal to unpaid total)'
      );
      return;
    }

    let remaining = partial;
    const updatedItems = spendings.map((item) => {
      if (item.paid) return item;
      const alreadyPaid = item.amountPaid || 0;
      const left = item.amount - alreadyPaid;
      if (left <= 0) return { ...item, paid: true, amountPaid: item.amount };

      if (remaining >= left) {
        remaining -= left;
        return { ...item, paid: true, amountPaid: item.amount };
      } else if (remaining > 0) {
        // Partial payment for this item
        const newAmountPaid = alreadyPaid + remaining;
        remaining = 0;
        return { ...item, paid: false, amountPaid: newAmountPaid };
      }
      return item;
    });

    const newPaid = updatedItems
      .filter((s) => (s.amountPaid || 0) >= s.amount)
      .reduce((sum, s) => sum + s.amount, 0);
    const newTotal = updatedItems.reduce((sum, s) => sum + s.amount, 0);

    let newStatus = 'partial';
    if (newPaid === newTotal && newTotal > 0) newStatus = 'paid';

    saveData({
      ...data,
      items: updatedItems,
      total: newTotal,
      paid: newPaid,
      status: newStatus,
      updatedAt: new Date(),
    });

    setPartialDialogOpen(false);
  };

  const handleOpenNoteDialog = (item) => {
    setNoteEditId(item.id);
    setNoteText(item.note || '');
    setNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    updateData(noteEditId, { note: noteText });
    setNoteDialogOpen(false);
    setNoteEditId(null);
    setNoteText('');
  };

  // Helper to render action icons for an item
  function renderActions(s) {
    return (
      <>
        <Tooltip title={s.note ? 'Edit/View Note' : 'Add Note'}>
          <IconButton
            edge='end'
            color='info'
            onClick={() => handleOpenNoteDialog(s)}
            disabled={loading}
          >
            <NoteAddIcon />
          </IconButton>
        </Tooltip>
        {!s.paid && (
          <>
            <Tooltip title='Mark as Paid'>
              <IconButton
                edge='end'
                color='success'
                onClick={() => handleMarkPaid(s.id)}
                disabled={loading}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Partial Paid'>
              <IconButton
                edge='end'
                color='warning'
                onClick={() => handleOpenItemPartialDialog(s)}
                disabled={loading}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit'>
              <IconButton
                edge='end'
                color='primary'
                onClick={() => handleEdit(s)}
                disabled={loading}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
        <Tooltip title='Delete'>
          <IconButton
            edge='end'
            color='error'
            onClick={() => handleDelete(s.id)}
            disabled={loading}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  return (
    <Paper
      elevation={6}
      sx={{
        p: isMobile ? 2 : 4,
        mt: 4,
        borderRadius: 4,
        boxShadow: 8,
        maxWidth: 700,
        mx: 'auto',
        my: 4,
        background: theme.palette.background.paper,
        position: 'relative',
        border: `2.5px solid ${
          theme.palette.mode === 'dark' ? '#223366' : '#e0eafc'
        }`,
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255,255,255,0.5)',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error.message || 'An error occurred'}
        </Alert>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant='h6' fontWeight={700} sx={{ flexGrow: 1 }}>
          Monthly Spendings
        </Typography>
        <Chip
          label={
            monthPaidStatus === 'paid'
              ? 'Paid'
              : monthPaidStatus === 'partial'
              ? 'Partial Paid'
              : 'Unpaid'
          }
          color={
            monthPaidStatus === 'paid'
              ? 'success'
              : monthPaidStatus === 'partial'
              ? 'warning'
              : 'error'
          }
          sx={{ fontWeight: 700, fontSize: 16 }}
        />
      </Box>
      <Box
        component='form'
        onSubmit={handleAddSpending}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label='Spending Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth={isMobile}
          disabled={loading}
        />
        <TextField
          label='Amount'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          type='number'
          inputProps={{ min: 0, step: 0.01 }}
          fullWidth={isMobile}
          disabled={loading}
        />
        <Button
          type='submit'
          variant='contained'
          color='success'
          sx={{ minWidth: 100, fontWeight: 700, fontSize: 16 }}
          disabled={loading}
        >
          ADD
        </Button>
      </Box>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mb: 2 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleMarkMonthFullyPaid}
          disabled={spendings.length === 0 || paid === total || loading}
          sx={{ fontWeight: 700 }}
        >
          Mark Month as Fully Paid
        </Button>
        <Button
          variant='outlined'
          color='warning'
          onClick={handleOpenPartialDialog}
          disabled={spendings.length === 0 || paid === total || loading}
          sx={{ fontWeight: 700 }}
        >
          Mark as Partial Paid (All)
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <List>
        {spendings.map((s) => (
          <ListItem
            key={s.id}
            sx={{
              opacity: s.paid ? 0.5 : 1,
              borderRadius: 2,
              mb: 1,
              boxShadow: s.paid ? 0 : 1,
              background: s.paid
                ? theme.palette.background.default
                : theme.palette.background.paper,
              border: `2px solid ${
                theme.palette.mode === 'dark' ? '#223366' : '#e0eafc'
              }`,
            }}
          >
            {editId === s.id ? (
              <>
                <TextField
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size='small'
                  sx={{ mr: 1, width: 120 }}
                  disabled={loading}
                />
                <TextField
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  size='small'
                  type='number'
                  sx={{ mr: 1, width: 80 }}
                  disabled={loading}
                />
                <Button
                  onClick={() => handleEditSave(s.id)}
                  size='small'
                  color='success'
                  variant='contained'
                  sx={{ mr: 1 }}
                  disabled={loading}
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setEditId(null);
                    setEditName('');
                    setEditAmount('');
                  }}
                  size='small'
                  color='inherit'
                  variant='outlined'
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                      {s.paid ? (
                        <Chip label='Paid' color='success' size='small' />
                      ) : (s.amountPaid || 0) > 0 ? (
                        <Chip
                          label='Partial Paid'
                          color='warning'
                          size='small'
                        />
                      ) : (
                        <Chip label='Unpaid' color='default' size='small' />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <span style={{ fontWeight: 500 }}>
                        {s.amountPaid ? `$${s.amountPaid.toFixed(2)} / ` : ''}
                        {s.amount.toFixed(2)}
                      </span>
                      {s.note && (
                        <Tooltip title={s.note}>
                          <NotesIcon
                            fontSize='small'
                            sx={{ ml: 1, color: '#1976d2' }}
                          />
                        </Tooltip>
                      )}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  {renderActions(s)}
                </ListItemSecondaryAction>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          mt: 2,
          gap: isMobile ? 2 : 0,
        }}
      >
        <Chip
          label={`Total: $${total.toFixed(2)}`}
          color='primary'
          sx={{ fontWeight: 600, fontSize: 16, minWidth: 120 }}
        />
        <Chip
          label={`Paid: $${paid.toFixed(2)}`}
          color='success'
          sx={{ fontWeight: 600, fontSize: 16, minWidth: 120 }}
        />
        <Chip
          label={`Unpaid: $${unpaid.toFixed(2)}`}
          color='warning'
          sx={{ fontWeight: 600, fontSize: 16, minWidth: 120 }}
        />
      </Box>
      {/* Partial Paid Dialog for all items */}
      <Dialog
        open={partialDialogOpen}
        onClose={() => setPartialDialogOpen(false)}
      >
        <DialogTitle>Partial Paid Amount (All Items)</DialogTitle>
        <DialogContent>
          <TextField
            label='Partial Paid Amount'
            type='number'
            value={partialAmount}
            onChange={(e) => setPartialAmount(e.target.value)}
            fullWidth
            inputProps={{ min: 0, max: unpaid, step: 0.01 }}
            sx={{ mt: 1 }}
            disabled={loading}
          />
          {partialError && (
            <Typography color='error' variant='body2' sx={{ mt: 1 }}>
              {partialError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPartialDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePartialPaid}
            variant='contained'
            color='warning'
            disabled={loading}
          >
            Mark Partial Paid
          </Button>
        </DialogActions>
      </Dialog>
      {/* Partial Paid Dialog for single item */}
      <Dialog
        open={itemPartialDialogOpen}
        onClose={() => setItemPartialDialogOpen(false)}
      >
        <DialogTitle>Partial Paid Amount (Item)</DialogTitle>
        <DialogContent>
          <TextField
            label='Partial Paid Amount'
            type='number'
            value={itemPartialAmount}
            onChange={(e) => setItemPartialAmount(e.target.value)}
            fullWidth
            inputProps={{
              min: 0,
              max: spendings.find((s) => s.id === partialItemId)
                ? spendings.find((s) => s.id === partialItemId).amount -
                  (spendings.find((s) => s.id === partialItemId).amountPaid ||
                    0)
                : 0,
              step: 0.01,
            }}
            sx={{ mt: 1 }}
            disabled={loading}
          />
          {itemPartialError && (
            <Typography color='error' variant='body2' sx={{ mt: 1 }}>
              {itemPartialError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setItemPartialDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleItemPartialPaid}
            variant='contained'
            color='warning'
            disabled={loading}
          >
            Mark Partial Paid
          </Button>
        </DialogActions>
      </Dialog>
      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)}>
        <DialogTitle>
          {noteEditId && spendings.find((s) => s.id === noteEditId)?.name} -
          Note
        </DialogTitle>
        <DialogContent>
          <TextField
            label='Note'
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            sx={{ mt: 1 }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveNote}
            variant='contained'
            color='info'
            disabled={loading}
          >
            Save Note
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
