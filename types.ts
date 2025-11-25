export type Msg = {
  _id: string;
  sent: boolean;
  read: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
};


export type Inboxes = {
  _id: string
  title: string
  status: string
  userId: string
  messages: Msg[]
  createdAt: string
  updatedAt: string
  projectId: string
  receiverId: string
}

type process = {
  _id: string
  title: string
  createdAt: string
  updatedAt: string
  phase: {
    type: string,
    completed: boolean
  }
}

export type Projects = {
  _id: string
  url: string
  rate: string
  type: string
  name: string
  price: number
  class: string
  about: string
  lang: string[]
  status: string
  sector: string
  userId: string
  service: string
  signed: boolean
  concept: string
  provider: string
  createdAt: string
  updatedAt: string
  langFrom: string[]
  process: process[]
  features: string[]
  ico: string | null
  link: string | null
  pages: string | null
  scale: string | null
  paymentLevel: number
  reason: string | null
}

export type Notes = {
  _id: string
  type: string
  link: string
  read: boolean
  class: string
  title: string
  target: string
  userId: string
  message: string
  createdAt: string
  updatedAt: string
  important: boolean
}

export type Histories = {
  _id: string
  type: string
  class: string
  title: string
  target: string
  status: string
  userId: string
  message: string
  createdAt: string
  updatedAt: string
}

export type Helps = {
  _id: string
  link: string
  slug: string
  title: string
  content: string
  related: string[]
  createdAt: string | null
  updatedAt: string | null
}

export type Message = {
  _id: string
  name: string
  type: string
  email: string
  replies: number
  content: string
  isUser: boolean
  createdAt: string | null
  updatedAt: string | null
}