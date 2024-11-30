import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import { initialProducts } from './data/products';
import './index.css';

function App() {
  useEffect(() => {
    // Initialize products in localStorage if not exists
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const products = JSON.parse(localStorage.getItem('products') || '[]');

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Fashion Store
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-gray-800">
              Admin Panel
            </Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            } />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;