import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from '@heroui/button';
import { Dropdown, DropdownItem,DropdownMenu,DropdownTrigger } from '@heroui/dropdown';
import { Link } from '@heroui/link'; 
import { Avatar } from '@heroui/avatar';

import { User, LogOut, Settings } from 'lucide-react';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const authenticatedMenuItems = {
    LP: [
      { name: "Browse Funds", href: "/browse-funds" },
      { name: "Profile", href: "/profile" },
    ],
    FUND: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Profile", href: "/profile" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isBordered 
        isMenuOpen={isMenuOpen} 
        onMenuOpenChange={setIsMenuOpen}
        className="bg-white/95 backdrop-blur-md border-b border-gray-200"
        height="70px"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/" className="font-bold text bg-primary-600 bg-clip-text text-transparent">
              Open Allocators Network
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <Link
                href={item.href}
                className={`text-gray-700 hover:text-primary-600 transition-colors ${
                  router.pathname === item.href ? 'text-primary-600 font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
          
          {user && authenticatedMenuItems[user.role]?.map((item) => (
            <NavbarItem key={item.name}>
              <Link
                href={item.href}
                className={`text-gray-700 hover:text-primary-600 transition-colors ${
                  router.pathname === item.href ? 'text-primary-600 font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          {!user ? (
            <>
              <NavbarItem className="hidden lg:flex">
                <Link href="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Button 
                  as={Link} 
                  href="/signup" 
                  color="primary" 
                  variant="flat"
                  className="bg-primary-500 text-white"
                >
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          ) : (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={user.email}
                  size="sm"
                  icon={<User />}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-tiny text-default-500">{user.role}</p>
                </DropdownItem>
                <DropdownItem 
                  key="settings" 
                  startContent={<Settings className="w-4 h-4" />}
                  onClick={() => router.push('/profile')}
                >
                  Profile Settings
                </DropdownItem>
                <DropdownItem 
                  key="logout" 
                  color="danger" 
                  startContent={<LogOut className="w-4 h-4" />}
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                href={item.href}
                className="w-full text-gray-700 hover:text-primary-600"
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          
          {user && authenticatedMenuItems[user.role]?.map((item, index) => (
            <NavbarMenuItem key={`auth-${item.name}-${index}`}>
              <Link
                href={item.href}
                className="w-full text-gray-700 hover:text-primary-600"
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          
          {!user && (
            <>
              <NavbarMenuItem>
                <Link href="/login" className="w-full text-gray-700" size="lg">
                  Login
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link href="/signup" className="w-full text-primary-600" size="lg">
                  Sign Up
                </Link>
              </NavbarMenuItem>
            </>
          )}
        </NavbarMenu>
      </Navbar>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4 bg-primary-400 bg-clip-text text-transparent">
                Open Allocators Network
              </h3>
              <p className="text-gray-400 mb-4">
                Connecting Limited Partners, Family Offices, and HNWIs with top-tier crypto funds.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">info@openallocatorsnetwork.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Open Allocators Network. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;