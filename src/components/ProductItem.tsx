import Link from 'next/link';
import React from 'react';

interface Product {
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
}

type Props = {
  product?: Product;
  // addToCartHandler?: any;
};

const ProductItem = ({ product,
  // addToCartHandler
}: Props) => {
  return (
    <div className="card">
      <Link href={`/product/${product?.slug}`}>
        <a>
          <img
            src={product?.image}
            alt={product?.name}
            className="rounded shadow"
          />
        </a>
      </Link>

      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product?.slug}`}>
          <a>
            <h2 className="text-lg">{product?.name}</h2>
          </a>
        </Link>
        <p className="mb-2">Lost: {product?.category}</p>
        <p className="mb-2">Till: {product?.brand}</p>
        <p>{product?.price} Eth</p>
        {/* 
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button> */}
      </div>
    </div>
  );
};

export default ProductItem;
