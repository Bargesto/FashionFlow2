import { useState, useEffect } from 'react';
import { Product } from '../types';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(storedProducts);
    };
    loadProducts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      const newProducts = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(newProducts));
      setProducts(newProducts);
      toast.success('Ürün başarıyla silindi');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Görsel
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ürün Adı
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tip
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stok Durumu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-12 w-12 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {product.name}
                </div>
                <div className="text-sm text-gray-500">
                  {product.price} TL
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {product.type === 'clothing' ? 'Giyim' : 'Ayakkabı'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {Object.entries(product.stock)
                    .filter(([_, count]) => count > 0)
                    .map(([size, count]) => `${size}: ${count}`)
                    .join(', ')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}