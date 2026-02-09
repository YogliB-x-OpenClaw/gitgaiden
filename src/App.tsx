import { useState } from 'react'
import { RepoSelector } from './components/RepoSelector'
import { GameScreen } from './components/GameScreen'
import type { Repo, Commit } from './lib/types'

function App() {
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null)
  const [commits, setCommits] = useState<Commit[]>([])
  const [currentCommitIndex, setCurrentCommitIndex] = useState(0)

  const handleRepoSelect = async (repo: Repo) => {
    setSelectedRepo(repo)
    setCommits([])

    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/commits?per_page=10`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch commits')
      }
      const data = await response.json()
      
      const commitsData: Commit[] = data.map((commit: any) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          date: commit.commit.author.date
        }
      }))
      
      setCommits(commitsData)
    } catch (error) {
      console.error('Error fetching commits:', error)
      setCommits([])
    }
  }

  const handleBack = () => {
    setSelectedRepo(null)
    setCommits([])
    setCurrentCommitIndex(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          GitGaiden 🎮
        </h1>
        <p className="text-gray-400 mt-2">Experience Git history as a story</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedRepo ? (
          <RepoSelector onSelect={handleRepoSelect} />
        ) : (
          <GameScreen
            repo={selectedRepo}
            commits={commits}
            currentIndex={currentCommitIndex}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  )
}

export default App