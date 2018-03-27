/* global renderMessageBody:true */
import s from 'underscore.string';

renderMessageBody = function(msg) {
	msg.html = msg.msg;

	// if (s.trim(msg.html) !== '') {
	// 	msg.html = s.escapeHTML(msg.html);
	// }

	const message = RocketChat.callbacks.run('renderMessage', msg);
	// console.log('message', message);
	if (message.tokens && message.tokens.length > 0) {
		for (const {token, text} of message.tokens) {
			// console.log('token', token);
			// console.log('text', text);

			message.html = message.html.replace(token, () => text); // Uses lambda so doesn't need to escape $
		}
	}

	// console.log('msg.html', msg.html);
	return msg.html;
};

/* exported renderMessageBody */
