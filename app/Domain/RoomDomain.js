/**
 * Domains
 * 
*/
const UserDomain = use('App/Domain/UserDomain')
const MessageDomain = use('App/Domain/MessageDomain')

/**
 * DTO
 * 
*/
const DTOMessage = use('App/DTO/DTOMessage')

/**
 * Models
 * 
*/
const Room = use("App/Models/Room")

/**
 * General
 * 
*/
const SocketEvents = use('App/Enum/SocketEvents')

/**
 * Save the user current room and socket id
 *
 * @param {object} roomConnection
 * @param {string} roomCode
 * @param {integer} userId
*/
module.exports.join = async (roomConnection, roomCode, userId) => {

    const room = await Room.findOrCreate(
        { code: roomCode },
        { code: roomCode }
    )

    room.save();

    roomConnection.join(room.id);

    const user = await UserDomain.update(userId, {
        room_id: roomConnection.id(),
        socket_id: roomConnection.socketId
    });

    const lastMessages = await MessageDomain.getRoomLastMessages(roomConnection.id(), 10);

    roomConnection.emit(SocketEvents.SERVER_USER_JOINED_ROOM, {
        id: user.id,
        username: user.username,
        lastMessages
    });
}

/**
 * Disconnect user
 *
 * @param {object} roomConnection
*/
module.exports.disconnectUser = async (roomConnection) => {
    roomConnection.leave();

    let user = await UserDomain.getUserBySocketId(roomConnection.socketId);
    if (!user) return;

    const { id, username } = user;

    await UserDomain.update(user.id, {
        room_id: null,
        socket_id: null
    });

    roomConnection.emit(SocketEvents.SERVER_USER_LEAVED_ROOM, {
        id,
        username
    }, roomConnection.id);
}

/**
 * Set user as writing a message
 *
 * @param {object} roomConnection
*/
module.exports.userWritingMessage = async (roomConnection) => {
    let user = await UserDomain.getUserBySocketId(roomConnection.socketId);
    if (!user) return;

    const { id, username } = user;

    roomConnection.emit(SocketEvents.SERVER_USER_WRITING_MESSAGE, {
        id,
        username
    });
}


/**
 * Send a message to room
 *
 * @param {object} roomConnection
*/
module.exports.sendMessage = async (roomConnection, message, type, fileId) => {
    let user = await UserDomain.getUserBySocketId(roomConnection.socketId);
    if (!user) return;

    const { id } = user;

    const dtoMessage = await MessageDomain.create(id, roomConnection.id(), message, type, fileId);

    roomConnection.emit(SocketEvents.SERVER_USER_SEND_MESSAGE, dtoMessage);
}