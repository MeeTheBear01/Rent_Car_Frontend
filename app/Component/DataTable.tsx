import React from 'react';
import { Table } from 'antd';
import moment from 'moment';

interface DataType {
    key: number;
    brand: string;
    licensePlate: string;
    model: string;
    customerName: string;
    startDate: string;
    endDate: string;
  }

const columns = [
    {
        title: 'id',
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
        render: (_:any,record:any) => {
            return <p>{record.rentalContract.customerName}</p>;
        }
    },
    {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (_:any,record:any) => {
            const formattedstartDate = moment(record.rentalContract.endDate).format('DD-MM-YYYY');
            return <p>{formattedstartDate}</p>;
        }
    },
    {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (_:any,record:any) => {
            const formattedendDate = moment(record.rentalContract.endDate).format('DD-MM-YYYY');
            return <p>{formattedendDate}</p>;
        }
    },
];

interface RentalContract {
    customerName: string;
    startDate: string;
    endDate: string;
    id: number;
}

interface Vehicle {
    brand: string;
    id: number;
    licensePlate: string;
    model: string;
    rentalContract: RentalContract;
}

interface DataTableProps {
    datatoTable: Vehicle[];
}

const DataTable = (props: DataTableProps) => {
    const { datatoTable } = props
    console.log('datatoTable',datatoTable)
    return (<Table<DataType>
        columns={columns}
        dataSource={datatoTable}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10'] }}
    />);
}

export default DataTable;