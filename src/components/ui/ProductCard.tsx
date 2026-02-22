import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <Link to={`/shop/${product.slug}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden rounded-sm bg-sage/5">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sage/30 font-body text-sm">
            No image
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="font-body text-xs tracking-wide text-sage/60 uppercase">
          {product.category?.name}
        </p>
        <h3 className="mt-1 font-display text-lg text-sage-dark group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-body text-sm text-sage-dark">${product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="font-body text-xs text-sage/40 line-through">
              ${product.compare_price!.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
