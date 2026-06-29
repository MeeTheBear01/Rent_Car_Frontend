'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FormProps } from 'antd';
import {
  Badge,
  Button,
  ConfigProvider,
  DatePicker,
  Empty,
  Form,
  Input,
  Statistic,
  Table,
  Tag,
  TimePicker,
  theme,
} from 'antd';
import dayjs from 'dayjs';
import type { Vehicle } from '../components/organisms/DataTable';
import TopBar from '../components/organisms/TopBar';
import HeroSearch from '../components/organisms/HeroSearch';
import LoginModal from '../components/organisms/LoginModal';
import CollectionGrid from '../components/organisms/CollectionGrid';
import ResultsSection from '../components/organisms/ResultsSection';
import AdminDashboard from '../components/organisms/AdminDashboard';

const API_BASE_URL = 'https://localhost:7216/api';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const AUTH_STORAGE_KEY = 'rent_car_auth';

type FieldType = {
  customerName?: string;
  pickupLocation?: string;
  pickupDate?: dayjs.Dayjs;
  dropoffDate?: dayjs.Dayjs;
  pickupTime?: dayjs.Dayjs;
  dropoffTime?: dayjs.Dayjs;
};

type AuthUser = {
  email: string;
  name: string;
  picture: string;
  role: 'user' | 'admin';
};

type AuthSession = {
  token: string;
  user: AuthUser;
};

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            use_fedcm: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: string; size: string; shape: string; text: string },
          ) => void;
        };
      };
    };
  }
}

const fallbackVehicles: Vehicle[] = [
  {
    id: 1,
    brand: 'MINI',
    model: 'Cooper S',
    licensePlate: 'YOU-404',
    rentalContract: {
      id: 101,
      customerName: 'Narin S.',
      startDate: '2026-06-15T00:00:00',
      endDate: '2026-06-18T00:00:00',
    },
  },
  {
    id: 2,
    brand: 'Hyundai',
    model: 'Santro',
    licensePlate: 'HYU-202',
    rentalContract: {
      id: 102,
      customerName: 'Pimchanok K.',
      startDate: '2026-06-20T00:00:00',
      endDate: '2026-06-23T00:00:00',
    },
  },
  {
    id: 3,
    brand: 'Dodge',
    model: 'Charger',
    licensePlate: 'DOD-707',
    rentalContract: {
      id: 103,
      customerName: 'Arthit M.',
      startDate: '2026-06-24T00:00:00',
      endDate: '2026-06-26T00:00:00',
    },
  },
];

const featuredCars = [
  {
    name: 'MINI Cooper S',
    label: 'City premium',
    price: '3,400',
    image:
      'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=1000&q=82',
  },
  {
    name: 'Hyundai Santro',
    label: 'Daily comfort',
    price: '1,900',
    image:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=82',
  },
  {
    name: 'Dodge Charger',
    label: 'Sport drive',
    price: '5,500',
    image:
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1000&q=82',
  },
];

const brands = ['Europcar', 'enterprise', 'AVIS', 'GOLDCAR'];

