import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Repo, Commit } from "../lib/types"
import { cn } from "@/lib/utils"

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
          <Button
            onClick={onBack}
            variant="outline"
            className="border-[#a371f7] text-[#a371f7] hover:bg-[#a371f7] hover:text-white bg-transparent"
          >
            ← Back
          </Button>
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
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-[#c9d1d9] hover:text-[#a371f7] hover:bg-transparent font-mono"
        >
          <span className="text-[#a371f7]">←</span> Back to repos
        </Button>

        {/* Main Game Card */}
        <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(163,113,247,0.3)] backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between mb-0 pb-0">
            <CardTitle className="text-xl font-bold text-[#c9d1d9] font-mono text-shadow-purple">
              {repo.full_name}
            </CardTitle>
            <span className="text-[#a371f7] font-mono text-sm">
              COMMIT {currentIndex + 1}<span className="text-[#2ea043]">/</span>{commits.length}
            </span>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {/* Retro Progress Bar */}
            <div className="relative">
              <Progress value={progress} className="h-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(163,113,247,0.3)]" />
              {/* Progress markers */}
              <div className="flex justify-between mt-1">
                {[...Array(Math.min(commits.length, 10))].map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-1 h-1 rounded-full transition-all",
                      i <= currentIndex ? 'bg-[#2ea043]' : 'bg-[rgba(255,255,255,0.2)]'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Commit Message Panel */}
            <div className="space-y-2 animate-fade-in">
              <h3 className="text-sm font-bold text-[#a371f7] font-mono uppercase tracking-wider">
                {'>'} Commit Message
              </h3>
              <div className="bg-[rgba(0,0,0,0.3)] p-4 rounded-lg border-l-2 border-[#a371f7]">
                <p className="text-[#c9d1d9] font-mono text-sm">
                  {currentCommit.message}
                </p>
                <p className="text-[rgba(201,209,217,0.6)] text-xs mt-2 font-mono">
                  <span className="text-[#2ea043]">@</span> {currentCommit.author.name} • {new Date(currentCommit.author.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <Button
                onClick={onPrevious}
                disabled={currentIndex === 0}
                variant={currentIndex === 0 ? "outline" : "default"}
                className={cn(
                  "flex-1 py-4 sm:py-3 font-mono text-sm font-bold transition-all duration-200",
                  currentIndex === 0
                    ? "border-[rgba(255,255,255,0.1)] text-[rgba(201,209,217,0.3)] cursor-not-allowed bg-transparent"
                    : "border-[#a371f7] text-[#c9d1d9] bg-[rgba(163,113,247,0.1)] hover:bg-[rgba(163,113,247,0.2)] hover:shadow-[0_0_15px_rgba(163,113,247,0.4)] hover:scale-105"
                )}
              >
                ◄ PREVIOUS
              </Button>
              <Button
                onClick={onNext}
                disabled={currentIndex === commits.length - 1}
                variant={currentIndex === commits.length - 1 ? "outline" : "default"}
                className={cn(
                  "flex-1 py-4 sm:py-3 font-mono text-sm font-bold transition-all duration-200",
                  currentIndex === commits.length - 1
                    ? "border-[rgba(255,255,255,0.1)] text-[rgba(201,209,217,0.3)] cursor-not-allowed bg-transparent"
                    : "border-[#2ea043] text-[#c9d1d9] bg-[rgba(46,160,67,0.1)] hover:bg-[rgba(46,160,67,0.2)] hover:shadow-[0_0_15px_rgba(46,160,67,0.4)] hover:scale-105"
                )}
              >
                NEXT ►
              </Button>
            </div>

            {/* Game Action Area */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#a371f7] font-mono uppercase tracking-wider">
                {'>'} What happened here?
              </h3>
              {/* TODO: Render choices from local LLM */}
              <Button
                variant="outline"
                className="w-full p-4 bg-[rgba(163,113,247,0.1)] border-[rgba(163,113,247,0.3)] hover:border-[#a371f7] hover:bg-[rgba(163,113,247,0.2)] font-mono text-sm text-[#c9d1d9] justify-start h-auto"
              >
                <span className="text-[#a371f7] mr-2">▸</span> Loading choices from local model...
              </Button>
            </div>
          </CardContent>
        </Card>

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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}