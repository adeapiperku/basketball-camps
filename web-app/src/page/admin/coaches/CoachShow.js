import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { useDialogs } from '../../../hooks/useDialogs/useDialogs';
import useNotifications from '../../../hooks/useNotifications/useNotifications';
import PageContainer from '../../../components/PageContainer';
import { CoachService } from '../../../service/CoachService';

export default function CoachShow() {
  const { coachId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [coach, setCoach] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const service = new CoachService();
      const showData = await service.findById(Number(coachId));

      setCoach(showData);
    } catch (showDataError) {
      setError(showDataError);
    }
    setIsLoading(false);
  }, [coachId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = React.useCallback(() => {
    navigate(`/coaches/${coachId}/edit`);
  }, [navigate, coachId]);

  const handleDelete = React.useCallback(async () => {
    if (!coach) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `Do you want to delete ${coach.firstName} ${coach.lastName}?`,
      {
        title: `Delete coach?`,
        severity: 'error',
        okText: 'Delete',
        cancelText: 'Cancel',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        const service = new CoachService();
        await service.delete(Number(coachId));

        navigate('/coaches');

        notifications.show('Coach deleted successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `Failed to delete coach. Reason:' ${deleteError.message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [coach, dialogs, coachId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/coaches');
  }, [navigate]);

  const renderShow = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return coach ? (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">First name</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {coach.firstName}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Last name</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {coach.lastName}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Email</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {coach.email}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Phone</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {coach.phoneNumber}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Birth date</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {coach.birthDate}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Type</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {coach.type}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Box>
    ) : null;
  }, [isLoading, error, coach, handleBack, handleEdit, handleDelete]);

  const pageTitle = `Coach ${coachId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Coaches', path: '/coaches' },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  );
}
