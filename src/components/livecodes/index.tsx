'use client'

import { useMemo } from "react"
import LiveCodes from 'livecodes/react';
import { Config, Language } from "livecodes";

interface Props {
  language: Language
  content: string,
}
export function LivecodesEditor({ language, content }: Props) {

  const config = useMemo<Partial<Config>>(() => {
    return {
      markup: {
        language: language,
        content: content,
        console: false,
      },
      view: 'editor',
    }
  }, [language, content])

  return<LiveCodes config={config} className="!h-full !w-full" />
}


