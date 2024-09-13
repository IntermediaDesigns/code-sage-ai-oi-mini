'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import CodeEditor from '../components/CodeEditor'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-hot-toast'

export default function SubmitCodePage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSnippetId, setSubmittedSnippetId] = useState<string | null>(null)

  const createCodeSnippet = useMutation(api.codeSnippets.createCodeSnippet)
  const addNotification = useMutation(api.notifications.addNotification)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)
    setIsSubmitting(true)
    setError('')

    try {
      // First, analyze the code
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze code')
      }

      const data = await response.json()
      setAnalysis(data.analysis)

      // Then, save the code snippet
      const snippetId = await createCodeSnippet({
        userId: userId!,
        title,
        language,
        content: code,
        analysis: data.analysis
      })
      console.log('Snippet created with ID:', snippetId);
      setSubmittedSnippetId(snippetId)

      // Create a notification with a link to the snippet
      await addNotification({
        userId: userId!,
        content: `Your code snippet "${title}" has been submitted for review.`,
        snippetId: snippetId
      })

      toast.success('Code snippet submitted successfully')
    } catch (error) {
      console.error('Error submitting code:', error)
      toast.error('Failed to submit code snippet')
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsAnalyzing(false)
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>Submit Code for Review</h1>
        {error && (
          <div
            className='bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4'
            role='alert'
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className='space-y-6'>
          <Input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Enter a title for your code snippet'
            required
            className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
          />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'>
              <SelectValue placeholder='Select a language' />
            </SelectTrigger>
            <SelectContent className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'>
              <SelectItem value='c++'>C++</SelectItem>
              <SelectItem value='csharp'>C#</SelectItem>
              <SelectItem value='css'>CSS</SelectItem>
              <SelectItem value='go'>Go</SelectItem>
              <SelectItem value='html'>HTML</SelectItem>
              <SelectItem value='java'>Java</SelectItem>
              <SelectItem value='javascript'>JavaScript</SelectItem>
              <SelectItem value='php'>PHP</SelectItem>
              <SelectItem value='python'>Python</SelectItem>
              <SelectItem value='ruby'>Ruby</SelectItem>
              <SelectItem value='typescript'>TypeScript</SelectItem>
            </SelectContent>
          </Select>
          <div className='border border-gray-300 dark:border-gray-700 rounded-md'>
            <CodeEditor
              language={language}
              value={code}
              onChange={value => setCode(value || '')}
            />
          </div>
          <Button 
            type='submit' 
            disabled={isAnalyzing || isSubmitting}
            className='bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700'
          >
            {isAnalyzing ? 'Analyzing...' : isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </form>
        {analysis && (
          <div className='mt-8 mb-24'>
            <h2 className='text-2xl font-bold mb-4'>AI Analysis</h2>
            <pre className='bg-gray-200 dark:bg-gray-800 p-4 rounded-md whitespace-pre-wrap text-gray-900 dark:text-gray-100'>
              {analysis}
            </pre>
            {submittedSnippetId && (
              <Button
                onClick={() => router.push(`/dashboard`)}
                className='mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700'
              >
                Back to Dashboard
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}