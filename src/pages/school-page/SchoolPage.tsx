import LoadingSpinner from 'components/loading-spinner/LoadingSpinner';
import { FeatureCollection } from 'geojson';
import { useSchool } from 'hooks/use-school';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MapboxGLPointMap from './MapboxglPointMap';
import { Pie } from '@nivo/pie';
import './SchoolPage.css';

function SchoolPage() {

  const { schoolId } = useParams() as { schoolId: string };
  const [school, schoolError, schoolPending] = useSchool(schoolId);

  let features: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  if (!schoolPending && !schoolError && school) {
    features.features = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [+school?.longitude, +school?.latitude],
      },
      properties: school,
    } as any;
  }
  const randColor = () => `hsl(${Math.round(Math.random() * 360)}, 70%, 50%)`;
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
    <section id="school-section">
      <div className="breadcrumb"><Link to='/schools'>schools</Link> / {schoolId}</div>
      <h1>{school?.orgName || 'Loading...'}</h1>
      <div className="school">
        {schoolPending && <LoadingSpinner />}
        {/* {!schoolPending && !schoolError && <pre>{JSON.stringify(school, null, 4)}</pre>} */}
        {!schoolPending && !schoolError && <div>
          <div id="school-details" className="panel bordered">
            <h2>Details</h2>
            <table>
              <tr><td>Organisation Name</td><td>{school?.orgName}</td></tr>
              <tr><td>Organisation Type</td><td>{school?.orgType}</td></tr>
            </table>
          </div>
          <div id="school-location" className="panel bordered">
            <h2>Location</h2>
            <table className="details">
              <tr>
                <td>Address 1</td>
                <td>
                  {school?.add1Line1}<br />
                  {school?.add1Suburb}{school?.add1Suburb && <br />}
                  {school?.add1City}<br />
                </td>
              </tr>
              <hr></hr>
              <tr>
              <td>Address 2</td>
                <td>
                  {school?.add2Line1}<br />
                  {school?.add2Suburb}{school?.add2Suburb && <br />}
                  {school?.add2City}<br />
                  {school?.add2PostalCode}<br />
                </td>
              </tr>
              <hr></hr>
              <tr><td>Latitude</td><td>{school?.latitude}</td></tr>
              <tr><td>Longitude</td><td>{school?.longitude}</td></tr>
            </table>
            <span className="map">
            <MapboxGLPointMap
              height={'100%'} width={'100%'}
              lat={school!.latitude} lng={school!.longitude} zoom={6}>
            </MapboxGLPointMap>
            </span>
          </div>
          <div id="school-enrolments" className="panel bordered">
            <h2>Enrolments</h2>
            <div>
            <Pie
              width={768}
              height={512}
              isInteractive={false}
              margin={{ top: 80, right: 120, bottom: 80, left: 120 }}
              data={enrolments}
              colors={{ datum: 'data.color' }}
              startAngle={-90}
              innerRadius={0.6}
              padAngle={0.5}
              cornerRadius={5}
              radialLabel={(d: any) => `${d.id}: ${d.value}`}
              radialLabelsLinkColor={{
                  from: 'color',
              }}
              radialLabelsLinkStrokeWidth={3}
              radialLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 1.2]],
              }}
              enableSliceLabels={false}
            />
            </div>
          </div>
          <div id="school-contact" className="panel bordered">
            <h2>Contact</h2>
            <tr><td>Name</td><td>{school?.contact1Name}</td></tr>
            <tr><td>Phone</td><td><a href={'tel:'+school?.telephone.replace(/[.,\s\-_()]/g,"")}>{school?.telephone}</a></td></tr>
            <tr><td>Email</td><td><a href={'mailto:'+school?.email}>{school?.email}</a></td></tr>
            <tr><td>Web</td><td><a href="{school?.url}">{school?.url}</a></td></tr>
          </div>
          <div id="school-misc" className="panel bordered">
            <h2>Miscellaneous</h2>
            <tr><td>Definition</td><td>{school?.definition}</td></tr>
            <tr><td>Roll Date</td><td>{school?.rollDate}</td></tr>
            <tr><td>Decile</td><td>{school?.decile}</td></tr>
            <tr><td>Isolation Index</td><td>{school?.isolationIndex}</td></tr>
            <tr><td>CoEducation Status</td><td>{school?.coEdStatus}</td></tr>
            <tr><td>Education Region</td><td>{school?.educationRegion}</td></tr>
            <tr><td>General Electorate</td><td>{school?.generalElectorate}</td></tr>
            <tr><td>Māori Electorate</td><td>{school?.maoriElectorate}</td></tr>
            <tr><td>School Donations</td><td>{school?.schoolDonations}</td></tr>
          </div>
        </div>}
      </div>
    </section>
  );

}

export default SchoolPage;
