'use client'
import axios, { AxiosError } from "axios";
import React, { useState } from 'react';
import toast from 'react-hot-toast';



interface ApiSummaryItem {
  logo: string;
  data_type: 'rating' | 'delivery';
  customer_rating?: 'excellent_customer' | string;
  risk_level?: 'low' | string; 
  message?: string;
  api_version?: string;
  show_count?: boolean;
  total: number;
  success: number;
  cancel: number;
}

interface ApiSummaries {
  [courierName: string]: ApiSummaryItem;
}

interface ApiTotalSummary {
  total: number;
  success: number;
  cancel: number;
  successRate: number;
  cancelRate: number;
}

interface ApiResponseData {
  Summaries: ApiSummaries;
  totalSummary: ApiTotalSummary;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ApiResponseData;
}



type CourierStatus = 'Recommended' | 'Standard' | 'On Probation';

interface Courier {
  id: string;
  name: string;
  logo: string;
  rating: number;
  review: string;
  status: CourierStatus;
  data_type: string
  orders: number;
  deliveries: number;
  cancels: number;
}

interface PerformanceStats {
  totalOrders: number;
  totalDeliveries: number;
  totalCanceled: number;
  successRate: number;
}

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PackageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const StarIcon = ({ className, filled }: { className?: string; filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);



const CourierLogo = ({ src, name }: { src: string; name: string }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length > 1) {
      return words[0][0] + words[1][0];
    }
    return name.length > 1 ? name.substring(0, 2) : name[0];
  };

  const getFallbackColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  if (hasError || !src) {
    return (
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: getFallbackColor(name) }}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className="h-8 w-8 rounded-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};


const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        filled={i < rating}
      />
    ))}
  </div>
);


const SuccessDonutChart = ({ percentage }: { percentage: number }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = isNaN(percentage) ? 0 : percentage;
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className="relative h-40 w-40">
      <svg className="h-full w-full" viewBox="0 0 120 120">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-green-500 transition-all duration-500"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-green-600">
          {Math.round(validPercentage)}%
        </span>
      </div>
    </div>
  );
};


const CourierRow = ({ courier }: { courier: Courier }) => {
  const cancelRate =
    courier.orders > 0
      ? ((courier.cancels / courier.orders) * 100).toFixed(1)
      : '0.0';

  const statusColor =
    courier.status === 'Recommended'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  return (
    <div className="grid grid-cols-1 items-center gap-4 border-t border-gray-100 p-4 md:grid-cols-5">
      <div className="col-span-1 flex items-center gap-3">
        <CourierLogo src={courier.logo} name={courier.name} />
        <div className="flex-1">
          <div className="font-medium text-gray-800">{courier.name}</div>
          {courier.data_type === "rating" && <StarRating rating={courier.rating} />}
          {/* <StarRating rating={courier.rating} /> */}
          {/* <div className="mt-1 text-xs text-gray-500">{courier.review}</div> */}
        </div>
        {/* {courier.status === 'Recommended' && (
          <span
            className={`ml-auto hidden rounded-full px-3 py-1 text-xs font-semibold md:inline-block ${statusColor}`}
          >
            {courier.status}
          </span>
        )} */}
      </div>

      <div className="text-center text-sm text-gray-700">
        <span className="font-medium text-gray-500 md:hidden">Orders: </span>
        {courier.orders} Orders
      </div>
      <div className="text-center text-sm text-gray-700">
        <span className="font-medium text-gray-500 md:hidden">Deliveries: </span>
        {courier.deliveries} Deliveries
      </div>
      <div className="text-center text-sm text-gray-700">
        <span className="font-medium text-gray-500 md:hidden">Canceled: </span>
        {courier.cancels} Canceled
      </div>
      <div className="text-center text-sm font-semibold text-red-600">
        <span className="font-medium text-gray-500 md:hidden">
          Cancel Rate:{' '}
        </span>
        {cancelRate}% Cancel Rate
      </div>

      {courier.status === 'Recommended' && (
        <div className="col-span-1 mt-2 md:hidden">
          <span
            className={`w-full rounded-full px-3 py-1 text-center text-xs font-semibold ${statusColor}`}
          >
            {courier.status}
          </span>
        </div>
      )}
    </div>
  );
};

