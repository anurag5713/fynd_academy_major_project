import { io } from 'socket.io-client';
const URL="https://codematebackend.onrender.com"

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(URL, options);
};
