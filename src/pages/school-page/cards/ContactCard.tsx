import { Card, Divider, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { School } from '../../../models/school.interface';

interface ContactCardProps {
  school: School;
}

export const ContactCard = ({ school }: ContactCardProps) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="h5" component="h2" mb={2}>
      Contact
    </Typography>
    <Divider sx={{ mt: 1 }} />
    <TableContainer>
      <Table aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Name
            </TableCell>
            <TableCell size="small">{school?.contact1Name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Phone
            </TableCell>
            <TableCell size="small">
              <a href={'tel:' + school?.telephone.replace(/[.,\s\-_()]/g, '')}>{school?.telephone}</a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Email
            </TableCell>
            <TableCell size="small">
              <a href={'mailto:' + school?.email}>{school?.email}</a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Web
            </TableCell>
            <TableCell size="small">
              <a href={school?.url}>{school?.url}</a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
);
