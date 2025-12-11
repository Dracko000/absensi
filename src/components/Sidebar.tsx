import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  userRole: 'superadmin' | 'admin' | 'user';
}

const navItems = {
  superadmin: [
    { name: 'Dashboard', href: '/dashboard-superadmin' },
    { name: 'Absensi Guru', href: '/absensi-guru' },
    { name: 'Laporan Absensi', href: '/laporan' },
    { name: 'Manajemen Guru', href: '/manajemen-guru' },
    { name: 'Manajemen Murid', href: '/manajemen-murid' },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard-guru' },
    { name: 'Absensi Murid', href: '/absensi-murid' },
    { name: 'Riwayat Absensi', href: '/riwayat-absensi' },
    { name: 'Laporan Harian', href: '/laporan-harian' },
  ],
  user: [
    { name: 'Dashboard', href: '/dashboard-murid' },
    { name: 'Riwayat Kehadiran', href: '/riwayat-kehadiran' },
    { name: 'Barcode Saya', href: '/barcode' },
  ]
};

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const items = navItems[userRole];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-md z-10">
      <nav className="mt-8 px-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}