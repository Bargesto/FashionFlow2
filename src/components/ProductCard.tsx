import { useState } from 'react';
import toast from 'react-hot-toast';
import { Product, Order } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [instagramUsername, setInstagramUsername] = useState('');

  const sizes = Object.entries(product.stock);

  const handleOrder = () => {
    if (!selectedSize) {
      toast.error('Lütfen bir beden seçin');
      return;
    }
    if (!instagramUsername) {
      toast.error('Lütfen Instagram kullanıcı adınızı girin');
      return;
    }

    const currentStock = product.stock[selectedSize];
    if (currentStock <= 0) {
      toast.error('Bu beden tükendi');
      return;
    }

    // Update stock
    product.stock[selectedSize]--;

    // Create order
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      size: selectedSize,
      instagramUsername,
      timestamp: Date.now()
    };

    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('products', JSON.stringify(
      JSON.parse(localStorage.getItem('products') || '[]').map((p: Product) =>
        p.id === product.id ? product : p
      )
    ));

    toast.success('Sipariş başarıyla oluşturuldu!');
    setSelectedSize('');
    setInstagramUsername('');
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{product.name}</h3>
          <span className="text-lg font-bold text-blue-600">{product.price} TL</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {sizes.map(([size, stock]) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              disabled={stock <= 0}
              className={`
                py-1 px-2 rounded text-sm font-medium
                ${selectedSize === size 
                  ? 'bg-blue-500 text-white' 
                  : stock > 0 
                    ? 'bg-gray-100 hover:bg-gray-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {size} ({stock})
            </button>
          ))}
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={instagramUsername}
            onChange={(e) => setInstagramUsername(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Instagram kullanıcı adı"
          />
        </div>

        <button
          onClick={handleOrder}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded font-medium hover:bg-blue-600 transition-colors"
        >
          Sipariş Ver
        </button>
      </div>
    </div>
  );
}