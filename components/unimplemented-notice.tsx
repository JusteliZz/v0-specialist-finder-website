"use client"

import { toast } from "sonner"
import { Construction } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface UnimplementedNoticeProps {
  feature: string
  className?: string
}

export function showUnimplementedFeature(feature: string) {
  const { t } = useLanguage()

  toast.error(t("featureUnderDevelopment", { feature }), {
    icon: <Construction className="h-4 w-4" />,
    duration: 4000,
  })
}

export function UnimplementedNotice({ feature, className }: UnimplementedNoticeProps) {
  // This component is now deprecated - use showUnimplementedFeature() instead
  return null
}
