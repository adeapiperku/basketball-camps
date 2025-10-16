import { Box, Container, Typography } from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const contentSections = [
  {
    type: 'text',
    content: "Our basketball camps provide an exciting opportunity for young athletes to develop their skills, make new friends, and experience the joy of the game. Each camp is carefully designed to offer a balanced mix of training, competition, and fun activities that help participants grow both on and off the court."
  },
  {
    type: 'image-group',
    images: [
      {
        src: "/images/participants5.png",
        alt: "Team huddle"
      },
      {
        src: "/images/coaches.png",
        alt: "Our experienced coaching staff working with camp participants"
      },
      {
        src: "/images/participants1.png",
        alt: "Camp participants in action"
      },
    ],
  },
  {
    type: 'text',
    content: "At our Summer Basketball Camp, we focused on fundamental skills development, teamwork, and sportsmanship. Participants engaged in various drills and scrimmages that helped them improve their game while having fun in a supportive environment."
  },
  {
    type: 'image-group',
    images: [
      {
        src: "/images/participants2.png",
        alt: "Team building activities"
      },
      {
        src: "/images/rewards.png",
        alt: "Awards ceremony"
      },
      {
        src: "/images/participants3.png",
        alt: "Group photo of happy campers"
      },
      {
        src: "/images/participants4.png",
        alt: "Training drills"
      },
      {
        src: "/images/training1.png",
        alt: "Campers practicing shooting techniques"
      },
      {
        src: "/images/training2.png",
        alt: "Group training session"
      }
    ],
  },
  {
    type: 'text',
    content: "The Basketball Camp  was all about taking skills to the next level. With specialized training sessions and competitive games, our campers showed tremendous improvement throughout the week."
  },
  {
    type: 'image-group',
    images: [
      {
        src: "/images/participants6.png",
        alt: "Game day action"
      },
      {
        src: "/images/training3.png",
        alt: "Skills workshop"
      },
      {
        src: "/images/participants1.png",
        alt: "Team celebrations"
      }
    ],
  },
  {
    type: 'text',
    content: "Looking ahead to other camps , we're excited to introduce new training modules and guest coaches who will bring fresh perspectives to our program. Join us for an unforgettable basketball experience!"
  }
];

const imageGridStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
  gap: 2,
  '& img': { width: '100%', height: 200, objectFit: 'cover', borderRadius: 2, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)' } },
  '@media (max-width: 600px)': { gridTemplateColumns: 'repeat(2, 1fr)', '& img': { height: 150 } },
  '@media (max-width: 400px)': { gridTemplateColumns: '1fr', '& img': { height: 200, maxWidth: '100%' } }
};

const ImageBox = ({ src, alt }) => (
  <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, boxShadow: 2, '&:hover img': { transform: 'scale(1.05)' } }}>
    <img src={src} alt={alt} loading="lazy" />
  </Box>
);

export default function CampsInformation() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {contentSections.map((section, index) => {
            if (section.type === 'text') return (
              <Typography key={index} variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', textAlign: 'justify', '&:first-letter': { fontSize: '1.5em', fontWeight: 'bold', color: 'primary.main', lineHeight: 1, float: 'left', mr: 1, mt: 0.5 } }}>
                {section.content}
              </Typography>
            );

            if (section.type === 'image' || section.type === 'image-group') {
              const images = section.type === 'image' ? [section] : section.images;
              return (
                <Box key={index} sx={{ my: 4 }}>
                  <Box sx={imageGridStyles}>
                    {images.map((img, i) => <ImageBox key={i} src={img.src} alt={img.alt} />)}
                  </Box>
                </Box>
              );
            }

            return null;
          })}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
