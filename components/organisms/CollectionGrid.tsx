import React from 'react';
import { Button } from 'antd';

type Car = {
  name: string;
  label: string;
  price: string;
  image: string;
};

type Props = {
  featuredCars: Car[];
  createBooking: (vehicleId: number) => void;
  loading: boolean;
  bookingMessage: string;
};

const CollectionGrid: React.FC<Props> = ({ featuredCars, createBooking, loading, bookingMessage }) => {
  return (
    <section id="collection" className="collection-section" aria-labelledby="collection-title">
      <p className="section-overline">Premium inventory</p>
      <h2 id="collection-title">
        Our Car <span>Collection</span>
      </h2>
      <div className="collection-grid">
        {featuredCars.map((car, idx) => (
          <article className="car-card" key={car.name}>
            <img src={car.image} alt={car.name} />
            <div>
              <p>{car.label}</p>
              <h3>{car.name}</h3>
              <strong>THB {car.price}/day</strong>
              <Button type="primary" onClick={() => createBooking(idx + 1)} loading={loading}>
                Book now
              </Button>
            </div>
          </article>
        ))}
      </div>
      {bookingMessage ? <p className="booking-message">{bookingMessage}</p> : null}
    </section>
  );
};

export default CollectionGrid;
