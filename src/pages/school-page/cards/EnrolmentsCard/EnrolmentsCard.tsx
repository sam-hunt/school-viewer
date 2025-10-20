import { Box, Card, Stack, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Bar } from '@nivo/bar';
import { Pie } from '@nivo/pie';
import { School } from '../../../../models/School';
import { useMemo, useState } from 'react';

interface EnrolmentsCardProps {
  school: School;
}

export const EnrolmentsCard = ({ school }: EnrolmentsCardProps) => {
  const [chartContainerEl, setChartContainerEl] = useState<HTMLDivElement>();

  const [width, height] = useMemo(() => {
    const parentWidth = chartContainerEl?.clientWidth ?? 0;
    const parentHeight = chartContainerEl?.clientHeight ?? 0;
    return [parentWidth, parentHeight];
  }, [chartContainerEl?.clientWidth, chartContainerEl?.clientHeight]);

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
    <Card sx={{ p: 2 }}>
      <Typography variant="h5" component="h2">
        {`Enrolments (${totalEnrolments.toString()})`}
      </Typography>
      <Box
        ref={(el: HTMLDivElement) => setChartContainerEl(el)}
        sx={{ minHeight: '450px', maxHeight: '600px' }}
        px={2}
        py={0}
        role="img"
        aria-label={`Enrollment by ethnicity for ${school.orgName}: ${enrolments
          .map(d => `${d.label} ${d.value.toString()} students`)
          .join(', ')}`}
      >
        {totalEnrolments > 0 ? (
          window.innerWidth > 640 ? (
            <Pie
              data-testid="pie-chart"
              width={width}
              height={height}
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
                const percentage = Math.round((d.value / school.total) * 100);
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
            <Bar
              data-testid="bar-chart"
              layout="horizontal"
              enableGridX={false}
              enableGridY={false}
              labelTextColor="#fff"
              enableLabel={true}
              width={chartContainerEl?.clientWidth ?? 0}
              height={chartContainerEl?.clientHeight ?? 0}
              data={enrolments}
              colors={{ datum: 'data.color' }}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            />
          )
        ) : (
          <Stack height={height} justifyContent="center" alignItems="center" pb={5}>
            <Typography fontSize="large">No Enrolment Data</Typography>
          </Stack>
        )}
      </Box>

      {totalEnrolments > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Enrollment Data Table
          </Typography>
          <Table
            size="small"
            aria-label="Enrollment by ethnicity data table"
            sx={{ maxWidth: 600 }}
          >
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="col">Ethnicity</TableCell>
                <TableCell component="th" scope="col" align="right">Students</TableCell>
                <TableCell component="th" scope="col" align="right">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrolments.map((row) => (
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
                      <span lang={row.label === 'Māori' ? 'mi' : undefined}>
                        {row.label}
                      </span>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell align="right">
                    {((row.value / totalEnrolments) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ fontWeight: 'bold' }}>
                <TableCell component="th" scope="row">Total</TableCell>
                <TableCell align="right">{totalEnrolments}</TableCell>
                <TableCell align="right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      )}
    </Card>
  );
};
