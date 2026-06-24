import React from 'react';
import { Badge, Button, DatePicker, Form, Input, TimePicker } from 'antd';

type Props = {
  form: any;
  onFinish: any;
  loading: boolean;
  rentedVehiclesCount: number;
  usingFallback: boolean;
};

const HeroSearch: React.FC<Props> = ({ form, onFinish, loading, rentedVehiclesCount, usingFallback }) => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-search">
        <p className="hero-kicker">Search your</p>
        <h1>
          Rental <span>Cars</span>
        </h1>

        <Form
          form={form}
          className="search-form"
          layout="vertical"
          name="vehicle-search"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Pickup Location" name="pickupLocation">
            <Input placeholder="Select a pickup address" />
          </Form.Item>
          <div className="form-pair">
            <Form.Item label="Pickup Date" name="pickupDate">
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item label="Dropoff Date" name="dropoffDate">
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </div>
          <div className="form-pair">
            <Form.Item label="Pickup Time" name="pickupTime">
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item label="Dropoff Time" name="dropoffTime">
              <TimePicker format="HH:mm" />
            </Form.Item>
          </div>
          <Form.Item label="Customer Name" name="customerName">
            <Input placeholder="For booking lookup" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Search
          </Button>
        </Form>
      </div>

      <div className="hero-car" aria-label="Featured rental car">
        <img
          src="https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/3be0ece4-7491-4feb-87b7-77c1ff2e5122/d5395488-62e9-4477-ab50-7adb0536a00b.png"
          alt="Featured rental car"
        />
        <div className="ceiling-lines" />
        <div className="hero-car-caption">
          <Badge status="processing" text={usingFallback ? 'Demo mode' : 'Live API'} />
          <strong>{rentedVehiclesCount} rentals tracked</strong>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
