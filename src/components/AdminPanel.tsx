import { Download, Plus } from 'lucide-react';
import { useState } from 'react';
import { Product, Order } from '../types';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';

export default function AdminPanel() {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDownload = () => {
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');

    // Create CSV content with proper escaping
    const escapeCSV = (str: string) => {
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvContent = [
      ['Sipariş ID', 'Ürün Adı', 'Beden', 'Instagram Kullanıcı Adı', 'Tarih'].map(escapeCSV),
      ...orders.map(order => {
        const product = products.find(p => p.id === order.productId);
        return [
          escapeCSV(order.id),
          escapeCSV(product?.name || 'Bilinmeyen Ürün'),
          escapeCSV(order.size),
          escapeCSV(order.instagramUsername),
          escapeCSV(new Date(order.timestamp).toLocaleString('tr-TR'))
        ];
      })
    ]
      .map(row => row.join(';'))  // Using semicolon for better Excel compatibility
      .join('\n');

    // Create and download file with BOM for Excel
    const BOM = '\uFEFF';  // UTF-8 BOM for Excel
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `siparisler-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Yönetici Paneli</h2>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            <Download size={20} />
            Siparişleri İndir
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Ürünler</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus size={20} />
              Yeni Ürün Ekle
            </button>
          </div>

          {showAddForm && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <AddProductForm onComplete={() => setShowAddForm(false)} />
            </div>
          )}

          <ProductList />
        </div>
      </div>
    </div>
  );
}