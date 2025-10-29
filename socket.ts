import next from "next";
import { Server } from "socket.io";
import connect from "./src/utils/db.js";
import { createServer } from "node:http";
import { getToken } from "next-auth/jwt";
import Inbox from "./src/models/Inbox.js";
import Project from "./src/models/Project.js";

type Msg = {
  _id: string;
  sent: boolean;
  read: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "4000", 10); // your socket server port

// Initialize Next.js app (if you want it to coexist with your Next app)
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  await connect(); // connect to MongoDB before starting sockets

  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.development || "http://localhost:3000",
        process.env.production || "https://cod-en-ywpx.vercel.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    console.log("Socket connected:", socket.id);

    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const token = await getToken({
        req: { headers: { cookie: cookieHeader } } as any,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        console.warn("Unauthorized socket attempt");
        socket.disconnect(true);
        return;
      }

      const userId = token.id;
      const role = token.role || "user";
      const isAdmin = role === "admin";

      const projects = await Project.find(isAdmin ? {} : { userId }).select("_id");
      projects.forEach((p) => socket.join(`project:${p._id}`));

      const inboxes = await Inbox.find({
        projectId: { $in: projects.map((p) => p._id) },
      }).select("_id");
      inboxes.forEach((i) => socket.join(`inbox:${i._id}`));

      socket.on("send-message", async ({ inboxId, message }) => {
        const inbox = await Inbox.findById(inboxId);
        if (!inbox) return;
        inbox.messages.push(message);
        await inbox.save();
        io.to(`inbox:${inboxId}`).emit("new-message", { ...message, inboxId });
      });

      socket.on("read-message", async ({ inboxId }) => {
        const inbox = await Inbox.findById(inboxId);
        if (!inbox) return;

        await Inbox.findByIdAndUpdate(inboxId, {
          messages: inbox.messages.map((msg: Msg) =>
            token.id === inbox.userId
              ? !msg.sent
                ? { ...msg, read: true }
                : msg
              : isAdmin && msg.sent
              ? { ...msg, read: true }
              : msg
          ),
        });

        io.to(`inbox:${inboxId}`).emit("messages-read", { inboxId });
      });

      socket.on("update-project", async ({ projectId, update }) => {
        const project = await Project.findByIdAndUpdate(projectId, update, { new: true });
        if (project) io.to(`project:${projectId}`).emit("project-updated", project);
      });
    } catch (err) {
      console.error("Socket error:", err);
      socket.disconnect(true);
    }
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Socket server running on http://${hostname}:${port}`);
  });
});
