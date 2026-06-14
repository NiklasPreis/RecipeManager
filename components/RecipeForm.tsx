'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RecipeFormData, RecipeDetail, Category, Ingredient } from '@/lib/types'

interface Props {
  initialData?: RecipeDetail
  categories: Category[]
}

const emptyIngredient = (): Ingredient => ({ amount: '', unit: '', name: '' })
const emptyForm = (): RecipeFormData => ({
  title: '',
  description: '',
  servings: '',
  prepTime: '',
  cookTime: '',
  ingredients: [emptyIngredient()],
  instructions: [''],
  categoryIds: [],
  tagNames: [],
})

export default function RecipeForm({ initialData, categories }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<RecipeFormData>(() => {
    if (!initialData) return emptyForm()
    return {
      title: initialData.title,
      description: initialData.description ?? '',
      servings: initialData.servings ?? '',
      prepTime: initialData.prepTime ?? '',
      cookTime: initialData.cookTime ?? '',
      ingredients: initialData.ingredients.length > 0 ? initialData.ingredients : [emptyIngredient()],
      instructions: initialData.instructions.length > 0 ? initialData.instructions : [''],
      categoryIds: initialData.categories.map((c) => c.category.id),
      tagNames: initialData.tags.map((t) => t.tag.name),
    }
  })

  const [imageUrl, setImageUrl] = useState<string>(initialData?.image ?? '')
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (res.ok) {
      setImageUrl(data.url)
    } else {
      setError(data.error ?? 'Upload fehlgeschlagen')
    }
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }

  const addIngredient = () =>
    setForm((f) => ({ ...f, ingredients: [...f.ingredients, emptyIngredient()] }))

  const removeIngredient = (i: number) =>
    setForm((f) => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }))

  const updateIngredient = (i: number, field: keyof Ingredient, value: string) =>
    setForm((f) => {
      const ingredients = [...f.ingredients]
      ingredients[i] = { ...ingredients[i], [field]: value }
      return { ...f, ingredients }
    })

  const addInstruction = () =>
    setForm((f) => ({ ...f, instructions: [...f.instructions, ''] }))

  const removeInstruction = (i: number) =>
    setForm((f) => ({ ...f, instructions: f.instructions.filter((_, idx) => idx !== i) }))

  const updateInstruction = (i: number, value: string) =>
    setForm((f) => {
      const instructions = [...f.instructions]
      instructions[i] = value
      return { ...f, instructions }
    })

  const toggleCategory = (id: number) =>
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }))

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tagNames.includes(tag)) {
      setForm((f) => ({ ...f, tagNames: [...f.tagNames, tag] }))
    }
    setTagInput('')
  }

  const removeTag = (name: string) =>
    setForm((f) => ({ ...f, tagNames: f.tagNames.filter((t) => t !== name) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      image: imageUrl || null,
      ingredients: form.ingredients.filter((i) => i.name.trim()),
      instructions: form.instructions.filter((s) => s.trim()),
    }

    const url = initialData ? `/api/recipes/${initialData.id}` : '/api/recipes'
    const method = initialData ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      router.push(`/recipes/${data.id}`)
      router.refresh()
    } else {
      setError(data.error ?? 'Fehler beim Speichern')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basisdaten */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-800">Allgemein</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="z.B. Spaghetti Carbonara"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Kurze Beschreibung des Rezepts..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portionen</label>
            <input
              type="number"
              min="1"
              value={form.servings}
              onChange={(e) => setForm((f) => ({ ...f, servings: e.target.value ? Number(e.target.value) : '' }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vorbereit. (Min)</label>
            <input
              type="number"
              min="0"
              value={form.prepTime}
              onChange={(e) => setForm((f) => ({ ...f, prepTime: e.target.value ? Number(e.target.value) : '' }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kochzeit (Min)</label>
            <input
              type="number"
              min="0"
              value={form.cookTime}
              onChange={(e) => setForm((f) => ({ ...f, cookTime: e.target.value ? Number(e.target.value) : '' }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="20"
            />
          </div>
        </div>
      </section>

      {/* Bild */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Foto</h2>

        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          {imageUrl ? (
            <div className="relative">
              <img src={imageUrl} alt="Vorschau" className="mx-auto max-h-48 rounded-lg object-contain" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setImageUrl('') }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="text-gray-400 space-y-2">
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Hochladen...</span>
                </div>
              ) : (
                <>
                  <svg className="mx-auto w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Bild hierher ziehen oder klicken zum Auswählen</p>
                  <p className="text-xs">JPEG, PNG, WebP – max. 10 MB</p>
                </>
              )}
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }}
        />
      </section>

      {/* Kategorien & Tags */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-800">Kategorien & Tags</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategorien</label>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400">Noch keine Kategorien – erstelle zuerst welche auf der Startseite.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    form.categoryIds.includes(cat.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Tag eingeben + Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Hinzufügen
            </button>
          </div>
          {form.tagNames.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.tagNames.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-700 ml-1">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Zutaten */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Zutaten</h2>

        <div className="space-y-2">
          {form.ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                type="text"
                value={ing.amount}
                onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="200"
              />
              <input
                type="text"
                value={ing.unit}
                onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="g"
              />
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Zutat"
              />
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                disabled={form.ingredients.length === 1}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-2 text-primary-700 hover:text-primary-800 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Zutat hinzufügen
        </button>
      </section>

      {/* Zubereitung */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Zubereitung</h2>

        <div className="space-y-3">
          {form.instructions.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full text-sm font-bold flex items-center justify-center mt-1.5">
                {i + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => updateInstruction(i, e.target.value)}
                rows={2}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder={`Schritt ${i + 1}...`}
              />
              <button
                type="button"
                onClick={() => removeInstruction(i)}
                disabled={form.instructions.length === 1}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors mt-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addInstruction}
          className="flex items-center gap-2 text-primary-700 hover:text-primary-800 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schritt hinzufügen
        </button>
      </section>

      {/* Actions */}
      <div className="flex gap-3 justify-end pb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {initialData ? 'Aktualisieren' : 'Rezept speichern'}
        </button>
      </div>
    </form>
  )
}
