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
    setCurrentCommitIndex(0)

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

  const handlePrevious = () => {
    if (currentCommitIndex > 0) {
      setCurrentCommitIndex(prev => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentCommitIndex < commits.length - 1) {
      setCurrentCommitIndex(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Retro header */}
      <header className="p-6 text-center border-b border-[rgba(163,113,247,0.2)] bg-[rgba(0,0,0,0.2)]">
        <h1 className="text-4xl font-bold font-mono text-shadow-purple bg-gradient-to-r from-[#a371f7] to-[#2ea043] bg-clip-text text-transparent">
          GitGaiden <span className="text-[#c9d1d9] text-2xl">🎮</span>
        </h1>
        <p className="text-[rgba(201,209,217,0.6)] mt-2 font-mono text-sm">
          {'>'} Experience Git history as a story
        </p>
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
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}
      </main>

      {/* Scanline effect overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1px) 1px, transparent 1px)',
          backgroundSize: '100% 3px'
        }}
      />

      {/* CSS for glow effects */}
      <style>{`
        .text-shadow-purple {
          text-shadow: 0 0 10px rgba(163, 113, 247, 0.5);
        }
      `}</style>
    </div>
  )
}

export default App