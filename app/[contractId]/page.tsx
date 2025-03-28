'use client'
import { Button, DatePicker, Form, FormProps, Input } from "antd";
import dayjs from "dayjs";
import { use, useEffect, useState } from "react"
import DataTable from "../Component/DataTable";

  type DataType = [{
    id: number,
    brand: string,
    licensePlate: string,
    model: string,
    customerName: string,
    startDate: string,
    endDate: string,
    rentalContract: {
        customerName: string;
        startDate: string;
        endDate: string;
    }
  }]

const contractId  = ({params}:{params: Promise<{ contractId: string }>}) => {

    const { contractId } = use(params);
    const [Data,setData] = useState<DataType[]>([]);
    
    useEffect(() => {
        async function fetchDataByID() {
            try {
                const response = await fetch(`https://localhost:7216/api/Vehicles/${contractId}`);
                const jsonData = await response.json();
                setData([jsonData]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchDataByID();
    },[contractId])

    return (
        <>    
          <DataTable datatoTable={Data} />
        </>
      )
}

export default contractId;