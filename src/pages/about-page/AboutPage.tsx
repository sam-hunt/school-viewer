import { Container, Typography } from "@mui/material";

export const AboutPage = () => (
  <Container component="section">
    <Typography variant="h4" component="h1" my={3}>About</Typography>
    <Typography sx={{ my: 1 }}>
      A small visualiser for the <a href="https://www.educationcounts.govt.nz/directories/api-new-zealand-schools">Schooling Directory API</a> provided by the New Zealand Government.
    </Typography>
    <Typography>
      Built with <a href="https://reactjs.org/">React</a>, <a href="https://www.typescriptlang.org/">Typescript</a>, <a href="https://mui.com/">MUI</a>, <a href="https://www.mapbox.com/mapbox-gljs">Mapbox GLJS</a>, and <a href="https://nivo.rocks/">Nivo</a>.
    </Typography>
  </Container>
);