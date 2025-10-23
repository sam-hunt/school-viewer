import { Box, Button, Card, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import { School } from '../../../../models/School';
import { useState } from 'react';
import TableChartIcon from '@mui/icons-material/TableChart';

interface EnrolmentsCardProps {
  school: School;
}

export const EnrolmentsCard = ({ school }: EnrolmentsCardProps) => {
  // Detect if user prefers reduced motion (common for screen reader users and accessibility needs)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [showTable, setShowTable] = useState(prefersReducedMotion);

  const enrolments = [
    { color: '#b2cefe', label: 'Māori', value: school.maori, id: 'Māori' },
    { color: '#fea3aa', label: 'Pacific', value: school.pacific, id: 'Pacific' },
    { color: '#cb9eff', label: 'European', value: school.european, id: 'European' },
    { color: '#baed91', label: 'Asian', value: school.asian, id: 'Asian' },
    { color: '#f8b88b', label: 'MELAA', value: school.melaa, id: 'MELAA' },
    { color: '#faf884', label: 'International', value: school.international, id: 'International' },
    { color: '#f2a2e8', label: 'Other', value: school.other, id: 'Other' },
  ].filter(d => d.value > 0);

  const totalEnrolments = school.total;

  return (
    <Card>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Enrolments ({totalEnrolments})
        </Typography>
        {totalEnrolments > 0 && (
          <Button
            onClick={() => setShowTable(!showTable)}
            startIcon={<TableChartIcon />}
            variant="outlined"
            size="small"
            aria-expanded={showTable}
            aria-controls="enrolment-data-display"
          >
            {showTable ? 'Show Chart' : 'Show Data Table'}
          </Button>
        )}
      </Box>

      {showTable ? (
        <Box sx={{ p: 2 }} id="enrolment-data-display">
          <Typography variant="h6" component="h3" gutterBottom>
            Enrolment Data Table
          </Typography>
          <Table size="small" aria-label="Enrolment by ethnicity data table">
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="col">
                  Ethnicity
                </TableCell>
                <TableCell component="th" scope="col" align="right">
                  Students
                </TableCell>
                <TableCell component="th" scope="col" align="right">
                  Percentage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...enrolments]
                .sort((a, b) => b.value - a.value)
                .map(row => (
                  <TableRow key={row.label}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: row.color,
                            borderRadius: '2px',
                          }}
                          aria-hidden="true"
                        />
                        <span lang={row.label === 'Māori' ? 'mi' : undefined}>{row.label}</span>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{((row.value / totalEnrolments) * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              <TableRow sx={{ fontWeight: 'bold' }}>
                <TableCell component="th" scope="row">
                  Total
                </TableCell>
                <TableCell align="right">{totalEnrolments}</TableCell>
                <TableCell align="right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box
          sx={{ height: '500px', width: '100%' }}
          role="img"
          aria-label={`Enrolment by ethnicity for ${school.orgName}: ${enrolments
            .map(d => `${d.label} ${d.value.toString()} students`)
            .join(', ')}`}
          id="enrolment-data-display"
        >
          {totalEnrolments > 0 ? (
            <ResponsivePie
              data-testid="pie-chart"
              isInteractive={false}
              margin={{ top: 80, right: 120, bottom: 80, left: 120 }}
              data={enrolments}
              colors={{ datum: 'data.color' }}
              startAngle={-90} // Prevent smaller arcs from clustering at the top and getting overlapping labels
              innerRadius={0.6}
              padAngle={0.5}
              cornerRadius={5}
              enableArcLabels={true} // These are labels on the arc
              enableArcLinkLabels={true} // These are labels off to the side
              arcLabel={d => {
                const percentage = Math.round((d.value / totalEnrolments) * 100);
                return percentage > 2 ? `${percentage.toString()}%` : '';
              }}
              arcLinkLabel={d => `${d.id.toString()}: ${d.value.toString()}`}
              arcLinkLabelsColor={{
                from: 'color',
              }}
              arcLinkLabelsThickness={3}
              arcLinkLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 1.2]],
              }}
            />
          ) : (
            <Stack height="100%" justifyContent="center" alignItems="center" pb={5}>
              <Typography fontSize="large">No Enrolment Data</Typography>
            </Stack>
          )}
        </Box>
      )}
    </Card>
  );
};
