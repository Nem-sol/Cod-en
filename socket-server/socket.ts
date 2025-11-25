import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { Msg } from "@/types.js"
import { Server } from "socket.io"
import { createServer } from "node:http"
import User from "@/src/models/User.jsx"
import connect from "../src/utils/db.js"
import Inbox from "../src/models/Inbox.js"
import sendMail from "@/src/utils/mailer.js"
import Message from "@/src/models/Message.js"
import Project from "../src/models/Project.js"

dotenv.config()

const url = process.env.NEXTAUTH_URL || ""
const hostname = process.env.HOSTNAME || "localhost"
const port = parseInt(process.env.PORT || "4000", 10)

const app = async () => {
  await connect()

  const httpServer = createServer()
  const io = new Server(httpServer, {
    cors: {
      origin: [ url || ""],
      credentials: true,
    },
  })

  io.on("connection", async (socket) => {
    try {
      console.log("Socket connected:", socket.id)

      const token = socket.handshake.auth
      const user = await User.findById(token.id)
      if (!token || !token.id || !user) {
        console.warn("Unauthorized socket attempt")
        return socket.disconnect(true)
      }

      const userId = token.id
      const isAdmin = user.role === "admin" || false

      const userProjects = await Project.find(isAdmin ? {} : { userId }).select("_id")
      const userInboxes = await Inbox.find({
        projectId: { $in: userProjects.map((p) => p._id) },
      }).select("_id userId")

      userProjects.forEach((p) => socket.join(`project:${p._id}`))
      userInboxes.forEach((i) => socket.join(`inbox:${i._id}`))

      if (isAdmin) socket.join('admin')

      socket.on("send-message", async ({ inboxId, msg, type = "message" }) => {
        try {
          if (!inboxId || !msg) return socket.emit("message-error", { message: "Invalid message data" })

          if (!socket.rooms.has(`inbox:${inboxId}`))
            return socket.emit("message-error", { message: "Unauthorized inbox" })

          const inbox = await Inbox.findById(inboxId)
          if (!inbox) return socket.emit("message-error", { message: "Inbox not found" })

          const sent = userId === String(inbox.userId)

          inbox.messages.push({
            type,
            sent,
            read: false,
            content: msg,
          })

          await inbox.save()
          io.to(`inbox:${inboxId}`).emit("new-message", inbox)
        } catch {
          socket.emit("message-error", { message: "Failed to send message" })
        }
      })

      socket.on("read-message", async (inboxId) => {
        try {
          if (!socket.rooms.has(`inbox:${inboxId}`))
            return socket.emit("message-error", { message: "Unauthorized inbox" })

          const inbox = await Inbox.findById(inboxId)
          if (!inbox) return
          const me = userId === String(inbox.userId)

          inbox.messages = inbox.messages.map((m: Msg) => {
            if (me && !m.sent) return { ...m, read: true }
            else if (isAdmin && m.sent) return { ...m, read: true }
            return m
          })

          await inbox.save()
          io.to(`inbox:${inboxId}`).emit("messages-read", {inboxId , me })
        } catch {
          socket.emit("message-error", { message: "Failed to mark messages as read" })
        }
      })

      socket.on("create-project", async (project) => {
        try {
          const existsByName = await Project.findOne({ name: project.name })
          if (user.role === 'admin') return socket.emit("project-error", {message: "You are not allowed to create projects"})

          if (existsByName)
            return socket.emit("project-error", { message: "Project name already exists" })

          const similar = await Project.find({
            url: project.url,
            type: project.type,
            class: project.class,
            about: project.about,
            sector: project.sector,
            service: project.service,
            concept: project.concept,
            langFrom: project.langFrom,
            provider: project.provider,
          })

          if (similar.length > 0 && project.service !== "upgrade")
            return socket.emit("project-error", { message: "Very similar project already exists" })

          const newProject = await Project.create({
            userId,
            ...project,
            reason: "Cod-en is setting up project process and costs based on submitted details",
          })

          await sendMail({
            to: user.email,
            text: `New project created by ${user.name}`,
            subject : 'New project created successfuly',
            link: {cap: 'You can view your project on your project page. ', address: `/project/${newProject._id}`, title: 'View now.'},
            messages: [
              `We are glad to let you know that your latest project ${newProject.name} has been created successfully.`,
              `A dedicated inbox, ${newProject.name} inbox, has been been made for this project for in-app expression of project functionaity, performance and features`,
              'Cod-en is currently completing the set-up process and your project will be fully set within the next five business days.',
              'Thanks for choosing Cod-en.'
            ],
          })

          const newInbox = await Inbox.create({
            userId,
            projectId: newProject._id,
            status: "active",
            title: `${newProject.name} inbox`,
            messages: userInboxes.length < 1 ? [
              { sent: false, read: false, content: "Welcome to In-app chatting." },
              {
                sent: false,
                read: false,
                content:
                  "We will be transferring informations on your project details, progress, enquiries and other related relevant information.",
              },
              {
                sent: false,
                read: false,
                content: "Messages unrelated to your project may be ignored.",
              },
            ] : []
          })

          socket.join(`project:${newProject._id}`)
          socket.join(`inbox:${newInbox._id}`)

          socket.emit("inbox-created", newInbox)
          socket.emit("project-created", newProject)
        } catch (err) {
          console.log(err)
          socket.emit("project-error", { message: "Failed to create project" })
        }
      })

      socket.on("update-project", async ({ projectId, update }) => {
        try {
          if (!socket.rooms.has(`project:${projectId}`))
            return socket.emit("project-error", { message: "Unauthorized project" })

          const project = await Project.findByIdAndUpdate(projectId, update, { new: true })

          if (project) io.to(`project:${projectId}`).emit("project-updated", project)
        } catch {
          socket.emit("project-error", { message: "Failed to update project" })
        }
      })

      socket.on("mail-to-one", async({ msg , pass , id }) => {
        const isCorrect = await bcrypt.compare( pass , user.password )
        const contact = await Message.findById( id )

        if (!id) return socket.emit("failed-to-mail", { id , message: "Contact id should not be an empty string."})
          
        if (msg.find((m: string) => !m.trim())) return socket.emit("failed-to-mail", { id , message: "No empty messages allowed."})

        if (!contact || user.role !== "admin" ) return socket.emit("failed-to-mail", { id , message: "Contact message not found."})

        if (!isCorrect) return socket.emit("failed-to-mail", { id , message: "Incorrect pasword"})

        const sent = await sendMail({
          title: null,
          messages: [
            `Thank you for contacting Cod-en. We received your ${contact.type}`,
            ...msg,
          'The Cod-en Team.'],
          to: contact.email,
          text: `Cod-en reply to ${contact.name}'${contact.name.endsWith('s') ? "" : "s"} ${contact.type}`,
          subject: `Reply to ${contact.name}'${contact.name.endsWith('s') ? "" : "s"} ${contact.type}`,
          link: {
            address: `${url}/contact`,
            title: "Cod-en support page",
            cap: "For more support, visit ", 
          }
        })
        
        if (!sent ) return socket.emit("failed-to-mail", { id , message: "Could not send reply. Try again later"})
          
        contact.replies++
        await contact.save()
        socket.emit("mailed-to-one", { contact })
      })

      socket.on("mail", async({ messages , summary , subject , password , link }) => {
        const isCorrect = await bcrypt.compare( password , user.password )
          
        if (!summary?.trim()) return socket.emit("failed-to-mail", { message: "Summary should not be empty."})

        if (!subject?.trim()) return socket.emit("failed-to-mail", { message: "Subject should not be empty."})

        if ( !Array.isArray(messages) || messages?.length === 0 ) return socket.emit("failed-to-mail", { message: "Subject should not be empty."})

        if (messages.find((m: string) => !m.trim())) return socket.emit("failed-to-mail", { message: "No empty messages allowed."})

        if ( user.role !== "admin" ) return socket.emit("failed-to-mail", { message: "Contact message not found."})

        if (!isCorrect) return socket.emit("failed-to-mail", { message: "Incorrect pasword"})

        try {
          const users = await User.find({
            $or: [
              { role: "user" }, 
              { role: "worker" }
            ]
          }).select( "email" )

          if (!users.length) return socket.emit("failed-to-mail", { message: "No users available to mail." });
          
          for (const u of users) {
            await sendMail({
              subject,
              messages,
              title: null,
              to: u.email,
              text: summary,
              link: link || {
                address: `${url}/contact`,
                title: "Cod-en support page",
                cap: "For more support, visit ",
              }
            });
          }

          socket.emit("mailed-to-all")
        } catch (error) {
          socket.emit("failed-to-mail", { message: "Could not send reply. Try again later"})
        }
  
      })

      socket.on("send-contact", async ({ name , email , msg , type })=>{
        try{
          if (isAdmin) return socket.emit("contact-error", { message: 'Admin can only send reply messages' })
      
          if (!name.trim()) socket.emit("contact-error", {message: "Please submit message with a name entry."})
      
          else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) socket.emit("contact-error", { message: 'Please submit message with a valid email entry.' })
      
          else if (!type.trim()) socket.emit("contact-error",{ message: 'Please submit message with a type entry.'})
      
          if (!msg.trim()) socket.emit("contact-error", {message: 'Please submit a non-empty message.' })
      
          const message = await Message.create({ name , email , type , content: msg , isUser: true })
            
          socket.emit("contact-success", { message: `${type[0].toLocaleUpperCase()}${type.toLocaleLowerCase().slice(1)} sent successfully. Cod-en will get back to you shortly.`})

          io.to("admin").emit("new-contact", message )
        } catch (error) {
          socket.emit("contact-error", {message: 'Error occured in the process'})
        }
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id)
      })
    } catch (err) {
      console.error("Socket error:", err)
      socket.disconnect(true)
    }
  })

  httpServer.listen(port, () => {
    console.log(`Socket server running on http://${hostname}:${port}`)
  })
}

app()
