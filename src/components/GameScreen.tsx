import type { Repo, Commit } from '../lib/types'

interface GameScreenProps {
  repo: Repo
  commits: Commit[]
  currentIndex: number
  onBack: () => void
}

export function GameScreen({ repo, commits, currentIndex, onBack }: GameScreenProps) {
  if (commits.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl mb-4">Loading commits from {repo.name}...</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
    )
  }

  const currentCommit = commits[currentIndex]
  const progress = ((currentIndex + 1) / commits.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 text-gray-400 hover:text-white transition-colors"
      >
        ← Back to repos
      </button>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-purple-300">{repo.full_name}</h2>
          <span className="text-gray-400">
            {currentIndex + 1} / {commits.length}
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Commit Message:</h3>
          <p className="text-gray-300 font-mono text-sm bg-gray-900/50 p-3 rounded-lg">
            {currentCommit.message}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            by {currentCommit.author.name} • {new Date(currentCommit.author.date).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-purple-300">What happened here?</h3>
          {/* TODO: Render choices from local LLM */}
          <button className="w-full p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors text-left border border-gray-600 hover:border-purple-500">
            Loading choices from local model...
          </button>
        </div>
      </div>
    </div>
  )
}