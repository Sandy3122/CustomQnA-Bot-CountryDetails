const { getCQAAnswer } = require('./kB');

const Decider = async (question) => {
    try {
        const [cqaResponse] = await Promise.allSettled([
            getCQAAnswer(question)
        ]);
        console.log(cqaResponse.value)

        if (cqaResponse && cqaResponse.status === "fulfilled") {
            const qnaScore = cqaResponse.value.answers[0]?.confidenceScore;
            console.log("QnA Score : ", qnaScore);

            if (qnaScore !== undefined) {
                console.log("cqa");
                return {
                    status: true,
                    flow: "cqa",
                    answer: cqaResponse.value.answers[0]?.answer
                };
            }
        } else {
            console.log('No valid QnA Maker response or status found.');
        }
    } catch (err) {
        console.log('Error in Decider:', err);
        // Handle any errors that might occur during the process.
        return {
            status: false,
            error: err.message
        };
    }
};
// Decider("Can I apply to multiple colleges at once?")
module.exports.Decider = Decider;


/* The ?. is known as the optional chaining operator. It's used to access properties of an object, 
but it guards against cases where the property might be undefined. 
In this case, it's used to access the confidenceScore property of the first answer. 
If the first answer does not have a confidenceScore property, it will not throw an error but instead return undefined.
*/