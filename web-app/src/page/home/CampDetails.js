import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Button, Divider, Chip, Grid, CircularProgress, Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LocationOn, CalendarToday, ArrowBack, CheckCircle, Schedule, Info, SportsBasketball, BeachAccess, Hotel, Restaurant, DirectionsBus, EmojiEvents, LocalHospital, Group, ExpandMore, ExpandLess } from '@mui/icons-material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCamp } from '../../hooks/useCamps';

const ExpandableSection = ({ title, icon: Icon, children }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <Box sx={{ mb: 3 }}>
      <Box onClick={() => setExpanded(!expanded)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
        <Icon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="h3" color="primary">{title}</Typography>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={expanded}><Box sx={{ pl: 3, mt: 1 }}>{children}</Box></Collapse>
    </Box>
  );
};

const ScheduleItem = ({ time, activity, icon: Icon }) => (
  <Box sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
    <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 1, minWidth: 80, textAlign: 'center', mr: 2 }}>
      {time}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      {Icon && <Icon color="action" sx={{ mr: 1 }} />}
      <Typography>{activity}</Typography>
    </Box>
  </Box>
);

export default function CampDetails() {
  const { campId } = useParams();
  const navigate = useNavigate();
  const { camp, loading, error } = useCamp(campId);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">Error loading camp details: {error.message}</Typography>
      </Container>
    );
  }

  if (!camp) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography>Camp not found</Typography>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">{camp.name}</Typography>
            <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
              <Chip icon={<LocationOn />} label={camp.location} variant="outlined" color="primary" />
              <Chip icon={<CalendarToday />} label={`${formatDate(camp.startDate)} - ${formatDate(camp.endDate)}`} variant="outlined" />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box mb={4}>
                  <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">About This Camp</Typography>

                  <Box mb={4}>
                    <ExpandableSection title="Camp Overview" icon={Info}>
                      <Typography variant="body1" paragraph>
                        All interested participants can contact the coaches during the training sessions for details regarding participation, payment and other information.
                      </Typography>
                      <Typography variant="body1" paragraph>
                        The main goals of the camp are to encourage independence from family, socialization, adaptation to household and camp routines, and to promote responsibility and teamwork.
                      </Typography>
                    </ExpandableSection>

                    <ExpandableSection title="What's Included" icon={CheckCircle}>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {[
                          { icon: <Hotel />, text: 'Accommodation at the hotel' },
                          { icon: <SportsBasketball />, text: 'Camp uniforms' },
                          { icon: <Group />, text: '1 instructor per 15 children' },
                          { icon: <SportsBasketball />, text: 'Complete basketball training program' },
                          { icon: <EmojiEvents />, text: 'Competitions and friendly matches' },
                          { icon: <BeachAccess />, text: 'Swimming with certified instructor' },
                          { icon: <LocalHospital />, text: 'Medical supervision' },
                          { icon: <DirectionsBus />, text: 'Sightseeing day in the city' },
                          { icon: <EmojiEvents />, text: 'Diplomas and awards' },
                          { icon: <DirectionsBus />, text: 'Comfortable transportation' },
                        ].map((item, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ mr: 1 }}>{item.icon}</Box>
                              <Typography variant="body2">{item.text}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </ExpandableSection>

                    <ExpandableSection title="Daily Schedule" icon={Schedule}>
                      <Box sx={{ mt: 2, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                        <ScheduleItem time="07:00" activity="Wake-up" />
                        <ScheduleItem time="07:30" activity="Breakfast" icon={Restaurant} />
                        <ScheduleItem time="08:00-10:00" activity="Basketball Training" icon={SportsBasketball} />
                        <ScheduleItem time="10:30-12:30" activity="Beach Activities" icon={BeachAccess} />
                        <ScheduleItem time="13:30" activity="Lunch" icon={Restaurant} />
                        <ScheduleItem time="14:00-16:00" activity="Rest Time" />
                        <ScheduleItem time="16:00-17:30" activity="Beach Activities" icon={BeachAccess} />
                        <ScheduleItem time="18:00-20:00" activity="Training & Matches" icon={SportsBasketball} />
                        <ScheduleItem time="20:30" activity="Dinner" icon={Restaurant} />
                        <ScheduleItem time="21:00-22:30" activity="Cultural Activities" />
                        <ScheduleItem time="23:00" activity="Bedtime" />
                      </Box>
                    </ExpandableSection>

                    <ExpandableSection title="Required Documents" icon={Info}>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Valid personal passport" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Signed parental authorization form" secondary="(instructions provided by the coaches)" />
                        </ListItem>
                      </List>
                    </ExpandableSection>
                  </Box>
                </Box>

                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SportsBasketball /> Camp Activities
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {['Training', '1x1 & 3x3', 'Matches', 'Swimming', 'Volleyball', 'Games', 'Contests', 'Skills'].map((activity) => (
                      <Chip 
                        key={activity} 
                        label={activity} 
                        size="medium"
                        variant="outlined"
                        color="primary"
                        sx={{ 
                          fontWeight: 500,
                          '& .MuiChip-label': {
                            px: 1.5,
                            py: 0.5
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
