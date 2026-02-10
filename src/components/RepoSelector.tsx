import { useState, useEffect } from 'react'
import type { Repo } from '../lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface RepoSelectorProps {
  onSelect: (repo: Repo) => void
}

export function RepoSelector({ onSelect }: RepoSelectorProps) {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTopRepos()
  }, [])

  const fetchTopRepos = async () => {
    try {
      const response = await fetch(
        'https://api.github.com/search/repositories?q=stars:>100000&sort=stars&per_page=10'
      )
      if (!response.ok) throw new Error('Failed to fetch repos')
      const data = await response.json()
      setRepos(data.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300">
          Loading Adventures...
        </h2>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-400 font-mono">Fetching top repositories...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Error: {error}</p>
        <Button
          onClick={fetchTopRepos}
          variant="outline"
          className="mt-4 border-[#a371f7] text-[#a371f7] hover:bg-[#a371f7] hover:text-white bg-transparent"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300">
        Choose Your Adventure
      </h2>
      <div className="grid gap-4">
        {repos.map((repo, index) => (
          <Card
            key={repo.id}
            className={cn(
              "bg-gray-800/50 border-gray-700 hover:border-purple-500 hover:bg-gray-800/80 transition-all cursor-pointer min-h-[120px]"
            )}
            onClick={() => onSelect(repo)}
          >
            <CardContent className="p-6 h-full">
              <div className="flex items-center gap-4 h-full">
                <span className="text-2xl font-bold text-purple-400 w-8 flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#c9d1d9] hover:text-purple-300 transition-colors truncate">
                    {repo.full_name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                    {repo.description || 'No description'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-yellow-400 font-mono">⭐ {repo.stargazers_count.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}