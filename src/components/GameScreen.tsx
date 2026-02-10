import type { Repo, Commit } from '../lib/types'

interface GameScreenProps {
  repo: Repo
  commits: Commit[]
  currentIndex: number
  onBack: () => void
  onPrevious: () => void
  onNext: () => void
}

export function GameScreen({ repo, commits, currentIndex, onBack, onPrevious, onNext }: GameScreenProps) {
  if (commits.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4 text-[#c9d1d9] font-mono">Loading commits from {repo.name}...</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-[#a371f7] text-white font-mono rounded border border-[#a371f7] hover:bg-[#8b5cf6] hover:shadow-[0_0_15px_#a371f7] transition-all"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  const currentCommit = commits[currentIndex]
  const progress = ((currentIndex + 1) / commits.length) * 100

  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      {/* Retro Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(163, 113, 247, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(163, 113, 247, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 text-[#c9d1d9] font-mono hover:text-[#a371f7] transition-colors flex items-center gap-2"
        >
          <span className="text-[#a371f7]">←</span> Back to repos
        </button>

        {/* Main Game Card */}
        <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-6 border border-[rgba(163,113,247,0.3)] backdrop-blur-sm">
          {/* Header with neon glow */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#c9d1d9] font-mono text-shadow-purple">
              {repo.full_name}
            </h2>
            <span className="text-[#a371f7] font-mono text-sm">
              COMMIT {currentIndex + 1}<span className="text-[#2ea043]">/</span>{commits.length}
            </span>
          </div>

          {/* Retro Progress Bar */}
          <div className="relative mb-6">
            <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-3 border border-[rgba(163,113,247,0.3)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#a371f7] to-[#2ea043] rounded-full transition-all duration-300 shadow-[0_0_10px_#a371f7]"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Progress markers */}
            <div className="flex justify-between mt-1">
              {[...Array(Math.min(commits.length, 10))].map((_, i) => (
                <div 
                  key={i}
                  className={`w-1 h-1 rounded-full transition-all ${
                    i <= currentIndex ? 'bg-[#2ea043]' : 'bg-[rgba(255,255,255,0.2)]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Commit Message Panel */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#a371f7] font-mono mb-2 uppercase tracking-wider">
              {'>'} Commit Message
            </h3>
            <p className="text-[#c9d1d9] font-mono text-sm bg-[rgba(0,0,0,0.3)] p-4 rounded-lg border-l-2 border-[#a371f7]">
              {currentCommit.message}
            </p>
            <p className="text-[rgba(201,209,217,0.6)] text-xs mt-2 font-mono">
              <span className="text-[#2ea043]">@</span> {currentCommit.author.name} • {new Date(currentCommit.author.date).toLocaleDateString()}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className={`flex-1 py-3 px-4 font-mono text-sm font-bold rounded border transition-all ${
                currentIndex === 0
                  ? 'border-[rgba(255,255,255,0.1)] text-[rgba(201,209,217,0.3)] cursor-not-allowed bg-[rgba(255,255,255,0.02)]'
                  : 'border-[#a371f7] text-[#c9d1d9] bg-[rgba(163,113,247,0.1)] hover:bg-[rgba(163,113,247,0.2)] hover:shadow-[0_0_15px_rgba(163,113,247,0.4)] active:scale-[0.98]'
              }`}
            >
              ◄ PREVIOUS
            </button>
            <button
              onClick={onNext}
              disabled={currentIndex === commits.length - 1}
              className={`flex-1 py-3 px-4 font-mono text-sm font-bold rounded border transition-all ${
                currentIndex === commits.length - 1
                  ? 'border-[rgba(255,255,255,0.1)] text-[rgba(201,209,217,0.3)] cursor-not-allowed bg-[rgba(255,255,255,0.02)]'
                  : 'border-[#2ea043] text-[#c9d1d9] bg-[rgba(46,160,67,0.1)] hover:bg-[rgba(46,160,67,0.2)] hover:shadow-[0_0_15px_rgba(46,160,67,0.4)] active:scale-[0.98]'
              }`}
            >
              NEXT ►
            </button>
          </div>

          {/* Game Action Area */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#a371f7] font-mono mb-3 uppercase tracking-wider">
              {'>'} What happened here?
            </h3>
            {/* TODO: Render choices from local LLM */}
            <button className="w-full p-4 bg-[rgba(163,113,247,0.1)] rounded-lg hover:bg-[rgba(163,113,247,0.2)] transition-all text-left border border-[rgba(163,113,247,0.3)] hover:border-[#a371f7] font-mono text-sm text-[#c9d1d9] hover:shadow-[0_0_10px_rgba(163,113,247,0.3)]">
              <span className="text-[#a371f7]">▸</span> Loading choices from local model...
            </button>
          </div>
        </div>

        {/* Terminal-style footer */}
        <div className="mt-6 text-center">
          <p className="text-[rgba(201,209,217,0.4)] font-mono text-xs">
            <span className="text-[#2ea043]">●</span> READY FOR NEXT COMMAND
          </p>
        </div>
      </div>

      {/* CSS for glow effects */}
      <style>{`
        .text-shadow-purple {
          text-shadow: 0 0 10px rgba(163, 113, 247, 0.5);
        }
      `}</style>
    </div>
  )
}