import { useEffect, useState } from 'react';

interface Industry {
  id: number;
  name: string;
}

interface Solution {
  id: number;
  name: string;
  description: string;
  demoAvailable: boolean;
  demoLink?: string;
  industry: Industry;
}

function HomePage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/industries')
      .then((response) => response.json())
      .then((data) => setIndustries(data.data));
    fetch('/api/solutions')
      .then((response) => response.json())
      .then((data) => setSolutions(data.data));
  }, []);

  const filteredSolutions = selectedIndustry
    ? solutions.filter((solution) => solution.industry.id === selectedIndustry)
    : solutions;

  return (
    <div className="page-container">
      <section className="hero">
        <h1>GOSH Solutions</h1>
        <p>Explore industry software solutions, request demos, and book discussions.</p>
      </section>

      <section className="filters">
        <h2>Industries</h2>
        <div className="industry-list">
          <button type="button" onClick={() => setSelectedIndustry(null)}>
            All
          </button>
          {industries.map((industry) => (
            <button key={industry.id} type="button" onClick={() => setSelectedIndustry(industry.id)}>
              {industry.name}
            </button>
          ))}
        </div>
      </section>

      <section className="solutions">
        <h2>Solutions</h2>
        {filteredSolutions.length === 0 ? (
          <p>No solutions found for this industry.</p>
        ) : (
          <div className="solution-grid">
            {filteredSolutions.map((solution) => (
              <article key={solution.id} className="solution-card">
                <h3>{solution.name}</h3>
                <p>{solution.description}</p>
                <p>Industry: {solution.industry.name}</p>
                <p>Demo available: {solution.demoAvailable ? 'Yes' : 'No'}</p>
                {solution.demoAvailable && solution.demoLink ? (
                  <a href={solution.demoLink} target="_blank" rel="noreferrer">
                    Open Demo
                  </a>
                ) : (
                  <p>Request a demo below.</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
