import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Community' }

const CATEGORIES = [
  { name: 'Hot flashes & vasomotor', slug: 'hot-flashes', count: 142 },
  { name: 'Sleep & fatigue', slug: 'sleep', count: 98 },
  { name: 'HRT & medications', slug: 'hrt', count: 215 },
  { name: 'Mood & mental health', slug: 'mood', count: 167 },
  { name: 'Brain fog & memory', slug: 'brain-fog', count: 73 },
  { name: 'Relationships & intimacy', slug: 'relationships', count: 89 },
  { name: 'Nutrition & weight', slug: 'nutrition', count: 104 },
  { name: 'Exercise & movement', slug: 'exercise', count: 61 },
  { name: 'Ask a question', slug: 'questions', count: 312 },
  { name: 'Wins & celebrations', slug: 'wins', count: 44 },
]

export default function CommunityPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748]">Community</h1>
        <p className="text-[#718096] mt-1">You&apos;re not alone. Connect with women who get it.</p>
      </div>
      <div className="grid gap-3">
        {CATEGORIES.map((cat) => (
          <Link key={cat.slug} href={`/community/${cat.slug}`}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="flex items-center justify-between p-4">
                <span className="font-medium text-[#2d3748]">{cat.name}</span>
                <Badge variant="outline">{cat.count} posts</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <p className="text-xs text-[#a0aec0] text-center">Community participation is always free. Your health tracking data stays private.</p>
    </div>
  )
}
