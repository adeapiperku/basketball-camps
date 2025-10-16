import { useState, useEffect } from "react";
import { Container, Typography, TextField, MenuItem, Box, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useCamps from "../../hooks/useCamps";
import { RegistrationService } from "../../service/RegistrationService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
        const registrations = await new RegistrationService().findByCamp(selectedCamp);

        const formattedData = registrations.map((reg) => ({
          id: reg.id,
          participantName: `${reg.participant?.firstName || ""} ${
            reg.participant?.lastName || ""
          }`.trim(),
          schoolName: reg.school?.name || "N/A",
          jerseySize: reg.jerseySize || "N/A",
          status: reg.status,
          registeredAt: reg.registeredAt,
          confirmedAt: reg.confirmedAt || null,
          cancelledAt: reg.cancelledAt || null,
          amountPaid: reg.price || 0,
          specialRequests: reg.specialRequests || "None",
        }));
        setParticipants(formattedData);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setErrorParticipants(
          err.response?.data?.message || "Failed to load participants"
        );
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchParticipants();
  }, [selectedCamp]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  const columns = [
    {
      field: "participantName",
      headerName: "Participant",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "schoolName",
      headerName: "School",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "jerseySize",
      headerName: "Jersey Size",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <span
          style={{
            color:
              params.value === "CONFIRMED"
                ? "green"
                : params.value === "PENDING"
                ? "orange"
                : "red",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "registeredAt",
      headerName: "Registered At",
      width: 180,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "confirmedAt",
      headerName: "Confirmed At",
      width: 180,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "amountPaid",
      headerName: "Amount Paid",
      width: 130,
      valueFormatter: (params) => {
        const value = parseFloat(params.value);
        return isNaN(value) ? "$0.00" : `$${value.toFixed(2)}`;
      },
    },
    {
      field: "specialRequests",
      headerName: "Special Requests",
      flex: 1,
      minWidth: 200,
    },
  ];

  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Registered Participants
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

        <Box sx={{ height: 600, width: "100%", mt: 3 }}>
          <DataGrid
            rows={participants}
            columns={columns}
            loading={loadingParticipants}
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row.id}
            autoHeight
            disableRowSelectionOnClick
          />
          {errorParticipants && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorParticipants}
            </Typography>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
}
