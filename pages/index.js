import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMoralis } from 'react-moralis'
import divWithClassName from 'react-bootstrap/divWithClassName';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

export default function Home() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className='px-3 mt-5'>
        <CenteredDiv>
          <Button variant='dark' onClick={() => authenticate({signingMessage: 'metamask login'})}>Login to your Metamask wallet to start.</Button>
        </CenteredDiv>
      </div>
    )
  } else {
    return (
      <div className='px-3 mt-5'>
        <CenteredDiv>
        <h2>Welcome, {user.attributes.ethAddress}!</h2>
          <div className='mt-1'>
            <Button variant='dark' onClick={() => router.push('/quiz')}>Let&apos;s start the quiz!</Button>
          </div>
          <div className='mt-1'>
            <Button variant='dark' onClick={() => logout()}>Logout</Button>
          </div>
        </CenteredDiv>
      </div>
    )
  }
}

const CenteredDiv = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
`;