export default function Fraud_Check() {
  const [orderId, setOrderId] = useState('01906479901');
  const [courierData, setCourierData] = useState<Courier[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const transformData = (
    data: ApiResponseData
  ): { couriers: Courier[]; stats: PerformanceStats } => {

    const couriers: Courier[] = Object.entries(data.Summaries).map(
      ([name, summary]) => {
        let rating = 4; 
        if (summary.customer_rating === 'excellent_customer') {
          rating = 5;
        }

        let status: CourierStatus = 'Standard';
        if (summary.risk_level === 'low') {
          status = 'Recommended';
        }

        return {
          id: name.toLowerCase(),
          name: name,
          logo: summary.logo,
          rating: rating,
          review: summary.message || '',
          status: status,
          data_type: summary.data_type,
          orders: summary.total,
          deliveries: summary.success,
          cancels: summary.cancel,
        };
      }
    );


    const stats: PerformanceStats = {
      totalOrders: data.totalSummary.total,
      totalDeliveries: data.totalSummary.success,
      totalCanceled: data.totalSummary.cancel,
      successRate: data.totalSummary.successRate,
    };

    return { couriers, stats };
  };


  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setCourierData([]);
    setStats(null);

    try {
      const phoneNumber = orderId;
      const phoneRegex = /^01[3-9]\d{8}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error("Please enter a valid Bangladeshi phone number!");
      }
      const { data } = await axios.post("/api/fraud-check", {
        phone_number: phoneNumber,
      });

      const apiData = data.data;
      const { couriers, stats } = transformData(apiData);
      setCourierData(couriers);
      setStats(stats);

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          err.message ||
          "API request failed!";
        setError(message);
        toast.error(message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred.");
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-blue-600 border-gray-200"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-96 flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <XCircleIcon className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Search Failed</h3>
          <p className="text-red-600">{error} <a target="_blank" className="text-blue-500" href="https://www.fraudbd.com/">Check</a></p>
          <p className="text-sm text-gray-500">Please try again or contact support.</p>
        </div>
      );
    }

    if (!stats || courierData.length === 0) {
      return (
        <div className="flex h-96l flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <SearchIcon className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Search for a Customer</h3>
          <p className="text-gray-500">
            Enter a phone number or order ID to see the delivery performance overview.
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Card Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Delivery Performance Overview
          </h2>
        </div>

        {/* Card Body */}
        <div className="flex flex-col gap-6 p-6 md:flex-row">
          {/* Left Side: Success Rate */}
          <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-6 md:w-1/3 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <h3 className="text-md font-semibold text-gray-600">
              Delivery Success Rate
            </h3>
            <SuccessDonutChart percentage={stats.successRate} />
           
            
          </div>

          {/* Right Side: Stats */}
          <div className="flex flex-1 items-center justify-center">
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <PackageIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">
                    {stats.totalOrders}
                  </span>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3 text-green-600">
                  <TruckIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">
                    {stats.totalDeliveries}
                  </span>
                  <p className="text-sm text-gray-500">Total Deliveries</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3 text-red-600">
                  <XCircleIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">
                    {stats.totalCanceled}
                  </span>
                  <p className="text-sm text-gray-500">Total Canceled</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Courier Table */}
        <div className="w-full">
          {/* Table Header */}
          <div className="hidden bg-gray-50 p-4 md:grid md:grid-cols-5">
            <h4 className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Courier
            </h4>
            <h4 className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Orders
            </h4>
            <h4 className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Deliveries
            </h4>
            <h4 className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Canceled
            </h4>
            <h4 className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cancel Rate
            </h4>
          </div>

          {/* Table Body */}
          <div>
            {courierData.map((courier) => (
              <CourierRow key={courier.id} courier={courier} />
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className='flex justify-center'>
          <header className="mb-6">
            <h1 className="md:text-3xl  text-lg font-bold text-gray-800">
              Resolve Pending Orders
            </h1>
            <p className="text-lg text-gray-500 text-center">Reduce Return Rate</p>
          </header>
      </div>

        {/* Search Bar */}
        <div className='flex justify-center items-center p-4'>
          {/* Added w-full and max-w-sm to ensure it fills small screens 
      but doesn't get too wide on large ones */}
          <div className="mb-6 flex w-full  rounded-lg shadow-md">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Phone Number"
              className="flex-1 w-10 rounded-l-lg border border-slate-300 p-4 text-gray-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50"
              disabled={isLoading}
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-r-lg bg-slate-900 p-4 text-white transition-colors duration-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-white border-slate-400"></div>
              ) : (
                <>
                  <SearchIcon className="h-5 w-5" />
                  <span className="font-semibold hidden sm:inline">Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Dashboard Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
}

