'use client'
import { use, useEffect, useState } from "react"
import DataTable from "../../components/organisms/DataTable";
import type { Vehicle } from "../../components/organisms/DataTable";

const API_BASE_URL = 'https://localhost:7216/api';

const ContractDetail = ({params}:{params: Promise<{ contractId: string }>}) => {

    const { contractId } = use(params);
    const [Data,setData] = useState<Vehicle[]>([]);
    
    useEffect(() => {
        async function fetchDataByID() {
            try {
                const response = await fetch(`${API_BASE_URL}/Vehicles/${contractId}`);
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

export default ContractDetail;
