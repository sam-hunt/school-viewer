import { Box, Card, Typography } from '@mui/material';
import { Bar } from '@nivo/bar';
import { Pie } from '@nivo/pie';
import { useWindowSize } from 'hooks/use-window-size';
import { ISchool } from 'models/school.interface';
import { useMemo, useState } from 'react';

interface EnrolmentsCardProps {
  school: ISchool;
}

export const EnrolmentsCard = ({ school }: EnrolmentsCardProps) => {

  const [chartContainerEl, setChartContainerEl] = useState<HTMLDivElement>();
  const size = useWindowSize();

  const [width, height] = useMemo(() => {
    if (!size) return [0, 0];
    const parentWidth = chartContainerEl?.clientWidth || 0;
    const parentHeight = chartContainerEl?.clientHeight || 0;
    return [parentWidth, parentHeight];
  }, [chartContainerEl?.clientWidth, chartContainerEl?.clientHeight, size]);

  const enrolments = [
    { color: '#b2cefe', label: 'Māori', value: school?.maori || 0, id: 'Māori' },
    { color: '#fea3aa', label: 'Pacific', value: school?.pacific || 0, id: 'Pacific' },
    { color: '#cb9eff', label: 'European', value: school?.european || 0, id: 'European' },
    { color: '#baed91', label: 'Asian', value: school?.asian || 0, id: 'Asian' },
    { color: '#f8b88b', label: 'MELAA', value: school?.melaa || 0, id: 'MELAA' },
    { color: '#faf884', label: 'International', value: school?.international || 0, id: 'International' },
    { color: '#f2a2e8', label: 'Other', value: school?.other || 0, id: 'Other' },
  ].filter(d => d.value > 0);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5" component="h2">Enrolments ({school?.total})</Typography>
      <Box ref={(el: any) => setChartContainerEl(el)} px={2} py={0} sx={{ minHeight: '450px', maxHeight: '600px' }}>
        {window.innerWidth > 640 ?
          <Pie
            width={width}
            height={height}
            isInteractive={false}
            margin={{ top: 80, right: 120, bottom: 80, left: 120 }}
            data={enrolments}
            colors={{ datum: 'data.color' }}
            startAngle={-90}  // Prevent smaller arcs from clustering at the top and getting overlapping labels
            innerRadius={0.6}
            padAngle={0.5}
            cornerRadius={5}
            enableArcLabels={true} // These are labels on the arc
            enableArcLinkLabels={true} // These are labels off to the side
            arcLabel={(d) => {
              const percentage = Math.round(d.value / school?.total * 100);
              return percentage > 2 ? `${percentage}%` : '';
            }}
            arcLinkLabel={(d) => `${d.id}: ${d.value}`}
            arcLinkLabelsColor={{
              from: 'color',
            }}
            arcLinkLabelsThickness={3}
            arcLinkLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 1.2]],
            }}
          /> :
          <Bar
            layout='horizontal'
            enableGridX={false}
            enableGridY={false}
            labelTextColor='#fff'
            enableLabel={true}
            width={chartContainerEl?.clientWidth || 0}
            height={chartContainerEl?.clientHeight || 0}
            data={enrolments}
            colors={{ datum: 'data.color' }}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          />
        }
      </Box>
    </Card>
  );
}