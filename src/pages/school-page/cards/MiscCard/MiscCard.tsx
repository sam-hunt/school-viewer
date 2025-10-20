import { Card, Divider, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { School } from '../../../../models/School';

interface MiscCardProps {
  school: School;
}

export const MiscCard = ({ school }: MiscCardProps) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="h5" component="h2" mb={2}>
      Miscellaneous
    </Typography>
    <Divider sx={{ mt: 1 }} />
    <TableContainer>
      <Table aria-label="Additional school information">
        <TableBody>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Definition
            </TableCell>
            <TableCell size="small">{school.definition}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Roll Date
            </TableCell>
            <TableCell size="small">{school.rollDate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Equity Index
            </TableCell>
            <TableCell size="small">{school.eqiIndex}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Isolation Index
            </TableCell>
            <TableCell size="small">{school.isolationIndex}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              CoEducation Status
            </TableCell>
            <TableCell size="small">{school.coEdStatus}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Education Region
            </TableCell>
            <TableCell size="small">{school.educationRegion}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              General Electorate
            </TableCell>
            <TableCell size="small">{school.generalElectorate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              Māori Electorate
            </TableCell>
            <TableCell size="small">{school.maoriElectorate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell size="small" component="th" scope="row">
              School Donations
            </TableCell>
            <TableCell size="small">{school.schoolDonations}</TableCell>
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell size="small" component="th" scope="row">
              Authority
            </TableCell>
            <TableCell size="small">{school.authority}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
);
