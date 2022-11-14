import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMoralis } from 'react-moralis'
import divWithClassName from 'react-bootstrap/divWithClassName';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { CenteredDiv } from '../components/Div/CustomDivs';
import Row from 'react-bootstrap/Row';

export default function Home() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
        <CenteredDiv>
          <Button variant='dark' onClick={() => authenticate({signingMessage: 'metamask login'})}>Login to your Metamask wallet to start.</Button>
        </CenteredDiv>
    )
  } else {
    return (
      <CenteredDiv>
      <h2>Welcome, {user.attributes.ethAddress}!</h2>
        <div className='mt-1'>
          <Button variant='dark' onClick={() => router.push('/quiz')}>Let&apos;s start the quiz!</Button>
        </div>
        <div className='mt-1'>
          <Button variant='dark' onClick={() => logout()}>Logout</Button>
        </div>
      </CenteredDiv>
    )
  }
}