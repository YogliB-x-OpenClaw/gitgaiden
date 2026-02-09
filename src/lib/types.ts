export interface Repo {
  id: number
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  html_url: string
  owner: {
    login: string
    avatar_url: string
  }
}

export interface Commit {
  sha: string
  message: string
  author: {
    name: string
    date: string
  }
  choices?: StoryChoice[]
}

export interface StoryChoice {
  id: string
  text: string
  isCorrect: boolean
}

export interface GameState {
  score: number
  streak: number
  currentStory: string
}