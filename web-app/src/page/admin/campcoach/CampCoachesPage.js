import * as React from "react";
import { useEffect, useState } from "react";
import { CampCoachService } from "../services/CampCoachService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";

const campCoachService = new CampCoachService();

export default function CampCoachesPage({ campId }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const data = await campCoachService.getCoachesForCamp(campId);
        setCoaches(data);
      } catch (err) {
        setError("Failed to fetch coaches");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [campId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Coaches for Camp {campId}
      </Typography>
      {coaches.length === 0 ? (
        <Typography>No coaches assigned yet.</Typography>
      ) : (
        <List>
          {coaches.map((coach, index) => (
            <ListItem key={index}>
              <ListItemText primary={coach} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
