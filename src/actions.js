const _ = require('lodash');
module.exports = {
    startGame: state => {
        return {
            ...state, // we clone the existing state
            count: 0, // we then reset the number of questions asked to `0`
            score: 0 // and we reset the score to `0`
        }
    },

    sendRandomQuestion: async (state, event) => {
        // The `-random()` extension picks a random element in all the `trivia` Content Type
        // We also retrieve the message we just sent, notice that `event.reply` is asynchronous, so we need to `await` it
        const messageSent = await event.reply('#!trivia-random()');
        // We find the good answer
        const goodAnswer = _.find(messageSent.context.choices, {
            payload: 'TRIVIA_GOOD'
        });

        return {
            ...state, // We clone the state
            isCorrect: null, // We reset `isCorrect` (optional)
            count: state.count + 1, // We increase the number of questions we asked so far
            goodAnswer // We store the goodAnswer in the state, so that we can match the user's response against it
        }
    },

    sendIntroQuestion: async (state, event) => {
        // We also retrieve the message we just sent, notice that `event.reply` is asynchronous, so we need to `await` it
        const messageSent = await event.reply('#!intro-question');

        // We find the good answer
        const goodAnswer = _.find(messageSent.context.choices, {
            payload: 'TRIVIA_GOOD'
        });

        return {
            ...state, // We clone the state
            isCorrect: null, // We reset `isCorrect` (optional)
            count: state.count + 1, // We increase the number of questions we asked so far
            goodAnswer // We store the goodAnswer in the state, so that we can match the user's response against it
        }
    },

    render: async (state, event, args) => {
        if (!args.renderer) {
            throw new Error('Missing "renderer"')
        }

        await event.reply(args.renderer, args)
    },

    validateAnswer: (state, event) => {
        const isCorrect = state.goodAnswer && event.text === state.goodAnswer.text;
        return {
            ...state,
            isCorrect,
            score: isCorrect ? state.score + 1 : state.score
        }
    },

    jumpToFlow: async (state, event) => {
        try {
            const flowId = state.nextHint+".flow.json";
            event.bp.logger.debug("Custom Action (getNextHint): got flowId", flowId);
            // this is not working yet
            const stateId = event.sessionId || event.user.id;
            await event.bp.dialogEngine.jumpTo(stateId, flowId, null, {resetState: true});
            await event.bp.dialogEngine.processMessage(stateId, event); // Continue processing
        } catch (e) {
            event.bp.logger.error(e);
            await event.reply('#builtin_text', {text: `Failed to fetch data. Is the rules-engine running?`})
        }
    }
};
