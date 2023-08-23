const { Decider } = require('./decider');
const { ActivityHandler } = require('botbuilder');
const { DialogSet, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');


class QnABot extends ActivityHandler {
    constructor(conversationState) {
        super();
        this.dialogState = conversationState.createProperty('dialogState');
        this.dialogs = new DialogSet(this.dialogState);

        const textPrompt = new TextPrompt('textPrompt')
        const location = new TextPrompt('location')

        this.dialogs.add(textPrompt);
        this.dialogs.add(textPrompt);
        this.dialogs.add(location)

        this.dialogs.add(new WaterfallDialog('waterFall', [
            this.step1.bind(this),
            this.step2.bind(this)
        ]))

        this.dialogs.add(new WaterfallDialog('waterFall2', [

            this.step3.bind(this),
            this.step2.bind(this)
        ]))
        this.onMessage(async (context, next) => {
            const dc = await this.dialogs.createContext(context)
            if (!context.responded) {
                // If the bot hasn't responded to the user yet, check if there's an active dialog
                if (!dc.activeDialog) {
                    if (context.activity.text.toLowerCase() === 'hello') {
                        // Begin the waterfallDialog
                        await dc.beginDialog('waterFall');
                    }
                    if (context.activity.text.toLowerCase() === 'hi') {
                        // Begin the waterfallDialog
                        await dc.beginDialog('waterFall');
                    }
                    else {
                        await context.sendActivity("Sorry, I didn't understand that.");
                    }
                } else {
                    // Continue the active dialog if there is one
                    await dc.continueDialog();
                }
            }

            await conversationState.saveChanges(context);
            await next();
        })
    }
    async step1(step) {
        console.log('step1- WaterFall-1')
        await step.context.sendActivity("Hello, I'm your CoutryDetailsBot!")
        await step.context.sendActivity("Provide me the name of any country, and I'll give you all the information.")
        // return step.beginDialog('waterFall2')
    }
    async step2(step) {
        console.log('step2 WaterFall-1')
        let activity = step.context.activity.text;
        const analyze = await Decider(activity);
        // if (analyze.status == true) {
        console.log("CQnA", analyze.answer)
        await step.context.sendActivity(analyze.answer)
        return await step.beginDialog('waterFall2')
    }

    async step3(step) {
        console.log('step3- WaterFall-2')
        await step.context.sendActivity("Provide me the name of any country, and I'll give you all the information.")
        // return step.beginDialog('waterFall2')
    }
}


module.exports.QnABot = QnABot;

