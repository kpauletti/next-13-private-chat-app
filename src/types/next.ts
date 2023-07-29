import { Server as NetServer, Socket } from "net";
import { NextApiResponse, NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";

type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};


export type NextApiHandlerExtended = (req: NextApiRequest, res: NextApiResponseServerIO) => void | Promise<void>;