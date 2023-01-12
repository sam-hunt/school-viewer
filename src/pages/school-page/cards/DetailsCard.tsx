import { Card, Divider, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { ISchool } from 'models/school.interface';

interface DetailsCardProps {
  school: ISchool;
}

export const DetailsCard = ({ school }: DetailsCardProps) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="h5" component="h2" mb={2}>Details</Typography>
    <Divider sx={{ mt: 1 }} />
    <TableContainer>
      <Table aria-label="simple table" sx={{ border: 0 }}>
        <TableBody>
          <TableRow>
            <TableCell size="small" component="th" scope="row">Organisation Type</TableCell>
            <TableCell size="small">{school?.orgType}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">Address 1</TableCell>
            <TableCell size="small">
              <Typography>{school?.add1Line1}</Typography>
              {!!school?.add1Suburb && <Typography>{school?.add1Suburb}</Typography>}
              <Typography>{school?.add1City}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">Address 2</TableCell>
            <TableCell size="small">
              <Typography>{school?.add2Line1}<br /></Typography>
              <Typography>{school?.add2Suburb}{school?.add2Suburb && <br />}</Typography>
              <Typography>{school?.add2City}<br /></Typography>
              <Typography>{school?.add2PostalCode}</Typography>
            </TableCell>
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell size="small" component="th" scope="row">Geolocation</TableCell>
            <TableCell size="small">{school?.latitude}, {school?.longitude}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
);