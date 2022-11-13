require('dotenv').config();

const Moralis = require('moralis-v1/node');
const { parseJSON } = require('./jsonParser');

const getQuiz = async () => {
    try {
        await Moralis.start({
            appId: process.env.MORALIS_APPID,
            serverUrl: process.env.MORALIS_SERVERURL,
            masterKey: process.env.MORALIS_MASTERKEY,
        });

        const QuizData = new Moralis.Query('RealmHunterQuizBot');
        const quizData = await QuizData.find({useMasterKey: true});
    
        if (!QuizData) {
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
        
        console.log(questionDatas);
        return questionDatas;
    } catch (err) {
        throw err;
    }
}

getQuiz();

module.exports = {
    getQuiz
}