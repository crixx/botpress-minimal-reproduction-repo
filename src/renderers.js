const _ = require('lodash');

module.exports = {
    text: data => {
        return {
            text: data.text,
            typing: !!data.typing
        }
    },

    'trivia-question': data => ({
        text: data.question,
        quick_replies: data.choices.map(choice => `<${choice.payload}> ${choice.text}`),
        typing: data.typing || '2s'
    }),
    '#translated_text': data => {
        const language = data.state.language || 'EN';
        return [
            {
                typing: true,
                markdown: true,
                text: data[`text${language}`],
                'web-style': {direction: language === 'AR' ? 'rtl' : 'ltr'}
            }
        ]
    },
    '#sg_text': data => {
        const language = data.state.language || 'EN';
        return [
        {
            // on: '*',
            text: _.sample([data[`text${language}`], ...(data[`variations${language}`] || [])]),
            typing: data.typing,
            markdown: true // Webchat only
        }
    ]}
};
