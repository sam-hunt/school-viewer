import LoadingSpinner from 'components/loading-spinner/LoadingSpinner';
import { useSchool } from 'hooks/use-school';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './SchoolPage.css';

function SchoolPage() {

  const { schoolId } = useParams() as { schoolId: string };
  const [school, schoolError, schoolPending] = useSchool(schoolId);

  return (
    <section id="school-section">
      <div className="breadcrumb"><Link to='/schools'>schools</Link> / {schoolId}</div>
      <h1>{school?.orgName || 'Loading...'}</h1>
      <div className="school-details">
        {schoolPending && <LoadingSpinner />}
        {!schoolPending && !schoolError && <pre>{JSON.stringify(school, null, 4)}</pre>}
        {/* <div>
          <div className="school-details-main">
            <h2>Details</h2>
            Organisation Name: {school?.orgName}
          </div>
        </div> */}
      </div>
    </section>
  );

}

export default SchoolPage;
