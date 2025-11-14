import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Equipment } from '@/types/entity.type';

// Booking Item - chỉ dành cho thiết bị THUÊ (ForRent)
export interface BookingItem {
  equipment: Equipment;
  startDate: string;
  endDate: string;
  rentalDays: number;
  totalPrice: number;
  deposit: number;
  insuranceFee: number;
  notes?: string;
}

interface BookingContextType {
  bookings: BookingItem[];
  addBooking: (equipment: Equipment, startDate: string, endDate: string, notes?: string) => void;
  removeBooking: (equipmentId: string) => void;
  clearBookings: () => void;
  getTotalBookings: () => number;
  getTotalPrice: () => number;
  getTotalDeposit: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingItem[]>(() => {
    const saved = localStorage.getItem('lendcamdio_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync với localStorage
  useEffect(() => {
    localStorage.setItem('lendcamdio_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const calculateRentalDays = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Tối thiểu 1 ngày
  };

  const addBooking = (equipment: Equipment, startDate: string, endDate: string, notes?: string) => {
    // Chỉ cho phép booking thiết bị THUÊ
    if (equipment.type !== 0) { // 0 = ForRent, 1 = ForSale
      alert('Thiết bị này chỉ để bán, không thể đặt lịch thuê. Vui lòng thêm vào giỏ hàng.');
      return;
    }

    const rentalDays = calculateRentalDays(startDate, endDate);
    const dailyPrice = equipment.dailyPrice || 0;
    const totalPrice = dailyPrice * rentalDays;
    const deposit = equipment.depositAmount || 0;
    const insuranceFee = equipment.insuranceRequired ? (totalPrice * 0.1) : 0; // 10% insurance fee

    const newBooking: BookingItem = {
      equipment,
      startDate,
      endDate,
      rentalDays,
      totalPrice,
      deposit,
      insuranceFee,
      notes,
    };

    setBookings([...bookings, newBooking]);
  };

  const removeBooking = (equipmentId: string) => {
    setBookings(bookings.filter(item => item.equipment.equipmentId !== equipmentId));
  };

  const clearBookings = () => {
    setBookings([]);
    localStorage.removeItem('lendcamdio_bookings');
  };

  const getTotalBookings = () => {
    return bookings.length;
  };

  const getTotalPrice = () => {
    return bookings.reduce((total, item) => total + item.totalPrice + item.insuranceFee, 0);
  };

  const getTotalDeposit = () => {
    return bookings.reduce((total, item) => total + item.deposit, 0);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        removeBooking,
        clearBookings,
        getTotalBookings,
        getTotalPrice,
        getTotalDeposit,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
