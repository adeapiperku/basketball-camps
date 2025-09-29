export const styles = (theme) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: 'white',
  py: 8,
  position: 'relative',
  zIndex: 1,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30px',
    background: theme.palette.grey[100],
    clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)'
  }
});

export const sectionStyles = (theme) => ({
  py: 2,
  minHeight: '60vh',
  backgroundColor: theme.palette.grey[100],
  width: '100%',
  '& > .MuiContainer': {
    maxWidth: '100%',
    backgroundColor: 'transparent',
    py: 4,
    px: { xs: 2, sm: 3, md: 4 },
    margin: 0,
    '&.MuiContainer-maxWidthLg': {
      maxWidth: '100%',
      paddingLeft: { xs: 2, sm: 3, md: 4 },
      paddingRight: { xs: 2, sm: 3, md: 4 },
    }
  }
});

export const titleStyles = {
  mb: 4,
  color: 'primary.main',
  fontWeight: 'bold',
  position: 'relative',
  display: 'block',
  textAlign: 'center',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '60px',
    height: '4px',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'primary.main',
    borderRadius: 2
  }
};

export const cardStyles = (theme) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: 2,
  borderColor: 'primary.main',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
});

export const cardContentStyles = {
  flexGrow: 1
};

export const cardTitleStyles = {
  color: 'primary.main',
  fontWeight: 'bold',
  mb: 1
};

export const cardActionsStyles = {
  mt: 'auto',
  p: 2
};

export const buttonStyles = {
  fontWeight: 'bold',
  textTransform: 'none',
  py: 1
};
