require('dotenv').config();

const Moralis = require('moralis-v1/node');
const { parseJSON } = require('./jsonParser');

const uploadQuizStats = async (address, quizStats) => {
    try {
        await Moralis.start({
            appId: process.env.NEXT_PUBLIC_MORALIS_APPID,
            serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVERURL,
            masterKey: process.env.NEXT_PUBLIC_MORALIS_MASTERKEY,
        });

        const AddressStats = new Moralis.Query('RHQuizLeaderboard');
        AddressStats.equalTo('address', address);

        // check if the stats for this address is in the DB
        const addressStats = await AddressStats.first({useMasterKey: true});

        if (!addressStats) {
            const Stats = Moralis.Object.extend('RHQuizLeaderboard');
            const stats = new Stats();
            stats.set('address', address);
            stats.set('quizzesPlayed', 1);
            stats.set('allQuizStats', [quizStats]);

            await stats.save(null, {useMasterKey: true});
            return {
                status: 'OK'
            }
        }

        const parsedAddressStats = parseJSON(addressStats);

        const currentQuizzesPlayed = parsedAddressStats['quizzesPlayed'];
        addressStats.set('quizzesPlayed', currentQuizzesPlayed + 1);
        let currentAllQuizStats = parsedAddressStats['allQuizStats'];
        currentAllQuizStats.push(quizStats);
        addressStats.set('allQuizStats', currentAllQuizStats);

        await addressStats.save(null, {useMasterKey: true});

        return {
            status: 'OK'
        }
    } catch (err) {
        throw err;
    }
}