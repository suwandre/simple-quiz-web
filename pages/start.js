import { CenteredDiv } from "../components/Div/CustomDivs";
import Button from "react-bootstrap/Button";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Moralis } from "moralis-v1";

const Start = () => {
    const [userStats, setUserStats] = useState({});
    const [bestGame, setBestGame] = useState({});
    const { isAuthenticated, user } = useMoralis();
    const router = useRouter();
    if (!isAuthenticated || !user) () => router.replace('/');

    const getUserStats = async () => {
      await Moralis.start({
        appId: process.env.NEXT_PUBLIC_MORALIS_APPID,
        serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVERURL,
        masterKey: process.env.NEXT_PUBLIC_MORALIS_MASTERKEY,
      });

      const AddressStats = new Moralis.Query('RHQuizLeaderboard');
      AddressStats.equalTo('address', user && user.attributes.ethAddress);

      const result = await AddressStats.first({useMasterKey: true});

      if (!result) {
        return {
          quizzesPlayed: 0,
          allQuizStats: 0
        }
      }

      const parsedResult = JSON.parse(JSON.stringify(result));
      const quizzesPlayed = parsedResult['quizzesPlayed'] ? parsedResult['quizzesPlayed'] : 0;
      const allQuizStats = parsedResult['allQuizStats'] ? parsedResult['allQuizStats'] : [];

      setUserStats({quizzesPlayed: quizzesPlayed, allQuizStats: allQuizStats});
    }

    const getBestGame = async () => {
      const game = userStats['allQuizStats'] && userStats['allQuizStats'].length > 0 ? userStats['allQuizStats'].reduce((prev, current) => (prev['score'] > current['score']) ? prev : current) : {};
      setBestGame(game);
    }

    useEffect(() => {
      getUserStats();
    }, [])

    useEffect(() => {
      getBestGame();
    }, [userStats])

    return (
        <CenteredDiv>
        <h2>Welcome, {user && user.attributes.ethAddress}!</h2>
        <div className='mb-4'></div>
        <h3>Your recent most stats</h3>
        <h5>Games played: {userStats['quizzesPlayed'] ? userStats['quizzesPlayed'] : 0}</h5>
        <h5>Best game:</h5>
        <h6>Correct choices: {bestGame['correctChoices'] ? bestGame['correctChoices'] : '-'}</h6>
        <h6>Wrong choices: {bestGame['wrongChoices'] ? bestGame['wrongChoices'] : '-'}</h6>
        <h6>Points: {bestGame['points'] ? bestGame['points'] : '-'}</h6>
          <div className='mt-5'>
            <Button variant='dark' onClick={() => router.push('/quiz')}>Let&apos;s get started!</Button>
          </div>
          <div className='mt-1'>
            <Button variant='dark' onClick={() => logout()}>Logout</Button>
          </div>
        </CenteredDiv>
    )
}

// const GetUserStats = ({address}) => {
//   const [ stats, setStats ] = useState(null);
//   const userStats = async () => {
//     setStats('hello!');
//   }

//   return (
//     <h2>{stats} and {address}</h2>
//   )
// }

// export const getServerSideProps = async () => {
//   const stats = 
// }

export default Start;