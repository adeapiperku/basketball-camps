import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import useCamps from "../../../hooks/useCamps";
import useCoaches from "../../../hooks/useCoaches";
import { CampCoachService } from "../../../service/CampCoachService";

const CampCoachCreate = () => {
  const { camps, loading: loadingCamps, error: errorCamps } = useCamps();
  const { coaches, loading: loadingCoaches, error: errorCoaches } = useCoaches();

  const [formData, setFormData] = useState({
    campId: "",
    coachIds: [], // <-- change to array for multiple selection
  });

  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If multiple select, value is an array of selected options
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);

    try {
      const service = new CampCoachService();
      await service.assignCoachesToCamp({
        campId: formData.campId,
        coachIds: formData.coachIds, // send array directly
      });
      setSuccess(true);
      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate('/camps');
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || "Failed to assign coaches");
    }
  };

  return (
    <Box maxWidth="500px" mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>
        Assign Coaches to Camp
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {loadingCamps || loadingCoaches ? (
            <CircularProgress />
          ) : (
            <>
              {errorCamps && <Alert severity="error">{errorCamps.message}</Alert>}
              {errorCoaches && <Alert severity="error">{errorCoaches.message}</Alert>}

              {!errorCamps && !errorCoaches && (
                <>
                  {/* Camps Dropdown */}
                  <TextField
                    select
                    name="campId"
                    label="Select Camp"
                    value={formData.campId}
                    onChange={handleChange}
                    fullWidth
                    required
                  >
                    {camps.map((camp) => (
                      <MenuItem key={camp.id} value={camp.id}>
                        {camp.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Multi-Select Coaches Dropdown */}
                  <TextField
                    select
                    name="coachIds"
                    label="Select Coaches"
                    value={formData.coachIds}
                    onChange={handleChange}
                    fullWidth
                    required
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) =>
                        coaches
                          .filter((c) => selected.includes(c.id))
                          .map((c) => c.firstName + " " + c.lastName)
                          .join(", "),
                    }}
                  >
                    {coaches.map((coach) => (
                      <MenuItem key={coach.id} value={coach.id}>
                        {coach.firstName} {coach.lastName}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            </>
          )}

          {submitError && <Alert severity="error">{submitError}</Alert>}
          {success && <Alert severity="success">Coaches assigned successfully!</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loadingCamps || loadingCoaches}
          >
            Assign
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CampCoachCreate;
