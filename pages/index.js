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
  const { authenticate, isAuthenticated, user } = useMoralis();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return (
        <CenteredDiv>
          <Button variant='dark' onClick={() => {
            authenticate({signingMessage: 'metamask login'});
            router.push('/start');
          }}>Login to your Metamask wallet to start.</Button>
        </CenteredDiv>
    )
  } else {
    router.push('/start');
  }
}