import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  createSharedLink,
  getUserSharedLinks,
  deleteSharedLink,
} from '../utils/firebase';
import { auth } from '../utils/firebase';

export default function ShareDialog({ open, onClose, year, month, data }) {
  const [loading, setLoading] = useState(false);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [creating, setCreating] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && auth.currentUser) {
      loadSharedLinks();
    }
  }, [open]);

  const loadSharedLinks = async () => {
    try {
      setLoading(true);
      const links = await getUserSharedLinks(auth.currentUser.uid);
      setSharedLinks(links.filter((link) => !link.deleted));
    } catch (err) {
      setError('Failed to load shared links');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShare = async () => {
    if (!auth.currentUser || !data) return;

    try {
      setCreating(true);
      setError('');
      const shareId = await createSharedLink(
        auth.currentUser.uid,
        year,
        month,
        data
      );
      const shareUrl = `${window.location.origin}/shared/${shareId}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess('Share link created and copied to clipboard!');

      // Reload shared links
      await loadSharedLinks();

      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      setError('Failed to create share link');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = async (shareId) => {
    const shareUrl = `${window.location.origin}/shared/${shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess('Link copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch {
      setError('Failed to copy link');
    }
  };

  const handleDeleteLink = async (shareId) => {
    try {
      await deleteSharedLink(shareId);
      await loadSharedLinks();
    } catch (err) {
      setError('Failed to delete share link');
      console.error(err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getMonthName = (month) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month - 1] || '';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShareIcon />
          Share Dashboard
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {copySuccess && (
          <Alert severity='success' sx={{ mb: 2 }}>
            {copySuccess}
          </Alert>
        )}

        <Typography variant='h6' gutterBottom>
          Share Current Dashboard
        </Typography>
        <Typography color='text.secondary' sx={{ mb: 2 }}>
          Share your {getMonthName(month)} {year} spending dashboard with
          others. They will be able to view your spending data in read-only
          mode.
        </Typography>

        <Button
          variant='contained'
          onClick={handleCreateShare}
          disabled={creating || !data}
          startIcon={creating ? <CircularProgress size={20} /> : <ShareIcon />}
          sx={{ mb: 3 }}
        >
          {creating ? 'Creating...' : 'Create Share Link'}
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant='h6' gutterBottom>
          Your Shared Links
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : sharedLinks.length === 0 ? (
          <Typography color='text.secondary' align='center' sx={{ py: 2 }}>
            No shared links yet. Create one above to get started.
          </Typography>
        ) : (
          <List>
            {sharedLinks.map((link) => (
              <ListItem
                key={link.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant='subtitle1'>
                        {getMonthName(link.month)} {link.year}
                      </Typography>
                      {(() => {
                        const items = link.data?.items || [];
                        const hasPartialPaid = items.some(
                          (item) => item.amountPaid > 0 && !item.paid
                        );
                        if (hasPartialPaid) {
                          return (
                            <Chip
                              label='Partial Paid'
                              color='warning'
                              size='small'
                            />
                          );
                        } else if (link.data?.status === 'paid') {
                          return (
                            <Chip label='Paid' color='success' size='small' />
                          );
                        } else {
                          return (
                            <Chip label='Unpaid' color='default' size='small' />
                          );
                        }
                      })()}
                    </Box>
                  }
                  secondary={
                    <Typography variant='body2' color='text.secondary'>
                      Created: {formatDate(link.createdAt)}
                      {link.expiresAt &&
                        ` • Expires: ${formatDate(link.expiresAt)}`}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title='Copy link'>
                    <IconButton
                      edge='end'
                      onClick={() => handleCopyLink(link.id)}
                      sx={{ mr: 1 }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete link'>
                    <IconButton
                      edge='end'
                      onClick={() => handleDeleteLink(link.id)}
                      color='error'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
