import prisma from '@/lib/prismaClient';
import { UserRole, AttendanceType } from '@prisma/client';

// User-related functions
export const createUser = async (userData: {
  id: string;
  email: string;
  passwordHash: string;
  namaLengkap: string;
  nomorInduk: string;
  role: UserRole;
}) => {
  return await prisma.user.create({
    data: userData
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id }
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

export const getUserByNomorInduk = async (nomorInduk: string) => {
  return await prisma.user.findUnique({
    where: { nomorInduk }
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const updateUser = async (id: string, data: any) => {
  return await prisma.user.update({
    where: { id },
    data
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id }
  });
};

// Attendance-related functions
export const createAttendanceRecord = async (attendanceData: {
  userId: string;
  tanggal: Date;
  jamMasuk?: Date;
  jamKeluar?: Date;
  jenisAbsensi: AttendanceType;
  barcode?: string;
  keterangan?: string;
}) => {
  return await prisma.attendanceRecord.create({
    data: attendanceData
  });
};

export const getAttendanceRecordById = async (id: string) => {
  return await prisma.attendanceRecord.findUnique({
    where: { id },
    include: {
      user: true
    }
  });
};

export const getAttendanceByUserId = async (userId: string) => {
  return await prisma.attendanceRecord.findMany({
    where: { userId },
    include: {
      user: true
    },
    orderBy: {
      tanggal: 'desc'
    }
  });
};

export const getAttendanceByDate = async (date: Date) => {
  // Format date to match the date part only
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  return await prisma.attendanceRecord.findMany({
    where: {
      tanggal: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      user: true
    }
  });
};

export const getAttendanceByType = async (jenisAbsensi: AttendanceType) => {
  return await prisma.attendanceRecord.findMany({
    where: { jenisAbsensi },
    include: {
      user: true
    },
    orderBy: {
      tanggal: 'desc'
    }
  });
};

export const updateAttendanceRecord = async (id: string, data: any) => {
  return await prisma.attendanceRecord.update({
    where: { id },
    data
  });
};

export const deleteAttendanceRecord = async (id: string) => {
  return await prisma.attendanceRecord.delete({
    where: { id }
  });
};

// Advanced queries
export const getAttendanceBetweenDates = async (startDate: Date, endDate: Date, jenisAbsensi?: AttendanceType) => {
  const query: any = {
    tanggal: {
      gte: startDate,
      lte: endDate
    }
  };
  
  if (jenisAbsensi) {
    query.jenisAbsensi = jenisAbsensi;
  }
  
  return await prisma.attendanceRecord.findMany({
    where: query,
    include: {
      user: true
    },
    orderBy: {
      tanggal: 'asc'
    }
  });
};