import { Product } from 'src/models/Product.entity';
import data from '@/utils/data';
import db from '@/utils/db';
import 'reflect-metadata';
import Layout from '@/components/Layout';
import ProductItem from '@/components/ProductItem';
import type { GetServerSideProps, NextPage } from 'next';
import { useContext } from 'react';
import { CartActionType, IProduct, Store } from '@/utils/store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Carousel } from 'flowbite-react';

import { useWeb3React } from "@web3-react/core";
import Account from "../components/Account";
import ChainMetadata from "../components/ChainMetadata"
import useEagerConnect from "../hooks/useEagerConnect";
// const LFT_TOKEN_ADDRESS = "0x4C6ce97175697394171EB13976A8a8bd08aE58Fc";
// import { Button, Card, ConfigProvider } from "antd";
// import { Breadcrumb, Layout, Menu, theme } from 'antd';
// import { Divider } from 'antd';
interface Props {
  products: any;
}

const Home: NextPage = ({ products }: Props) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x: any) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    console.log(await axios.get(`/api/products/${product._id}`));
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({
      type: CartActionType.CartAddItem,
      payload: { ...product, quantity },
    });

    toast.success('Product added to the cart');
  };

  return (
    <Layout>
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 py-4">
        <Carousel>
          <img
            src="/images/banner/cloth_banner_001.jpg"
            alt="Image by StockSnap from Pixabay "
            className="w-full"
          />
          <img
            src="/images/banner/cloth_banner_002.png"
            alt=""
            className="w-full"
          />
          <img
            src="/images/banner/cloth_banner_003.jpg"
            alt=""
            className="w-full"
          />
        </Carousel>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  await db.connection();
  const products = await db.AppDataSource.manager.find(Product);
  await db.disconnection();

  let tmp = JSON.stringify(products);

  return {
    props: {
      products: JSON.parse(tmp),
    },
  };
};

export default Home;
