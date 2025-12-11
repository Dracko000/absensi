import { utils, writeFile } from 'xlsx';

// Function to export attendance data to Excel
export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
  // Convert data to worksheet
  const worksheet = utils.json_to_sheet(data);
  
  // Create workbook with the worksheet
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Buffer and write file
  writeFile(workbook, `${fileName}.xlsx`);
};

// Function to format attendance records for export
export const formatAttendanceForExport = (records: any[], type: 'guru' | 'murid' | 'all' = 'all') => {
  return records.map(record => ({
    'Nama': record.user?.nama_lengkap || 'N/A',
    'Nomor Induk': record.user?.nomor_induk || 'N/A',
    'Tanggal': new Date(record.tanggal).toLocaleDateString('id-ID'),
    'Jam Masuk': record.jam_masuk || '-',
    'Jam Keluar': record.jam_keluar || '-',
    'Jenis Absensi': record.jenis_absensi === 'guru' ? 'Guru' : 'Murid',
    'Barcode': record.barcode || '-',
    'Keterangan': record.keterangan || '-',
    'Terdaftar': new Date(record.created_at).toLocaleString('id-ID')
  }));
};

// Function to format user data for export
export const formatUsersForExport = (users: any[], role: 'admin' | 'user' | 'all' = 'all') => {
  return users.map(user => ({
    'Nama Lengkap': user.nama_lengkap,
    'Email': user.email,
    'Nomor Induk': user.nomor_induk,
    'Role': user.role === 'admin' ? 'Guru' : 'Murid',
    'Terdaftar': new Date(user.created_at).toLocaleString('id-ID')
  }));
};