const Home = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(fallbackVehicles);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(true);
  const [authMessage, setAuthMessage] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [form] = Form.useForm();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const role = session?.user.role || 'user';
  const isAdmin = role === 'admin';

  const rentedVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.rentalContract),
    [vehicles],
  );

  const dashboardRows = useMemo(
    () =>
      rentedVehicles.map((vehicle) => {
        const start = dayjs(vehicle.rentalContract.startDate);
        const end = dayjs(vehicle.rentalContract.endDate);
        return {
          key: vehicle.id,
          car: `${vehicle.brand} ${vehicle.model}`,
          plate: vehicle.licensePlate,
          customer: vehicle.rentalContract.customerName,
          period: `${start.format('DD MMM YYYY')} - ${end.format('DD MMM YYYY')}`,
          days: Math.max(end.diff(start, 'day'), 1),
          status: end.isBefore(dayjs()) ? 'Returned' : 'Active',
        };
      }),
    [rentedVehicles],
  );

  useEffect(() => {
    const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/Vehicles`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const jsonData = await response.json();
        setVehicles(jsonData);
        setUsingFallback(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setVehicles(fallbackVehicles);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || session || !isLoginModalOpen || !googleButtonRef.current) {
      return;
    }

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        use_fedcm: false,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.body.appendChild(script);
  }, [session, isLoginModalOpen]);

  useEffect(() => {
    async function fetchAdminRentals() {
      if (!session || session.user.role !== 'admin') {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/Admin/rentals`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Cannot load admin rental data.');
        }

        setVehicles(await response.json());
      } catch (error) {
        setAuthMessage(error instanceof Error ? error.message : 'Cannot load admin rental data.');
      } finally {
        setLoading(false);
      }
    }

    fetchAdminRentals();
  }, [session]);

  const handleGoogleCredential = async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      setAuthMessage('Google login did not return a credential.');
      return;
    }

    setAuthLoading(true);
    setAuthMessage('');
    try {
      const apiResponse = await fetch(`${API_BASE_URL}/Auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await apiResponse.json();
      if (!apiResponse.ok) {
        throw new Error(data.message || 'Google login failed.');
      }

      setSession(data);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("เกิดข้อผิดพลาดตอนยืนยันกับ Backend:", error);
      setAuthMessage(error instanceof Error ? error.message : 'Google login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setBookingMessage('');
  };

  const createBooking = async (vehicleId: number) => {
    if (!session) {
      setIsLoginModalOpen(true);
      return;
    }

    const values = form.getFieldsValue();
    setBookingMessage('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Bookings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          customerName: values.customerName || session.user.name,
          pickupLocation: values.pickupLocation || '',
          startDateStr: values.pickupDate ? dayjs(values.pickupDate).format('DD/MM/YYYY') : '',
          endDateStr: values.dropoffDate ? dayjs(values.dropoffDate).format('DD/MM/YYYY') : '',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Booking failed.');
      }

      setBookingMessage('Booking request sent successfully.');
    } catch (error) {
      setBookingMessage(error instanceof Error ? error.message : 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const start = values.pickupDate ? dayjs(values.pickupDate).format('DD/MM/YYYY') : '';
    const end = values.dropoffDate ? dayjs(values.dropoffDate).format('DD/MM/YYYY') : '';

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Vehicles/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: values.customerName || '',
          startDateStr: start,
          endDateStr: end,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setVehicles(data);
      setUsingFallback(false);
    } catch (error) {
      console.error('Error sending data:', error);
      const search = values.customerName?.toLowerCase().trim();
      setVehicles(
        search
          ? fallbackVehicles.filter((vehicle) =>
            vehicle.rentalContract.customerName.toLowerCase().includes(search),
          )
          : fallbackVehicles,
      );
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#9b55ff',
          colorBgContainer: '#19151f',
          colorBorder: 'rgba(255,255,255,0.12)',
          borderRadius: 8,
          fontFamily: 'var(--font-body)',
        },
      }}
    >
      <main className="site-shell">
        <TopBar
          isAdmin={isAdmin}
          session={session}
          logout={logout}
          onLoginClick={() => setIsLoginModalOpen(true)}
        />
        <HeroSearch form={form} onFinish={onFinish} loading={loading} rentedVehiclesCount={rentedVehicles.length} usingFallback={usingFallback} />
        <div className='contents'>
        {!session && (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(155, 85, 255, 0.05)', borderRadius: '8px', marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '16px' }}>Login to Book</h2>
              <p style={{ marginBottom: '20px', color: '#999' }}>Sign in with Google to reserve your rental car.</p>
              <Button type="primary" size="large" onClick={() => setIsLoginModalOpen(true)}>
                Open Login
              </Button>
            </div>
          )}
          {session && (
            <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(155, 85, 255, 0.05)', borderRadius: '8px', marginBottom: '40px' }}>
              <Button type="link" onClick={() => setIsLoginModalOpen(true)}>
                View Profile
              </Button>
            </div>
          )}

          <section id="how" className="how-section" aria-labelledby="how-title">
            <p className="section-overline">Search - Select - Book</p>
            <h2 id="how-title">
              How it <span>Works</span>
            </h2>
            <div className="steps">
              {[
                ['01', 'Search', 'Choose location, dates, and customer lookup details.'],
                ['02', 'Select', 'Compare available rental cars and match the right trip.'],
                ['03', 'Book', 'Confirm the booking and let admin track the active contract.'],
              ].map(([number, title, body]) => (
                <article className="step-card" key={number}>
                  <div className="step-illustration">{number}</div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="brand-section" aria-label="Partner brands">
            <h2>
              Big <span>Brand</span>, Better Work
            </h2>
            <div className="brand-strip">
              {brands.map((brand) => (
                <strong key={brand}>{brand}</strong>
              ))}
            </div>
          </section>

          <CollectionGrid featuredCars={featuredCars} createBooking={createBooking} loading={loading} bookingMessage={bookingMessage} />

          <ResultsSection vehicles={vehicles} loading={loading} />

          {isAdmin && <AdminDashboard rentedCount={rentedVehicles.length} dashboardRows={dashboardRows} />}
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          session={session}
          GOOGLE_CLIENT_ID={GOOGLE_CLIENT_ID}
          googleButtonRef={googleButtonRef}
          authLoading={authLoading}
          authMessage={authMessage}
          logout={logout}
        />
      </main>
    </ConfigProvider>
  );
};

export default Home;
