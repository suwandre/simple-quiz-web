import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMoralis } from 'react-moralis'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate({signingMessage: 'metamask login', chainId: 97})}>Login to your wallet.</button>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Welcome {user.getUsername}</h2>
        <button onClick={() => logout()}>Log out</button>
      </div>
    )
  }
  
}
