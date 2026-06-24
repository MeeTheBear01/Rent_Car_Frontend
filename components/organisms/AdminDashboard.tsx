import React from 'react';
import { Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type Row = {
  key: number;
  car: string;
  plate: string;
  customer: string;
  period: string;
  days: number;
  status: string;
};

type Props = {
  rentedCount: number;
  dashboardRows: Row[];
};

const AdminDashboard: React.FC<Props> = ({ rentedCount, dashboardRows }) => {
  return (
    <section id="dashboard" className="admin-dashboard" aria-labelledby="dashboard-title">
      <div className="section-heading">
        <div>
          <p className="section-overline">Admin dashboard</p>
          <h2 id="dashboard-title">Rented car details</h2>
        </div>
        <p className="dashboard-note">
          Admin can monitor rented vehicles, customers, rental dates, and contract status.
        </p>
      </div>

      <div className="stats-grid">
        <Statistic title="Rented cars" value={rentedCount} />
        <Statistic title="Active contracts" value={dashboardRows.filter((row) => row.status === 'Active').length} />
        <Statistic title="Rental days" value={dashboardRows.reduce((total, row) => total + row.days, 0)} />
      </div>

      <Table
        className="admin-table"
        dataSource={dashboardRows}
        pagination={false}
        scroll={{ x: 760 }}
        columns={[
          { title: 'Car', dataIndex: 'car', key: 'car' },
          { title: 'Plate', dataIndex: 'plate', key: 'plate' },
          { title: 'Customer', dataIndex: 'customer', key: 'customer' },
          { title: 'Period', dataIndex: 'period', key: 'period' },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color={status === 'Active' ? 'purple' : 'green'}>{status}</Tag>,
          },
        ] as ColumnsType<Row>}
      />
    </section>
  );
};

export default AdminDashboard;
