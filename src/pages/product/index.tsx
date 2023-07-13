import Layout from '@/components/Layout';
import ProductItem from '@/components/ProductItem';
import { Product } from 'src/models/Product.entity';
import db from '@/utils/db';
import { CartActionType, Store } from '@/utils/store';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import React, { useContext, useReducer, useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { getError } from '@/utils/error'
import useLFTContract from "@/hooks/useLFTContract"
import useEagerConnect from "@/hooks/useEagerConnect"
import { Button } from "antd"
import type { Web3Provider } from "@ethersproject/providers"
// import { BrowserProvider, ethers, JsonRpcSigner } from 'ethers';
interface Props {
  products: any;
}

// LFT contract address
const LFT_TOKEN_ADDRESS = "0xbD3b3a6E98a63D846676D59523cbC0462dcF6153"
import useENSName from "@/hooks/useENSName";
import { useWeb3React } from "@web3-react/core";
import useMetaMaskOnboarding from "@/hooks/useMetaMaskOnboarding";
import { BigNumber, Signer } from 'ethers';
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      state;
  }
}
const ProductsPage: NextPage = ({ products }: Props) => {
  // const { state, dispatch } = useContext(Store);
  // const { cart } = state;
  const triedToEagerConnect = useEagerConnect();

  const { library: web3Lib, active, error: error_web3, activate, chainId, account, setError } =
    useWeb3React<Web3Provider>();
  // console.log('this is ', account)
  console.log('tried to eager connect', triedToEagerConnect);
  console.log('library', web3Lib);
  console.log('chainID', chainId);
  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error_web3) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error_web3, stopOnboarding]);

  const ENSName = useENSName(account);

  if (error_web3) {
    return null;
  }
  const contract = useLFTContract(LFT_TOKEN_ADDRESS);
  console.log('this is the contract', contract)
  const router = useRouter()
  const [
    { loading, error, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });
  // const addToCartHandler = async (product) => {
  //   const existItem = cart.cartItems.find((x: any) => x.slug === product.slug);
  //   const quantity = existItem ? existItem.quantity + 1 : 1;

  //   const { data } = await axios.get(`/api/products/${product._id}`);
  //   console.log(await axios.get(`/api/products/${product._id}`));
  //   if (data.countInStock < quantity) {
  //     return toast.error('Sorry. Product is out of stock');
  //   }
  //   dispatch({
  //     type: CartActionType.CartAddItem,
  //     payload: { ...product, quantity },
  //   });

  //   toast.success('Product added to the cart');
  // };

  const createHandler = async () => {
    if (!window.confirm('Are you sure to create?')) {
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Product created successfully');
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  console.log(contract)
  let CHAIN_OWNER_ADDRESS = "0x2C9107998F7eF7E0bd063BC9ed60A28f9bb975Ca"
  console.log(process.env.LFT_TOKEN_ADDRESS)
  const helloWorld = async () => {
    let name = await contract.helloWorld()
    // alert(name)
    alert('prepare to transfer ether and LFT')
    let accounts = await web3Lib.listAccounts();
    console.log('here are the accounts', accounts)
    let signer = web3Lib.getSigner(CHAIN_OWNER_ADDRESS)
    console.log('signer', signer)
    let bblance = await signer.getBalance()
    let transactionCount = await signer.getTransactionCount()
    console.log('bblance', bblance)
    console.log('trans count', transactionCount)
    let transaction = {
      'from': CHAIN_OWNER_ADDRESS,
      'to': '0xE148128852e7Ce18E623b81cea4dDAd7e44e49b2',
      // 'to': LFT_TOKEN_ADDRESS,
      'value': BigNumber.from("2000000000000000000"),
      'gasLimit': 1000000000,
      'maxPriorityFeePerGas': 3000000,
      'maxFeePerGas': 20000000,
      'nonce': transactionCount,
    }
    // let signedTransaction = await signer.signTransaction(transaction)
    let resultTT = await signer.sendTransaction(transaction)
    console.log(resultTT)
    // let result = await sendTransaction(transaction)
    // await web3Lib.sendTransaction(signedTransaction)
    let transferResult = await contract.transfer(
      // "0x5cBae6A65578b7C118963bf88f09e2149C3Cedfd",
      LFT_TOKEN_ADDRESS,
      BigNumber.from("2000000000000000000"))
    console.log(transferResult)
    let balance = await contract.balanceOf(CHAIN_OWNER_ADDRESS)
    console.log('balance', balance)
  }
  return (
    <Layout>
      <div className="flex h-40 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 ">
        <button
          disabled={loadingCreate}
          onClick={createHandler}
          className="primary-button"
        >
          {loadingCreate ? 'Loading' : 'Add new Bounty'}
        </button>
        <button
          disabled={loadingCreate}
          className="primary-button"
          onClick={helloWorld}>Trigger transfer</button>

        {/* {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
          // addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))} */}
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

export default ProductsPage;
