import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

export default function CoachesModal({ open, onClose, coaches = [] }) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="coaches-modal-title">
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "85%", sm: 350 },
          minWidth: 300,
          maxHeight: "75vh",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 30,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          outline: "none",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography
            variant="h6"
            id="coaches-modal-title"
            sx={{ fontWeight: 600 }}
          >
            Coaches
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: "inherit" }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
          {coaches.length > 0 ? (
            <List sx={{ listStyleType: "disc", pl: 4 }}>
              {coaches.map((coach, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "list-item",
                    px: 0,
                    py: 0.5,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {coach}
                      </Typography>
                    }
                  />
                  <Divider />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                color: "text.secondary",
              }}
            >
              <PersonIcon sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Coaches Assigned
              </Typography>
              <Typography variant="body2" textAlign="center">
                There are no coaches assigned to this camp yet.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Modal>
  );
}
