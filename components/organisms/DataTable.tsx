import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

export interface RentalContract {
    customerName: string;
    startDate: string;
    endDate: string;
    id: number;
}

export interface Vehicle {
    brand: string;
    id: number;
    licensePlate: string;
    model: string;
    rentalContract: RentalContract;
}

const columns: ColumnsType<Vehicle> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Brand',
        dataIndex: 'brand',
        key: 'brand',
    },
    {
        title: 'License Plate',
        dataIndex: 'licensePlate',
        key: 'licensePlate',
    },
    {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
    },
    {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
        render: (_, record) => {
            return <span>{record.rentalContract?.customerName || '-'}</span>;
        }
    },
    {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (_, record) => {
            const formattedstartDate = record.rentalContract?.startDate
                ? moment(record.rentalContract.startDate).format('DD-MM-YYYY')
                : '-';
            return <span>{formattedstartDate}</span>;
        }
    },
    {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (_, record) => {
            const formattedendDate = record.rentalContract?.endDate
                ? moment(record.rentalContract.endDate).format('DD-MM-YYYY')
                : '-';
            return <span>{formattedendDate}</span>;
        }
    },
];

interface DataTableProps {
    datatoTable: Vehicle[];
    loading?: boolean;
}

const DataTable = (props: DataTableProps) => {
    const { datatoTable, loading = false } = props
    return (<Table<Vehicle>
        className="vehicle-table"
        columns={columns}
        dataSource={datatoTable}
        loading={loading}
        rowKey="id"
        scroll={{ x: 760 }}
        pagination={{ defaultPageSize: 6, showSizeChanger: true, pageSizeOptions: ['6', '10'] }}
    />);
}

export default DataTable;
