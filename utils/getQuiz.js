require('dotenv').config();

const Moralis = require('moralis-v1/node');
const { parseJSON } = require('./jsonParser');

const getQuiz = async () => {
    try {
        await Moralis.start({
            appId: process.env.NEXT_PUBLIC_MORALIS_APPID,
            serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVERURL,
            masterKey: process.env.NEXT_PUBLIC_MORALIS_MASTERKEY,
        });

        const QuizData = new Moralis.Query('RealmHunterQuizBot');
        const quizData = await QuizData.find({useMasterKey: true});
    
        if (quizData.length === 0 || !quizData) {
            throw new Error('No quiz data found');
        }

        const result = parseJSON(quizData);
    
        // an array of question data objects which include the question, answer(s) and other important data
        const questionDatas = [];

        result.forEach((questionItem) => {
            const questionData = {
                questionId: questionItem.questionId,
                question: questionItem.question,
                answers: questionItem.answers,
                correctAnswers: questionItem.correctAnswers,
                minimumPoints: questionItem.minimumPoints,
                maximumPoints: questionItem.maximumPoints,
                duration: questionItem.duration,
            }
    
            questionDatas.push(questionData);
        });
        
        return questionDatas;
    } catch (err) {
        throw err;
    }
}

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

const getUserStats = async (address) => {
    try {
        await Moralis.start({
            appId: process.env.NEXT_PUBLIC_MORALIS_APPID,
            serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVERURL,
            masterKey: process.env.NEXT_PUBLIC_MORALIS_MASTERKEY,
        });

        const AddressStats = new Moralis.Query('RHQuizLeaderboard');
        AddressStats.equalTo('address', address);

        const result = await AddressStats.first({useMasterKey: true});

        if (!result) {
            return {
                quizzesPlayed: 0,
                allQuizStats: []
            }
        }

        const parsedResult = parseJSON(result);

        const quizzesPlayed = parsedResult['quizzesPlayed'] ? parsedResult['quizzesPlayed'] : 0;
        const allQuizStats = parsedResult['allQuizStats'] ? parsedResult['allQuizStats'] : [];

        return {
            quizzesPlayed: quizzesPlayed,
            allQuizStats: allQuizStats
        }
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getQuiz,
    uploadQuizStats,
    getUserStats
}