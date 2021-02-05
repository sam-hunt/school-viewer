import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <section id="about-section">
      <h1>About</h1>
      <p>
        A small visualiser for the <a href="https://www.educationcounts.govt.nz/directories/api-new-zealand-schools">Schooling Directory API</a> Provided by the New Zealand Government.<br/>
        <br/><br/>
        Built with <a href="https://reactjs.org/">React</a>, <a href="https://www.typescriptlang.org/">Typescript</a>, <a href="https://www.mapbox.com/mapbox-gljs">Mapbox GLJS</a>, and <a href="https://d3js.org/">D3 v6</a>.
      </p>
    </section>
  );
}

export default AboutPage;
