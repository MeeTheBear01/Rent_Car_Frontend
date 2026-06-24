import React from 'react';
import { Empty } from 'antd';
import DataTable from './DataTable';
import type { Vehicle } from './DataTable';

type Props = {
  vehicles: Vehicle[];
  loading: boolean;
};

const ResultsSection: React.FC<Props> = ({ vehicles, loading }) => {
  return (
    <section className="results-section" aria-label="Vehicle search results">
      <div className="section-heading compact">
        <p className="section-overline">Live inventory</p>
        <h2>Rental list</h2>
      </div>
      {vehicles.length ? <DataTable datatoTable={vehicles} loading={loading} /> : <Empty description="No vehicles found for this search" />}
    </section>
  );
};

export default ResultsSection;
