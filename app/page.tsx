'use client'
import React, { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, DatePicker } from 'antd';
import DataTable from './Component/DataTable';
import dayjs from 'dayjs';

type FieldType = {
  customerName?: string;
  startDate?: string;
  endDate?: string;
};

const Home = () => {

  const [Data,setData] = useState()

  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5298/api/Vehicles');
        const jsonData = await response.json();
        setData(jsonData);
        // setFilteredData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  },[])

  const onFinish: FormProps<FieldType>['onFinish'] = async(values: any) => {

    if (values["range-picker"]) {
      const [startDate, endDate] = values["range-picker"];

      const start = dayjs(startDate).format('DD/MM/YYYY');
      const end = dayjs(endDate).format('DD/MM/YYYY');

      console.log('start',start,end)

      try {
        console.log('if')
        const response = await fetch('http://localhost:5298/api/Vehicles/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: values.customerName || "",
            startDateStr: start,
            endDateStr: end,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setData(data)
        } else {
          console.log('Failed to send data:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }else{
      try {
        console.log("else")
        const response = await fetch('http://localhost:5298/api/Vehicles/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: values.customerName,
            startDateStr: "",
            endDateStr: "",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setData(data)
        } else {
          console.log('Failed to send data:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        labelCol={{ span: 10 }}
        style={{ maxWidth: '100%' }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', alignItems: 'flex-end' }}>
          <Form.Item<FieldType>
            label="CustomerName"
            name="customerName"
          >
            <Input style={{ width: '250px' }} />
            
          </Form.Item>

          <Form.Item name="range-picker" label="Date">
            <RangePicker
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </div>
      </Form>

      <DataTable datatoTable={Data}/>
    </>
  )
}

export default Home;