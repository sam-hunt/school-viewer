import React, { useMemo, useState } from 'react';
import './SchoolsListPage.css';
import { useSchoolList } from 'hooks/use-school';
import { Link } from 'react-router-dom';
import LoadingSpinner from 'components/loading-spinner/LoadingSpinner';

function SchoolsListPage() {

  const [autocompleteValue, setAutocompleteValue] = useState<string>('');
  const [schoolsList, schoolsListError, schoolsListPending] = useSchoolList();

  // Memoize optimized search strings so we don't have to do it on each key press
  const optimizedSchoolsList = useMemo(() => schoolsList?.map(school => ({
    schoolId: school.schoolId,
    name: school.name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase(),
  })), [schoolsList]);
  const optimizedAutocompleteValue = autocompleteValue.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();

  return (
    <section id="schools-list-section">
      <h1>Find a School</h1>
      <input
        className="autocomplete"
        type="text" value={autocompleteValue}
        onChange={(e) => setAutocompleteValue(e.target.value)}>
      </input>
      <div className="school-list">
        {schoolsListPending && <LoadingSpinner />}
        {!schoolsListPending && !schoolsListError && optimizedSchoolsList!
          .filter((item: { schoolId: string, name: string }) => item.name.includes(optimizedAutocompleteValue))
          .map((school: { schoolId: string, name: string }) =>
            <Link
              to={'/school/'+school.schoolId}
              key={school.schoolId}
              className="school-list-item"
            >
            {school.name}
            </Link>
          )
        }
      </div>
    </section>
  );
}

export default SchoolsListPage;

