import React from 'react';
import { Feature, FeatureCollection, Point } from 'geojson';
import { useHistory } from 'react-router-dom';
import { useSchoolList } from 'hooks/use-school';
import LoadingSpinner from 'components/loading-spinner/LoadingSpinner';
import './HomePage.css'
import { ISchoolListItem } from 'models/school-list-item.interface';
import HelperIcon from 'components/helper-icon/HelperIcon';
import MapboxGLClusteredMap from './MapboxglClusteredMap';

type ISchoolFeature = Feature<Point, { schoolId: string, name: string, total: number }>;

function HomePage() {

    const [mapGrouping, setMapGrouping] = React.useState<keyof ISchoolListItem>('count');
    const [schoolsList, schoolsListError, schoolsListPending] = useSchoolList();
    const history = useHistory();
    const onFeatureClick = (feature: ISchoolFeature) => history.push(`/school/${feature.properties.schoolId}`)

    let features: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
    };

    if (!schoolsListPending && !schoolsListError && schoolsList) {
        features.features = schoolsList!.map((school: ISchoolListItem): ISchoolFeature => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [+school.lng, +school.lat],
            },
            properties: school,
        }));
    }

    return (
        <section id="home-section">
            <h1>New Zealand Schooling Directory&nbsp;
                <HelperIcon width={'430px'} height={'120px'} tooltipText={<p>
                    Use the scroll-wheel or select a cluster to zoom<br />
                    Select a school to see more information<br />
                    Hover over a school to see its name<br />
                    Click away to hide displayed school names<br /></p>}>\
                </HelperIcon>
            </h1>

            <select name="map-group" id="map-group" defaultValue={mapGrouping} onChange={(e) => setMapGrouping(e.target.value as keyof ISchoolListItem)}>
                <option value="count">School Locations</option>
                <option value="maori">Māori Enrolments</option>
                <option value="pacific">Pacific Enrolments</option>
                <option value="european">European Enrolments</option>
                <option value="asian">Asian Enrolments</option>
                <option value="melaa">MELAA Enrolments</option>
                <option value="international">International Enrolments</option>
                <option value="other">Other Enrolments</option>
                <option value="total">Total Enrolments</option>
            </select>
            {schoolsListPending && <LoadingSpinner />}
            {/* {!schoolsListPending && !schoolsListError && <pre>{JSON.stringify(schoolsList, null, 4)}</pre>} */}
            {schoolsListError && <p className="schoolsListError">{JSON.stringify(schoolsListError)}</p>}

            {!schoolsListPending && !schoolsListError &&
                <MapboxGLClusteredMap
                    height={'80vh'} width={'90vw'}
                    lat={-41} lng={173} zoom={5}
                    features={features}
                    onFeatureClick={onFeatureClick}
                    clusterByProperty={mapGrouping} >
                </MapboxGLClusteredMap>
            }
            
        </section>
    );
}

export default HomePage;