import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Settings' }
export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-[#2d3748]">Settings</h1>
      <Card><CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">Edit profile</Button>
          <Button variant="outline" className="w-full justify-start">Change password</Button>
          <Button variant="outline" className="w-full justify-start">Export my data</Button>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-base">Subscription</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[#718096]">You&apos;re on the <strong>Free</strong> plan.</p>
          <Link href="/settings/upgrade"><Button className="w-full">Upgrade to Premium — $12.99/mo</Button></Link>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-base">Privacy & data</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">Manage AI memory</Button>
          <Button variant="outline" className="w-full justify-start">Notification preferences</Button>
          <Button variant="destructive" className="w-full justify-start">Delete account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
