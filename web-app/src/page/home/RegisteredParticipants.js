import { useState, useEffect } from 'react';
import { Container, Typography, TextField, MenuItem, Box, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import useCamps from '../../hooks/useCamps';
import { RegistrationService } from '../../service/RegistrationService';

export default function RegisteredParticipants() {
  const { camps, loading: loadingCamps, error: campsError } = useCamps();
  const [selectedCamp, setSelectedCamp] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [errorParticipants, setErrorParticipants] = useState(null);

  useEffect(() => {
    if (!selectedCamp) return;

    const fetchParticipants = async () => {
      setLoadingParticipants(true);
      setErrorParticipants(null);
      try {
        const data = await new RegistrationService().findByCamp(selectedCamp);
        setParticipants(data);
      } catch (err) {
        setErrorParticipants(err);
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchParticipants();
  }, [selectedCamp]);

  const columns = [
    { field: 'participantName', headerName: 'Participant', width: 200 },
    { field: 'schoolName', headerName: 'School', width: 200 },
    { field: 'jerseySize', headerName: 'Jersey Size', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'registeredAt', headerName: 'Registered At', width: 160 },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Coach Dashboard
      </Typography>

      {loadingCamps ? (
        <CircularProgress />
      ) : campsError ? (
        <Typography color="error">{campsError.message}</Typography>
      ) : (
        <TextField
          select
          label="Select Camp"
          value={selectedCamp}
          onChange={(e) => setSelectedCamp(e.target.value)}
          fullWidth
          margin="normal"
        >
          {camps.map((camp) => (
            <MenuItem key={camp.id} value={camp.id}>
              {camp.name}
            </MenuItem>
          ))}
        </TextField>
      )}

      <Box sx={{ height: 400, mt: 3 }}>
        <DataGrid
          rows={participants}
          columns={columns}
          loading={loadingParticipants}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25]}
        />
        {errorParticipants && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorParticipants.message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
